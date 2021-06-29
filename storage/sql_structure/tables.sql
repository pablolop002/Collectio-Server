-- phpMyAdmin SQL Dump
-- version 5.0.3
-- https://www.phpmyadmin.net/

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT = @@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS = @@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION = @@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `collectio`
--
CREATE DATABASE IF NOT EXISTS `collectio` DEFAULT CHARACTER SET utf8 COLLATE utf8_general_ci;
USE `collectio`;

-- --------------------------------------------------------

--
-- Table structure for table `Categories`
--

DROP TABLE IF EXISTS `Categories`;
CREATE TABLE `Categories`
(
    `Id`      int(11) NOT NULL,
    `Image`   varchar(255) DEFAULT NULL,
    `Spanish` varchar(255) DEFAULT NULL,
    `English` varchar(255) DEFAULT NULL,
    `Catalan` varchar(255) DEFAULT NULL,
    `Basque`  varchar(255) DEFAULT NULL
) ENGINE = InnoDB
  DEFAULT CHARSET = utf8;

--
-- Dumping data for table `Categories`
--

INSERT INTO `Categories` (`Id`, `Image`, `Spanish`, `English`, `Catalan`, `Basque`)
VALUES (1, NULL, 'Antigüedades', 'Antiques', '', ''),
       (2, NULL, 'Arqueología e historia natural', 'Archaeology & Natural Story', '', ''),
       (3, NULL, 'Arte', 'Art', '', ''),
       (4, NULL, 'Artesanía', 'Craftwork', '', ''),
       (5, NULL, 'Bebidas y envases', 'Drinks & Bottles', '', ''),
       (6, NULL, 'Cámaras Fotográficas', 'Cameras', '', ''),
       (7, NULL, 'Cine y Series', 'Cinema & TV Shows', '', ''),
       (8, NULL, 'Medios de transporte', '', '', ''),
       (9, NULL, 'Comunicación y sonido', '', '', ''),
       (10, NULL, 'Costura y manualidades', 'Sewing & Handicraft', '', ''),
       (11, NULL, 'Deportes y eventos', 'Sports & Events', '', ''),
       (12, NULL, 'Informática y electrónica', '', '', ''),
       (13, NULL, 'Interiores y decoración', '', '', ''),
       (14, NULL, 'Joyería', 'Fashion', '', ''),
       (15, NULL, 'Juguetes y Juegos', 'Toys & Games', '', ''),
       (16, NULL, 'Libros, Cómics y Manga', 'Books, comics & Manga', '', ''),
       (17, NULL, 'Militaría y Armas', 'Military & Weaponry', '', ''),
       (18, NULL, 'Monedas y Billetes', 'Coins & ', '', ''),
       (19, NULL, 'Música', 'Music', '', ''),
       (20, NULL, 'Otros', 'Other', '', ''),
       (21, NULL, 'Papelería', '', '', ''),
       (22, NULL, 'Relojes', '', '', ''),
       (23, NULL, 'Sellos', 'Stamps', '', ''),
       (24, NULL, 'Textil', '', '', '');

-- --------------------------------------------------------

--
-- Table structure for table `Collections`
--

DROP TABLE IF EXISTS `Collections`;
CREATE TABLE `Collections`
(
    `Id`          int(11)    NOT NULL,
    `CategoryId`  int(11)    NOT NULL,
    `UserId`      int(11)    NOT NULL,
    `Name`        text       NOT NULL,
    `Description` text                DEFAULT NULL,
    `Image`       varchar(255)        DEFAULT NULL,
    `Private`     tinyint(1) NOT NULL DEFAULT '1',
    `CreatedAt`   timestamp  NULL     DEFAULT NULL,
    `UpdatedAt`   timestamp  NULL     DEFAULT NULL
) ENGINE = InnoDB
  DEFAULT CHARSET = utf8;

-- --------------------------------------------------------

--
-- Table structure for table `ItemImages`
--

