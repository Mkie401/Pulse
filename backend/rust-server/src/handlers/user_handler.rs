use axum::{extract::State, Json};
use std::sync::Arc;

use crate::{
    models::{CreateUser, User},
    state::AppState,
    utils::id_generator::get_next_id,
};

pub async fn add_user(
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

pub async fn get_users(State(state): State<Arc<AppState>>) -> Result<Json<Vec<User>>, String> {
    let users = sqlx::query_as::<_, User>("SELECT id, username, email FROM users")
        .fetch_all(&state.pool)
        .await
        .map_err(|e| e.to_string())?;
    Ok(Json(users))
}
