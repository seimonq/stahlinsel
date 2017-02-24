-- phpMyAdmin SQL Dump
-- version 4.0.10deb1
-- http://www.phpmyadmin.net
--
-- Host: localhost
-- Erstellungszeit: 18. Feb 2017 um 20:27
-- Server Version: 5.5.54-0ubuntu0.14.04.1
-- PHP-Version: 5.5.9-1ubuntu4.21

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8 */;

--
-- Datenbank: `stahlinsel`
--
CREATE DATABASE IF NOT EXISTS `stahlinsel` DEFAULT CHARACTER SET utf8 COLLATE utf8_unicode_ci;
USE `stahlinsel`;

-- --------------------------------------------------------

--
-- Tabellenstruktur für Tabelle `chapter`
--

CREATE TABLE IF NOT EXISTS `chapter` (
  `index` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(30) COLLATE utf8_unicode_ci NOT NULL,
  `summary` text COLLATE utf8_unicode_ci NOT NULL,
  `owner` varchar(30) COLLATE utf8_unicode_ci NOT NULL,
  `time` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`index`),
  UNIQUE KEY `name` (`name`)
) ENGINE=InnoDB  DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci AUTO_INCREMENT=84 ;

--
-- Daten für Tabelle `chapter`
--

INSERT INTO `chapter` (`index`, `name`, `summary`, `owner`, `time`) VALUES
(2, 'Folgekapitel_dieOffenbarung', 'Unmögliche Dinge auf Papier gebracht', 'sikern', '2016-09-29 20:13:19'),
(4, '2-Stunden-Thema', 'FÃ¼r den Wartesaal beim Arzt.', 'arsch', '2016-12-08 23:37:07'),
(30, 'Löbenßwertestes', 'isset já schün', 'arsch', '2017-01-02 23:07:31'),
(33, 'etwas3', 'mehr', 'arsch', '2017-01-08 11:32:20'),
(38, 'neueFunktion', 'ist da', 'arsch', '2017-01-09 22:09:50'),
(42, 'gogogo', 'gone', 'arsch', '2017-01-09 22:29:58'),
(57, 'TestKapitel17', 'null komma null beschreibung', 'arsch', '2017-01-09 22:47:30'),
(68, 'Landung', 'Der Charakter betritt die Stahlinsel.. oder besser er wird auf sie gespuckt.', 'arsch', '2017-02-09 19:45:31'),
(75, 'zweiter Versuch ', 'Mit Referenzen', 'arsch', '2017-02-18 14:29:30'),
(81, 'etwas', 'mehr', 'arsch', '2017-02-18 14:51:29'),
(82, 'Kapitel24', 'Mit neuerFileStruktur', 'Donald Traum', '2017-02-18 18:27:54'),
(83, 'WiederEnds', '', 'arsch', '2017-02-18 18:28:31');

-- --------------------------------------------------------

--
-- Tabellenstruktur für Tabelle `chapter_edges`
--

CREATE TABLE IF NOT EXISTS `chapter_edges` (
  `index` int(11) NOT NULL AUTO_INCREMENT,
  `parent_id` int(11) NOT NULL,
  `child_id` int(11) NOT NULL,
  PRIMARY KEY (`index`)
) ENGINE=InnoDB  DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci AUTO_INCREMENT=183 ;

--
-- Daten für Tabelle `chapter_edges`
--

INSERT INTO `chapter_edges` (`index`, `parent_id`, `child_id`) VALUES
(10, 42, 4),
(11, 42, 2),
(12, 42, 30),
(121, 68, 42),
(145, 30, 75),
(146, 57, 75),
(150, 75, 30),
(151, 75, 38),
(152, 75, 57),
(170, 4, 81),
(171, 33, 81),
(172, 75, 81),
(173, 81, 57),
(176, 4, 82),
(177, 2, 82),
(178, 38, 82),
(179, 75, 82),
(180, 81, 83),
(181, 30, 83),
(182, 75, 83);

-- --------------------------------------------------------

--
-- Tabellenstruktur für Tabelle `login`
--

