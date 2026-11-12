<?php
/**
 * Connexion à la base de données via PDO
 * Plateforme pédagogique - INSFP EL HIDHAB 2026
 *
 * Fonctionne avec :
 *   - le serveur portable fourni (serveur\mariadb, port 3307)
 *   - un XAMPP / WAMP / Laragon classique (port 3306)
 *   - un serveur distant (variables d'environnement INSFP_DB_*)
 */

require_once __DIR__ . '/config-db.php';

$config = insfp_db_config();

try {
     $pdo = insfp_db_connect($config, $config['db']);

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
     echo json_encode([
         'error' => 'Erreur de connexion : ' . $e->getMessage(),
         'hint'  => "Démarrez le serveur MySQL puis ouvrez install.php. Sur XAMPP/WAMP : port 3306. Version portable : lancez Lancer-Les-Projets.bat.",
     ]);
     exit;
}
?>
