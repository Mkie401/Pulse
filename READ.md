# Discord-like 即時通訊系統－系統規格書（Spring Boot 版本）

---

## 1. 系統整體功能拆分（Functional Decomposition）

### 1.1 使用者與身分驗證系統（User & Authentication）

**功能說明**
- 使用者註冊 / 登入 / 登出
- JWT Access Token / Refresh Token
- 多裝置登入
- 使用者基本資料管理

**即時性**
- 否

**技術責任**
- React：登入頁面、Token 管理
- Spring Boot：Auth REST API、JWT 簽發與驗證、Security Filter
- Rust：無
- MySQL：users、refresh_tokens
- Redis：Session、Token Blacklist

---

### 1.2 伺服器（Server / Guild）管理

**功能說明**
- Server 建立 / 刪除
- 邀請成員
- 成員列表與基本設定

**即時性**
- 部分即時（成員變動通知）

**技術責任**
- React：Server UI
- Spring Boot：Server CRUD、成員管理 API
- Rust：無
- MySQL：servers、server_members
- Redis：Server 成員快取、事件 Pub/Sub

---

### 1.3 頻道系統（Text / Voice）

**功能說明**
- 文字頻道 / 語音頻道
- 頻道管理與成員關聯

**即時性**
- 是

**技術責任**
- React：頻道列表與切換
- Spring Boot：Channel CRUD、權限驗證
- Rust：語音頻道即時處理
- MySQL：channels、channel_members
- Redis：頻道狀態、在線人數

---

### 1.4 即時文字聊天系統

**功能說明**
- 即時訊息收發
- 訊息歷史紀錄
- Typing Indicator

**即時性**
- 是（WebSocket）

**技術責任**
- React：WebSocket Client、訊息渲染
- Spring Boot：WebSocket Gateway（STOMP / Raw WS）、訊息驗證
- Rust：無
- MySQL：messages
- Redis：Pub/Sub、聊天室 Fan-out

---

### 1.5 語音通話系統（多人）

**功能說明**
- 語音頻道加入 / 離開
- 多人即時語音
- Speaking / Muted 狀態

**即時性**
- 是（強即時）

**技術責任**
- React：WebRTC Client
- Spring Boot：語音狀態控制 API、授權
- Rust：Voice Gateway（WebRTC）
- MySQL：voice_sessions
- Redis：語音狀態、Presence

---

### 1.6 私訊 / 好友系統

**功能說明**
- 好友邀請與關係管理
- 一對一私訊聊天室

**即時性**
- 是

**技術責任**
- React：DM UI
- Spring Boot：好友 / 私訊 API
- Rust：無
- MySQL：friendships、dm_rooms、dm_messages
- Redis：私訊 Pub/Sub

---

### 1.7 權限與角色管理（RBAC）

**功能說明**
- Server Role
- Channel 細部權限（Read / Write / Speak）

**即時性**
- 否

**技術責任**
- React：權限設定 UI
- Spring Boot：RBAC 核心邏輯
- MySQL：roles、permissions、role_bindings
- Redis：權限快取

---

### 1.8 使用者狀態系統（Presence）

**功能說明**
- Online / Offline
- Speaking / Muted
- 當前 Server / Channel

**即時性**
- 是

**技術責任**
- React：狀態顯示
- Spring Boot：狀態同步控制
- Rust：語音 Speaking 狀態回報
- Redis：Presence Key
- MySQL：無

---

### 1.9 通知與事件系統

**功能說明**
- 使用者加入 / 離開
- 新訊息事件
- Server 系統事件

**即時性**
- 是

**技術責任**
- Spring Boot：事件產生與推送
- Redis：Pub/Sub
- React：事件訂閱與 UI 更新

---

## 2. 系統整體架構（Logical Architecture）

```
[ React Web Client ]
| REST (HTTPS)
| WebSocket (WSS)
| WebRTC (SRTP)
v
[ Spring Boot Backend API ]
| Redis Pub/Sub
| REST / WebSocket
v
[ Rust Realtime / Voice Gateway ]
|
[ Redis ]
|
[ MySQL ]
```

---

## 3. 語音系統專項分析

### 3.1 技術選型
- WebRTC（瀏覽器原生、低延遲、UDP）
- Rust 實作 Voice Gateway（高效能）

### 3.2 語音流程
1. React 呼叫 Spring Boot API 取得 Voice Token
2. React 與 Rust Gateway 建立 WebRTC 連線
3. 音訊資料經 SRTP 傳輸
4. Rust Gateway 負責轉發（SFU）

### 3.3 Join / Leave
- Join：建立 PeerConnection、Redis 註冊狀態
- Leave：關閉連線、清除狀態

### 3.4 多人策略
- SFU（Selective Forwarding Unit）
- 不做 Mixing，僅轉發音訊流

---

## 4. 前端（React）架構設計

```
src/
├─ pages/
├─ components/
├─ hooks/
├─ services/
│ ├─ api.ts
│ ├─ websocket.ts
│ ├─ webrtc.ts
├─ store/
```

- WebSocket：單例管理 + 自動重連
- 狀態管理：Zustand
- 語音狀態同步：WebRTC Event + WebSocket

---

## 5. 資料庫設計（ERD 概念）

### users
- id (PK)
- email (UNIQUE)
- password_hash
- nickname
- created_at

### servers
- id (PK)
- owner_id (FK users)
- name
- created_at

### channels
- id (PK)
- server_id (FK servers)
- type (TEXT / VOICE)
- name

### messages
- id (PK)
- channel_id (FK channels)
- sender_id (FK users)
- content
- created_at

### voice_sessions
- id (PK)
- channel_id
- user_id
- join_at
- leave_at

---

## 6. Redis 使用規劃

### 僅存在 Redis
- Presence
- WebSocket Session
- 語音 Speaking 狀態

### 同步 MySQL
- 訊息快取
- Server / Channel Metadata

### Key 命名
- presence:user:{userId}
- ws:session:{userId}
- voice:channel:{channelId}:users

---

## 7. API 與即時通訊設計

### REST API（Spring Boot）
- POST /auth/login
- POST /auth/register
- POST /servers
- POST /channels
- GET /messages

### WebSocket Events
- CHAT_MESSAGE
- USER_JOIN
- USER_LEAVE
- VOICE_STATE_UPDATE
- TYPING
- PRESENCE_UPDATE

### WebRTC Signaling
- OFFER
- ANSWER
- ICE_CANDIDATE

---

## 8. 專案結構規劃

### Frontend（React）
- pages
- components
- hooks
- services
- store

### Backend（Spring Boot）
- controller
- service
- domain
- repository
- config
- websocket
- security

### Realtime / Voice（Rust）
- gateway
- signaling
- audio
- protocol

### Docker
- frontend
- backend-api
- realtime-gateway
- mysql
- redis

---

## 9. 非功能需求（NFR）

- 高併發：WebSocket + Redis Pub/Sub
- 可水平擴充：Spring Boot 無狀態化
- 安全性：JWT、WSS、DTLS-SRTP
- 容錯：自動重連、狀態恢復
- 監控：Prometheus / Grafana
- Logging：ELK / OpenTelemetry

---

## 10. 開發階段切分（Roadmap）

### MVP
- 使用者系統
- Server / Channel
- 文字聊天室

### Phase 2
- WebRTC 語音
- Rust Voice Gateway

### Phase 3
- 效能優化
- 大規模部署
- 自動擴展
