<?php
/**
 * Script d'installation automatique de la base de données et des tables
 */
$host = 'localhost';
$user = 'root';
$pass = '';

try {
    $pdo = new PDO("mysql:host=$host", $user, $pass, [PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION]);

    // Lecture et exécution du fichier database.sql
    $sql = file_get_contents(__DIR__ . '/database.sql');
    $pdo->exec($sql);

    // Compatibilité avec une base déjà installée
    try {
        $col = $pdo->query("SHOW COLUMNS FROM `insfp_projets`.`projets` LIKE 'data_json'")->fetch();
        if (!$col) {
            $pdo->exec("ALTER TABLE `insfp_projets`.`projets` ADD COLUMN `data_json` LONGTEXT NULL");
        }
    } catch (PDOException $migration) {
        // Ignorer : la base vient d'être créée avec la colonne.
    }

    // Insertion d'un compte admin par défaut (si inexistant)
    // Le frontend utilise sha256Hex(AUTH_SALT + ':' + identifiant) / sha256Hex(AUTH_SALT + ':' + mot de passe) :
    // on enregistre donc directement ces empreintes, jamais les valeurs en clair.
    // Identifiant par défaut : profdouadi — Mot de passe par défaut : admin2026
    $adminUserHash = hash('sha256', '517670aa3dc9f48c724d53e5a1aea398307735567c60d9de:profdouadi');
    $adminPassHash = hash('sha256', '517670aa3dc9f48c724d53e5a1aea398307735567c60d9de:admin2026');

    $stmt = $pdo->prepare("SELECT COUNT(*) FROM users WHERE username = ?");
    $stmt->execute([$adminUserHash]);
    if ($stmt->fetchColumn() == 0) {
        $insert = $pdo->prepare("INSERT INTO users (username, password, prof_name) VALUES (?, ?, ?)");
        $insert->execute([$adminUserHash, $adminPassHash, 'Douadi Nabil']);
    }

    // Insertion des spécialités par défaut si la table est vide
    $stmt = $pdo->prepare("SELECT COUNT(*) FROM specialites");
    $stmt->execute();
    if ($stmt->fetchColumn() == 0) {
        $specs = [
            'Chimie Industrielle',
            'Analyse et Contrôle Qualité',
            'Pharmacie',
            'Biologie',
            'Industrie Agroalimentaire',
            'Protection de l\'Environnement',
            'Autre'
        ];
        $insertSpec = $pdo->prepare("INSERT IGNORE INTO specialites (nom) VALUES (?)");
        foreach ($specs as $s) {
            $insertSpec->execute([$s]);
        }
    }

    echo "<!DOCTYPE html>
    <html lang='fr'>
    <head>
        <meta charset='UTF-8'>
        <title>Installation — INSFP El Hidhab</title>
        <style>
            body { font-family: Arial, sans-serif; background: #f0f4f8; display: flex; justify-content: center; align-items: center; height: 100vh; margin: 0; }
            .card { background: white; padding: 2rem; border-radius: 12px; box-shadow: 0 4px 12px rgba(0,0,0,0.1); text-align: center; max-width: 400px; }
            h1 { color: #0ea5e9; font-size: 1.5rem; margin-bottom: 1rem; }
            p { color: #334155; font-size: 0.95rem; line-height: 1.5; }
            a { display: inline-block; margin-top: 1.5rem; background: #0ea5e9; color: white; padding: 0.7rem 1.2rem; text-decoration: none; border-radius: 8px; font-weight: bold; }
            a:hover { background: #0284c7; }
        </style>
    </head>
    <body>
        <div class='card'>
            <h1>Installation Réussie !</h1>
            <p>La base de données MySQL a été configurée avec succès pour l'application <strong>Les Projets des Stagiaires</strong> (INSFP El Hidhab 2026).</p>
            <p style='font-size:0.85rem; color:#64748b; margin-top:1rem;'>Identifiant professeur par défaut : <code>profdouadi</code> / Mot de passe : <code>admin2026</code></p>
            <a href='index.html'>Accéder à l'application</a>
        </div>
    </body>
    </html>";

} catch (PDOException $e) {
    echo "<h2>Erreur lors de l'installation :</h2><pre>" . $e->getMessage() . "</pre>";
    echo "<p>Vérifiez que votre serveur MySQL (XAMPP/WAMP) est bien démarré et que les identifiants dans <code>install.php</code> sont corrects.</p>";
}
?>