CREATE TABLE IF NOT EXISTS `login` (
  `index` int(11) NOT NULL AUTO_INCREMENT,
  `user` varchar(30) COLLATE utf8_unicode_ci NOT NULL,
  `name` varchar(30) COLLATE utf8_unicode_ci NOT NULL,
  `password` varchar(30) COLLATE utf8_unicode_ci NOT NULL,
  `login_amount` int(11) DEFAULT NULL,
  `last_login` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`index`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci AUTO_INCREMENT=1 ;

-- --------------------------------------------------------

--
-- Tabellenstruktur für Tabelle `node_edges`
--

CREATE TABLE IF NOT EXISTS `node_edges` (
  `index` int(11) NOT NULL AUTO_INCREMENT,
  `parent_id` int(11) NOT NULL,
  `child_id` int(11) NOT NULL,
  `teaser` text COLLATE utf8_unicode_ci NOT NULL,
  PRIMARY KEY (`index`)
) ENGINE=InnoDB  DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci AUTO_INCREMENT=89 ;

--
-- Daten für Tabelle `node_edges`
--

INSERT INTO `node_edges` (`index`, `parent_id`, `child_id`, `teaser`) VALUES
(1, 6, 3, ''),
(2, 9, 6, 'Ist nur zweiter'),
(4, 10, 5, 'Das ist der n&auml;chste Knoten, der kommt.'),
(6, 54, 47, 'hreasher'),
(9, 62, 54, ''),
(10, 63, 54, ''),
(11, 64, 60, 'saewrhg'),
(12, 64, 56, 'aqr'),
(15, 68, 62, ''),
(17, 70, 62, ''),
(18, 71, 62, 'aewtaweg'),
(19, 72, 62, 'aewtaweg'),
(20, 73, 62, ''),
(50, 110, 100, ''),
(64, 124, 127, 'Das ist ein Teaser, der gleiche!'),
(69, 132, 135, 'Willst du  die Kerzen anzünden.'),
(70, 135, 133, 'Du beachtest die Kerzen nicht.'),
(71, 135, 134, 'Du wartest, bis die Kerzen ausgehen.'),
(88, 149, 138, 'teaser tesaser');

-- --------------------------------------------------------

--
-- Tabellenstruktur für Tabelle `state`
--

CREATE TABLE IF NOT EXISTS `state` (
  `index` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(100) COLLATE utf8_unicode_ci NOT NULL,
  `type` varchar(30) COLLATE utf8_unicode_ci NOT NULL,
  PRIMARY KEY (`index`)
) ENGINE=InnoDB  DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci AUTO_INCREMENT=14 ;

--
-- Daten für Tabelle `state`
--

INSERT INTO `state` (`index`, `name`, `type`) VALUES
(3, 'Messer', 'Gegenstand'),
(4, 'Wasserkopf', 'Zustand'),
(5, 'Bekifft', 'Information'),
(6, 'Erschöpft', 'Zustand'),
(7, 'Total Kaputt', 'Zustand'),
(8, 'Kerzen', 'Gegenstand'),
(9, 'ClassItem', 'Information'),
(10, 'RealClassItem', 'Zustand');

-- --------------------------------------------------------

--
-- Tabellenstruktur für Tabelle `state_nodeedge_relation`
--

CREATE TABLE IF NOT EXISTS `state_nodeedge_relation` (
  `index` int(11) NOT NULL AUTO_INCREMENT,
  `state_id` int(11) NOT NULL,
  `nodeedge_id` int(11) NOT NULL,
  PRIMARY KEY (`index`)
) ENGINE=InnoDB  DEFAULT CHARSET=utf8 COLLATE=utf8_swedish_ci AUTO_INCREMENT=62 ;

--
-- Daten für Tabelle `state_nodeedge_relation`
--

INSERT INTO `state_nodeedge_relation` (`index`, `state_id`, `nodeedge_id`) VALUES
(1, 4, 6),
(2, 3, 7),
(3, 4, 7),
(4, 7, 8),
(5, 5, 9),
(6, 5, 10),
(7, 7, 11),
(9, 3, 15),
(10, 7, 15),
(13, 3, 18),
(14, 6, 18),
(15, 3, 19),
(16, 6, 19),
(48, 3, 64),
(49, 6, 64),
(52, 8, 69),
(61, 6, 88);

-- --------------------------------------------------------

--
-- Tabellenstruktur für Tabelle `state_node_relation`
--

CREATE TABLE IF NOT EXISTS `state_node_relation` (
  `index` int(11) NOT NULL AUTO_INCREMENT,
  `node_id` int(11) NOT NULL,
  `state_id` int(11) NOT NULL,
  PRIMARY KEY (`index`)
) ENGINE=InnoDB  DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci AUTO_INCREMENT=97 ;

--
-- Daten für Tabelle `state_node_relation`
--

INSERT INTO `state_node_relation` (`index`, `node_id`, `state_id`) VALUES
(1, 54, 3),
(2, 55, 6),
(3, 55, 7),
(4, 56, 4),
(5, 57, 6),
(6, 58, 6),
(7, 58, 5),
(8, 62, 6),
(9, 63, 6),
(10, 64, 5),
(11, 64, 3),
(15, 68, 4),
(16, 68, 5),
(17, 68, 7),
(21, 70, 4),
(22, 70, 5),
(23, 70, 7),
(29, 72, 4),
(30, 72, 5),
(31, 72, 7),
(32, 72, 4),
(33, 72, 5),
(78, 110, 4),
(85, 127, 4),
(86, 127, 5),
(87, 127, 7),
(88, 127, 6),
(90, 132, 8),
(91, 133, 7),
(92, 138, 4),
(96, 149, 3);

-- --------------------------------------------------------

--
-- Tabellenstruktur für Tabelle `storynode`
--

CREATE TABLE IF NOT EXISTS `storynode` (
  `index` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(30) COLLATE utf8_unicode_ci NOT NULL,
  `text` text COLLATE utf8_unicode_ci NOT NULL,
  `chapter` int(11) NOT NULL,
  `owner` varchar(30) COLLATE utf8_unicode_ci NOT NULL,
  `time` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`index`)
) ENGINE=InnoDB  DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci AUTO_INCREMENT=150 ;