DROP TABLE IF EXISTS `ItemImages`;
CREATE TABLE `ItemImages`
(
    `Id`     int(11)      NOT NULL,
    `ItemId` int(11)      NOT NULL,
    `Image`  varchar(255) NOT NULL
) ENGINE = InnoDB
  DEFAULT CHARSET = utf8;

-- --------------------------------------------------------

--
-- Table structure for table `Items`
--

DROP TABLE IF EXISTS `Items`;
CREATE TABLE `Items`
(
    `Id`            int(11)    NOT NULL,
    `CollectionId`  int(11)    NOT NULL,
    `SubcategoryId` int(11)             DEFAULT NULL,
    `Name`          text       NOT NULL,
    `Description`   text                DEFAULT NULL,
    `Private`       tinyint(1) NOT NULL DEFAULT '1',
    `CreatedAt`     timestamp  NULL     DEFAULT NULL,
    `UpdatedAt`     timestamp  NULL     DEFAULT NULL
) ENGINE = InnoDB
  DEFAULT CHARSET = utf8;

-- --------------------------------------------------------

--
-- Table structure for table `MobileSessions`
--

DROP TABLE IF EXISTS `MobileSessions`;
CREATE TABLE `MobileSessions`
(
    `Token`          varchar(255) NOT NULL,
    `UserId`         int(11)      NOT NULL,
    `CreatedAt`      timestamp    NULL DEFAULT CURRENT_TIMESTAMP,
    `UsedAt`         timestamp    NULL DEFAULT NULL,
    `Device`         varchar(255)      DEFAULT NULL,
    `UserDeviceName` varchar(255)      DEFAULT NULL
) ENGINE = InnoDB
  DEFAULT CHARSET = utf8;

-- --------------------------------------------------------

--
-- Table structure for table `Subcategories`
--

DROP TABLE IF EXISTS `Subcategories`;
CREATE TABLE `Subcategories`
(
    `Id`         int(11) NOT NULL,
    `CategoryId` int(11) NOT NULL,
    `Image`      varchar(255) DEFAULT NULL,
    `Fields`     text    NOT NULL,
    `Spanish`    varchar(255) DEFAULT NULL,
    `English`    varchar(255) DEFAULT NULL,
    `Catalan`    varchar(255) DEFAULT NULL,
    `Basque`     varchar(255) DEFAULT NULL
) ENGINE = InnoDB
  DEFAULT CHARSET = utf8;

--
-- Dumping data for table `Subcategories`
--

