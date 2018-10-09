-- phpMyAdmin SQL Dump
-- version 4.6.4
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: 2018-10-09 13:37:39
-- 服务器版本： 5.7.14
-- PHP Version: 5.6.25

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `myapp`
--
CREATE DATABASE IF NOT EXISTS `myapp` DEFAULT CHARACTER SET latin1 COLLATE latin1_swedish_ci;
USE `myapp`;

-- --------------------------------------------------------

--
-- 表的结构 `detailed`
--

CREATE TABLE `detailed` (
  `detailed_id` bigint(20) NOT NULL,
  `list_id` bigint(20) NOT NULL,
  `marktime` int(11) NOT NULL
) ENGINE=MyISAM DEFAULT CHARSET=utf8;

--
-- 转存表中的数据 `detailed`
--

INSERT INTO `detailed` (`detailed_id`, `list_id`, `marktime`) VALUES
(1030, 24, 1535177806),
(1058, 29, 1536673617),
(1045, 28, 1536659753),
(1070, 29, 1536983835),
(1062, 29, 1536764332),
(1066, 28, 1536767415),
(1067, 29, 1536842829),
(1069, 42, 1536848662);

-- --------------------------------------------------------

--
-- 表的结构 `listmeta`
--

CREATE TABLE `listmeta` (
  `listmate_id` bigint(20) NOT NULL,
  `user_id` bigint(20) NOT NULL,
  `list_id` bigint(20) NOT NULL,
  `status` int(2) NOT NULL DEFAULT '0' COMMENT '0进行中 1已到期'
) ENGINE=MyISAM DEFAULT CHARSET=utf8;

--
-- 转存表中的数据 `listmeta`
--

INSERT INTO `listmeta` (`listmate_id`, `user_id`, `list_id`, `status`) VALUES
(27, 1006, 27, 1),
(25, 1006, 25, 1),
(24, 1006, 24, 1),
(28, 1006, 28, 1),
(29, 1006, 29, 0),
(42, 1006, 42, 1);

-- --------------------------------------------------------

--
-- 表的结构 `lists`
--

CREATE TABLE `lists` (
  `list_id` bigint(20) NOT NULL,
  `list_name` varchar(50) NOT NULL,
  `list_starttime` int(11) NOT NULL,
  `list_endtime` int(11) NOT NULL DEFAULT '0',
  `list_remark` varchar(200) DEFAULT NULL
) ENGINE=MyISAM DEFAULT CHARSET=utf8;

--
-- 转存表中的数据 `lists`
--

INSERT INTO `lists` (`list_id`, `list_name`, `list_starttime`, `list_endtime`, `list_remark`) VALUES
(24, '啊啊啊啊', 1535177463, 1535212740, ''),
(25, '添加一项', 1535178209, 1535212740, ''),
(27, '阿萨大大是', 1534918626, 1535005026, NULL),
(28, '这是今天的', 1536555171, 1536767940, '哈哈哈'),
(29, '还差哈哈', 1536562502, 0, '噜噜噜聚聚结构鬼哦拉锯套路套路V5图旅途卡啊啦啦啦图图'),
(42, '今天添加', 1536848604, 1536940740, '啦啦啦');

-- --------------------------------------------------------

--
-- 表的结构 `users`
--

CREATE TABLE `users` (
  `user_id` bigint(20) NOT NULL,
  `user_password` varchar(255) NOT NULL,
  `user_nickname` varchar(50) NOT NULL,
  `user_mail` varchar(50) NOT NULL,
  `user_avatar` varchar(400) NOT NULL,
  `user_regtime` int(11) NOT NULL,
  `user_level` int(10) NOT NULL DEFAULT '0'
) ENGINE=MyISAM DEFAULT CHARSET=utf8;

--
-- 转存表中的数据 `users`
--

INSERT INTO `users` (`user_id`, `user_password`, `user_nickname`, `user_mail`, `user_avatar`, `user_regtime`, `user_level`) VALUES
(1006, '4e746b0aadc7bd90fbb9f6071a6552ff', '钟林辉', '3146056629@qq.com', '1', 1534740362, 0);

--
-- Indexes for dumped tables
--

--
-- Indexes for table `detailed`
--
ALTER TABLE `detailed`
  ADD PRIMARY KEY (`detailed_id`);

--
-- Indexes for table `listmeta`
--
ALTER TABLE `listmeta`
  ADD PRIMARY KEY (`listmate_id`);

--
-- Indexes for table `lists`
--
ALTER TABLE `lists`
  ADD PRIMARY KEY (`list_id`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`user_id`);

--
-- 在导出的表使用AUTO_INCREMENT
--

--
-- 使用表AUTO_INCREMENT `detailed`
--
ALTER TABLE `detailed`
  MODIFY `detailed_id` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=1071;
--
-- 使用表AUTO_INCREMENT `listmeta`
--
ALTER TABLE `listmeta`
  MODIFY `listmate_id` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=43;
--
-- 使用表AUTO_INCREMENT `lists`
--
ALTER TABLE `lists`
  MODIFY `list_id` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=43;
--
-- 使用表AUTO_INCREMENT `users`
--
ALTER TABLE `users`
  MODIFY `user_id` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=1009;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
