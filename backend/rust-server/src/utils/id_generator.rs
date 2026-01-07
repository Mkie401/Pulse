// 修改引入路徑
use snowflake::SnowflakeIdGenerator;
use std::sync::Mutex;
use std::sync::OnceLock;

// 初始化 Generator
static GENERATOR: OnceLock<Mutex<SnowflakeIdGenerator>> = OnceLock::new();

pub fn get_next_id() -> i64 {
    let generator = GENERATOR.get_or_init(|| {
        // 參數：new(machine_id, node_id)
        // rs-snowflake 的參數順序跟原本的一樣，直接用即可
        Mutex::new(SnowflakeIdGenerator::new(1, 1))
    });

    let mut guard = generator.lock().unwrap();
    guard.generate()
}