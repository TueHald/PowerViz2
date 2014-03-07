/*Database tables: */

-- phpMyAdmin SQL Dump
-- version 3.4.10.1deb1
-- http://www.phpmyadmin.net
--
-- Vært: localhost
-- Genereringstid: 27. 02 2014 kl. 17:32:00
-- Serverversion: 5.5.32
-- PHP-version: 5.3.10-1ubuntu3.8

SET SQL_MODE="NO_AUTO_VALUE_ON_ZERO";
SET time_zone = "+00:00";

--
-- Database: `PowerVizDevelopment`
--

-- --------------------------------------------------------

--
-- Struktur-dump for tabellen `BoxConfig`
--

CREATE TABLE IF NOT EXISTS `BoxConfig` (
  `houseId` int(11) NOT NULL,
  `boxIP` varchar(32) COLLATE utf8_bin NOT NULL COMMENT 'The IP of the box on the local net ',
  `boxID` varchar(8) COLLATE utf8_bin NOT NULL COMMENT 'Last five digits written on the box.',
  `boxPort` int(11) NOT NULL DEFAULT '10001' COMMENT 'TCP/IP port used for communicating ith the box.',
  `sleepTime` int(11) NOT NULL DEFAULT '1' COMMENT 'Seconds between each dataread on outlets.',
  `historyTime` int(11) NOT NULL DEFAULT '15' COMMENT 'Minutes between box sending history data to server.',
  `maxWatts` int(11) NOT NULL DEFAULT '1000' COMMENT 'The max watts that the speedometer uses as max.',
  `bulbWatts` int(11) NOT NULL DEFAULT '50' COMMENT 'The number of watts that one bulb on the screensaver represents.',
  `kwattPrice` double NOT NULL DEFAULT '1' COMMENT 'Price in kroner for 1 kilowatt/hour.',
  UNIQUE KEY `houseId` (`houseId`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_bin COMMENT='Configurations for each Harvester.';

-- --------------------------------------------------------

--
-- Struktur-dump for tabellen `BoxLog`
--

CREATE TABLE IF NOT EXISTS `BoxLog` (
  `houseId` int(11) NOT NULL,
  `time` datetime NOT NULL,
  `msg` varchar(1024) COLLATE utf8_bin NOT NULL,
  KEY `houseId` (`houseId`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_bin;

-- --------------------------------------------------------

--
-- Struktur-dump for tabellen `CurrentLoad`
--

CREATE TABLE IF NOT EXISTS `CurrentLoad` (
  `houseId` int(11) NOT NULL,
  `outletId` int(11) NOT NULL,
  `time` datetime NOT NULL,
  `load` float NOT NULL,
  PRIMARY KEY (`houseId`,`outletId`)
) ENGINE=MEMORY DEFAULT CHARSET=utf8 COLLATE=utf8_bin COMMENT='The current load on all outlets.';

-- --------------------------------------------------------

--
-- Struktur-dump for tabellen `DisplayLog`
--

CREATE TABLE IF NOT EXISTS `DisplayLog` (
  `houseId` int(11) NOT NULL,
  `time` datetime NOT NULL,
  `tag` varchar(256) COLLATE utf8_bin NOT NULL,
  `type` varchar(32) COLLATE utf8_bin NOT NULL,
  `comments` varchar(256) COLLATE utf8_bin NOT NULL,
  KEY `houseId` (`houseId`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_bin;

-- --------------------------------------------------------

--
-- Struktur-dump for tabellen `HouseOutlets`
--

CREATE TABLE IF NOT EXISTS `HouseOutlets` (
  `houseId` int(11) NOT NULL COMMENT 'PowerViz house Id.',
  `outletId` int(11) NOT NULL COMMENT 'We use the zense ID.',
  `outletName` varchar(128) CHARACTER SET utf8 COLLATE utf8_danish_ci NOT NULL COMMENT 'PowerViz name, for naming outlet on display',
  `outletZenseName` varchar(16) CHARACTER SET utf8 COLLATE utf8_danish_ci NOT NULL COMMENT 'Name obtained from PC-box',
  `outletZenseRoom` varchar(16) CHARACTER SET utf8 COLLATE utf8_danish_ci NOT NULL COMMENT 'Room name from PC-box',
  `outletZenseFloor` varchar(16) CHARACTER SET utf8 COLLATE utf8_danish_ci NOT NULL COMMENT 'Floor name from PC-box',
  `roomId` int(11) NOT NULL DEFAULT '0' COMMENT 'Room ID in powerviz.',
  `color` varchar(8) CHARACTER SET utf8 COLLATE utf8_danish_ci NOT NULL DEFAULT '0x000000' COMMENT 'Color, in hex format (eg. 0xFF00FF) for use on display.',
  KEY `houseId` (`houseId`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_bin;

-- --------------------------------------------------------

--
-- Struktur-dump for tabellen `HouseRooms`
--

CREATE TABLE IF NOT EXISTS `HouseRooms` (
  `houseId` int(11) NOT NULL,
  `roomId` int(11) NOT NULL,
  `roomName` varchar(128) CHARACTER SET utf8 COLLATE utf8_danish_ci NOT NULL,
  `roomColor` varchar(8) COLLATE utf8_bin NOT NULL,
  PRIMARY KEY (`houseId`,`roomId`),
  KEY `houseId` (`houseId`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_bin;

-- --------------------------------------------------------

--
-- Struktur-dump for tabellen `LoadHistory`
--

CREATE TABLE IF NOT EXISTS `LoadHistory` (
  `houseId` int(11) NOT NULL,
  `outletId` int(11) NOT NULL,
  `time` datetime NOT NULL,
  `load` float NOT NULL,
  KEY `houseId` (`houseId`,`outletId`,`time`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_bin COMMENT='Watt usage history. There should be 15 minutes btwn values.';

-- --------------------------------------------------------

--
-- Struktur-dump for tabellen `PowerSource`
--

CREATE TABLE IF NOT EXISTS `PowerSource` (
  `time` datetime NOT NULL,
  `source` enum('coal','wind','water','sun','nuclear') COLLATE utf8_bin NOT NULL,
  `wind` double NOT NULL DEFAULT '0',
  `water` double NOT NULL DEFAULT '0',
  `coal` double NOT NULL DEFAULT '0',
  `nuclear` double NOT NULL DEFAULT '0',
  `sun` double NOT NULL DEFAULT '0',
  KEY `time` (`time`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_bin;

-- --------------------------------------------------------


-----------------------------------------------------
-- Weather Data:

CREATE TABLE IF NOT EXISTS WeatherData (
	cityId int(11) NOT NULL COMMENT 'City ID from OpenWeatherMap.org',
	fromTime datetime NOT NULL COMMENT 'Start time of the weather/forecast information.',
	toTime datetime NOT NULL COMMENT 'End time of the weather/forecast information.',
	windSpeed double NOT NULL DEFAULT '0' COMMENT 'The average wind speed in the period, measured in meters per second.',
	weatherIcon varchar(8) COLLATE utf8_bin NOT NULL COMMENT 'The icon ID for the weather, from OpenWeatherMap.org.',
  acquired datetime NOT NULL COMMENT 'Time when this data was acquired.',
  PRIMARY KEY (cityId, fromTime)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_bin; 


-- The House table.
CREATE TABLE IF NOT EXISTS House (
  houseId int(11) NOT NULL COMMENT 'The ID of the house',
  cityId int(11) NOT NULL COMMENT 'The city ID used for obtaining weather data.',
  PRIMARY KEY (houseId)
) ENGINE=InnoDB;


-- Power prices
CREATE TABLE IF NOT EXISTS PowerPrices (
  fromTime datetime NOT NULL COMMENT 'Start of the price timeslot',
  toTime datetime NOT NULL COMMENT 'End pf the price timeslot',
  dk1 float NOT NULL COMMENT 'Price pr mwh in kr, west of storebaelt.',
  dk2 float NOT NULL COMMENT 'Price pr mwh in kr, east of storebaelt.',
  PRIMARY KEY (fromTime)
) ENGINE=InnoDB;