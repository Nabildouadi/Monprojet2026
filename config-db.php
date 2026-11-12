<?php
/**
 * Configuration de la connexion MySQL / MariaDB
 * Plateforme pédagogique - INSFP EL HIDHAB 2026
 *
 * Ordre de priorité :
 *   1. Variables d'environnement  (INSFP_DB_HOST / PORT / USER / PASS / NAME)
 *   2. Fichier serveur\db-config.json  (écrit par le lanceur portable)
 *   3. Valeurs par défaut XAMPP / WAMP  (127.0.0.1:3306, root, sans mot de passe)
 *
 * Si le port demandé ne répond pas, on essaie automatiquement 3306 puis 3307 :
 * la plateforme fonctionne donc aussi bien avec un serveur installé qu'avec
 * le serveur portable fourni dans le dossier "serveur".
 */

if (!function_exists('insfp_db_config')) {

    function insfp_db_config(): array
    {
        $cfg = [
            'host' => '127.0.0.1',
            'port' => 0,
            'user' => 'root',
            'pass' => '',
            'db'   => 'insfp_projets',
        ];

        // 1) Variables d'environnement
        $envMap = [
            'INSFP_DB_HOST' => 'host',
            'INSFP_DB_USER' => 'user',
            'INSFP_DB_PASS' => 'pass',
            'INSFP_DB_NAME' => 'db',
        ];
        foreach ($envMap as $env => $key) {
            $value = getenv($env);
            if ($value !== false && $value !== '') {
                $cfg[$key] = $value;
            }
        }
        $envPort = getenv('INSFP_DB_PORT');
        if ($envPort !== false && $envPort !== '') {
            $cfg['port'] = (int) $envPort;
        }

        // 2) Fichier écrit par le lanceur portable
        $file = __DIR__ . DIRECTORY_SEPARATOR . 'serveur' . DIRECTORY_SEPARATOR . 'db-config.json';
        if (is_file($file)) {
            $json = json_decode((string) @file_get_contents($file), true);
            if (is_array($json)) {
                foreach (['host', 'port', 'user', 'pass', 'db'] as $key) {
                    if (isset($json[$key]) && $json[$key] !== '') {
                        $cfg[$key] = $json[$key];
                    }
                }
            }
        }

        $cfg['port'] = (int) $cfg['port'];
        return $cfg;
    }

    /**
     * Liste des ports à essayer, dans l'ordre.
     */
    function insfp_db_ports(array $cfg): array
    {
        $ports = [];
        if (($cfg['port'] ?? 0) > 0) {
            $ports[] = (int) $cfg['port'];
        }
        foreach ([3306, 3307] as $fallback) {
            if (!in_array($fallback, $ports, true)) {
                $ports[] = $fallback;
            }
        }
        return $ports;
    }

    /**
     * Connexion PDO en essayant les ports disponibles.
     *
     * @param array       $cfg    Configuration renvoyée par insfp_db_config()
     * @param string|null $dbname Base à sélectionner (null = pas de base)
     */
    function insfp_db_connect(array $cfg, ?string $dbname = null): PDO
    {
        $options = [
            PDO::ATTR_ERRMODE            => PDO::ERRMODE_EXCEPTION,
            PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
            PDO::ATTR_EMULATE_PREPARES   => false,
        ];

        $lastError = null;
        foreach (insfp_db_ports($cfg) as $port) {
            $dsn = 'mysql:host=' . $cfg['host'] . ';port=' . $port . ';charset=utf8mb4';
            if ($dbname !== null && $dbname !== '') {
                $dsn = 'mysql:host=' . $cfg['host'] . ';port=' . $port . ';dbname=' . $dbname . ';charset=utf8mb4';
            }
            try {
                return new PDO($dsn, $cfg['user'], $cfg['pass'], $options);
            } catch (PDOException $e) {
                $lastError = $e;
            }
        }

        if ($lastError === null) {
            $lastError = new PDOException('Aucun serveur MySQL joignable.');
        }
        throw $lastError;
    }
}
