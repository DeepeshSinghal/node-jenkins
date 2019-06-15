-- phpMyAdmin SQL Dump
-- version 4.7.4
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1:3306
-- Generation Time: May 08, 2018 at 06:51 PM
-- Server version: 5.7.19
-- PHP Version: 5.6.31

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET AUTOCOMMIT = 0;
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `maerskline`
--

-- --------------------------------------------------------

--
-- Table structure for table `content`
--

DROP TABLE IF EXISTS `content`;
CREATE TABLE IF NOT EXISTS `content` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `panel_section` int(4) DEFAULT NULL,
  `content` varchar(2000) DEFAULT NULL,
  `created` datetime DEFAULT NULL,
  `modified` datetime DEFAULT NULL,
  `created_by` int(11) DEFAULT NULL,
  `modified_by` int(11) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- Table structure for table `shipping`
--

DROP TABLE IF EXISTS `shipping`;
CREATE TABLE IF NOT EXISTS `shipping` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `cnee` varchar(255) DEFAULT NULL,
  `line` varchar(255) DEFAULT NULL,
  `origin` varchar(255) DEFAULT NULL,
  `job_no` varchar(255) DEFAULT NULL,
  `type` varchar(255) DEFAULT NULL,
  `contact_no` varchar(255) DEFAULT NULL,
  `pkgs` varchar(255) DEFAULT NULL,
  `weight` varchar(255) DEFAULT NULL,
  `vol` varchar(255) DEFAULT NULL,
  `hbl` varchar(255) DEFAULT NULL,
  `etd` varchar(255) DEFAULT NULL,
  `nhs` varchar(255) DEFAULT NULL,
  `shipper` varchar(255) DEFAULT NULL,
  `mb_l` varchar(255) DEFAULT NULL,
  `agent` varchar(255) DEFAULT NULL,
  `igm` varchar(255) DEFAULT NULL,
  `zoho_freight` varchar(255) DEFAULT NULL,
  `zoho_line` varchar(255) DEFAULT NULL,
  `ohbl` varchar(255) DEFAULT NULL,
  `payment` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=MyISAM AUTO_INCREMENT=23 DEFAULT CHARSET=latin1;

--
-- Dumping data for table `shipping`
--