--
-- Daten für Tabelle `storynode`
--

INSERT INTO `storynode` (`index`, `name`, `text`, `chapter`, `owner`, `time`) VALUES
(3, 'myNode#1', 'Die Geschichte geht los und du hast nichts in den Taschen.', 32, 'arsch', '2017-01-14 07:13:54'),
(10, '27012017', 'Lass es kommen.', 32, 'Donald Trump', '2017-01-27 15:54:03'),
(11, '27012017', 'Lass es kommen. Auch in diesem Chapter', 30, 'Donald Trump', '2017-01-27 16:20:46'),
(23, 'Das_Wirbeltier', 'Wirbelt sich.', 32, 'Donald Trump', '2017-02-09 20:14:01'),
(24, 'ööööhm', 'Lölaläß', 66, 'Donald Trump', '2017-02-10 20:05:38'),
(54, 'mal_was_falschesassssa', 'Die kunst hat viel zu bieten.', 61, 'Donald Trump', '2017-02-11 01:30:28'),
(56, 'asdgf', 'Textage', 61, 'Donald Trump', '2017-02-11 09:20:41'),
(57, 'asdgf', 'Textage', 4, 'Donald Trump', '2017-02-11 09:23:29'),
(58, 'soviele_wie_geht', 'Textage', 4, 'Donald Trump', '2017-02-11 09:23:56'),
(59, 'das_ist_komplett_ok', '', 61, 'Donald Trump', '2017-02-11 10:18:38'),
(60, 'das_ist_komplett_ok', '', 61, 'Donald Trump', '2017-02-11 10:18:54'),
(61, 'das_ist_komplett_ok', '', 61, 'Donald Trump', '2017-02-11 10:18:58'),
(62, 'das_ist_komplett_ok,_wa', '', 61, 'Donald Trump', '2017-02-11 10:20:49'),
(63, 'das_ist_komplett_ok,_wa', '', 61, 'Donald Trump', '2017-02-11 10:20:52'),
(64, 'das_ist_komplett_ok,_wa', 'Fertig!', 61, 'Donald Trump', '2017-02-11 10:25:49'),
(68, 'jetzt_endlich_gehts', 'Die kunst hat viel zu bieten. Nicht wahr', 61, 'Donald Trump', '2017-02-11 21:21:29'),
(70, 'jetzt_endlich_gehts', 'Die kunst hat viel zu bieten. Nicht wahr', 61, 'Donald Trump', '2017-02-11 21:28:24'),
(72, 'Test#1', 'Ein einfaches töxtschen', 61, 'Donald Trump', '2017-02-11 21:28:54'),
(100, '#124', 'Kurzes Testkapitel ein Knoten', 4, 'Donald Trump', '2017-02-11 22:19:49'),
(110, '#123', 'Kurzes Testkapitel', 4, 'Donald Trump', '2017-02-11 22:31:47'),
(124, 'Knoten_0.5', 'Text 0.5', 68, 'Donald Trump', '2017-02-11 23:04:32'),
(127, 'Knoten_1', 'Text', 68, 'Donald Trump', '2017-02-11 23:27:45'),
(132, 'Kerzen_holen', 'Die Kerzen Brennen.', 70, 'Donald Trump', '2017-02-11 23:37:09'),
(133, 'Der_Tisch_brennt', 'Die Kerzen sind heruntergebrannt und haben den Tisch enflammt!', 70, 'Donald Trump', '2017-02-11 23:41:04'),
(134, 'Die_Kerzen_gehen_aus.', 'Und alle gehen nach Haus.', 70, 'Donald Trump', '2017-02-11 23:42:14'),
(135, 'Kerzen_anzünden', 'Die Kerzen Brennen.', 70, 'Donald Trump', '2017-02-11 23:43:07'),
(138, 'Knoten_für_Kapitel_17', 'Text', 57, 'Donald Trump', '2017-02-18 16:41:15'),
(149, 'knotenname', 'Text', 57, 'Donald Trump', '2017-02-18 18:48:14');

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
