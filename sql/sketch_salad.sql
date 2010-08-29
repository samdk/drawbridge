-- phpMyAdmin SQL Dump
-- version 3.3.2deb1
-- http://www.phpmyadmin.net
--
-- Host: localhost
-- Generation Time: Aug 29, 2010 at 02:16 AM
-- Server version: 5.1.41
-- PHP Version: 5.3.2-1ubuntu4.2

SET SQL_MODE="NO_AUTO_VALUE_ON_ZERO";

--
-- Database: `sketch_salad`
--

-- --------------------------------------------------------

--
-- Table structure for table `segment`
--

DROP TABLE IF EXISTS `segment`;
CREATE TABLE `segment` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `color` varchar(7) NOT NULL DEFAULT '#000000',
  `points` longtext NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=MyISAM  DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Table structure for table `sketch`
--

DROP TABLE IF EXISTS `sketch`;
CREATE TABLE `sketch` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `hash` varchar(40) NOT NULL,
  `parent_id` varchar(40) DEFAULT NULL,
  `root_id` varchar(40) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `modified_at` timestamp NOT NULL DEFAULT '0000-00-00 00:00:00',
  PRIMARY KEY (`id`),
  KEY `hash` (`hash`)
) ENGINE=MyISAM  DEFAULT CHARSET=latin1;


-- --------------------------------------------------------

--
-- Table structure for table `saved_sketch`
--
DROP TABLE IF EXISTS `saved_sketch`;
CREATE TABLE `saved_sketch` (
    `key` VARCHAR( 40 ) NOT NULL ,
    `data` TEXT NOT NULL ,
    PRIMARY KEY (  `key` )
) ENGINE = MYISAM;

-- --------------------------------------------------------

--
-- Table structure for table `sketch_to_segment`
--

DROP TABLE IF EXISTS `sketch_to_segment`;
CREATE TABLE `sketch_to_segment` (
  `sketch_id` bigint(20) NOT NULL,
  `segment_id` bigint(20) NOT NULL
) ENGINE=MyISAM DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Table structure for table `user`
--

DROP TABLE IF EXISTS `user`;
CREATE TABLE `user` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `name` varchar(64) NOT NULL,
  `email` text,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=MyISAM  DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Table structure for table `user_to_sketch`
--

DROP TABLE IF EXISTS `user_to_sketch`;
CREATE TABLE `user_to_sketch` (
  `user_id` bigint(20) NOT NULL,
  `sketch_id` bigint(20) NOT NULL,
  `is_active` tinyint(1) NOT NULL DEFAULT '1'
) ENGINE=MyISAM DEFAULT CHARSET=latin1;

