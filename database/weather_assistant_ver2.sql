-- MySQL dump 10.13  Distrib 8.0.33, for Win64 (x86_64)
--
-- Host: localhost    Database: weather_assistant
-- ------------------------------------------------------
-- Server version	8.0.33

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `subscriber`
--

DROP TABLE IF EXISTS `subscriber`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `subscriber` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `city` varchar(20) NOT NULL,
  `webhook_url` varchar(255) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `webhook_url` (`webhook_url`)
) ENGINE=InnoDB AUTO_INCREMENT=16 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `subscriber`
--

LOCK TABLES `subscriber` WRITE;
/*!40000 ALTER TABLE `subscriber` DISABLE KEYS */;
/*!40000 ALTER TABLE `subscriber` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `weather_comment`
--

DROP TABLE IF EXISTS `weather_comment`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `weather_comment` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `city` varchar(20) NOT NULL,
  `comment` text NOT NULL,
  `update_time` varchar(40) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `city` (`city`)
) ENGINE=InnoDB AUTO_INCREMENT=13 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `weather_comment`
--

LOCK TABLES `weather_comment` WRITE;
/*!40000 ALTER TABLE `weather_comment` DISABLE KEYS */;
INSERT INTO `weather_comment` VALUES (1,'台北','多雲到晴，早晚稍有涼意，早出晚歸請適時增添衣物,昨天（18日）東北季風稍減弱，天氣多雲到晴；在氣溫方面，臺北站低溫24.7度，白天高溫31.2度，早晚稍有涼意。,今天（19日）東北季風稍減弱，天氣多雲到晴，預測平地氣溫約23至29度，白天感受舒適，早晚稍有涼意，早出晚歸請適時增添衣物。','2023-10-19 13:02:43.384982'),(3,'新北','多雲到晴，早晚稍有涼意，早出晚歸請適時增添衣物,昨天（18日）東北季風稍減弱，天氣多雲到晴；在氣溫方面，新北站低溫21.5度，白天高溫31.8度，早晚稍有涼意。,今天（19日）東北季風稍減弱，天氣多雲到晴，預測平地氣溫約23至30度，白天感受舒適，早晚稍有涼意，早出晚歸請適時增添衣物。','2023-10-19 13:02:47.372150'),(5,'桃園','東北季風稍減弱，晴時多雲的天氣,今天(19日)桃園市白天天氣晴時多雲，氣溫約23至31度，降雨機率0%，早晚較涼，外出請適時增減衣物。,海上方面預報,今天(19日)近海天氣晴時多雲，偏東轉西南風，風力4至5陣風7級。','2023-10-19 13:02:50.539943'),(7,'台中','多雲時晴，早晚稍涼，適時增減衣服,臺中地區昨天（18日）陰時多雲；臺中公園及一中商圈氣溫23.6~29.9℃，梧棲氣溫24.1~26.6℃。,臺中市今天（19日）東北季風稍減弱，為多雲時晴天氣，午後山區有局部短暫陣雨，外出活動留意天氣變化；氣溫25~31℃，早晚稍涼，適時增減衣服。,今天（19日）臺中沿海地區平均風力4級陣風6級以下上午轉4至5陣風7級，船隻或沿岸活動，請注意安全。','2023-10-19 13:02:53.644260'),(9,'台南','【早晚微涼中午熱，空品不佳，敏感族群留意】,昨(18日)臺南市區晨間低溫24.5度，白天陰有零星短暫雨，能見度不佳，午後高溫29.5度。,今(19日)臺南地區早晚微涼，低溫約22~25度，白天多雲時晴，能見度不佳，中午熱，高溫約28~32度。,環境部預測空氣品質為對敏感族群不健康(橘色)等級。','2023-10-19 13:02:56.802902'),(11,'高雄','今(19)日東北季風稍減弱，高雄市為多雲的天氣，局部山區午後有短暫陣雨。早晚有涼意，請添加衣物。,高雄市昨日市區最低溫為23.5度，最高溫為30.1度。,高雄市今(19)日平地(苓雅)為多雲，氣溫26 ~ 30度，降雨機率20%；丘陵區(旗山)多雲，氣溫25 ~ 32度，降雨機率20%；山區（六龜）晴，氣溫23 ~ 30度，降雨機率30%。,高雄沿海今(19)日偏西轉偏北風，4級陣風6級以下，浪高約1公尺，海邊活動請注意安全。,旗津海域今(19)日乾潮時間05:11，滿潮時間21:36，海濱戲水請注意漲潮時間。日落時間17:31 (看夕陽請在此時間之前)。','2023-10-19 13:03:00.274644');
/*!40000 ALTER TABLE `weather_comment` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2023-10-19 13:11:12
