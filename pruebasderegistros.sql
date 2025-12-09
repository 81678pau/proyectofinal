
-- MySQL dump 10.13  Distrib 8.0.44, for Win64 (x86_64)
--
-- Host: localhost    Database: paugonzzr
-- ------------------------------------------------------
-- Server version	8.0.44

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `categories`
--

DROP TABLE IF EXISTS `categories`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `categories` (
  `categoryId` int NOT NULL AUTO_INCREMENT,
  `name` varchar(100) NOT NULL,
  `description` text,
  `imageUrl` varchar(255) DEFAULT NULL,
  `createdAt` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `status` enum('active','inactive') DEFAULT 'active',
  `season` varchar(50) NOT NULL DEFAULT 'All Seasons',
  `gender` varchar(20) NOT NULL DEFAULT 'Unisex',
  PRIMARY KEY (`categoryId`),
  UNIQUE KEY `uq_categories_name` (`name`)
) ENGINE=InnoDB AUTO_INCREMENT=10 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `categories`
--

LOCK TABLES `categories` WRITE;
/*!40000 ALTER TABLE `categories` DISABLE KEYS */;
INSERT INTO `categories` VALUES (1,'Formal','Ropa elegante y moderna para ocasiones especiales.','https://example.com/images/formal-category.jpg','2025-11-27 00:01:34','inactive','All Seasons','Unisex'),(3,'k','kñskdfksldkflsdjfk','kkk','2025-11-28 02:19:41','inactive','All Seasons','Unisex'),(4,'pantalones','perfectos para la moda','https/:lslñd','2025-12-08 04:31:56','inactive','Fall','Women'),(5,'Vestidos','Vestidos de super moda','https://dam.elcorteingles.es/producto/www-001005673504816-01.jpg?impolicy=Resize&width=967&height=1200','2025-12-08 04:43:09','inactive','All Seasons','Women'),(6,'Camisetas','Elegantes y formal','https://media.istockphoto.com/id/916092484/es/foto/ropa-de-mujer-colgada-en-ganchos-rieles-de-ropa-dise%C3%B1o-de-moda.jpg?s=612x612&w=0&k=20&c=nqOB2NSoFFVVnPSZQ6nDOnOdUtvkYLnS-O3kripEF68=','2025-12-08 20:57:21','active','Winter','Women'),(7,'Pantalones ','Ideal para todos lados','https://www.shutterstock.com/image-photo/shorts-on-store-shelf-fashionable-260nw-1816444037.jpg','2025-12-09 01:00:46','active','All Seasons','Men'),(8,'Vestidos ','Perfectos','https://www.sears.com.mx/c/graduaciones/img/Categorias/vestido-brillante-Sears-box-2025.jpg','2025-12-09 01:05:40','active','Summer','Women'),(9,'Sueteres','hermosos lol',NULL,'2025-12-09 01:06:08','active','All Seasons','Unisex');
/*!40000 ALTER TABLE `categories` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `order_items`
--

DROP TABLE IF EXISTS `order_items`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `order_items` (
  `orderItemId` int NOT NULL AUTO_INCREMENT,
  `orderId` int NOT NULL,
  `productId` int NOT NULL,
  `quantity` int NOT NULL DEFAULT '1',
  `price` decimal(10,2) NOT NULL,
  PRIMARY KEY (`orderItemId`),
  KEY `fk_order_items_order` (`orderId`),
  KEY `fk_order_items_product` (`productId`),
  CONSTRAINT `fk_order_items_order` FOREIGN KEY (`orderId`) REFERENCES `orders` (`orderId`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `fk_order_items_product` FOREIGN KEY (`productId`) REFERENCES `products` (`productId`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=11 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `order_items`
--

LOCK TABLES `order_items` WRITE;
/*!40000 ALTER TABLE `order_items` DISABLE KEYS */;
INSERT INTO `order_items` VALUES (2,2,5,10,700.00),(3,3,5,3,700.00),(4,4,5,10,700.00),(5,5,5,6,700.00),(6,6,5,6,700.00),(7,7,5,9,700.00),(8,8,7,1,289.00),(9,8,6,1,890.00),(10,8,5,1,700.00);
/*!40000 ALTER TABLE `order_items` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `orders`
--

DROP TABLE IF EXISTS `orders`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `orders` (
  `orderId` int NOT NULL AUTO_INCREMENT,
  `userId` int NOT NULL,
  `orderDate` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `status` enum('pending','paid','shipped','cancelled') NOT NULL DEFAULT 'pending',
  `total` decimal(10,2) NOT NULL DEFAULT '0.00',
  PRIMARY KEY (`orderId`),
  KEY `fk_orders_user` (`userId`),
  CONSTRAINT `fk_orders_user` FOREIGN KEY (`userId`) REFERENCES `users` (`userId`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=9 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `orders`
--

LOCK TABLES `orders` WRITE;
/*!40000 ALTER TABLE `orders` DISABLE KEYS */;
INSERT INTO `orders` VALUES (1,1,'2025-11-27 00:07:57','pending',2400.00),(2,5,'2025-12-08 20:59:52','pending',7000.00),(3,5,'2025-12-08 21:14:13','pending',2100.00),(4,7,'2025-12-08 21:26:59','pending',7000.00),(5,8,'2025-12-08 21:28:13','pending',4200.00),(6,9,'2025-12-08 21:31:29','pending',4200.00),(7,9,'2025-12-09 01:07:54','pending',6300.00),(8,10,'2025-12-09 02:06:01','pending',1879.00);
/*!40000 ALTER TABLE `orders` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `products`
--

DROP TABLE IF EXISTS `products`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `products` (
  `productId` int NOT NULL AUTO_INCREMENT,
  `name` varchar(150) NOT NULL,
  `description` text,
  `price` decimal(10,2) NOT NULL DEFAULT '0.00',
  `stock` int NOT NULL DEFAULT '0',
  `size` varchar(30) DEFAULT NULL,
  `color` varchar(60) DEFAULT NULL,
  `imageUrl` varchar(255) DEFAULT NULL,
  `categoryId` int DEFAULT NULL,
  `createdByUserId` int DEFAULT NULL,
  `createdAt` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`productId`),
  KEY `idx_products_category` (`categoryId`),
  KEY `idx_products_name` (`name`),
  KEY `fk_products_user` (`createdByUserId`),
  CONSTRAINT `fk_products_category` FOREIGN KEY (`categoryId`) REFERENCES `categories` (`categoryId`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `fk_products_user` FOREIGN KEY (`createdByUserId`) REFERENCES `users` (`userId`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=8 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `products`
--

LOCK TABLES `products` WRITE;
/*!40000 ALTER TABLE `products` DISABLE KEYS */;
INSERT INTO `products` VALUES (5,'Camiseta','Camiseta de seda, formal, ideal para cenas en la noche lol',700.00,484,'S','Blanca','https://img.bestdealplus.com/ae04/kf/Ha8bf69c50aee4f6fa078f092bc3eeb5de.jpg',6,1,'2025-12-08 20:58:46'),(6,'Pantalón cargo','Supr padre',890.00,555,'S','Verde kk','https://freddy.com.mx/wp-content/uploads/BRITNEYF301_V69X_-1.1-1.jpg',7,1,'2025-12-09 01:07:31'),(7,'Vestido','spsdñlfs',289.00,33,'S','muchos colores','https://www.desigual.com/dw/image/v2/BCVV_PRD/on/demandware.static/-/Sites-desigual-m-catalog/default/dw4c4c1aaf/images/B2C/26SWVKX8_6000_1.jpg?sfrm=jpg&v=webp10&sw=720',8,1,'2025-12-09 01:09:47');
/*!40000 ALTER TABLE `products` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `users`
--

DROP TABLE IF EXISTS `users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `users` (
  `userId` int NOT NULL AUTO_INCREMENT,
  `username` varchar(100) NOT NULL,
  `email` varchar(150) NOT NULL,
  `password` varchar(255) NOT NULL,
  `role` enum('admin','employee','cliente') NOT NULL DEFAULT 'cliente',
  `createdAt` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `phoneNumber` varchar(20) DEFAULT NULL,
  PRIMARY KEY (`userId`),
  UNIQUE KEY `email` (`email`),
  KEY `idx_users_email` (`email`)
) ENGINE=InnoDB AUTO_INCREMENT=11 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `users`
--

LOCK TABLES `users` WRITE;
/*!40000 ALTER TABLE `users` DISABLE KEYS */;
INSERT INTO `users` VALUES (1,'paulina','paulina@example.com','123456','cliente','2025-11-27 00:01:20',NULL),(2,'lmfdkk','ejmpo1@hotmail.com','paulux70','cliente','2025-12-08 04:08:52','4771236789'),(3,'regina','rg@fais','regina123','cliente','2025-12-08 04:48:59','4771725463'),(4,'Paulina González','paulina@diacomx.com','paulux70','cliente','2025-12-08 20:19:37','4771725462'),(5,'paugonzzr','maramirez74@hotmail.com','paulux70','cliente','2025-12-08 20:59:45','4771236789'),(7,'regina','regina@skdjfsfkl','paulux70','cliente','2025-12-08 21:26:42','4776789045'),(8,'luis','luis@ejemplo','luis123','cliente','2025-12-08 21:28:01','4896784567'),(9,'ejemplo','ejemplo@com.xom','ejemplo','cliente','2025-12-08 21:31:14','4778905678'),(10,'lll','llll@di','123456','cliente','2025-12-09 02:05:33','1234567891');
/*!40000 ALTER TABLE `users` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Dumping events for database 'paugonzzr'
--
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2025-12-08 20:14:52
