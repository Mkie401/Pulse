use axum::{routing::get, Router};
use dotenvy::dotenv;
use sqlx::mysql::MySqlPoolOptions;
use std::env;
use std::net::SocketAddr;
use std::sync::Arc;
use tokio::sync::broadcast;

// 宣告新的模組
pub mod handlers;
pub mod models;
pub mod state;
pub mod utils;

use crate::{
    handlers::{user_handler, ws_handler},
    state::AppState,
};

#[tokio::main]
async fn main() -> Result<(), Box<dyn std::error::Error>> {
    dotenv().ok();
    tracing_subscriber::fmt::init();

    // --- 設定資料庫和應用程式狀態 ---
    let database_url = env::var("DATABASE_URL").expect("DATABASE_URL must be set");
    let pool = MySqlPoolOptions::new()
        .max_connections(5)
        .connect(&database_url)
        .await?;
    println!("資料庫連線成功！");

    let (tx, _rx) = broadcast::channel(100);

    let shared_state = Arc::new(AppState { pool, tx });
    println!("廣播系統準備完成！");

    // --- 設定路由 ---
    let app = Router::new()
        .route("/", get(root_handler))
        .route(
            "/users",
            get(user_handler::get_users).post(user_handler::add_user),
        )
        .route("/ws", get(ws_handler::ws_handler))
        .with_state(shared_state);

    // --- 啟動伺服器 ---
    let addr = SocketAddr::from(([127, 0, 0, 1], 3000));
    println!("伺服器正在啟動，監聽於: http://{}", addr);

    let listener = tokio::net::TcpListener::bind(addr).await?;
    axum::serve(listener, app).await?;

    Ok(())
}

async fn root_handler() -> &'static str {
    "Hello, Pulse! Rust Server is running!"
}