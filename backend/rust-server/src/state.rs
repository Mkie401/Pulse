use sqlx::MySqlPool;
use tokio::sync::broadcast;

#[derive(Clone)]
pub struct AppState {
    pub pool: MySqlPool,
    pub tx: broadcast::Sender<String>,
}