INSERT INTO `shipping` (`id`, `cnee`, `line`, `origin`, `job_no`, `type`, `contact_no`, `pkgs`, `weight`, `vol`, `hbl`, `etd`, `nhs`, `shipper`, `mb_l`, `agent`, `igm`, `zoho_freight`, `zoho_line`, `ohbl`, `payment`) VALUES
(1, 'HINDUSTHAN M-I SWACO ', 'MAERSK', 'XINGANG', 'A0108', '5*20', 'MSKU3997273,TCLU6140440,PONU2077563,MRKU9823699,MRSU0070621', '5000', '125000', '125 cbm', 'CETGD1705964', '2018-05-06', '2017-09-09', 'CHANGSHA XIAN SHAN YUAN AGRICULTURE & TECHNOLOGY CO.,LTD', '961543581', 'MICHAEL', '', '', '', 'RECD', 'RECD'),
(13, 'pr', '', '', '', '', '', '', '', '', '', '2018-05-06', '', '', '', '', '', '', '', '', ''),
(14, 'ddddd', 'ddddd', 'ddddd', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', ''),
(4, 'Test', '', '', '', '', '', '', '', 'dsfsfsdf', '', '2018-05-06', '2017-09-09', '', '', '', '', '', '', '', ''),
(7, 'Test 1', '', '', '', '', '', '', '', '', '', '2018-05-06', '', '', '', '', '', '', '', '', ''),
(8, 'dddddd', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', ''),
(9, 'TESTNEW', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2018-05-06', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(10, 'TESTNEW12', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(11, 'TESTNEW', 'Test1', '', '', '', '', '', '', '', '', '2018-05-06', '', '', '', '', '', '', '', '', ''),
(12, 'TESTNEW', 'Test1', 'aaa', 'bbbb', 'ccc', 'dddd', '', '', '', '', '2018-05-06', '', '', '', '', '', '', '', '', ''),
(15, 'dddd', '', '', '', '', '', '', '', '', '', '2018-05-06', '', '', '', '', '', '', '', '', ''),
(16, 'dddd', '', '', '', '', '', '', '', '', '', '2018-05-06', '', '', '', '', '', '', '', '', ''),
(17, 'dddd', '', '', '', '', '', '', '', '', '', '2018-05-06', '', '', '', '', '', '', '', '', ''),
(18, 'ffffff', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', ''),
(19, 'ggg', '', '', '', '', '', '', '', '', '', '2018-05-06', '', '', '', '', '', '', '', '', ''),
(20, 'ffffffffff', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', ''),
(21, 'jjjjjjj', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', ''),
(22, 'Test', '', '', '', '', '', '', '', '', '', '2018-05-07', '', '', '', '', '', '', '', '', '');

-- --------------------------------------------------------

--
-- Table structure for table `user`
--

DROP TABLE IF EXISTS `user`;
CREATE TABLE IF NOT EXISTS `user` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `first_name` varchar(50) NOT NULL,
  `middle_name` varchar(50) NOT NULL,
  `last_name` varchar(50) NOT NULL,
  `profile_pic` varchar(255) DEFAULT NULL,
  `email` varchar(100) NOT NULL,
  `password` varchar(200) DEFAULT NULL,
  `user_role_id` int(11) NOT NULL,
  `status` char(2) NOT NULL,
  `manager_id` int(11) DEFAULT '0',
  `mis_user_id` int(11) DEFAULT NULL,
  `client_id` int(11) DEFAULT NULL,
  `last_login` datetime DEFAULT NULL,
  `created` datetime DEFAULT NULL,
  `modified` datetime DEFAULT NULL,
  `created_by` int(11) DEFAULT NULL,
  `modified_by` int(11) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `client` (`client_id`),
  KEY `pm` (`mis_user_id`),
  KEY `user_role_idx` (`user_role_id`)
) ENGINE=InnoDB AUTO_INCREMENT=50 DEFAULT CHARSET=utf8;

--
-- Dumping data for table `user`
--

INSERT INTO `user` (`id`, `first_name`, `middle_name`, `last_name`, `profile_pic`, `email`, `password`, `user_role_id`, `status`, `manager_id`, `mis_user_id`, `client_id`, `last_login`, `created`, `modified`, `created_by`, `modified_by`) VALUES
(1, 'Pushpendra', 'Admin1', 'Rajput', 'IMG_19012018_144519_0_1525084280148.png', 'rajput.pushpendra61@gmail.com', 'sha1$b0b9f09c$1$e9eef4a440751d751bd14cc99b24c79390415467', 3, 'A', 0, NULL, NULL, NULL, '2018-04-26 14:37:22', '2018-04-26 14:37:22', NULL, NULL),
(45, 'push', 'ad1', 'rajput', NULL, 'rajput.pushpendra62@gmail.com', 'sha1$f98cda38$1$cd4e6a60e4cb5b6f4cc5e65775c16b182e81521f', 3, 'I', 0, NULL, NULL, NULL, '2018-05-03 01:15:11', '2018-05-03 01:18:27', NULL, NULL),
(46, 'push', 'a', 's', NULL, 'rajput.pushpendra63@gmail.com', 'sha1$82af9649$1$a53674672e0dbc50dcbb5ac35f3fb0d8e7283175', 3, 'R', 0, NULL, NULL, NULL, '2018-05-04 01:52:58', '2018-05-04 02:00:18', NULL, NULL),
(47, 'p1', 'u11', 's1', NULL, 'rahulcse.1990@gmail.com', 'sha1$b14c4899$1$c67017d11df0ae821de33b9e8185ad1ac85dcaea', 3, 'I', 0, NULL, NULL, NULL, '2018-05-04 02:00:48', '2018-05-05 22:35:16', NULL, NULL),
(49, 'Test', 'Test', 'Test', NULL, 'Test@gmail.com', 'sha1$29aabeb2$1$26181d2d9007376daade4890624cb9d0b8a14136', 3, 'I', 0, NULL, NULL, NULL, '2018-05-05 22:44:47', '2018-05-05 22:45:17', NULL, NULL);

-- --------------------------------------------------------

--
-- Table structure for table `user_role`
--

DROP TABLE IF EXISTS `user_role`;
CREATE TABLE IF NOT EXISTS `user_role` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(45) NOT NULL,
  `created` datetime DEFAULT NULL,
  `modified` datetime DEFAULT NULL,
  `created_by` int(11) DEFAULT NULL,
  `modified_by` int(11) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8;

--
-- Dumping data for table `user_role`
--

INSERT INTO `user_role` (`id`, `name`, `created`, `modified`, `created_by`, `modified_by`) VALUES
(3, 'Admin User', '2018-04-16 14:06:00', '2018-04-16 14:06:00', 0, 0);

--
-- Constraints for dumped tables
--

--
-- Constraints for table `user`
--
ALTER TABLE `user`
  ADD CONSTRAINT `user_role` FOREIGN KEY (`user_role_id`) REFERENCES `user_role` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
