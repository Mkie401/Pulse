-- MySQL dump 10.13  Distrib 8.0.19, for Win64 (x86_64)
--
-- Host: localhost    Database: Pulse_db
-- ------------------------------------------------------
-- Server version	8.0.44
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `attachments`
--

DROP TABLE IF EXISTS `attachments`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `attachments` (
  `id` bigint NOT NULL COMMENT '附件唯一 ID',
  `message_id` bigint NOT NULL COMMENT '關聯的訊息 ID',
  `url` varchar(255) NOT NULL COMMENT '檔案存放路徑 (URL)',
  `file_type` varchar(50) DEFAULT NULL COMMENT '檔案類型 (MIME type, 如 image/png)',
  `file_size` int DEFAULT NULL COMMENT '檔案大小 (Bytes)',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP COMMENT '上傳時間',
  PRIMARY KEY (`id`),
  KEY `message_id` (`message_id`),
  CONSTRAINT `attachments_ibfk_1` FOREIGN KEY (`message_id`) REFERENCES `messages` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci COMMENT='訊息附件表 (圖片/檔案)';
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `attachments`
--

LOCK TABLES `attachments` WRITE;
/*!40000 ALTER TABLE `attachments` DISABLE KEYS */;
/*!40000 ALTER TABLE `attachments` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `channels`
--

DROP TABLE IF EXISTS `channels`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `channels` (
  `id` bigint NOT NULL COMMENT '頻道唯一 ID',
  `server_id` bigint DEFAULT NULL COMMENT '所屬伺服器 ID (若為 NULL 代表私訊)',
  `name` varchar(100) NOT NULL COMMENT '頻道名稱',
  `description` text COMMENT '頻道主題描述',
  `type` varchar(20) DEFAULT 'TEXT' COMMENT '頻道類型 (TEXT: 文字, VOICE: 語音)',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP COMMENT '建立時間',
  PRIMARY KEY (`id`),
  KEY `server_id` (`server_id`),
  CONSTRAINT `channels_ibfk_1` FOREIGN KEY (`server_id`) REFERENCES `servers` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci COMMENT='聊天頻道表';
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `channels`
--

LOCK TABLES `channels` WRITE;
/*!40000 ALTER TABLE `channels` DISABLE KEYS */;
INSERT INTO `channels` VALUES (1,2001,'general',NULL,'TEXT','2026-01-07 11:05:29');
/*!40000 ALTER TABLE `channels` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `messages`
--

DROP TABLE IF EXISTS `messages`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `messages` (
  `id` bigint NOT NULL COMMENT '訊息唯一 ID',
  `channel_id` bigint NOT NULL COMMENT '所屬頻道 ID',
  `user_id` bigint NOT NULL COMMENT '發送者 ID',
  `content` text COMMENT '訊息文字內容',
  `reply_to_id` bigint DEFAULT NULL COMMENT '回覆哪一則訊息 (Thread 功能)',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP COMMENT '發送時間',
  `updated_at` timestamp NULL DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP COMMENT '編輯時間 (若有值代表已編輯)',
  PRIMARY KEY (`id`),
  KEY `channel_id` (`channel_id`),
  KEY `user_id` (`user_id`),
  CONSTRAINT `messages_ibfk_1` FOREIGN KEY (`channel_id`) REFERENCES `channels` (`id`) ON DELETE CASCADE,
  CONSTRAINT `messages_ibfk_2` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci COMMENT='聊天訊息記錄表';
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `messages`
--

LOCK TABLES `messages` WRITE;
/*!40000 ALTER TABLE `messages` DISABLE KEYS */;
INSERT INTO `messages` VALUES (7414629469723430913,1,1,'你好',NULL,'2026-01-07 11:30:22',NULL),(7414723033375576065,1,21828,'你好',NULL,'2026-01-07 17:42:10',NULL),(7414723033375576066,1,28970,'喔齁',NULL,'2026-01-07 17:42:24',NULL),(7414723033375576067,1,21828,'你好啊',NULL,'2026-01-07 17:42:29',NULL),(7414723033375576068,1,21828,'幹你老看三小',NULL,'2026-01-07 17:42:56',NULL),(7414723033375576069,1,21828,'操機掰',NULL,'2026-01-07 17:43:01',NULL);
/*!40000 ALTER TABLE `messages` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `server_members`
--

DROP TABLE IF EXISTS `server_members`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `server_members` (
  `server_id` bigint NOT NULL COMMENT '伺服器 ID',
  `user_id` bigint NOT NULL COMMENT '成員的使用者 ID',
  `nickname` varchar(50) DEFAULT NULL COMMENT '在該伺服器內的專屬暱稱',
  `joined_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP COMMENT '加入時間',
  PRIMARY KEY (`server_id`,`user_id`),
  KEY `user_id` (`user_id`),
  CONSTRAINT `server_members_ibfk_1` FOREIGN KEY (`server_id`) REFERENCES `servers` (`id`) ON DELETE CASCADE,
  CONSTRAINT `server_members_ibfk_2` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci COMMENT='伺服器成員關聯表 (多對多)';
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `server_members`
--

LOCK TABLES `server_members` WRITE;
/*!40000 ALTER TABLE `server_members` DISABLE KEYS */;
/*!40000 ALTER TABLE `server_members` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `servers`
--

DROP TABLE IF EXISTS `servers`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `servers` (
  `id` bigint NOT NULL COMMENT '伺服器唯一 ID',
  `owner_id` bigint NOT NULL COMMENT '伺服器擁有者 ID (關聯 users.id)',
  `name` varchar(100) NOT NULL COMMENT '伺服器名稱',
  `icon_url` varchar(255) DEFAULT NULL COMMENT '伺服器圖標連結',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP COMMENT '伺服器建立時間',
  PRIMARY KEY (`id`),
  KEY `owner_id` (`owner_id`),
  CONSTRAINT `servers_ibfk_1` FOREIGN KEY (`owner_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci COMMENT='伺服器/群組列表';
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `servers`
--

LOCK TABLES `servers` WRITE;
/*!40000 ALTER TABLE `servers` DISABLE KEYS */;
INSERT INTO `servers` VALUES (2001,1001,'Rust Developers',NULL,'2026-01-07 11:04:53');
/*!40000 ALTER TABLE `servers` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `users`
--

DROP TABLE IF EXISTS `users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `users` (
  `id` bigint NOT NULL COMMENT '使用者唯一 ID (建議使用 Snowflake ID)',
  `username` varchar(50) NOT NULL COMMENT '使用者顯示名稱 (暱稱)',
  `email` varchar(100) NOT NULL COMMENT '電子郵件 (登入帳號)',
  `password_hash` varchar(255) NOT NULL COMMENT '加密後的密碼 (BCrypt/Argon2)',
  `avatar_url` varchar(255) DEFAULT NULL COMMENT '大頭貼圖片連結',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP COMMENT '帳號建立時間',
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '資料最後更新時間',
  PRIMARY KEY (`id`),
  UNIQUE KEY `unique_email` (`email`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci COMMENT='使用者帳號主表';
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `users`
--

LOCK TABLES `users` WRITE;
/*!40000 ALTER TABLE `users` DISABLE KEYS */;
INSERT INTO `users` VALUES (1,'test_user','test@example.com','dummy_hash',NULL,'2026-01-07 10:28:26','2026-01-07 10:28:26'),(1001,'Admin','admin@pulse.app','hashed_secret',NULL,'2026-01-07 11:04:53','2026-01-07 11:04:53'),(21828,'Guest_21828','guest_21828@pulse.com','guest_pwd',NULL,'2026-01-07 17:42:05','2026-01-07 17:42:05'),(28970,'Guest_28970','guest_28970@pulse.com','guest_pwd',NULL,'2026-01-07 17:42:20','2026-01-07 17:42:20'),(58953,'Guest_58953','guest_58953@pulse.com','guest_pwd',NULL,'2026-01-07 17:43:21','2026-01-07 17:43:21'),(76732,'Guest_76732','guest_76732@pulse.com','guest_pwd',NULL,'2026-01-07 17:43:34','2026-01-07 17:43:34');
/*!40000 ALTER TABLE `users` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Dumping routines for database 'Pulse_db'
--
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2026-01-08 15:53:14
