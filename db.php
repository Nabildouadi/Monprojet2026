<?php
/**
 * Connexion à la base de données via PDO
 * Plateforme pédagogique - INSFP EL HIDHAB 2026
 */

$host = 'localhost';
$db   = 'insfp_projets';
$user = 'root'; // Par défaut sur XAMPP/WAMP
$pass = '';     // Par défaut sur XAMPP/WAMP
$charset = 'utf8mb4';

$dsn = "mysql:host=$host;dbname=$db;charset=$charset";
$options = [
    PDO::ATTR_ERRMODE            => PDO::ERRMODE_EXCEPTION,
    PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
    PDO::ATTR_EMULATE_PREPARES   => false,
];

try {
     $pdo = new PDO($dsn, $user, $pass, $options);

     // Migration automatique : colonne JSON pour conserver toute la fiche projet
     try {
         $col = $pdo->query("SHOW COLUMNS FROM `projets` LIKE 'data_json'")->fetch();
         if (!$col) {
             $pdo->exec("ALTER TABLE `projets` ADD COLUMN `data_json` LONGTEXT NULL");
         }
     } catch (PDOException $migration) {
         // La table n'existe pas encore : l'installation s'en occupe.
     }
} catch (\PDOException $e) {
     header('Content-Type: application/json');
     echo json_encode(['error' => 'Erreur de connexion : ' . $e->getMessage()]);
     exit;
}
?>