INSERT INTO `Subcategories` (`Id`, `CategoryId`, `Image`, `Fields`, `Spanish`, `English`, `Catalan`, `Basque`)
VALUES (1, 1, NULL, '', 'Muebles antiguos', '', '', ''),
       (2, 1, NULL, '', 'Porcelana y cerámica', '', '', ''),
       (3, 1, NULL, '', 'Otros', '', '', ''),
       (4, 2, NULL, '', 'Fósiles', '', '', ''),
       (5, 2, NULL, '', 'Minerales y rocas', '', '', ''),
       (6, 5, NULL, '', 'Tapones', '', '', ''),
       (7, 5, NULL, '', 'Cervezas', '', '', ''),
       (8, 5, NULL, '', 'Vinos', '', '', ''),
       (9, 5, NULL, '', 'Placas de cava', '', '', ''),
       (10, 5, NULL, '', 'Cavas', '', '', ''),
       (11, 7, NULL, '', 'DVD', '', '', ''),
       (12, 7, NULL, '', 'VHS', '', '', ''),
       (13, 7, NULL, '', 'Blu-ray', '', '', ''),
       (14, 7, NULL, '', 'Material autografiado', '', '', ''),
       (15, 8, NULL, '', 'Coches', '', '', ''),
       (16, 8, NULL, '', 'Motocicletas', '', '', ''),
       (17, 8, NULL, '', 'Bicicletas', '', '', ''),
       (18, 9, NULL, '', 'Hi-Fi y radio', '', '', ''),
       (19, 9, NULL, '', 'Gramófonos', '', '', ''),
       (20, 9, NULL, '', 'Tocadiscos', '', '', ''),
       (21, 9, NULL, '', 'Teléfonos', '', '', ''),
       (22, 9, NULL, '', 'Televisores', '', '', ''),
       (23, 10, NULL, '', 'Dedales', '', '', ''),
       (24, 11, NULL, '', 'Material deportivo', '', '', ''),
       (25, 11, NULL, '', 'Ropa y complementos', '', '', ''),
       (26, 11, NULL, '', 'Material autografiado', '', '', ''),
       (27, 12, NULL, '', 'Ordenadores y accesorios', '', '', ''),
       (28, 12, NULL, '', 'Monitores', '', '', ''),
       (29, 12, NULL, '', 'Impresoras y accesorios', '', '', ''),
       (30, 12, NULL, '', 'Software', '', '', ''),
       (31, 13, NULL, '', 'Figuras', '', '', ''),
       (32, 13, NULL, '', 'Imanes', '', '', ''),
       (33, 15, NULL, '', 'Figuras', '', '', ''),
       (34, 15, NULL, '', 'Funkos', '', '', ''),
       (35, 15, NULL, '', 'Maquetas', '', '', ''),
       (36, 15, NULL, '', 'Material autografiado', '', '', ''),
       (37, 16, NULL, '', 'Cartografía', '', '', ''),
       (38, 16, NULL, '', 'Libros', '', '', ''),
       (39, 16, NULL, '', 'Cómics', '', '', ''),
       (40, 16, NULL, '', 'Libros - Arte y fotografía', '', '', ''),
       (41, 16, NULL, '', 'Material autografiado', '', '', ''),
       (42, 18, NULL, '', 'Monedas periodo antiguo', '', '', ''),
       (43, 18, NULL, '', 'Monedas periodo moderno', '', '', ''),
       (44, 18, NULL, '', 'Monedas España', '', '', ''),
       (45, 18, NULL, '', 'Monedas extranjeras', '', '', ''),
       (46, 18, NULL, '', 'Notafilia - Billetes', '', '', ''),
       (47, 19, NULL, '', 'Discos', '', '', ''),
       (48, 19, NULL, '', 'Vinilos', '', '', ''),
       (49, 19, NULL, '', 'Instrumentos musicales', '', '', ''),
       (50, 19, NULL, '', 'Material autografiado', '', '', ''),
       (51, 21, NULL, '', 'Cromos y álbumes', '', '', ''),
       (52, 21, NULL, '', 'Pegatinas', '', '', ''),
       (53, 21, NULL, '', 'Material autografiado', '', '', ''),
       (54, 21, NULL, '', 'Fotografías', '', '', ''),
       (55, 21, NULL, '', 'Postales', '', '', ''),
       (56, 22, NULL, '', 'Relojes de pulsera', '', '', ''),
       (57, 22, NULL, '', 'Relojes de pared', '', '', ''),
       (58, 22, NULL, '', 'Relojes de bolsillo', '', '', '');

-- --------------------------------------------------------

--
-- Table structure for table `Users`
--

DROP TABLE IF EXISTS `Users`;
CREATE TABLE `Users`
(
    `Id`          int(11)                NOT NULL,
    `Nickname`    varchar(255) DEFAULT NULL,
    `Mail`        varchar(255) DEFAULT NULL,
    `Image`       varchar(255) DEFAULT NULL,
    `AppleId`     varchar(255) DEFAULT NULL,
    `GoogleId`    varchar(255) DEFAULT NULL,
    `MicrosoftId` varchar(255) DEFAULT NULL,
    `IsAdmin`     tinyint(1)   DEFAULT 0 NOT NULL
) ENGINE = InnoDB
  DEFAULT CHARSET = utf8;

--
-- Indexes for dumped tables
--

