-- Base de données pour la plateforme "Les Projets des Stagiaires" - INSFP EL HIDHAB 2026
CREATE DATABASE IF NOT EXISTS `insfp_projets` DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE `insfp_projets`;

-- Table Utilisateurs (Administrateur / Professeur)
CREATE TABLE IF NOT EXISTS `users` (
    `id` INT AUTO_INCREMENT PRIMARY KEY,
    `username` VARCHAR(50) NOT NULL UNIQUE,
    `password` VARCHAR(255) NOT NULL,
    `prof_name` VARCHAR(100) DEFAULT 'Douadi Nabil'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Table des Spécialités
CREATE TABLE IF NOT EXISTS `specialites` (
    `id` INT AUTO_INCREMENT PRIMARY KEY,
    `nom` VARCHAR(100) NOT NULL UNIQUE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Table des Stagiaires (Profils)
CREATE TABLE IF NOT EXISTS `stagiaires` (
    `id` INT AUTO_INCREMENT PRIMARY KEY,
    `nom` VARCHAR(100) NOT NULL,
    `prenom` VARCHAR(100) NOT NULL,
    `phone` VARCHAR(15) NOT NULL UNIQUE,
    `password` VARCHAR(4) NOT NULL,
    `specialite_id` INT NULL,
    `semestre` ENUM('S1', 'S2', 'S3', 'S4', 'S5') DEFAULT 'S1',
    `photo` LONGTEXT NULL,
    FOREIGN KEY (`specialite_id`) REFERENCES `specialites`(`id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Table des Projets
CREATE TABLE IF NOT EXISTS `projets` (
    `id` INT AUTO_INCREMENT PRIMARY KEY,
    `nom` VARCHAR(255) NOT NULL,
    `methode` TEXT NULL,
    `data_json` LONGTEXT NULL,
    `date_creation` DATETIME DEFAULT CURRENT_TIMESTAMP,
    `date_modification` DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Table des Membres des Projets
CREATE TABLE IF NOT EXISTS `projet_membres` (
    `id` INT AUTO_INCREMENT PRIMARY KEY,
    `projet_id` INT NOT NULL,
    `stagiaire_id` INT NULL,
    `nom_libre` VARCHAR(100) NULL,
    `prenom_libre` VARCHAR(100) NULL,
    FOREIGN KEY (`projet_id`) REFERENCES `projets`(`id`) ON DELETE CASCADE,
    FOREIGN KEY (`stagiaire_id`) REFERENCES `stagiaires`(`id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Table des Objectifs des Projets
CREATE TABLE IF NOT EXISTS `projet_objectifs` (
    `id` INT AUTO_INCREMENT PRIMARY KEY,
    `projet_id` INT NOT NULL,
    `texte` TEXT NOT NULL,
    FOREIGN KEY (`projet_id`) REFERENCES `projets`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Table des Étapes des Projets
CREATE TABLE IF NOT EXISTS `projet_etapes` (
    `id` INT AUTO_INCREMENT PRIMARY KEY,
    `projet_id` INT NOT NULL,
    `texte` TEXT NOT NULL,
    FOREIGN KEY (`projet_id`) REFERENCES `projets`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Table du Matériel des Projets
CREATE TABLE IF NOT EXISTS `projet_materiel` (
    `id` INT AUTO_INCREMENT PRIMARY KEY,
    `projet_id` INT NOT NULL,
    `texte` TEXT NOT NULL,
    FOREIGN KEY (`projet_id`) REFERENCES `projets`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Table des Photos des Projets (jusqu'à 8 photos)
CREATE TABLE IF NOT EXISTS `projet_photos` (
    `id` INT AUTO_INCREMENT PRIMARY KEY,
    `projet_id` INT NOT NULL,
    `position` INT NOT NULL,
    `image_data` LONGTEXT NOT NULL,
    FOREIGN KEY (`projet_id`) REFERENCES `projets`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Table des Notes & Critères de Notation
CREATE TABLE IF NOT EXISTS `projet_notes` (
    `id` INT AUTO_INCREMENT PRIMARY KEY,
    `projet_id` INT NOT NULL,
    `critere_id` VARCHAR(50) NOT NULL,
    `critere_texte` VARCHAR(255) NULL,
    `points_100` FLOAT DEFAULT 0,
    `points_20` FLOAT DEFAULT 0,
    `note_obtenue` FLOAT DEFAULT 0,
    FOREIGN KEY (`projet_id`) REFERENCES `projets`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Table des Paramètres généraux (Couleurs, Titres, Galerie, Logos)
CREATE TABLE IF NOT EXISTS `settings` (
    `setting_key` VARCHAR(100) PRIMARY KEY,
    `setting_value` LONGTEXT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
