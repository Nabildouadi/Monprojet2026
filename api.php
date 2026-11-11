<?php
/**
 * API Centralisée pour l'interaction entre Frontend (JS) et la Base de Données (MySQL)
 */
header('Content-Type: application/json; charset=utf-8');
require_once __DIR__ . '/db.php';

$action = $_GET['action'] ?? $_POST['action'] ?? '';

// Support des corps de requêtes JSON (POST RAW)
$inputJSON = json_decode(file_get_contents('php://input'), true);
if ($inputJSON) {
    if (isset($inputJSON['action'])) $action = $inputJSON['action'];
}

switch ($action) {
    // -------------------------------------------------------------
    // TEST DE DISPONIBILITÉ (utilisé par le frontend)
    // -------------------------------------------------------------
    case 'ping':
        echo json_encode(['status' => 'success', 'mode' => 'normal']);
        break;

    // -------------------------------------------------------------
    // AUTHENTIFICATION
    // -------------------------------------------------------------
    case 'login_prof':
        $userHash = $inputJSON['userHash'] ?? $_POST['userHash'] ?? '';
        $passHash = $inputJSON['passHash'] ?? $_POST['passHash'] ?? '';

        $stmt = $pdo->prepare("SELECT * FROM users WHERE username = ? AND password = ?");
        $stmt->execute([$userHash, $passHash]);
        $user = $stmt->fetch();

        if ($user) {
            echo json_encode(['status' => 'success', 'role' => 'admin', 'prof_name' => $user['prof_name']]);
        } else {
            echo json_encode(['status' => 'error', 'message' => 'Identifiant ou mot de passe incorrect.']);
        }
        break;

    case 'change_password':
        $userHash = $inputJSON['userHash'] ?? $_POST['userHash'] ?? '';
        $currentHash = $inputJSON['currentHash'] ?? $_POST['currentHash'] ?? '';
        $newHash = $inputJSON['newHash'] ?? $_POST['newHash'] ?? '';

        if ($userHash === '' || $currentHash === '' || $newHash === '') {
            echo json_encode(['status' => 'error', 'message' => 'Données manquantes.']);
            break;
        }

        $stmt = $pdo->prepare("SELECT id FROM users WHERE username = ? AND password = ?");
        $stmt->execute([$userHash, $currentHash]);
        $userId = $stmt->fetchColumn();

        if (!$userId) {
            echo json_encode(['status' => 'error', 'message' => 'Mot de passe actuel incorrect.']);
            break;
        }

        $stmt = $pdo->prepare("UPDATE users SET password = ? WHERE id = ?");
        $stmt->execute([$newHash, $userId]);
        echo json_encode(['status' => 'success']);
        break;

    case 'login_stu':
        $phone = $inputJSON['phone'] ?? $_POST['phone'] ?? '';
        $pass = $inputJSON['pass'] ?? $_POST['pass'] ?? '';

        $stmt = $pdo->prepare("SELECT * FROM stagiaires WHERE phone = ? AND password = ?");
        $stmt->execute([$phone, $pass]);
        $stu = $stmt->fetch();

        if ($stu) {
            echo json_encode(['status' => 'success', 'role' => 'stagiaire', 'data' => $stu]);
        } else {
            echo json_encode(['status' => 'error', 'message' => 'Numéro ou mot de passe incorrect.']);
        }
        break;

    // -------------------------------------------------------------
    // PROFILS STAGIAIRES
    // -------------------------------------------------------------
    case 'get_profiles':
        $stmt = $pdo->query("SELECT s.*, sp.nom as specialite_nom FROM stagiaires s LEFT JOIN specialites sp ON s.specialite_id = sp.id ORDER BY s.id DESC");
        $profiles = $stmt->fetchAll();
        // Transformer pour s'adapter à la structure JS
        $formatted = array_map(function($p) {
            return [
                'id' => (string)$p['id'],
                'id_db' => (string)$p['id'],
                'nom' => $p['nom'],
                'prenom' => $p['prenom'],
                'phone' => $p['phone'],
                'pass' => $p['password'],
                'specialite' => $p['specialite_nom'] ?? '',
                'semestre' => $p['semestre'],
                'photo' => $p['photo'] ?? ''
            ];
        }, $profiles);

        // Charger aussi les spécialités
        $stmtSpec = $pdo->query("SELECT nom FROM specialites ORDER BY nom ASC");
        $specialites = $stmtSpec->fetchAll(PDO::FETCH_COLUMN);

        echo json_encode(['status' => 'success', 'profils' => $formatted, 'specialites' => $specialites]);
        break;

    case 'save_profile':
        $data = $inputJSON['profil'] ?? null;
        if (!$data) {
            echo json_encode(['status' => 'error', 'message' => 'Données invalides']);
            break;
        }

        // Trouver ID spécialité
        $specId = null;
        if (!empty($data['specialite'])) {
            $stmtSpec = $pdo->prepare("SELECT id FROM specialites WHERE nom = ?");
            $stmtSpec->execute([$data['specialite']]);
            $specId = $stmtSpec->fetchColumn() ?: null;
        }

        $idDb = $data['id_db'] ?? $data['id'] ?? null;

        if (!empty($idDb) && is_numeric($idDb)) {
            // Modification
            $stmt = $pdo->prepare("UPDATE stagiaires SET nom = ?, prenom = ?, phone = ?, password = ?, specialite_id = ?, semestre = ?, photo = ? WHERE id = ?");
            $stmt->execute([$data['nom'], $data['prenom'] ?? '', $data['phone'], $data['pass'] ?? '', $specId, $data['semestre'] ?? 'S1', $data['photo'] ?? '', $idDb]);
        } else {
            // Ajout
            $stmt = $pdo->prepare("INSERT INTO stagiaires (nom, prenom, phone, password, specialite_id, semestre, photo) VALUES (?, ?, ?, ?, ?, ?, ?)");
            $stmt->execute([$data['nom'], $data['prenom'] ?? '', $data['phone'], $data['pass'] ?? '', $specId, $data['semestre'] ?? 'S1', $data['photo'] ?? '']);
        }
        echo json_encode(['status' => 'success']);
        break;

    case 'delete_profile':
        $phone = $inputJSON['phone'] ?? $_POST['phone'] ?? '';
        $stmt = $pdo->prepare("DELETE FROM stagiaires WHERE phone = ?");
        $stmt->execute([$phone]);
        echo json_encode(['status' => 'success']);
        break;

    // -------------------------------------------------------------
    // SPECIALITES
    // -------------------------------------------------------------
    case 'save_specialites':
        $specialites = $inputJSON['specialites'] ?? [];
        $nouvelles = [];
        foreach ($specialites as $s) {
            $s = trim((string)$s);
            if ($s !== '' && !in_array($s, $nouvelles, true)) $nouvelles[] = $s;
        }

        $pdo->beginTransaction();
        // Supprime uniquement celles qui ont disparu (les stagiaires passent à NULL via la clé étrangère)
        if (count($nouvelles)) {
            $placeholders = implode(',', array_fill(0, count($nouvelles), '?'));
            $stmt = $pdo->prepare("DELETE FROM specialites WHERE nom NOT IN ($placeholders)");
            $stmt->execute($nouvelles);
        } else {
            $pdo->exec("DELETE FROM specialites");
        }
        // Ajoute les nouvelles spécialités
        $stmt = $pdo->prepare("INSERT IGNORE INTO specialites (nom) VALUES (?)");
        foreach ($nouvelles as $s) {
            $stmt->execute([$s]);
        }
        $pdo->commit();
        echo json_encode(['status' => 'success']);
        break;

    // -------------------------------------------------------------
    // PROJETS & FICHES PROJET
    // -------------------------------------------------------------
    case 'get_projets':
        $stmt = $pdo->query("SELECT * FROM projets ORDER BY date_creation DESC");
        $projets = $stmt->fetchAll();

        $result = [];
        foreach ($projets as $p) {
            $pId = $p['id'];

            // Objectifs
            $stmtObj = $pdo->prepare("SELECT id, texte FROM projet_objectifs WHERE projet_id = ?");
            $stmtObj->execute([$pId]);
            $objectifs = $stmtObj->fetchAll();

            // Etapes
            $stmtEt = $pdo->prepare("SELECT id, texte FROM projet_etapes WHERE projet_id = ?");
            $stmtEt->execute([$pId]);
            $etapes = $stmtEt->fetchAll();

            // Materiel
            $stmtMat = $pdo->prepare("SELECT id, texte FROM projet_materiel WHERE projet_id = ?");
            $stmtMat->execute([$pId]);
            $materiel = $stmtMat->fetchAll();

            // Membres
            $stmtMem = $pdo->prepare("SELECT pm.*, s.nom, s.prenom, s.phone FROM projet_membres pm LEFT JOIN stagiaires s ON pm.stagiaire_id = s.id WHERE pm.projet_id = ?");
            $stmtMem->execute([$pId]);
            $membres = array_map(function($m) {
                return [
                    'nom' => $m['nom'] ?? $m['nom_libre'] ?? '',
                    'prenom' => $m['prenom'] ?? $m['prenom_libre'] ?? '',
                    'phone' => $m['phone'] ?? ''
                ];
            }, $stmtMem->fetchAll());

            // Photos
            $stmtPho = $pdo->prepare("SELECT position, image_data FROM projet_photos WHERE projet_id = ? ORDER BY position ASC");
            $stmtPho->execute([$pId]);
            $photosData = $stmtPho->fetchAll();
            $photos = array_fill(0, 8, '');
            foreach ($photosData as $ph) {
                if ($ph['position'] >= 0 && $ph['position'] < 8) {
                    $photos[$ph['position']] = $ph['image_data'];
                }
            }

            // Notes
            $stmtNot = $pdo->prepare("SELECT critere_id, note_obtenue FROM projet_notes WHERE projet_id = ?");
            $stmtNot->execute([$pId]);
            $notesArr = $stmtNot->fetchAll();
            $notes = [];
            foreach ($notesArr as $n) {
                $notes[$n['critere_id']] = (float)$n['note_obtenue'];
            }

            $item = [
                'id' => (string)$p['id'],
                'nom' => $p['nom'],
                'methode' => $p['methode'],
                'cree' => $p['date_creation'],
                'modif' => strtotime($p['date_modification']) * 1000,
                'membres' => $membres,
                'objectifs' => $objectifs,
                'etapes' => $etapes,
                'materiel' => $materiel,
                'photos' => $photos,
                'notes' => $notes
            ];

            // Restaure les données complètes enregistrées par le mode unifié
            if (!empty($p['data_json'])) {
                $saved = json_decode($p['data_json'], true);
                if (is_array($saved)) {
                    $item = array_merge($item, $saved);
                }
            }
            $item['id'] = (string)$p['id'];
            $item['nom'] = $p['nom'];
            $item['methode'] = $p['methode'] ?? ($item['methode'] ?? '');
            if (empty($item['cree'])) $item['cree'] = $p['date_creation'];
            if (empty($item['modif'])) $item['modif'] = strtotime($p['date_modification']) * 1000;
            $photosItem = is_array($item['photos'] ?? null) ? array_values($item['photos']) : [];
            $item['photos'] = array_slice(array_pad($photosItem, 8, ''), 0, 8);
            if (!isset($item['notes']) || !is_array($item['notes'])) $item['notes'] = [];

            $result[] = $item;
        }

        echo json_encode(['status' => 'success', 'projets' => $result]);
        break;

    case 'save_projet':
        $p = $inputJSON['projet'] ?? null;
        if (!$p) {
            echo json_encode(['status' => 'error', 'message' => 'Projet manquant']);
            break;
        }

        $pdo->beginTransaction();

        if (!empty($p['id']) && is_numeric($p['id'])) {
            // Met à jour
            $stmt = $pdo->prepare("UPDATE projets SET nom = ?, methode = ? WHERE id = ?");
            $stmt->execute([$p['nom'], $p['methode'] ?? '', $p['id']]);
            $pId = $p['id'];
        } else {
            // Nouveau projet
            $stmt = $pdo->prepare("INSERT INTO projets (nom, methode) VALUES (?, ?)");
            $stmt->execute([$p['nom'], $p['methode'] ?? '']);
            $pId = $pdo->lastInsertId();
        }

        // Conserve TOUTES les données de la fiche (notes finales, critères,
        // photos, téléphones, etc.) dans une seule colonne JSON.
        $p['id'] = (string)$pId;
        if (empty($p['cree'])) $p['cree'] = date('c');
        $p['modif'] = round(microtime(true) * 1000);
        $jsonData = json_encode($p, JSON_UNESCAPED_UNICODE);
        if ($jsonData === false) $jsonData = json_encode($p);
        $stmtJson = $pdo->prepare("UPDATE projets SET data_json = ? WHERE id = ?");
        $stmtJson->execute([$jsonData, $pId]);

        // Nettoyage des sous-tables
        $pdo->prepare("DELETE FROM projet_objectifs WHERE projet_id = ?")->execute([$pId]);
        $pdo->prepare("DELETE FROM projet_etapes WHERE projet_id = ?")->execute([$pId]);
        $pdo->prepare("DELETE FROM projet_materiel WHERE projet_id = ?")->execute([$pId]);
        $pdo->prepare("DELETE FROM projet_membres WHERE projet_id = ?")->execute([$pId]);
        $pdo->prepare("DELETE FROM projet_photos WHERE projet_id = ?")->execute([$pId]);
        $pdo->prepare("DELETE FROM projet_notes WHERE projet_id = ?")->execute([$pId]);

        // Re-insertion
        if (!empty($p['objectifs'])) {
            $stmtObj = $pdo->prepare("INSERT INTO projet_objectifs (projet_id, texte) VALUES (?, ?)");
            foreach ($p['objectifs'] as $o) {
                if (!empty($o['texte'])) $stmtObj->execute([$pId, $o['texte']]);
            }
        }

        if (!empty($p['etapes'])) {
            $stmtEt = $pdo->prepare("INSERT INTO projet_etapes (projet_id, texte) VALUES (?, ?)");
            foreach ($p['etapes'] as $e) {
                if (!empty($e['texte'])) $stmtEt->execute([$pId, $e['texte']]);
            }
        }

        if (!empty($p['materiel'])) {
            $stmtMat = $pdo->prepare("INSERT INTO projet_materiel (projet_id, texte) VALUES (?, ?)");
            foreach ($p['materiel'] as $m) {
                if (!empty($m['texte'])) $stmtMat->execute([$pId, $m['texte']]);
            }
        }

        if (!empty($p['membres'])) {
            $stmtMem = $pdo->prepare("INSERT INTO projet_membres (projet_id, nom_libre, prenom_libre) VALUES (?, ?, ?)");
            foreach ($p['membres'] as $mem) {
                if (!empty($mem['nom'])) {
                    $stmtMem->execute([$pId, $mem['nom'], $mem['prenom'] ?? '']);
                }
            }
        }

        if (!empty($p['photos'])) {
            $stmtPho = $pdo->prepare("INSERT INTO projet_photos (projet_id, position, image_data) VALUES (?, ?, ?)");
            foreach ($p['photos'] as $pos => $img) {
                if (!empty($img)) {
                    $stmtPho->execute([$pId, $pos, $img]);
                }
            }
        }

        if (!empty($p['notes'])) {
            $stmtNot = $pdo->prepare("INSERT INTO projet_notes (projet_id, critere_id, note_obtenue) VALUES (?, ?, ?)");
            foreach ($p['notes'] as $critId => $val) {
                $stmtNot->execute([$pId, $critId, (float)$val]);
            }
        }

        $pdo->commit();
        echo json_encode(['status' => 'success', 'projet_id' => $pId]);
        break;

    case 'delete_projet':
        $id = $inputJSON['id'] ?? $_POST['id'] ?? null;
        if ($id) {
            $stmt = $pdo->prepare("DELETE FROM projets WHERE id = ?");
            $stmt->execute([$id]);
        }
        echo json_encode(['status' => 'success']);
        break;

    // -------------------------------------------------------------
    // PARAMÈTRES / THÈME / GALERIE
    // -------------------------------------------------------------
    case 'get_settings':
        $stmt = $pdo->query("SELECT * FROM settings");
        $rows = $stmt->fetchAll();
        $settings = [];
        foreach ($rows as $r) {
            $settings[$r['setting_key']] = $r['setting_value'];
        }
        echo json_encode(['status' => 'success', 'settings' => $settings]);
        break;

    case 'save_settings':
        $key = $inputJSON['key'] ?? $_POST['key'] ?? '';
        $value = $inputJSON['value'] ?? $_POST['value'] ?? '';

        if (!empty($key)) {
            $stmt = $pdo->prepare("INSERT INTO settings (setting_key, setting_value) VALUES (?, ?) ON DUPLICATE KEY UPDATE setting_value = ?");
            $stmt->execute([$key, $value, $value]);
        }
        echo json_encode(['status' => 'success']);
        break;

    default:
        echo json_encode(['status' => 'error', 'message' => 'Action inconnue']);
        break;
}
?>