--
-- Indexes for table `Categories`
--
ALTER TABLE `Categories`
    ADD PRIMARY KEY (`Id`);

--
-- Indexes for table `Collections`
--
ALTER TABLE `Collections`
    ADD PRIMARY KEY (`Id`),
    ADD KEY `Collections_CategoryId_index` (`CategoryId`),
    ADD KEY `Collections_UserId_index` (`UserId`);

--
-- Indexes for table `ItemImages`
--
ALTER TABLE `ItemImages`
    ADD PRIMARY KEY (`Id`),
    ADD KEY `ItemImages_Items_Id_fk` (`ItemId`);

--
-- Indexes for table `Items`
--
ALTER TABLE `Items`
    ADD PRIMARY KEY (`Id`),
    ADD KEY `Items_CollectionId_index` (`CollectionId`);

--
-- Indexes for table `MobileSessions`
--
ALTER TABLE `MobileSessions`
    ADD PRIMARY KEY (`Token`),
    ADD UNIQUE KEY `MobileSessions_Token_uindex` (`Token`),
    ADD KEY `MobileSessions_Users_Id_fk` (`UserId`);

--
-- Indexes for table `Subcategories`
--
ALTER TABLE `Subcategories`
    ADD PRIMARY KEY (`Id`),
    ADD KEY `Subcategories_CategoryId_index` (`CategoryId`);

--
-- Indexes for table `Users`
--
ALTER TABLE `Users`
    ADD PRIMARY KEY (`Id`),
    ADD UNIQUE KEY `Users_AppleId_uindex` (`AppleId`),
    ADD UNIQUE KEY `Users_GoogleId_uindex` (`GoogleId`),
    ADD UNIQUE KEY `Users_MicrosoftId_uindex` (`MicrosoftId`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `Categories`
--
ALTER TABLE `Categories`
    MODIFY `Id` int(11) NOT NULL AUTO_INCREMENT,
    AUTO_INCREMENT = 25;

--
-- AUTO_INCREMENT for table `Collections`
--
ALTER TABLE `Collections`
    MODIFY `Id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `ItemImages`
--
ALTER TABLE `ItemImages`
    MODIFY `Id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `Items`
--
ALTER TABLE `Items`
    MODIFY `Id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `Subcategories`
--
ALTER TABLE `Subcategories`
    MODIFY `Id` int(11) NOT NULL AUTO_INCREMENT,
    AUTO_INCREMENT = 59;

--
-- AUTO_INCREMENT for table `Users`
--
ALTER TABLE `Users`
    MODIFY `Id` int(11) NOT NULL AUTO_INCREMENT;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `Collections`
--
ALTER TABLE `Collections`
    ADD CONSTRAINT `Collections_Categories_Id_fk` FOREIGN KEY (`CategoryId`) REFERENCES `Categories` (`Id`) ON DELETE CASCADE ON UPDATE CASCADE,
    ADD CONSTRAINT `Collections_Users_Id_fk` FOREIGN KEY (`UserId`) REFERENCES `Users` (`Id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `ItemImages`
--
ALTER TABLE `ItemImages`
    ADD CONSTRAINT `ItemImages_Items_Id_fk` FOREIGN KEY (`ItemId`) REFERENCES `Items` (`Id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `Items`
--
ALTER TABLE `Items`
    ADD CONSTRAINT `Items_Collections_Id_fk` FOREIGN KEY (`CollectionId`) REFERENCES `Collections` (`Id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `MobileSessions`
--
ALTER TABLE `MobileSessions`
    ADD CONSTRAINT `MobileSessions_Users_Id_fk` FOREIGN KEY (`UserId`) REFERENCES `Users` (`Id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `Subcategories`
--
ALTER TABLE `Subcategories`
    ADD CONSTRAINT `Subcategories_Categories_Id_fk` FOREIGN KEY (`CategoryId`) REFERENCES `Categories` (`Id`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT = @OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS = @OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION = @OLD_COLLATION_CONNECTION */;
