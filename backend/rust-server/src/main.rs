use axum::{
    extract::{State, ws::{WebSocketUpgrade, WebSocket, Message}},
    response::IntoResponse,
    routing::get,
    Json,
    Router,
};
use serde::{Deserialize, Serialize};
use sqlx::mysql::{MySqlPool, MySqlPoolOptions};
use std::env;
use dotenvy::dotenv;
use std::net::SocketAddr;
use std::sync::Arc;
use tokio::sync::broadcast; // 引入廣播通道
use futures::{sink::SinkExt, stream::StreamExt};
use crate::utils::id_generator::get_next_id;
use axum::extract::Query;
pub mod utils;

#[derive(Debug, Serialize, sqlx::FromRow)]
struct User {
    id: i64,
    username: String,
    email: String,
}

// 用於反序列化請求 body
#[derive(Deserialize)]
struct CreateUser {
    username: String,
    email: String,
    password_hash: String,
}


// 1. 定義我們的應用程式狀態
// 這是一個「背包」，裡面裝著所有我們要讓不同使用者共享的東西
#[derive(Clone)]
struct AppState {
    pool: MySqlPool,                   // 資料庫連線池
    tx: broadcast::Sender<String>,     // 廣播發送器 (像是一個麥克風)
}

#[derive(serde::Deserialize)]
struct  WsParams {
    user_id: i64,
}
#[tokio::main]
async fn main() -> Result<(), Box<dyn std::error::Error>> {
    dotenv().ok();
    tracing_subscriber::fmt::init();

    let database_url = env::var("DATABASE_URL").expect("DATABASE_URL must be set");
    let pool = MySqlPoolOptions::new()
        .max_connections(5)
        .connect(&database_url)
        .await?;

    // 2. 建立一個廣播通道
    // capacity 100 代表最多暫存 100 條訊息，太舊的會被丟掉
    let (tx, _rx) = broadcast::channel(100);

    // 把 pool 和 tx 包進去 AppState

    let state = AppState {
        pool,
        tx
    };
    let shared_state = Arc::new(state);
    println!("資料庫與廣播系統準備完成！");

    let app = Router::new()
        .route("/", get(root_handler))
        .route("/users", get(get_users).post(add_user)) // Chain GET and POST
        .route("/ws", get(ws_handler))
        .with_state(shared_state); // 3. 這裡傳入完整的 app_state

    let addr = SocketAddr::from(([127, 0, 0, 1], 3000));
    println!("Server 正在啟動，監聽: http://{}", addr);

    let listener = tokio::net::TcpListener::bind(addr).await?;
    axum::serve(listener, app).await?;

    Ok(())
}

async fn root_handler() -> &'static str {
    "Hello, Pulse! Rust Server is running! "
}

async fn add_user(
    State(state): State<Arc<AppState>>,
    Json(payload): Json<CreateUser>,
) -> Result<Json<serde_json::Value>, String> {
    let user_id = get_next_id(); // 產生新的使用者 ID

    let result = sqlx::query("INSERT INTO users (id, username, email, password_hash) VALUES (?, ?, ?, ?)")
        .bind(user_id)
        .bind(&payload.username)
        .bind(&payload.email)
        .bind(&payload.password_hash)
        .execute(&state.pool)
        .await;

    match result {
        Ok(_) => {
            let response = serde_json::json!({
                "status": "success",
                "user_id": user_id,
            });
            Ok(Json(response))
        }
        Err(e) => {
            println!("建立使用者失敗: {:?}", e);
            Err(e.to_string())
        }
    }
}


// 注意：這裡的 State 從 MySqlPool 變成了 AppState，要從 state.pool 拿資料庫連線
async fn get_users(State(state): State<Arc<AppState>>) -> Result<Json<Vec<User>>, String> {
    // 裡面的程式碼完全不用改，因為 Arc 會自動 Deref
    let users = sqlx::query_as::<_, User>("SELECT id, username, email FROM users")
        .fetch_all(&state.pool)
        .await
        .map_err(|e| e.to_string())?;
    Ok(Json(users))
}

// --- WebSocket 部分 ---

async fn ws_handler(
    ws: WebSocketUpgrade,
    State(state): State<Arc<AppState>>,
    Query(params): Query<WsParams>, // <--- 這裡會自動解析 ?user_id=...
) -> impl IntoResponse {
    println!("使用者 ID: {} 嘗試連線...", params.user_id);

    // 把 params.user_id 傳進去
    ws.on_upgrade(move |socket| handle_socket(socket, state, params.user_id))
}

async fn handle_socket(socket: WebSocket, state: Arc<AppState>, who_am_i: i64) {

    let username = format!("Guest_{}", who_am_i);
    let email = format!("guest_{}@pulse.com", who_am_i); // 確保 email 不重複

    let _ = sqlx::query("INSERT INTO users (id, username, email, password_hash) VALUES (?, ?, ?, 'guest_pwd') ON DUPLICATE KEY UPDATE id=id")
        .bind(who_am_i)
        .bind(&username)
        .bind(&email)
        .execute(&state.pool)
        .await;

    // 1. 拆分 socket 為「發送端 (sender)」和「接收端 (receiver)」
    // 這樣我們才能同時做「聽別人講話」和「自己講話」兩件事
    let (mut sender, mut receiver) = socket.split();



    // 2. 訂閱廣播頻道 (每個人連上來都會拿到一個「耳機」)
    let mut rx = state.tx.subscribe();

    // 3. 發送歡迎訊息給自己
    let msg = format!("歡迎來到 Pulse 聊天室！目前線上人數: {}", state.tx.receiver_count());
    let _ = sender.send(Message::Text(msg)).await;

    // 4. 使用 tokio::select! 進行多工處理
    // 這是一個無限迴圈，它會同時監聽兩個任務，看誰先發生就處理誰
    let mut send_task = tokio::spawn(async move {
        while let Ok(msg) = rx.recv().await {
            // 任務 A: 廣播頻道有人講話 -> 轉發給這個使用者
            if sender.send(Message::Text(msg)).await.is_err() {
                break;
            }
        }
    });

    let mut recv_task = tokio::spawn(async move {
        while let Some(Ok(msg)) = receiver.next().await {
            // 任務 B: 這個使用者講話了 -> 廣播給所有人
            if let Message::Text(text) = msg {
                println!("收到訊息: {}", text);

                let message_id = get_next_id();
                let channel_id = 1;
                let user_id = who_am_i;

                let insert_result = sqlx::query("INSERT INTO messages (id, channel_id, user_id, content) VALUES (?, ?, ?, ?)")
                    .bind(message_id) // <--- 綁定訊息 ID
                    .bind(channel_id)
                    .bind(user_id)
                    .bind(&text)
                    .execute(&state.pool)
                    .await;

                match insert_result {
                    Ok(_) => {
                        println!("訊息已存入資料庫");
                        // 透過 state.tx 廣播出去
                        let _ = state.tx.send(format!("有人說: {}", text));
                    }
                    Err(e) => {
                        println!("無法存入資料庫: {:?}", e);
                    }
                }


            }
        }
    });

    // 等待任一任務結束（例如斷線）
    tokio::select! {
        _ = (&mut send_task) => recv_task.abort(),
        _ = (&mut recv_task) => send_task.abort(),
    };

    println!("使用者斷線");
}