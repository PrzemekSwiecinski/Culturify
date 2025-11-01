-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Cze 15, 2024 at 11:23 PM
-- Wersja serwera: 10.4.32-MariaDB
-- Wersja PHP: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `culturify`
--

-- --------------------------------------------------------

--
-- Struktura tabeli dla tabeli `admini`
--

CREATE TABLE `admini` (
  `id_admina` int(4) NOT NULL,
  `login` varchar(50) NOT NULL,
  `haslo` varchar(255) NOT NULL,
  `imie` varchar(30) NOT NULL,
  `nazwisko` varchar(50) NOT NULL,
  `token_sesji` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_polish_ci;

--
-- Dumping data for table `admini`
--

INSERT INTO `admini` (`id_admina`, `login`, `haslo`, `imie`, `nazwisko`, `token_sesji`) VALUES
(1, 'admin', 'admin', 'Tomasz', 'Adamek', '27594d2445b6e7a999495cb24cf9ae330f6eca07938a829585cef1dcc8e6e2cb');

-- --------------------------------------------------------

--
-- Struktura tabeli dla tabeli `bilety`
--

CREATE TABLE `bilety` (
  `id_biletu` int(4) NOT NULL,
  `id_wydarzenia` int(4) NOT NULL,
  `id_uzytkownika` int(4) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_polish_ci;

--
-- Dumping data for table `bilety`
--

INSERT INTO `bilety` (`id_biletu`, `id_wydarzenia`, `id_uzytkownika`) VALUES
(1, 2, 2),
(2, 1, 1),
(3, 2, 2),
(4, 2, 1),
(5, 4, 1),
(6, 1, NULL),
(7, 2, NULL),
(8, 1, NULL),
(9, 1, 1),
(10, 1, 1),
(11, 1, NULL),
(12, 1, 1),
(13, 1, 1),
(14, 1, 1);

-- --------------------------------------------------------

--
-- Struktura tabeli dla tabeli `organizatorzy`
--

CREATE TABLE `organizatorzy` (
  `id_organizatora` int(4) NOT NULL,
  `login` varchar(50) NOT NULL,
  `haslo` varchar(255) NOT NULL,
  `nazwa` varchar(30) NOT NULL,
  `telefon` varchar(9) NOT NULL,
  `token_sesji` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_polish_ci;

--
-- Dumping data for table `organizatorzy`
--

INSERT INTO `organizatorzy` (`id_organizatora`, `login`, `haslo`, `nazwa`, `telefon`, `token_sesji`) VALUES
(1, 'jaga', 'jaga', 'Jagiellonia Białystok', '689333021', '55ed6764860e19711cac1a596bee62915561c8e36f1c65e352351cea0948ce11'),
(2, 'mar123', 'mar123', 'Marek', '654123765', ''),
(3, 'qwerty', '123321', 'Mariusz', '545666777', '');

-- --------------------------------------------------------

--
-- Struktura tabeli dla tabeli `uzytkownicy`
--

CREATE TABLE `uzytkownicy` (
  `id_uzytkownika` int(4) NOT NULL,
  `login` varchar(50) NOT NULL,
  `haslo` varchar(255) NOT NULL,
  `imie` varchar(30) NOT NULL,
  `nazwisko` varchar(50) NOT NULL,
  `email` varchar(255) NOT NULL,
  `PESEL` varchar(11) NOT NULL,
  `telefon` varchar(9) NOT NULL,
  `token_sesji` varchar(255) NOT NULL,
  `portfel` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_polish_ci;

--
-- Dumping data for table `uzytkownicy`
--

INSERT INTO `uzytkownicy` (`id_uzytkownika`, `login`, `haslo`, `imie`, `nazwisko`, `email`, `PESEL`, `telefon`, `token_sesji`, `portfel`) VALUES
(1, 'asd123', 'asd123', 'Grzegorz', 'Kowalski', 'gkowalski@gmail.com', '02290921333', '656788922', '5d1a92e6b848586430bf47fd8e62924e36049ba7b85ddc00f51bc95b4b4c3098', 640),
(2, 'adam1', 'adam123', 'Adam', 'Nowak', 'adam123@op.pl', '99290921333', '666777888', '', 300),
(3, 'nowy', 'nowy', 'Nowy', 'Nowy', 'nowy@op.pl', '01220987212', '888674123', '2bb0d44594d447c612e48c2d03d9876c4c56935c6cc9a2f17aef79e74726259d', 800);

-- --------------------------------------------------------

--
-- Struktura tabeli dla tabeli `wydarzenia`
--

CREATE TABLE `wydarzenia` (
  `id_wydarzenia` int(4) NOT NULL,
  `id_organizatora` int(4) NOT NULL,
  `typ` varchar(50) NOT NULL,
  `nazwa` varchar(50) NOT NULL,
  `data` varchar(10) NOT NULL,
  `godzina` varchar(5) NOT NULL,
  `miasto` varchar(50) NOT NULL,
  `adres` varchar(255) NOT NULL,
  `opis` text NOT NULL,
  `zdjecie` varchar(20) NOT NULL,
  `cena` int(5) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_polish_ci;

--
-- Dumping data for table `wydarzenia`
--

INSERT INTO `wydarzenia` (`id_wydarzenia`, `id_organizatora`, `typ`, `nazwa`, `data`, `godzina`, `miasto`, `adres`, `opis`, `zdjecie`, `cena`) VALUES
(1, 1, 'mecz', 'Jagiellonia - HJK Helsinki', '06.08.2024', '18:00', 'Białystok', 'Słoneczna 1', 'Jagiellonia Białystok rozpoczyna zmagania w Europie. W pierwszym meczu eliminacji Ligi Mistrzów Mistrz Polski zmierzy się z HJK Helsinki w Białymstoku. Białostoczanie są faworytem mimo, że to przeciwnicy mają większe doświadczenie w Europie. Nie może cię zabraknąć na stadionie!', '1.jpg', 0),
(2, 2, 'koncert', 'Imagine Dragons', '10.09.2024', '20:00', 'Białystok', 'Wiejska 20', 'Koncert Imagine Dragons już 9 września w Białymstoku. Nie może cię zabraknąć!', '2.jpg', 60),
(3, 1, 'mecz', 'Jagiellonia - Legia', '10.08.2024', '20:00', 'Białystok', 'Słoneczna 1', 'Do Białegostoku przyjeżdża 3 drużyna ubiegłego sezonu - Legia Warszawa. Czeka nas mecz na szczycie. Obie drużyny reprezentują nas w Europie. Kto będzie górą w tym starciu?', '3.jpg', 60),
(4, 3, 'festiwal', 'Początek lata', '22.06.2024', '15:00', 'Suwałki', 'Kwiatowa 20', 'Nie może cię zabraknąć na festiwalu z okazji początku lata!', '4.jpg', 40),
(7, 1, 'asd', 'asd', 'asd', 'asd', 'asd', 'asd', 'asd', 'adsa', 12);

--
-- Indeksy dla zrzutów tabel
--

--
-- Indeksy dla tabeli `admini`
--
ALTER TABLE `admini`
  ADD PRIMARY KEY (`id_admina`);

--
-- Indeksy dla tabeli `bilety`
--
ALTER TABLE `bilety`
  ADD PRIMARY KEY (`id_biletu`),
  ADD KEY `id_wydarzenia` (`id_wydarzenia`),
  ADD KEY `id_uzytkownika` (`id_uzytkownika`);

--
-- Indeksy dla tabeli `organizatorzy`
--
ALTER TABLE `organizatorzy`
  ADD PRIMARY KEY (`id_organizatora`);

--
-- Indeksy dla tabeli `uzytkownicy`
--
ALTER TABLE `uzytkownicy`
  ADD PRIMARY KEY (`id_uzytkownika`);

--
-- Indeksy dla tabeli `wydarzenia`
--
ALTER TABLE `wydarzenia`
  ADD PRIMARY KEY (`id_wydarzenia`),
  ADD KEY `id_organizatora` (`id_organizatora`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `admini`
--
ALTER TABLE `admini`
  MODIFY `id_admina` int(4) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `bilety`
--
ALTER TABLE `bilety`
  MODIFY `id_biletu` int(4) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=15;

--
-- AUTO_INCREMENT for table `organizatorzy`
--
ALTER TABLE `organizatorzy`
  MODIFY `id_organizatora` int(4) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT for table `uzytkownicy`
--
ALTER TABLE `uzytkownicy`
  MODIFY `id_uzytkownika` int(4) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT for table `wydarzenia`
--
ALTER TABLE `wydarzenia`
  MODIFY `id_wydarzenia` int(4) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=8;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `bilety`
--
ALTER TABLE `bilety`
  ADD CONSTRAINT `bilety_ibfk_1` FOREIGN KEY (`id_uzytkownika`) REFERENCES `uzytkownicy` (`id_uzytkownika`),
  ADD CONSTRAINT `bilety_ibfk_2` FOREIGN KEY (`id_wydarzenia`) REFERENCES `wydarzenia` (`id_wydarzenia`);

--
-- Constraints for table `wydarzenia`
--
ALTER TABLE `wydarzenia`
  ADD CONSTRAINT `wydarzenia_ibfk_1` FOREIGN KEY (`id_organizatora`) REFERENCES `organizatorzy` (`id_organizatora`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
