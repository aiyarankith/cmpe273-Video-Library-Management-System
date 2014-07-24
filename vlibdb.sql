-- MySQL dump 10.13  Distrib 5.5.36, for Win64 (x86)
--
-- Host: localhost    Database: vlibdb
-- ------------------------------------------------------
-- Server version	5.5.36

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `admin`
--

DROP TABLE IF EXISTS `admin`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `admin` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `username` varchar(50) DEFAULT NULL,
  `password` varchar(50) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `movies`
--

DROP TABLE IF EXISTS `movies`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `movies` (
  `MOVIE_ID` varchar(50) NOT NULL,
  `MOVIE_NAME` varchar(100) DEFAULT NULL,
  `MOVIE_BANNER` varchar(100) DEFAULT NULL,
  `RELEASE_DATE` varchar(10) DEFAULT NULL,
  `RENT_AMOUNT` float(10,2) DEFAULT NULL,
  `AVAILABLE_COPIES` varchar(20) DEFAULT NULL,
  `CATEGORY` varchar(50) DEFAULT NULL,
  `IS_PUBLISHED` tinyint(1) DEFAULT NULL,
  PRIMARY KEY (`MOVIE_ID`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `transactions`
--

DROP TABLE IF EXISTS `transactions`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `transactions` (
  `transaction_id` int(5) NOT NULL AUTO_INCREMENT,
  `user_id` int(9) DEFAULT NULL,
  `movie_id` varchar(50) DEFAULT NULL,
  `movie_name` varchar(100) DEFAULT NULL,
  `movie_banner` varchar(100) DEFAULT NULL,
  `release_date` varchar(10) DEFAULT NULL,
  `rent_amount` double(10,2) DEFAULT '0.00',
  `category` varchar(15) DEFAULT NULL,
  `available_copies` int(11) DEFAULT NULL,
  `is_returned` tinyint(1) DEFAULT '0',
  `movie_issued` date DEFAULT NULL,
  PRIMARY KEY (`transaction_id`),
  KEY `user_id` (`user_id`),
  KEY `movie_id` (`movie_id`),
  CONSTRAINT `transactions_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`),
  CONSTRAINT `transactions_ibfk_2` FOREIGN KEY (`movie_id`) REFERENCES `movies` (`MOVIE_ID`)
) ENGINE=InnoDB AUTO_INCREMENT=24 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `users`
--

DROP TABLE IF EXISTS `users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `users` (
  `first_name` varchar(20) DEFAULT NULL,
  `last_name` varchar(20) DEFAULT NULL,
  `EMAIL` varchar(50) DEFAULT NULL,
  `user_id` int(9) NOT NULL AUTO_INCREMENT,
  `password` varchar(20) DEFAULT NULL,
  `type_of_user` varchar(10) DEFAULT NULL,
  `balance` double(4,2) DEFAULT '0.00',
  `street` varchar(40) DEFAULT NULL,
  `city` varchar(30) DEFAULT NULL,
  `state` varchar(20) DEFAULT NULL,
  `zipcode` varchar(20) DEFAULT NULL,
  `is_active` tinyint(1) DEFAULT '1',
  `registration_time` date DEFAULT '2014-05-04',
  PRIMARY KEY (`user_id`)
) ENGINE=InnoDB AUTO_INCREMENT=213457840 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2014-07-24  1:31:50
