use axum::{
    extract::{
        ws::{Message, WebSocket, WebSocketUpgrade},
        Query, State,
    },
    response::IntoResponse,
};
use futures::{sink::SinkExt, stream::StreamExt};
use std::sync::Arc;

use crate::{
    models::WsParams,
    state::AppState,
    utils::id_generator::get_next_id,
};

pub async fn ws_handler(
    ws: WebSocketUpgrade,
    State(state): State<Arc<AppState>>,
    Query(params): Query<WsParams>,
) -> impl IntoResponse {
    println!("使用者 ID: {} 嘗試連線...", params.user_id);
    ws.on_upgrade(move |socket| handle_socket(socket, state, params.user_id))
}

async fn handle_socket(socket: WebSocket, state: Arc<AppState>, who_am_i: i64) {
    let username = format!("Guest_{}", who_am_i);
    let email = format!("guest_{}@pulse.com", who_am_i);

    let _ = sqlx::query("INSERT INTO users (id, username, email, password_hash) VALUES (?, ?, ?, 'guest_pwd') ON DUPLICATE KEY UPDATE id=id")
        .bind(who_am_i)
        .bind(&username)
        .bind(&email)
        .execute(&state.pool)
        .await;

    let (mut sender, mut receiver) = socket.split();

    let mut rx = state.tx.subscribe();

    let msg = format!("歡迎來到 Pulse 聊天室！目前線上人數: {}", state.tx.receiver_count());
    let _ = sender.send(Message::Text(msg)).await;

    let mut send_task = tokio::spawn(async move {
        while let Ok(msg) = rx.recv().await {
            if sender.send(Message::Text(msg)).await.is_err() {
                break;
            }
        }
    });

    let mut recv_task = tokio::spawn(async move {
        while let Some(Ok(msg)) = receiver.next().await {
            if let Message::Text(text) = msg {
                println!("收到訊息: {}", text);

                let message_id = get_next_id();
                let channel_id = 1;
                let user_id = who_am_i;

                let insert_result = sqlx::query("INSERT INTO messages (id, channel_id, user_id, content) VALUES (?, ?, ?, ?)")
                    .bind(message_id)
                    .bind(channel_id)
                    .bind(user_id)
                    .bind(&text)
                    .execute(&state.pool)
                    .await;

                match insert_result {
                    Ok(_) => {
                        println!("訊息已存入資料庫");
                        let _ = state.tx.send(format!("有人說: {}", text));
                    }
                    Err(e) => {
                        println!("無法存入資料庫: {:?}", e);
                    }
                }
            }
        }
    });

    tokio::select! {
        _ = (&mut send_task) => recv_task.abort(),
        _ = (&mut recv_task) => send_task.abort(),
    };

    println!("使用者斷線");
}
