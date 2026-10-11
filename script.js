
    // ===== PROTECTION CONTRE LA COPIE ET LE PIRATAGE =====
    // © 2026 Professeur Douadi Nabil - INSFP El Hidhab, Sétif.
    // Toute copie, modification ou redistribution non autorisée est interdite
    // (Licence d'utilisation - ordonnance n° 03-05 du 19 juillet 2003, Algérie).
    const PROT_AUTEUR = 'Professeur Douadi Nabil';
    const PROT_MARQUEUR = ['PROPRIETE', 'DN-INSFP', 'ELHIDHAB', '2026'].join('-');
    const PROT_MARQUEURS_ATTENDUS = 13;
    const PROT_FILIGRANE = '© 2026 Prof. Douadi Nabil - INSFP El Hidhab - Copie non autorisée interdite';

    function protActiver() {
      const wm = document.getElementById('wmProtec');
      if (wm && !wm.children.length) {
        let h = '';
        for (let i = 0; i < 24; i++) h += '<span>' + PROT_FILIGRANE + '</span>';
        wm.innerHTML = h;
      }
    }

    function protBloquer(msg) {
      const b = document.getElementById('blocageProtec');
      if (b) b.classList.add('show');
      const a = document.querySelector('.app-container');
      if (a) { a.style.filter = 'blur(6px)'; a.style.pointerEvents = 'none'; }
      if (window.console && console.clear) { try { console.clear(); } catch (e) {} }
      if (msg && window.console) { try { console.warn('[Licence] ' + msg); } catch (e) {} }
    }

    // Verifie que toutes les marques de propriete sont intactes dans le fichier
    function protVerifier() {
      let src = '';
      try { src = document.documentElement.outerHTML; } catch (e) { return true; }
      const n = src.split(PROT_MARQUEUR).length - 1;
      if (n < PROT_MARQUEURS_ATTENDUS) {
        protBloquer('Marques de propriete intellectuelle incompletes (' + n + '/' + PROT_MARQUEURS_ATTENDUS + ')');
        return false;
      }
      return true;
    }

    function protVerrouiller() {
      // Clic droit
      document.addEventListener('contextmenu', function(e) {
        e.preventDefault();
        if (window.showToast) showToast('Contenu protégé - ' + PROT_AUTEUR, 'fas fa-shield-halved', true);
      });
      // Glisser-déposer
      document.addEventListener('dragstart', function(e) { e.preventDefault(); });
      document.addEventListener('drop', function(e) { e.preventDefault(); });
      // Raccourcis: DevTools, code source, enregistrement, copie
      document.addEventListener('keydown', function(e) {
        const k = (e.key || '').toLowerCase();
        const bloque = e.key === 'F12'
          || ((e.ctrlKey || e.metaKey) && (k === 'u' || k === 's' || k === 'i' || k === 'j' || k === 'c' || k === 'x'));
        if (bloque) {
          e.preventDefault();
          if (window.showToast) showToast('Action désactivée - logiciel protégé', 'fas fa-lock', true);
        }
      });
    }

    protActiver();
    window.addEventListener('load', function() {
      protActiver();
      if (!protVerifier()) protBloquer('Le fichier a ete modifie apres le chargement');
      protVerrouiller();
    });
    <!--PROPRIETE-DN-INSFP-ELHIDHAB-2026-->
    // ===== FIN PROTECTION =====

    // ===== Empreinte SHA-256 (le mot de passe n'est jamais écrit en clair dans le code) =====
    function sha256Hex(str) {
      function rr(n, x) { return (x >>> n) | (x << (32 - n)); }
      var K = [0x428a2f98,0x71374491,0xb5c0fbcf,0xe9b5dba5,0x3956c25b,0x59f111f1,0x923f82a4,0xab1c5ed5,0xd807aa98,0x12835b01,0x243185be,0x550c7dc3,0x72be5d74,0x80deb1fe,0x9bdc06a7,0xc19bf174,0xe49b69c1,0xefbe4786,0x0fc19dc6,0x240ca1cc,0x2de92c6f,0x4a7484aa,0x5cb0a9dc,0x76f988da,0x983e5152,0xa831c66d,0xb00327c8,0xbf597fc7,0xc6e00bf3,0xd5a79147,0x06ca6351,0x14292967,0x27b70a85,0x2e1b2138,0x4d2c6dfc,0x53380d13,0x650a7354,0x766a0abb,0x81c2c92e,0x92722c85,0xa2bfe8a1,0xa81a664b,0xc24b8b70,0xc76c51a3,0xd192e819,0xd6990624,0xf40e3585,0x106aa070,0x19a4c116,0x1e376c08,0x2748774c,0x34b0bcb5,0x391c0cb3,0x4ed8aa4a,0x5b9cca4f,0x682e6ff3,0x748f82ee,0x78a5636f,0x84c87814,0x8cc70208,0x90befffa,0xa4506ceb,0xbef9a3f7,0xc67178f2];
      var H = [0x6a09e667,0xbb67ae85,0x3c6ef372,0xa54ff53a,0x510e527f,0x9b05688c,0x1f83d9ab,0x5be0cd19];
      var bytes = [];
      for (var i = 0; i < str.length; i++) {
        var c = str.charCodeAt(i);
        if (c < 128) { bytes.push(c); }
        else if (c < 2048) { bytes.push(192 | (c >> 6), 128 | (c & 63)); }
        else { bytes.push(224 | (c >> 12), 128 | ((c >> 6) & 63), 128 | (c & 63)); }
      }
      var bitLen = bytes.length * 8;
      bytes.push(128);
      while ((bytes.length % 64) !== 56) { bytes.push(0); }
      for (var s = 7; s >= 0; s--) { bytes.push((bitLen / Math.pow(2, s * 8)) & 255); }
      var w = new Array(64);
      for (var b = 0; b < bytes.length; b += 64) {
        for (var t = 0; t < 16; t++) {
          w[t] = (bytes[b + t * 4] << 24) | (bytes[b + t * 4 + 1] << 16) | (bytes[b + t * 4 + 2] << 8) | (bytes[b + t * 4 + 3]);
        }
        for (t = 16; t < 64; t++) {
          var g0 = w[t - 15], g1 = w[t - 2];
          var s0 = rr(7, g0) ^ rr(18, g0) ^ (g0 >>> 3);
          var s1 = rr(17, g1) ^ rr(19, g1) ^ (g1 >>> 10);
          w[t] = (w[t - 16] + s0 + w[t - 7] + s1) | 0;
        }
        var a = H[0], bb = H[1], c2 = H[2], d = H[3], e = H[4], f = H[5], g = H[6], h = H[7];
        for (t = 0; t < 64; t++) {
          var S1 = rr(6, e) ^ rr(11, e) ^ rr(25, e);
          var ch = (e & f) ^ (~e & g);
          var t1 = (h + S1 + ch + K[t] + w[t]) | 0;
          var S0 = rr(2, a) ^ rr(13, a) ^ rr(22, a);
          var maj = (a & bb) ^ (a & c2) ^ (bb & c2);
          var t2 = (S0 + maj) | 0;
          h = g; g = f; f = e; e = (d + t1) | 0; d = c2; c2 = bb; bb = a; a = (t1 + t2) | 0;
        }
        H[0] = (H[0] + a) | 0; H[1] = (H[1] + bb) | 0; H[2] = (H[2] + c2) | 0; H[3] = (H[3] + d) | 0;
        H[4] = (H[4] + e) | 0; H[5] = (H[5] + f) | 0; H[6] = (H[6] + g) | 0; H[7] = (H[7] + h) | 0;
      }
      var out = '';
      for (var k = 0; k < 8; k++) { out += ('00000000' + (H[k] >>> 0).toString(16)).slice(-8); }
      return out;
    }

    // ===== Identifiants d'accès protégés (aucun identifiant ni mot de passe en clair) =====
    const AUTH_SALT = '517670aa3dc9f48c724d53e5a1aea398307735567c60d9de';
    function passHash(p) { return sha256Hex(AUTH_SALT + ':' + p); }
    function identifiantHash(u) { return sha256Hex(AUTH_SALT + ':' + u.trim().toLowerCase()); }
    const ADMIN_USER_HASH = '7a6c15bcdcf959c71d1dd7e4bf64bddb982fb01a32365d831dd7dacac12c20ed';
    const ADMIN_PASS_HASH = 'cd153356bfcb688cb5c25771ede14f00175851a3f76d25aba29e675286848516';
    const SETTINGS_PASS_HASH = 'cd153356bfcb688cb5c25771ede14f00175851a3f76d25aba29e675286848516';
const SESSION_KEY = 'ps_admin_session';
const SESSION_TYPE_KEY = 'ps_session_type';
const STU_KEY = 'ps_stagiaire_tel';
    const LANG_KEY = 'ps_lang';

    const APP_TRANSLATIONS = {
      fr: {
        'app-lang-label': 'Langue',
        'nav-profile': 'Profile Stagiaire',
        'nav-fiche': 'Fiche Projet',
        'nav-params': 'Paramètres',
        'nav-espace': 'Mon Espace',
        'h-prof': 'Profile Stagiaire',
        'h-fiche': 'Fiche Projet',
        'h-params': 'Paramètres',
        'h-espace': 'Mon Espace Stagiaire',
        'lbl-nom': 'Nom',
        'lbl-prenom': 'Prénom',
        'lbl-tel': 'Numéro de téléphone',
        'lbl-pass': 'Mot de passe (4 derniers chiffres)',
        'lbl-spec': 'Spécialité',
        'lbl-sem': 'Semestre',
        'b-ajouter': 'Ajouter',
        'b-modifier': 'Modifier',
        'b-supprimer': 'Supprimer',
        'b-sauvegarder': 'Sauvegarder',
        'b-vider': 'Vider',
        'b-photo': 'Photo',
        'b-retirer': 'Retirer',
        'b-ouvrir': 'Ouvrir',
        'b-consulter': 'Consulter',
        'b-imp-a4': 'Imprimer A4',
        'b-imp-a3': 'Imprimer A3',
        'b-dl-doc': 'Télécharger .doc',
        'b-dl-docx': 'Télécharger .docx',
        'b-exporter': 'Exporter (JSON)',
        'b-importer': 'Importer (JSON)',
        'b-imprimer': 'Imprimer',
        'b-deverrouiller': 'Déverrouiller',
        'b-verrouiller': 'Verrouiller',
        'b-reinitialiser': 'Réinitialiser',
        'b-enregistrer': 'Enregistrer',
        'b-annuler': 'Annuler',
        'th-n': 'N°',
        'th-photo': 'Photo',
        'th-nomprenom': 'Nom &amp; Prénom',
        'th-tel': 'Téléphone',
        'th-pass': 'Mot de passe',
        'th-spec': 'Spécialité',
        'th-sem': 'Semestre',
        'fiche-form': 'Fiche du stagiaire',
        'fiche-liste': 'Liste des profils stagiaires',
        'fiche-tri': 'Classer :',
        'tri1': 'Chronologique (ancien → récent)',
        'tri2': 'Chronologique inverse (récent → ancien)',
        'tri3': 'Alphabétique (A → Z)',
        'tri4': 'Dernière modification',
        'fiche-b1': 'Nom du projet',
        'fiche-b2': 'Les membres du projet',
        'fiche-b2s': 'Nom et prénom des stagiaires (1 à 5)',
        'fiche-b3': 'Objectifs du projet',
        'fiche-b4': 'Étapes du projet',
        'fiche-b5': 'Matériel et méthode',
        'fiche-b51': 'Matériel nécessaire',
        'fiche-b52': 'Méthode (démarche adoptée)',
        'b-logout': 'Déconnexion',
        'b-dl-zip': 'Télécharger le projet (.zip)',
        'zip-info': 'Le fichier ZIP contient le code complet du projet séparé en 3 fichiers : <strong>HTML</strong> (structure), <strong>CSS</strong> (design) et <strong>JavaScript</strong> (logique), avec la licence d\'utilisation.',
        'b-licence': 'Licence',
        'nav-archive': 'Archive des Projets',
        'h-archive': 'Archive des Projets',
        'archive-info': 'Une copie de chaque projet est archivée automatiquement (nom, date et heure). Chaque archive est téléchargeable en Word ou PDF et imprimable.',
        'arch-lbl-total': 'Archives',
        'arch-lbl-last': 'Dernière archive',
        'b-archiver': 'Archiver ce projet',
        'b-archiver-tout': 'Archiver tous les projets',
        'b-archiver-vider': 'Vider l\'archive',
        'th-proj': 'Nom du projet',


        'th-date': 'Date &amp; heure',
        'th-actions': 'Actions',
        'arch-empty': 'Aucune archive pour le moment — une copie est créée automatiquement à chaque sauvegarde d\'un projet.',
        'fiche-b6': 'Photos du projet',
        'fiche-b6s': '8 emplacements - modifiables par le professeur et les stagiaires',
        'b-photo-ajouter': 'Ajouter',
        'b-ajouter': 'Ajouter',
        'b-modifier': 'Modifier',
        'b-supprimer': 'Supprimer',
        'b-sauvegarder': 'Sauvegarder',
        'nav-notation': 'Notation du projet',
        'h-notation': 'Notation du projet',
        'notation-info': 'Sélectionnez un projet : le nom du projet et le nom des stagiaires sont remplis automatiquement. Saisissez la note obtenue sur 20 pour chaque critère — le total et l\'appréciation se calculent automatiquement.',
        'notation-projet': 'Projet à noter',
        'notation-equipe': 'Stagiaires du projet (rempli automatiquement)',
        'notation-membre-vide': '— non renseigné —',
        'notif-lbl-20': 'Total /20',
        'notif-lbl-100': 'Équivalent /100',
        'notif-lbl-app': 'Appréciation',
        'b-calculer': 'Calculer le total',
        'th-critere': 'Critère d\'\'évaluation',
        'th-p100': 'Points /100',
        'th-p20': 'Points /20',
        'th-note': 'Note obtenue',
        'th-total': 'TOTAL',
        'bareme-h': 'Barème d\'\'appréciation',
        'bareme-legende': 'niveau atteint par la note',
        'bareme-20': 'Note /20',
        'bareme-100': 'Note /100',
        'bareme-app': 'Appréciation',
        'c1': 'Pertinence du projet (originalité, réponse à un besoin réel, étude de marché)',
        'c2': 'Qualité technique du produit (choix des ingrédients, procédé de fabrication, sécurité)',
        'c3': 'Faisabilité économique (coûts, prix de vente, marge, rentabilité)',
        'c4': 'Stratégie commerciale / marketing (public cible, canaux de vente, packaging)',
        'c5': 'Respect des normes et réglementation (hygiène, étiquetage, statut légal)',
        'c6': 'Présentation du dossier (structure, clarté, orthographe, mise en forme)',
        'c7': 'Qualité de la soutenance orale / présentation (aisance, argumentation, réponses aux questions)',
        'c8': 'Esprit d\'\'innovation et créativité',
        'c9': 'Analyse des risques et solutions proposées',
        'app1': 'Excellent',
        'app2': 'Très bien',
        'app3': 'Bien',
        'app4': 'Assez bien',
        'app5': 'Passable',
        'app6': 'Insuffisant',
        'b-valider': 'Valider',
        'crit-ph': 'Intitulé du nouveau critère...',
        'membre-ph': 'Nom et prénom...',
        'membre-stag': 'Stagiaire',
        'bareme-note': 'Note obtenue',
        'final-tel': 'Téléphone',
        'final-send': 'Envoyer la note',
        'final-auto': 'Envoi automatique à tous les stagiaires :',
        'final-h': 'Notes finales des stagiaires',
        'b-finaliser': 'Finaliser le projet',
        'b-annuler-final': 'Annuler la finalisation',
        'final-badge': 'Projet finalisé',
        'final-stag': 'Stagiaire',
        'final-n20': 'Note finale /20',
        'final-n100': 'Note finale /100',
        'final-app': 'Appréciation',
        'final-vide': 'Aucun stagiaire dans ce projet — ajoutez-les dans la page « Fiche Projet ».',
        'repart-h': 'Répartition des niveaux',
        'repart-vide': 'Aucune note finale enregistrée pour ce projet.',
        'repart-vide-arch': 'Aucune note finale enregistrée dans les archives.',
        'th-niv': 'Niveau /20',
        'final-attente': 'Projet non finalisé : cliquez sur « Finaliser le projet » pour enregistrer les notes finales de chaque stagiaire.',
        'stu-membre': 'Stagiaire',
        'stu-liste': 'Fiches projet de l\'institut',
        'stu-empty': 'Profil introuvable — contactez votre professeur.',
        'stu-aucun': 'Aucune fiche projet disponible pour le moment.'
      },
      ar: {
        'app-lang-label': 'اللغة',
        'nav-profile': 'بطاقة المتربص',
        'nav-fiche': 'بطاقة المشروع',
        'nav-params': 'الإعدادات',
        'nav-espace': 'فضائي',
        'h-prof': 'بطاقة المتربص',
        'h-fiche': 'بطاقة المشروع',
        'h-params': 'الإعدادات',
        'h-espace': 'فضاء المتربص',
        'lbl-nom': 'اللقب',
        'lbl-prenom': 'الاسم',
        'lbl-tel': 'رقم الهاتف',
        'lbl-pass': 'كلمة المرور (آخر 4 أرقام)',
        'lbl-spec': 'التخصص',
        'lbl-sem': 'الفصل',
        'b-ajouter': 'إضافة',
        'b-modifier': 'تعديل',
        'b-supprimer': 'حذف',
        'b-sauvegarder': 'حفظ',
        'b-vider': 'تفريغ',
        'b-photo': 'الصورة',
        'b-retirer': 'إزالة',
        'b-ouvrir': 'فتح',
        'b-consulter': 'عرض',
        'b-imp-a4': 'طباعة A4',
        'b-imp-a3': 'طباعة A3',
        'b-dl-doc': 'تحميل .doc',
        'b-dl-docx': 'تحميل .docx',
        'b-exporter': 'تصدير (JSON)',
        'b-importer': 'استيراد (JSON)',
        'b-imprimer': 'طباعة',
        'b-deverrouiller': 'فتح القفل',
        'b-verrouiller': 'قفل',
        'b-reinitialiser': 'إعادة تعيين',
        'b-enregistrer': 'حفظ',
        'b-annuler': 'إلغاء',
        'th-n': 'الرقم',
        'th-photo': 'الصورة',
        'th-nomprenom': 'اللقب و الاسم',
        'th-tel': 'الهاتف',
        'th-pass': 'كلمة المرور',
        'th-spec': 'التخصص',
        'th-sem': 'الفصل',
        'fiche-form': 'بطاقة المتربص',
        'fiche-liste': 'قائمة بطاقات المتربصين',
        'fiche-tri': 'الترتيب:',
        'tri1': 'حسب التاريخ (الأقدم إلى الأحدث)',
        'tri2': 'عكس التاريخ (الأحدث إلى الأقدم)',
        'tri3': 'أبجدي (A → Z)',
        'tri4': 'آخر تعديل',
        'fiche-b1': 'اسم المشروع',
        'fiche-b2': 'أعضاء المشروع',
        'fiche-b2s': 'لقب واسم المتربصين (1 إلى 5)',
        'fiche-b3': 'أهداف المشروع',
        'fiche-b4': 'مراحل المشروع',
        'fiche-b5': 'التج equip و الطريقة'.replace('equip', 'التجهيز'),
        'fiche-b51': 'التجهيزات اللازمة',
        'fiche-b52': 'المنهجية (المسار المتبع)',
        'b-logout': 'تسجيل الخروج',
        'b-dl-zip': 'تحميل المشروع (zip)',
        'zip-info': 'ملف ZIP يحتوي على كود المشروع كاملاً في 3 ملفات: HTML و CSS و JavaScript، مع رخصة الاستعمال.',
        'b-licence': 'الترخيص',
        'nav-archive': 'أرشيف المشاريع',
        'h-archive': 'أرشيف المشاريع',
        'archive-info': 'تُؤرشف نسخة من كل مشروع تلقائياً (الاسم، التاريخ والساعة). كل نسخة قابلة للتحميل Word أو PDF وقابلة للطباعة.',
        'arch-lbl-total': 'عدد الأرشيفات',
        'arch-lbl-last': 'آخر أرشفة',
        'b-archiver': 'أرشفة هذا المشروع',
        'b-archiver-tout': 'أرشفة كل المشاريع',
        'b-archiver-vider': 'تفريغ الأرشيف',
        'repart-h': 'توزيع المستويات',
        'repart-vide': 'لا توجد نقطة نهائية مسجلة لهذا المشروع.',
        'repart-vide-arch': 'لا توجد نقطة نهائية مسجلة في الأرشيف.',
        'th-niv': 'المستوى /20',
        'th-proj': 'اسم المشروع',


        'th-date': 'التاريخ و الساعة',
        'th-actions': 'إجراءات',
        'arch-empty': 'لا يوجد أرشيف حالياً — تُنشأ نسخة تلقائياً عند كل حفظ لمشروع.',
        'fiche-b6': 'صور المشروع',
        'fiche-b6s': '8 أماكن - قابلة للتعديل من طرف الأستاذ والمتربصين',
        'b-photo-ajouter': 'إضافة',
        'b-ajouter': 'إضافة',
        'b-modifier': 'تعديل',
        'b-supprimer': 'حذف',
        'b-sauvegarder': 'حفظ',
        'nav-notation': 'تقييم المشروع',
        'h-notation': 'تقييم المشروع',
        'notation-info': 'اختر مشروعاً: يتم تعبئة اسم المشروع وأسماء المتربصين تلقائياً. أدخل النقطة المحصلة على 20 لكل معيار — يتم حساب المجموع والتقدير تلقائياً.',
        'notation-projet': 'المشروع المراد تقييمه',
        'notation-equipe': 'متربصو المشروع (يُملأ تلقائياً)',
        'notation-membre-vide': '— غير مملوء —',
        'notif-lbl-20': 'المجموع /20',
        'notif-lbl-100': 'المقابل /100',
        'notif-lbl-app': 'التقدير',
        'b-calculer': 'حساب المجموع',
        'th-critere': 'معيار التقييم',
        'th-p100': 'النقاط /100',
        'th-p20': 'النقاط /20',
        'th-note': 'النقطة المحصلة',
        'th-total': 'المجموع',
        'bareme-h': 'سلّم التقدير',
        'bareme-legende': 'المستوى الذي بلغته النقطة',
        'bareme-20': 'النقطة /20',
        'bareme-100': 'النقطة /100',
        'bareme-app': 'التقدير',
        'c1': 'ملاءمة المشروع (الأصالة، الاستجابة لحاجة حقيقية، دراسة السوق)',
        'c2': 'الجودة التقنية للمنتج (اختيار المكونات، طريقة التصنيع، السلامة)',
        'c3': 'الجدوى الاقتصادية (التكاليف، سعر البيع، الهامش، الربحية)',
        'c4': 'الاستراتيجية التجارية / التسويقية (الجمهور المستهدف، قنوات البيع، التغليف)',
        'c5': 'احترام المعايير والتنظيمات (النظافة، الملصق، الوضعية القانونية)',
        'c6': 'عرض الملف (الهيكل، الوضوح، الإملاء، التنسيق)',
        'c7': 'جودة العرض الشفوي (الطلاقة، الحجة، الإجابة عن الأسئلة)',
        'c8': 'روح الابتكار والإبداع',
        'c9': 'تحليل المخاطر والحلول المقترحة',
        'app1': 'ممتاز',
        'app2': 'جيد جدا',
        'app3': 'جيد',
        'app4': 'مقبول نوعا ما',
        'app5': 'مقبول',
        'app6': 'غير مقبول',
        'b-valider': 'تأكيد',
        'crit-ph': 'عنوان المعيار الجديد...',
        'membre-ph': 'الاسم و اللقب...',
        'membre-stag': 'المتربص',
        'bareme-note': 'النقطة المحصلة',
        'final-tel': 'الهاتف',
        'final-send': 'إرسال النقطة',
        'final-auto': 'إرسال تلقائي لجميع المتربصين:',
        'final-h': 'النهائية للمتربصين',
        'b-finaliser': 'إنهاء المشروع',
        'b-annuler-final': 'إلغاء الإنهاء',
        'final-badge': 'تم إنهاء المشروع',
        'final-stag': 'المتربص',
        'final-n20': 'النقطة النهائية /20',
        'final-n100': 'النقطة النهائية /100',
        'final-app': 'التقدير',
        'final-vide': 'لا يوجد متربص في هذا المشروع — أضفهم في صفحة «بطاقة المشروع».',
        'final-attente': 'المشروع غير منته: اضغط على «إنهاء المشروع» لتسجيل النقطة النهائية لكل متربص.',
        'stu-membre': 'المتربص',
        'stu-liste': 'بطاقات المشروع الخاصة بالمعهد',
        'stu-empty': 'البطاقة غير موجودة — اتصل بأستاذك.',
        'stu-aucun': 'لا توجد بطاقة مشروع حالياً.'
      },
      en: {
        'app-lang-label': 'Language',
        'nav-profile': 'Trainee Profile',
        'nav-fiche': 'Project Sheet',
        'nav-params': 'Settings',
        'nav-espace': 'My Space',
        'h-prof': 'Trainee Profile',
        'h-fiche': 'Project Sheet',
        'h-params': 'Settings',
        'h-espace': 'Trainee Space',
        'lbl-nom': 'Last name',
        'lbl-prenom': 'First name',
        'lbl-tel': 'Phone number',
        'lbl-pass': 'Password (last 4 digits)',
        'lbl-spec': 'Speciality',
        'lbl-sem': 'Semester',
        'b-ajouter': 'Add',
        'b-modifier': 'Edit',
        'b-supprimer': 'Delete',
        'b-sauvegarder': 'Save',
        'b-vider': 'Clear',
        'b-photo': 'Photo',
        'b-retirer': 'Remove',
        'b-ouvrir': 'Open',
        'b-consulter': 'View',
        'b-imp-a4': 'Print A4',
        'b-imp-a3': 'Print A3',
        'b-dl-doc': 'Download .doc',
        'b-dl-docx': 'Download .docx',
        'b-exporter': 'Export (JSON)',
        'b-importer': 'Import (JSON)',
        'b-imprimer': 'Print',
        'b-deverrouiller': 'Unlock',
        'b-verrouiller': 'Lock',
        'b-reinitialiser': 'Reset',
        'b-enregistrer': 'Save',
        'b-annuler': 'Cancel',
        'th-n': 'No.',
        'th-photo': 'Photo',
        'th-nomprenom': 'Last & First name',
        'th-tel': 'Phone',
        'th-pass': 'Password',
        'th-spec': 'Speciality',
        'th-sem': 'Semester',
        'fiche-form': 'Trainee sheet',
        'fiche-liste': 'List of trainee profiles',
        'fiche-tri': 'Sort:',
        'tri1': 'Chronological (oldest → newest)',
        'tri2': 'Reverse chronological (newest → oldest)',
        'tri3': 'Alphabetical (A → Z)',
        'tri4': 'Last modified',
        'fiche-b1': 'Project name',
        'fiche-b2': 'Project members',
        'fiche-b2s': 'Trainee last and first name (1 to 5)',
        'fiche-b3': 'Project objectives',
        'fiche-b4': 'Project steps',
        'fiche-b5': 'Material and method',
        'fiche-b51': 'Required material',
        'fiche-b52': 'Method (adopted approach)',
        'b-logout': 'Sign out',
        'b-dl-zip': 'Download the project (.zip)',
        'zip-info': 'The ZIP file contains the full project code split into 3 files: <strong>HTML</strong> (structure), <strong>CSS</strong> (design) and <strong>JavaScript</strong> (logic), with the licence.',
        'b-licence': 'Licence',
        'nav-archive': 'Projects Archive',
        'h-archive': 'Projects Archive',
        'archive-info': 'A copy of each project is archived automatically (name, date and time). Every archive can be downloaded as Word or PDF and printed.',
        'arch-lbl-total': 'Archives',
        'arch-lbl-last': 'Last archive',
        'b-archiver': 'Archive this project',
        'b-archiver-tout': 'Archive all projects',
        'b-archiver-vider': 'Empty the archive',
        'repart-h': 'Level distribution',
        'repart-vide': 'No final grade recorded for this project.',
        'repart-vide-arch': 'No final grade recorded in the archives.',
        'th-niv': 'Level /20',
        'th-proj': 'Project name',


        'th-date': 'Date &amp; time',
        'th-actions': 'Actions',
        'arch-empty': 'No archive yet — a copy is created automatically each time a project is saved.',
        'fiche-b6': 'Project photos',
        'fiche-b6s': '8 slots - editable by the teacher and the trainees',
        'b-photo-ajouter': 'Add',
        'b-ajouter': 'Add',
        'b-modifier': 'Edit',
        'b-supprimer': 'Delete',
        'b-sauvegarder': 'Save',
        'nav-notation': 'Project Grading',
        'h-notation': 'Project Grading',
        'notation-info': 'Select a project: the project name and the trainees names are filled in automatically. Enter the score obtained out of 20 for each criterion — the total and the assessment are calculated automatically.',
        'notation-projet': 'Project to grade',
        'notation-equipe': 'Project trainees (auto-filled)',
        'notation-membre-vide': '— not set —',
        'notif-lbl-20': 'Total /20',
        'notif-lbl-100': 'Equivalent /100',
        'notif-lbl-app': 'Assessment',
        'b-calculer': 'Compute total',
        'th-critere': 'Assessment criterion',
        'th-p100': 'Points /100',
        'th-p20': 'Points /20',
        'th-note': 'Score obtained',
        'th-total': 'TOTAL',
        'bareme-h': 'Assessment scale',
        'bareme-legende': 'level reached by the grade',
        'bareme-20': 'Score /20',
        'bareme-100': 'Score /100',
        'bareme-app': 'Assessment',
        'c1': 'Relevance of the project (originality, response to a real need, market study)',
        'c2': 'Technical quality of the product (ingredient choice, manufacturing process, safety)',
        'c3': 'Economic feasibility (costs, selling price, margin, profitability)',
        'c4': 'Commercial / marketing strategy (target audience, sales channels, packaging)',
        'c5': 'Compliance with standards and regulations (hygiene, labelling, legal status)',
        'c6': 'Report presentation (structure, clarity, spelling, formatting)',
        'c7': 'Quality of the oral defence / presentation (fluency, argumentation, answers)',
        'c8': 'Innovation and creativity',
        'c9': 'Risk analysis and proposed solutions',
        'app1': 'Excellent',
        'app2': 'Very good',
        'app3': 'Good',
        'app4': 'Fairly good',
        'app5': 'Passable',
        'app6': 'Insufficient',
        'b-valider': 'Validate',
        'crit-ph': 'New criterion title...',
        'membre-ph': 'First and last name...',
        'membre-stag': 'Trainee',
        'bareme-note': 'Score obtained',
        'final-tel': 'Phone',
        'final-send': 'Send the grade',
        'final-auto': 'Automatic sending to all trainees:',
        'final-h': 'Final grades of the trainees',
        'b-finaliser': 'Finalize the project',
        'b-annuler-final': 'Cancel finalization',
        'final-badge': 'Project finalized',
        'final-stag': 'Trainee',
        'final-n20': 'Final grade /20',
        'final-n100': 'Final grade /100',
        'final-app': 'Assessment',
        'final-vide': 'No trainee in this project — add them in the "Project Sheet" page.',
        'final-attente': 'Project not finalized: click "Finalize the project" to record each trainee final grade.',
        'stu-membre': 'Trainee',
        'stu-liste': 'Institute project sheets',
        'stu-empty': 'Profile not found — contact your teacher.',
        'stu-aucun': 'No project sheet available at the moment.'
      }
    };

    function langDico(lang) {
      return Object.assign({}, ACCUEIL_TRANSLATIONS[lang] || APP_TRANSLATIONS[lang] || {}, APP_TRANSLATIONS[lang] || {});
    }
    const APP_TITLE = 'Les Projets des Stagiaires';
    document.title = APP_TITLE + ' - INSFP ELHIDHAB';

    const ACCUEIL_TRANSLATIONS = {
      fr: {
        'accueil-title': '<i class="fas fa-diagram-project"></i> Les Projets des Stagiaires',
        'accueil-highlight': 'Encadrement des projets — INSFP ELHIDHAB 2026',
        'accueil-professor': 'Professeur Douadi Nabil',
        'access-prof': 'Accès Professeur',
        'access-prof-sub': 'Espace enseignant pour la gestion des projets',
        'access-stu': 'Accès Stagiaire',
        'access-stu-sub': 'Espace personnel du stagiaire',
        'accueil-info': '<i class="fas fa-book-open" style="color:#4fc3f7;"></i>&nbsp; Cette plateforme accompagne la préparation des <strong>projets des stagiaires</strong> : suivi des stagiaires, choix du sujet, méthodologie de rédaction, conseils pratiques et évaluation des soutenances.',
        'accueil-footer': 'Tous droits réservés © 2026 — <strong style="color:#b2dfdb;">Professeur Douadi Nabil</strong> · INSFP ELHidhab · Les Projets des Stagiaires<br>',
        'login-connexion': 'Connexion — Espace Professeur',
        'login-title': '<i class="fas fa-user-shield"></i> Accès Professeur',
        'login-sub': 'Les Projets des Stagiaires — INSFP ELHidhab',
        'login-bigtitle': 'Je m\'exerce avec les <span>Projets des Stagiaires</span>',
        'login-profname': 'Douadi Nabil',
        'login-user': '<i class="fas fa-user"></i> Nom d\'utilisateur',
        'login-pass': '<i class="fas fa-lock"></i> Mot de passe',
        'login-btn': '<i class="fas fa-sign-in-alt"></i> Se connecter',
        'login-hint': 'Accès protégé réservé à l\'enseignant (nom d\'utilisateur et mot de passe du professeur).',
        'login-stu-title': '<i class="fas fa-user-graduate"></i> Accès Stagiaire',
        'login-stu-tel': '<i class="fas fa-phone"></i> Numéro de téléphone (identifiant)',
        'login-stu-pass': '<i class="fas fa-key"></i> Mot de passe (4 chiffres)',
        'login-copyright': '<i class="fas fa-copyright"></i> 2026 — Professeur Douadi Nabil · INSFP ELHidhab'
      },
      ar: {
        'republique': 'الجمهورية الجزائرية الديمقراطية الشعبية',
        'ministere': 'وزارة التكوين والتعليم المهنيين',
        'institut': 'المعهد الوطني المتخصص للتكوين المهني (الهضاب)',
        'accueil-title': '<i class="fas fa-diagram-project"></i> مشاريع المتربصين',
        'accueil-highlight': 'تأطير المشاريع — INSFP ELHIDHAB 2026',
        'accueil-professor': 'الأستاذ دوادي نبيل',
        'access-prof': 'ولوج الأستاذ',
    'access-stu': 'ولوج المتربص',
        'access-stu-sub': 'فضاء المتربص',
        'access-prof-sub': 'فضاء الأستاذ لتدبير المشاريع',
        'accueil-info': '<i class="fas fa-book-open" style="color:#4fc3f7;"></i>&nbsp; تساهم هذه المنصة في مرافقة تحضير <strong>مشاريع المتربصين</strong>: متابعة المتربصين، اختيار الموضوع، منهجية الكتابة، نصائح عملية وتقييم المناقشات.',
        'accueil-footer': 'جميع الحقوق محفوظة © 2026 — <strong style="color:#b2dfdb;">الأستاذ دوادي نبيل</strong> · INSFP ELHidhab · مشاريع المتربصين<br>',
        'login-connexion': 'تسجيل الدخول — فضاء الأستاذ',
        'login-title': '<i class="fas fa-user-shield"></i> ولوج الأستاذ',
        'login-sub': 'مشاريع المتربصين — INSFP ELHidhab',
        'login-bigtitle': 'أشتغل مع <span>مشاريع المتربصين</span>',
        'login-profname': 'دوادي نبيل',
        'login-user': '<i class="fas fa-user"></i> اسم المستخدم',
        'login-pass': '<i class="fas fa-lock"></i> كلمة المرور',
        'login-btn': '<i class="fas fa-sign-in-alt"></i> تسجيل الدخول',
        'login-hint': 'ولوج محمي خاص بالأستاذ (اسم المستخدم وكلمة المرور الخاصتان بالأستاذ).',
    'login-stu-title': '<i class="fas fa-user-graduate"></i> ولوج المتربص',
    'login-stu-tel': '<i class="fas fa-phone"></i> رقم الهاتف (المعرف)',
    'login-stu-pass': '<i class="fas fa-key"></i> كلمة المرور (4 أرقام)',
        'login-copyright': '<i class="fas fa-copyright"></i> 2026 — الأستاذ دوادي نبيل · INSFP ELHidhab'
      },
      en: {
        'republique': "People's Democratic Republic of Algeria",
        'ministere': 'Ministry of Vocational Training and Education',
        'institut': 'National Specialized Institute of Vocational Training (ELHidhab)',
        'accueil-title': '<i class="fas fa-diagram-project"></i> Trainee Projects',
        'accueil-highlight': 'Project supervision — INSFP ELHIDHAB 2026',
        'accueil-professor': 'Professor Douadi Nabil',
        'access-prof': 'Teacher Access',
    'access-stu': 'Trainee Access',
        'access-stu-sub': 'Trainee personal space',
        'access-prof-sub': 'Teacher space for managing projects',
        'accueil-info': '<i class="fas fa-book-open" style="color:#4fc3f7;"></i>&nbsp; This platform supports the preparation of <strong>trainee projects</strong>: trainee monitoring, topic selection, writing methodology, practical advice and defense assessment.',
        'accueil-footer': 'All rights reserved © 2026 — <strong style="color:#b2dfdb;">Professor Douadi Nabil</strong> · INSFP ELHidhab · Trainee Projects<br>',
        'login-connexion': 'Login — Teacher Space',
        'login-title': '<i class="fas fa-user-shield"></i> Teacher Access',
        'login-sub': 'Trainee Projects — INSFP ELHidhab',
        'login-bigtitle': 'I work with the <span>Trainee Projects</span>',
        'login-profname': 'Douadi Nabil',
        'login-user': '<i class="fas fa-user"></i> Username',
        'login-pass': '<i class="fas fa-lock"></i> Password',
        'login-btn': '<i class="fas fa-sign-in-alt"></i> Sign in',
        'login-hint': 'Protected access reserved for the teacher (teacher username and password).',
        'login-copyright': '<i class="fas fa-copyright"></i> 2026 — Professor Douadi Nabil · INSFP ELHidhab'
      }
    };

    function setAccueilLang(lang) {
      setLang(lang);
    }

    function setLang(lang) {
      if (!APP_TRANSLATIONS[lang] && !ACCUEIL_TRANSLATIONS[lang]) return;
      try { localStorage.setItem(LANG_KEY, lang); } catch (e) {}
      const dict = langDico(lang);
      const accueil = document.getElementById('accueilPage');
      if (accueil) accueil.classList.toggle('lang-ar', lang === 'ar');
      document.body.classList.toggle('lang-ar', lang === 'ar');
      document.documentElement.lang = lang;
      document.querySelectorAll('[data-lang-key]').forEach(function(el) {
        const key = el.getAttribute('data-lang-key');
        if (key && dict[key] !== undefined) el.innerHTML = dict[key];
      });
      document.querySelectorAll('[data-lang-btn]').forEach(function(btn) {
        btn.classList.toggle('active', btn.getAttribute('data-lang-btn') === lang);
      });
      showToast('Langue : ' + ({ ar: 'العربية', fr: 'Français', en: 'English' })[lang], 'fas fa-language');
    }

    function initAccueilLang() {
      let lang = 'fr';
      try {
        const saved = localStorage.getItem(LANG_KEY);
        if (saved && (ACCUEIL_TRANSLATIONS[saved] || APP_TRANSLATIONS[saved])) lang = saved;
      } catch (e) {}
      const dict = langDico(lang);
      const accueil = document.getElementById('accueilPage');
      if (accueil) accueil.classList.toggle('lang-ar', lang === 'ar');
      document.body.classList.toggle('lang-ar', lang === 'ar');
      document.documentElement.lang = lang;
      document.querySelectorAll('[data-lang-key]').forEach(function(el) {
        const key = el.getAttribute('data-lang-key');
        if (key && dict[key] !== undefined) el.innerHTML = dict[key];
      });
      document.querySelectorAll('[data-lang-btn]').forEach(function(btn) {
        btn.classList.toggle('active', btn.getAttribute('data-lang-btn') === lang);
      });
    }

    // ===== Modification logos et galerie réservée à l'administrateur =====
    let adminGateCallback = null;

    function exigerAdmin(action) {
      if (sessionStorage.getItem(SESSION_TYPE_KEY) === 'admin' && sessionStorage.getItem(SESSION_KEY) === '1') {
        if (typeof action === 'function') action();
        return true;
      }
      adminGateCallback = (typeof action === 'function') ? action : null;
      document.getElementById('adminGatePass').value = '';
      document.getElementById('adminGateError').textContent = '';
      document.getElementById('adminGateModal').classList.add('show');
      document.getElementById('adminGatePass').focus();
      return false;
    }

    function fermerAdminGate() {
      document.getElementById('adminGateModal').classList.remove('show');
      adminGateCallback = null;
    }

    function validerAdminGate() {
      if (passHash(document.getElementById('adminGatePass').value.trim()) === ADMIN_PASS_HASH) {
        const cb = adminGateCallback;
        fermerAdminGate();
        showToast('Accès administrateur autorisé', 'fas fa-user-shield');
        if (cb) cb();
      } else {
        document.getElementById('adminGateError').textContent = '⚠ Mot de passe administrateur incorrect.';
        document.getElementById('adminGatePass').value = '';
        document.getElementById('adminGatePass').focus();
      }
    }

    // ===== Galerie 4 photos modifiables par l'admin =====
    const GALERIE_KEY = 'ps_galerie_accueil';
    let galerie = ['', '', '', ''];
    let galIndex = 0;

    function galerieRendre() {
      const zone = document.getElementById('galerie');
      if (!zone) return;
      zone.innerHTML = '';
      for (let i = 0; i < 4; i++) {
        const cell = document.createElement('div');
        cell.className = 'gal-item';
        cell.setAttribute('onclick', 'galChanger(' + i + ')');
        cell.innerHTML = (galerie[i] ? '<img src="' + galerie[i] + '" alt="Photo ' + (i + 1) + '">' : '<i class="fas fa-image"></i>') +
          '<span class="gal-num">' + (i + 1) + '</span>' +
          '<span class="gal-badge"><i class="fas fa-camera"></i></span>';
        zone.appendChild(cell);
      }
    }

    function galChanger(i) {
      exigerAdmin(function() {
        galIndex = i;
        document.getElementById('galInput').click();
      });
    }

    function galFichierChoisi(input) {
      const f = input.files && input.files[0];
      if (!f) return;
      const reader = new FileReader();
      reader.onload = function(ev) {
        const img = new Image();
        img.onload = function() {
          const max = 420;
          const k = Math.min(1, max / Math.max(img.width, img.height));
          const cv = document.createElement('canvas');
          cv.width = Math.round(img.width * k);
          cv.height = Math.round(img.height * k);
          cv.getContext('2d').drawImage(img, 0, 0, cv.width, cv.height);
          try { galerie[galIndex] = cv.toDataURL('image/jpeg', 0.78); }
          catch (e) { galerie[galIndex] = ev.target.result; }
          galerieSauver();
          galerieRendre();
        };
        img.onerror = function() { galerie[galIndex] = ev.target.result; galerieSauver(); galerieRendre(); };
        img.src = ev.target.result;
      };
      reader.readAsDataURL(f);
      input.value = '';
    }

    function galerieSauver() {
      try { localStorage.setItem(GALERIE_KEY, JSON.stringify(galerie)); }
      catch (e) { showToast('Stockage saturé — utilisez des photos plus légères', 'fas fa-exclamation-triangle', true); }
    }

    function galerieCharger() {
      try {
        const raw = JSON.parse(localStorage.getItem(GALERIE_KEY));
        if (Array.isArray(raw)) {
          for (let i = 0; i < 4; i++) galerie[i] = raw[i] || '';
        }
      } catch (e) {}
      galerieRendre();
    }

    function galToutEffacer() {
      exigerAdmin(function() {
        if (!confirm('Effacer les 4 photos de la galerie ?')) return;
        galerie = ['', '', '', ''];
        galerieSauver();
        galerieRendre();
        showToast('Galerie effacée', 'fas fa-eraser');
      });
    }

    // ===== Logos modifiables par l'administrateur =====
    function changeLogo(side) {
      if (document.body.classList.contains('locked')) return;
      exigerAdmin(function() {
        document.getElementById('logo' + side + 'File').click();
      });
    }

    document.addEventListener('change', function(e) {
      const target = e.target;
      if (target && target.id && /^logo(Left|Right)File$/.test(target.id)) {
        const side = target.id.replace('logo', '').replace('File', '');
        const file = target.files[0];
        if (!file) return;
        const reader = new FileReader();
        reader.onload = function(ev) {
          const dataUrl = ev.target.result;
          localStorage.setItem('ps_logo_' + side, dataUrl);
          const img = document.getElementById('logo' + side + 'Img');
          img.src = dataUrl;
          img.style.display = 'block';
          showToast('Logo ' + (side === 'Left' ? 'gauche' : 'droit') + ' mis à jour', 'fas fa-images');
        };
        reader.readAsDataURL(file);
        target.value = '';
      }
    });

    function restoreLogos() {
      ['Left', 'Right'].forEach(function(side) {
        const saved = localStorage.getItem('ps_logo_' + side);
        if (saved) {
          const img = document.getElementById('logo' + side + 'Img');
          img.src = saved;
          img.style.display = 'block';
        }
      });
    }

    function renderAccueilLogos() {
      const savedLeft = localStorage.getItem('ps_logo_Left');
      const savedRight = localStorage.getItem('ps_logo_Right');
      if (savedLeft) {
        document.getElementById('accueilLogoLeftImg').src = savedLeft;
        document.getElementById('accueilLogoLeftImg').style.display = 'block';
      }
      if (savedRight) {
        document.getElementById('accueilLogoRightImg').src = savedRight;
        document.getElementById('accueilLogoRightImg').style.display = 'block';
      }
    }

    function changeAccueilLogo(side) {
      exigerAdmin(function() {
        const input = document.getElementById('accueilLogo' + (side === 'left' ? 'Left' : 'Right') + 'Input');
        if (input) input.click();
      });
    }

    function accueilLogoChanged(side, input) {
      if (!input.files || !input.files[0]) return;
      const reader = new FileReader();
      const key = 'ps_logo_' + (side === 'left' ? 'Left' : 'Right');
      reader.onload = function(ev) {
        localStorage.setItem(key, ev.target.result);
        const img = document.getElementById('accueilLogo' + (side === 'left' ? 'Left' : 'Right') + 'Img');
        if (img) { img.src = ev.target.result; img.style.display = 'block'; }
        showToast('Logo ' + (side === 'left' ? 'gauche' : 'droit') + ' modifié', 'fas fa-image');
      };
      reader.readAsDataURL(input.files[0]);
      input.value = '';
    }

    // ===== Horloge =====
    function updateHeaderDateTime() {
      const now = new Date();
      document.getElementById('headerDate').textContent = now.toLocaleDateString('fr-FR', { day: '2-digit', month: '2-digit', year: 'numeric' });
      document.getElementById('headerTime').textContent = now.toTimeString().split(' ')[0];
    }

    // ===== Protection connexion (anti-tentatives multiples / anti-partage) =====
    const AUTH_MAX_ECHECS = 5;
    const AUTH_VERROU_MS = 30000;
    let authEchecs = 0;
    let authVerrouJusqua = 0;
    let authMinuteur = null;

    function authBloqueReste() {
      if (authVerrouJusqua > Date.now()) return Math.ceil((authVerrouJusqua - Date.now()) / 1000);
      return 0;
    }

    function marquerEchecAuth() {
      authEchecs++;
      if (authEchecs >= AUTH_MAX_ECHECS) {
        authVerrouJusqua = Date.now() + AUTH_VERROU_MS;
        authEchecs = 0;
      }
    }

    function reussiteAuth() {
      authEchecs = 0;
      authVerrouJusqua = 0;
      if (authMinuteur) { clearInterval(authMinuteur); authMinuteur = null; }
    }

    function compteurVerrouillage(errEl) {
      if (authMinuteur) clearInterval(authMinuteur);
      authMinuteur = setInterval(function() {
        const r = authBloqueReste();
        if (r > 0) {
          errEl.textContent = '⏱ Trop de tentatives. Réessayez dans ' + r + ' s.';
        } else {
          clearInterval(authMinuteur);
          authMinuteur = null;
          errEl.textContent = '';
        }
      }, 1000);
    }

    // ===== Connexion (professeur uniquement) =====
    function openAccueilLogin(mode) {
      const overlay = document.getElementById('accueilLoginOverlay');
      overlay.classList.add('active');
      setLoginMode(mode === 'stu' ? 'stu' : 'prof');
      setTimeout(function() {
        const first = document.getElementById(loginMode === 'stu' ? 'stuTel' : 'loginUser');
        if (first) first.focus();
      }, 60);
    }

    let loginMode = 'prof';

    function setLoginMode(mode) {
      loginMode = mode === 'stu' ? 'stu' : 'prof';
      const stu = loginMode === 'stu';
      document.getElementById('modeTabProf').classList.toggle('active', !stu);
      document.getElementById('modeTabStu').classList.toggle('active', stu);
      document.getElementById('loginPanelProf').style.display = stu ? 'none' : 'block';
      document.getElementById('loginPanelStu').style.display = stu ? 'block' : 'none';
      document.getElementById('accueilLoginOverlay').dataset.mode = loginMode;
    }

    // ---- Accès stagiaire : téléphone + 4 derniers chiffres ----
    function stuNormalize(raw) {
      return (raw || '').replace(/[\s.-]/g, '');
    }

    function stuConnexion() {
      const tel = stuNormalize(document.getElementById('stuTel').value);
      const pass = document.getElementById('stuPass').value.trim();
      const err = document.getElementById('stuError');
      const verrou = authBloqueReste();
      if (verrou > 0) {
        err.textContent = '⏱ Trop de tentatives. Réessayez dans ' + verrou + ' s.';
        compteurVerrouillage(err);
        return;
      }
      if (tel === '' || pass === '') {
        err.textContent = '⚠ Veuillez saisir votre numéro de téléphone et votre mot de passe.';
        return;
      }
      const profil = profileList.find(function(p) { return p.phone === tel; });
      if (!profil || (passHash(pass) !== profil.pass && pass !== profil.pass)) {
        marquerEchecAuth();
        err.textContent = '⚠ Numéro ou mot de passe incorrect. Contactez votre professeur pour toute assistance.';
        document.getElementById('stuPass').value = '';
        return;
      }
      reussiteAuth();
      sessionStorage.setItem(SESSION_KEY, '1');
      sessionStorage.setItem(SESSION_TYPE_KEY, 'stagiaire');
      sessionStorage.setItem(STU_KEY, tel);
      document.body.classList.remove('locked');
      document.body.classList.remove('show-accueil');
      document.getElementById('accueilLoginOverlay').classList.remove('active');
      err.textContent = '';
      document.getElementById('stuTel').value = '';
      document.getElementById('stuPass').value = '';
      appliquerRole();
      switchAppPage('page-fiche');
      setTimeout(function() {
        showToast('Bienvenue ' + profil.nom + ' ' + (profil.prenom || ''), 'fas fa-user-graduate');
      }, 200);
    }

    function stuProfil() {
      const tel = sessionStorage.getItem(STU_KEY);
      return profileList.find(function(p) { return p.phone === tel; }) || null;
    }

    function appliquerRole() {
      const stu = estStagiaire();
      document.body.classList.toggle('role-stu', stu);
      document.querySelectorAll('#appPages .page-tab').forEach(function(t) {
        const roles = (t.dataset.role || 'prof').split(/\s+/);
        const visible = roles.indexOf(stu ? 'stu' : 'prof') !== -1;
        t.style.display = visible ? '' : 'none';
        if (visible) t.classList.add('active');
      });
    }

    function closeAccueilLogin() {
      document.getElementById('accueilLoginOverlay').classList.remove('active');
      document.getElementById('loginError').textContent = '';
      document.getElementById('loginPass').value = '';
      document.getElementById('loginUser').value = '';
      document.getElementById('stuError').textContent = '';
      document.getElementById('stuPass').value = '';
      document.getElementById('stuTel').value = '';
    }

    function handleLogin() {
      const userInput = document.getElementById('loginUser').value.trim();
      const passInput = document.getElementById('loginPass').value.trim();
      const errorEl = document.getElementById('loginError');
      const verrou = authBloqueReste();
      if (verrou > 0) {
        errorEl.textContent = '⏱ Trop de tentatives. Réessayez dans ' + verrou + ' s.';
        compteurVerrouillage(errorEl);
        return;
      }

      if (userInput === '' || passInput === '') {
        errorEl.textContent = '⚠ Veuillez saisir l\'identifiant et le mot de passe.';
        return;
      }

      if (identifiantHash(userInput) === ADMIN_USER_HASH && passHash(passInput) === ADMIN_PASS_HASH) {
        reussiteAuth();
        sessionStorage.setItem(SESSION_KEY, '1');
        sessionStorage.setItem(SESSION_TYPE_KEY, 'admin');
        sessionStorage.removeItem(STU_KEY);
        document.body.classList.remove('locked');
        document.body.classList.remove('show-accueil');
        document.getElementById('accueilLoginOverlay').classList.remove('active');
        errorEl.textContent = '';
        document.getElementById('loginUser').value = '';
        document.getElementById('loginPass').value = '';
        appliquerRole();
        switchAppPage('page-profile');
        setTimeout(function() {
          showToast('Bienvenue, Professeur ' + settingsForm.profName + ' !', 'fas fa-user-shield');
        }, 200);
      } else {
        marquerEchecAuth();
        errorEl.textContent = '⚠ Identifiant ou mot de passe incorrect.';
        document.getElementById('loginPass').value = '';
        document.getElementById('loginPass').focus();
      }
    }

    function logout() {
      sessionStorage.removeItem(SESSION_KEY);
      sessionStorage.removeItem(SESSION_TYPE_KEY);
      sessionStorage.removeItem(STU_KEY);
      document.body.classList.add('locked');
      document.body.classList.add('show-accueil');
      document.getElementById('loginUser').value = '';
      document.getElementById('loginPass').value = '';
      document.getElementById('stuTel').value = '';
      document.getElementById('stuPass').value = '';
      document.getElementById('loginError').textContent = '';
      document.getElementById('stuError').textContent = '';
      document.getElementById('accueilLoginOverlay').classList.remove('active');
      document.querySelectorAll('#appPages .page-tab').forEach(function(t) {
        t.style.display = (t.dataset.role || 'prof') === 'prof' ? '' : 'none';
      });
      showToast('Session fermée', 'fas fa-sign-out-alt');
    }

    // ===== Toast =====
    function showToast(msg, icon, isError) {
      const container = document.getElementById('toastContainer');
      const toast = document.createElement('div');
      toast.className = 'toast' + (isError ? ' toast-error' : '');
      toast.innerHTML = '<i class="fas ' + icon + '"></i><span>' + msg + '</span>';
      container.appendChild(toast);
      setTimeout(function() {
        toast.style.transition = 'opacity 0.4s, transform 0.4s';
        toast.style.opacity = '0';
        toast.style.transform = 'translateX(30px)';
        setTimeout(function() { toast.remove(); }, 400);
      }, 2600);
    }

    // ===== Profile Stagiaire =====
    const PROFILES_KEY = 'ps_profiles';
    const SPECIALITES_KEY = 'ps_specialites';
    const PROFILE_SPECIALITES_DEFAUT = [
      'Chimie Industrielle',
      'Analyse et Contrôle Qualité',
      'Pharmacie',
      'Biologie',
      'Industrie Agroalimentaire',
      'Protection de l\'Environnement',
      'Autre'
    ];
    const PROFILE_SEMESTRES = ['S1', 'S2', 'S3', 'S4', 'S5'];

    let profileList = [];
    let profileEditingId = null;
    let profilePhotoData = '';
    let specialiteList = PROFILE_SPECIALITES_DEFAUT.slice();

    function profEscapeHtml(s) {
      return String(s == null ? '' : s).replace(/[&<>"']/g, function(c) {
        return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
      });
    }

    function profNormalizePhone(raw) {
      return (raw || '').replace(/[\s.-]/g, '');
    }

    function profAutoPass() {
      const phone = profNormalizePhone(document.getElementById('profPhone').value);
      document.getElementById('profPass').value = /^0[0-9]{9}$/.test(phone) ? phone.slice(-4) : '';
    }

    function profLoad() {
      try {
        const raw = JSON.parse(localStorage.getItem(PROFILES_KEY));
        profileList = Array.isArray(raw) ? raw : [];
      } catch (e) { profileList = []; }
      try {
        const raw = JSON.parse(localStorage.getItem(SPECIALITES_KEY));
        specialiteList = Array.isArray(raw) && raw.length ? raw : PROFILE_SPECIALITES_DEFAUT.slice();
      } catch (e) { specialiteList = PROFILE_SPECIALITES_DEFAUT.slice(); }
      profRendreSpecialites();
      profRender();
    }

    // ---- Gestion dynamique des spécialités ----
    function profRendreSpecialites(selection) {
      const sel = document.getElementById('profSpecialite');
      if (selection === undefined) selection = sel.value;
      sel.innerHTML = '<option value="">-- Sélectionner --</option>';
      specialiteList.forEach(function(s) {
        const opt = document.createElement('option');
        opt.value = s;
        opt.textContent = s;
        sel.appendChild(opt);
      });
      if (specialiteList.indexOf(selection) !== -1) sel.value = selection;
      const zone = document.getElementById('specChips');
      zone.innerHTML = '';
      if (!specialiteList.length) {
        zone.innerHTML = '<span style="font-size:.75rem;color:var(--text-muted);font-style:italic;">Aucune spécialité — ajoutez-en une ci-dessous.</span>';
        return;
      }
      specialiteList.forEach(function(s, i) {
        const chip = document.createElement('span');
        chip.className = 'spec-chip';
        chip.style.animationDelay = (i * 40) + 'ms';
        chip.innerHTML = '<span>' + profEscapeHtml(s) + '</span>' +
          '<button class="btn btn-accent" title="Modifier" onclick="profSpecModifier(' + i + ')"><i class="fas fa-pen"></i></button>' +
          '<button class="btn btn-danger" title="Supprimer" onclick="profSpecSupprimer(' + i + ')"><i class="fas fa-times"></i></button>';
        zone.appendChild(chip);
      });
    }

    function profSpecPersist() {
      try { localStorage.setItem(SPECIALITES_KEY, JSON.stringify(specialiteList)); }
      catch (e) { showToast('Stockage saturé', 'fas fa-exclamation-triangle', true); }
    }

    function profSpecSauvegarder() {
      profSpecPersist();
      profPersist();
      profRendreSpecialites();
      profRender();
      showToast('Liste des spécialités sauvegardée (' + specialiteList.length + ')', 'fas fa-save');
    }

    function profSpecAjouter() {
      const inp = document.getElementById('specInput');
      const nom = inp.value.trim();
      if (!nom) { showToast('Saisissez le nom de la spécialité', 'fas fa-exclamation-triangle', true); return; }
      if (specialiteList.some(function(s) { return s.toLowerCase() === nom.toLowerCase(); })) {
        showToast('Cette spécialité existe déjà', 'fas fa-exclamation-triangle', true);
        return;
      }
      specialiteList.push(nom);
      inp.value = '';
      profSpecPersist();
      profRendreSpecialites(nom);
      profRender();
      showToast('Spécialité ajoutée : ' + nom, 'fas fa-plus');
    }

    function profSpecModifier(i) {
      if (i < 0 || i >= specialiteList.length) return;
      const ancien = specialiteList[i];
      const nom = window.prompt('Modifier la spécialité :', ancien);
      if (nom === null) return;
      if (!nom.trim()) { showToast('Le nom ne peut pas être vide', 'fas fa-exclamation-triangle', true); return; }
      if (specialiteList.some(function(s, k) { return k !== i && s.toLowerCase() === nom.trim().toLowerCase(); })) {
        showToast('Cette spécialité existe déjà', 'fas fa-exclamation-triangle', true);
        return;
      }
      specialiteList[i] = nom.trim();
      let touches = 0;
      profileList.forEach(function(p) { if (p.specialite === ancien) { p.specialite = specialiteList[i]; touches++; } });
      profSpecPersist();
      profPersist();
      profRendreSpecialites(specialiteList[i]);
      profRender();
      showToast('Spécialité modifiée' + (touches ? ' (' + touches + ' profil(s) mis à jour)' : ''), 'fas fa-pen');
    }

    function profSpecSupprimer(i) {
      if (i < 0 || i >= specialiteList.length) return;
      const nom = specialiteList[i];
      if (!confirm('Supprimer la spécialité « ' + nom + ' » ?')) return;
      if (specialiteList.length === 1) {
        showToast('Conservez au moins une spécialité', 'fas fa-exclamation-triangle', true);
        return;
      }
      specialiteList.splice(i, 1);
      let touches = 0;
      profileList.forEach(function(p) { if (p.specialite === nom) { p.specialite = ''; touches++; } });
      profSpecPersist();
      profPersist();
      profRendreSpecialites('');
      profRender();
      showToast('Spécialité supprimée' + (touches ? ' (' + touches + ' profil(s) sans spécialité)' : ''), 'fas fa-trash');
    }

    function profPersist() {
      try {
        localStorage.setItem(PROFILES_KEY, JSON.stringify(profileList));
        return true;
      } catch (e) {
        showToast('Stockage saturé — retirez une photo pour alléger le fichier', 'fas fa-exclamation-triangle', true);
        return false;
      }
    }

    function profShowPhoto(data) {
      const img = document.getElementById('profPhotoPreview');
      const icon = document.getElementById('profPhotoIcon');
      if (data) {
        img.src = data;
        img.style.display = 'block';
        icon.style.display = 'none';
      } else {
        img.removeAttribute('src');
        img.style.display = 'none';
        icon.style.display = 'block';
      }
    }

    function profPhotoChanged(input) {
      const file = input.files && input.files[0];
      if (!file) return;
      const reader = new FileReader();
      reader.onload = function(ev) {
        const img = new Image();
        img.onload = function() {
          const max = 180;
          const scale = Math.min(1, max / Math.max(img.width, img.height));
          const canvas = document.createElement('canvas');
          canvas.width = Math.round(img.width * scale);
          canvas.height = Math.round(img.height * scale);
          canvas.getContext('2d').drawImage(img, 0, 0, canvas.width, canvas.height);
          try { profilePhotoData = canvas.toDataURL('image/jpeg', 0.8); }
          catch (e) { profilePhotoData = ev.target.result; }
          profShowPhoto(profilePhotoData);
          showToast('Photo chargée (facultative)', 'fas fa-image');
        };
        img.onerror = function() {
          profilePhotoData = ev.target.result;
          profShowPhoto(profilePhotoData);
        };
        img.src = ev.target.result;
      };
      reader.readAsDataURL(file);
      input.value = '';
    }

    function profPhotoClear() {
      profilePhotoData = '';
      profShowPhoto('');
      document.getElementById('profPhoto').value = '';
      showToast('Photo retirée', 'fas fa-eraser');
    }

    function profRender() {
      const tbody = document.getElementById('profBody');
      tbody.innerHTML = '';
      const empty = document.getElementById('profEmpty');
      if (profileList.length === 0) {
        empty.style.display = 'block';
        document.getElementById('profCounter').textContent = '';
        document.getElementById('profMeta').innerHTML = '<span><i class="fas fa-info-circle"></i> Aucun profil — remplissez la fiche puis cliquez sur « Ajouter ».</span>';
        return;
      }
      empty.style.display = 'none';
      document.getElementById('profCounter').textContent = 'Total : ' + profileList.length + ' profil(s) stagiaire(s)';
      const parSem = {};
      PROFILE_SEMESTRES.forEach(function(s) { parSem[s] = 0; });
      profileList.forEach(function(p, idx) {
        if (parSem[p.semestre] !== undefined) parSem[p.semestre]++;
        const tr = document.createElement('tr');
        tr.dataset.id = p.id;
        if (profileEditingId === p.id) tr.classList.add('selected');
        tr.innerHTML =
          '<td>' + (idx + 1) + '</td>' +
          '<td class="prof-thumb-ok">' + (p.photo ? '<img class="prof-photo-thumb" src="' + p.photo + '" alt="photo">' : '<i class="fas fa-user-slash"></i>') + '</td>' +
          '<td><strong>' + profEscapeHtml(p.nom) + '</strong> ' + profEscapeHtml(p.prenom) + '</td>' +
          '<td>' + profEscapeHtml(p.phone) + '</td>' +
          '<td><span class="status-badge valide">' + profEscapeHtml(p.pass || '————') + '</span></td>' +
          '<td>' + profEscapeHtml(p.specialite || '—') + '</td>' +
          '<td>' + (p.semestre ? '<span class="prof-sem-badge ' + p.semestre.toLowerCase() + '">' + p.semestre + '</span>' : '—') + '</td>';
        tr.addEventListener('click', function() { profFill(p); });
        tbody.appendChild(tr);
      });
      const chips = PROFILE_SEMESTRES.map(function(s) {
        return '<span><i class="fas fa-calendar-alt"></i> ' + s + ' : <b>' + parSem[s] + '</b></span>';
      }).join('');
      document.getElementById('profMeta').innerHTML = '<span><i class="fas fa-users"></i> Stagiaires : <b>' + profileList.length + '</b></span>' + chips;
    }

    function profFill(p) {
      profileEditingId = p.id;
      document.getElementById('profNom').value = p.nom || '';
      document.getElementById('profPrenom').value = p.prenom || '';
      document.getElementById('profPhone').value = p.phone || '';
      document.getElementById('profSpecialite').value = p.specialite || '';
      document.getElementById('profSemestre').value = p.semestre || '';
      profilePhotoData = p.photo || '';
      profShowPhoto(profilePhotoData);
      profAutoPass();
      profRender();
      showToast('Profil sélectionné : ' + p.nom + ' ' + (p.prenom || ''), 'fas fa-user-check');
    }

    function profVider() {
      profileEditingId = null;
      profilePhotoData = '';
      ['profNom', 'profPrenom', 'profPhone', 'profPass'].forEach(function(id) { document.getElementById(id).value = ''; });
      document.getElementById('profSpecialite').value = '';
      document.getElementById('profSemestre').value = '';
      profShowPhoto('');
      profRender();
      showToast('Formulaire vidé', 'fas fa-eraser');
    }

    function profReadForm() {
      const nom = document.getElementById('profNom').value.trim();
      const prenom = document.getElementById('profPrenom').value.trim();
      const phone = profNormalizePhone(document.getElementById('profPhone').value);
      const specialite = document.getElementById('profSpecialite').value;
      const semestre = document.getElementById('profSemestre').value;
      if (!nom) { showToast('Saisissez le nom du stagiaire', 'fas fa-exclamation-triangle', true); return null; }
      if (!/^0[0-9]{9}$/.test(phone)) {
        showToast('Numéro de téléphone invalide (10 chiffres débutant par 0)', 'fas fa-exclamation-triangle', true);
        return null;
      }
      if (semestre && PROFILE_SEMESTRES.indexOf(semestre) === -1) {
        showToast('Semestre invalide — choisissez S1 à S5', 'fas fa-exclamation-triangle', true);
        return null;
      }
      return {
        nom: nom, prenom: prenom, phone: phone,
        pass: phone.slice(-4),
        specialite: specialite, semestre: semestre, photo: profilePhotoData
      };
    }

    function profAjouter() {
      const data = profReadForm();
      if (!data) return;
      if (profileList.some(function(p) { return p.phone === data.phone; })) {
        showToast('Ce numéro est déjà enregistré', 'fas fa-exclamation-triangle', true);
        return;
      }
      data.id = Date.now() + '' + Math.floor(Math.random() * 1000);
      profileList.push(data);
      if (!profPersist()) { profileList.pop(); profRender(); return; }
      profVider();
      showToast('Profil ajouté : ' + data.nom + ' ' + data.prenom, 'fas fa-user-plus');
    }

    function profModifier() {
      if (profileEditingId === null) {
        showToast('Sélectionnez d\'abord un profil dans la liste (cliquez sur sa ligne)', 'fas fa-exclamation-triangle', true);
        return;
      }
      const data = profReadForm();
      if (!data) return;
      if (profileList.some(function(p) { return p.phone === data.phone && p.id !== profileEditingId; })) {
        showToast('Ce numéro est déjà utilisé par un autre stagiaire', 'fas fa-exclamation-triangle', true);
        return;
      }
      const target = profileList.find(function(p) { return p.id === profileEditingId; });
      if (!target) return;
      Object.keys(data).forEach(function(k) { target[k] = data[k]; });
      if (!profPersist()) return;
      profVider();
      showToast('Profil modifié', 'fas fa-pen');
    }

    function profSupprimer() {
      if (profileEditingId === null) {
        showToast('Sélectionnez d\'abord un profil dans la liste (cliquez sur sa ligne)', 'fas fa-exclamation-triangle', true);
        return;
      }
      const target = profileList.find(function(p) { return p.id === profileEditingId; });
      if (!confirm('Supprimer ce profil stagiaire ?')) return;
      profileList = profileList.filter(function(p) { return p.id !== profileEditingId; });
      profPersist();
      profVider();
      showToast('Profil supprimé' + (target ? (' : ' + target.nom + ' ' + (target.prenom || '')) : ''), 'fas fa-trash');
    }

    function profFormRempli() {
      return ['profNom', 'profPrenom', 'profPhone'].some(function(id) {
        return document.getElementById(id).value.trim() !== '';
      }) || document.getElementById('profSpecialite').value !== '' ||
             document.getElementById('profSemestre').value !== '' || profilePhotoData !== '';
    }

    function profSauvegarder() {
      // Si un profil est sélectionné -> met à jour la fiche sélectionnée
      if (profileEditingId !== null && profileList.some(function(p) { return p.id === profileEditingId; })) {
        profModifier();
        return;
      }
      // Sinon, si le formulaire est rempli -> crée la fiche manquante
      if (profFormRempli()) {
        profAjouter();
        return;
      }
      // Sinon : sauvegarde de la liste telle quelle
      if (profPersist()) {
        profRender();
        showToast('Profils stagiaires sauvegardés (' + profileList.length + ')', 'fas fa-save');
      }
    }

    function profExport() {
      if (profileList.length === 0) { showToast('Aucun profil à exporter', 'fas fa-exclamation-triangle', true); return; }
      const data = { app: 'Les Projets des Stagiaires — INSFP ELHIDHAB 2026', prof: settingsForm.profName, profils: profileList, exporte: new Date().toISOString() };
      const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
      const a = document.createElement('a');
      a.href = URL.createObjectURL(blob);
      a.download = 'profils_stagiaires_insfp_2026.json';
      a.click();
      URL.revokeObjectURL(a.href);
      showToast('Profils exportés (JSON)', 'fas fa-file-export');
    }

    function profImportChanged(input) {
      const file = input.files && input.files[0];
      if (!file) return;
      const reader = new FileReader();
      reader.onload = function(ev) {
        try {
          const obj = JSON.parse(ev.target.result);
          const arr = Array.isArray(obj) ? obj : (obj.profils || obj.stagiaires || []);
          if (!Array.isArray(arr)) throw new Error('Structure invalide');
          profileList = arr;
          profPersist();
          profVider();
          showToast('Profils importés : ' + arr.length, 'fas fa-file-import');
        } catch (e) {
          showToast('Fichier JSON invalide', 'fas fa-exclamation-triangle', true);
        }
      };
      reader.readAsText(file, 'utf-8');
      input.value = '';
    }

    // ===== Fiche Projet =====
    const FICHES_KEY = 'ps_fiches_projets';
    const MEMBRE_MAX = 5;
    const PHOTO_MAX = 8;
    const LISTE_CFG = {
      objectifs: { zone: 'listeObjectifs', inp: 'inpObjectif', cnt: 'cntObjectifs', vide: 'Aucun objectif défini pour ce projet.' },
      etapes: { zone: 'listeEtapes', inp: 'inpEtape', cnt: 'cntEtapes', vide: 'Aucune étape définie pour ce projet.' },
      materiel: { zone: 'listeMateriel', inp: 'inpMateriel', cnt: 'cntMateriel', vide: 'Aucun matériel renseigné pour ce projet.' }
    };

    let ficheList = [];
    let ficheId = null;
    let ficheSel = null;
    let ficheSelPhoto = null;

    // Compression d'image (canvas) avant stockage
    function compresserImage(fichier, maxDim, qualite, cb) {
      const reader = new FileReader();
      reader.onload = function(ev) {
        const img = new Image();
        img.onload = function() {
          const k = Math.min(1, maxDim / Math.max(img.width, img.height));
          const cv = document.createElement('canvas');
          cv.width = Math.max(1, Math.round(img.width * k));
          cv.height = Math.max(1, Math.round(img.height * k));
          cv.getContext('2d').drawImage(img, 0, 0, cv.width, cv.height);
          try { cb(cv.toDataURL('image/jpeg', qualite)); }
          catch (e) { cb(ev.target.result); }
        };
        img.onerror = function() { cb(ev.target.result); };
        img.src = ev.target.result;
      };
      reader.readAsDataURL(fichier);
    }

    // ---- Barre d'actions : Ajouter / Modifier / Supprimer / Sauvegarder ----
    function ficheSelectionner(type, cle) {
      if (ficheSel && ficheSel.type === type && ficheSel.cle === cle) ficheSel = null;
      else ficheSel = { type: type, cle: cle };
      ficheToutRendre();
    }

    function ficheAction(action, type) {
      const p = ficheCourant();
      if (!p) { showToast('Créez ou sélectionnez d\'abord un projet', 'fas fa-exclamation-triangle', true); return; }

      if (type === 'methode') {
        const ta = document.getElementById('ficheMethode');
        if (action === 'ajouter') { ta.focus(); showToast('Saisissez la démarche méthodologique', 'fas fa-pen'); return; }
        if (action === 'modifier') { ta.focus(); showToast('Zone méthode prête à être modifiée', 'fas fa-pen'); return; }
        if (action === 'supprimer') {
          if (!p.methode) { showToast('La méthode est déjà vide', 'fas fa-exclamation-triangle', true); return; }
          if (!confirm('Effacer la méthode de ce projet ?')) return;
          p.methode = '';
          ta.value = '';
          ficheSauvegarder();
          showToast('Méthode effacée', 'fas fa-trash');
        }
        return;
      }

      if (type === 'membres') {
        membreAssurer(p);
        if (action === 'ajouter') {
          // 1) si l'emplacement sélectionné contient une saisie -> on l'enregistre
          const sel = (ficheSel && ficheSel.type === 'membres') ? ficheSel.cle : -1;
          if (sel >= 0 && !membreRempli(p.membres[sel]) && membreLire(sel).nom) {
            if (membreEnregistrer(sel, true)) {
              const suivant = membreLibre(ficheCourant());
              if (suivant >= 0) { ficheSel = { type: 'membres', cle: suivant }; membreFocus(suivant); }
            }
            return;
          }
          // 2) sinon on cible le premier emplacement libre
          const libre = membreLibre(p);
          if (libre < 0) { showToast('Les ' + MEMBRE_MAX + ' fiches stagiaires sont remplies', 'fas fa-exclamation-triangle', true); return; }
          ficheSel = { type: 'membres', cle: libre };
          membreFocus(libre);
          showToast('Saisissez le nom et prénom du stagiaire ' + (libre + 1) + ' puis cliquez sur Ajouter', 'fas fa-user-plus');
          return;
        }
        if (action === 'modifier') {
          const i = (ficheSel && ficheSel.type === 'membres') ? ficheSel.cle : membreLibre(p);
          if (i < 0) { showToast('Aucun emplacement sélectionné', 'fas fa-exclamation-triangle', true); return; }
          membreEnregistrer(i, false);
          return;
        }
        if (action === 'supprimer') {
          if (ficheSel && ficheSel.type === 'membres') membreSupprimer(ficheSel.cle);
          else showToast('Cliquez sur un stagiaire pour le sélectionner puis Supprimer', 'fas fa-exclamation-triangle', true);
          return;
        }
        return;
      }

      // Listes dynamiques : objectifs, etapes, materiel
      const cfg = LISTE_CFG[type];
      if (!cfg) return;
      if (action === 'ajouter') {
        const inp = document.getElementById(cfg.inp);
        inp.focus();
        showToast('Saisissez l\'élément puis cliquez sur Ajouter', 'fas fa-plus');
        return;
      }
      const items = p[type] || [];
      if (action === 'modifier') {
        const it = ficheSel && ficheSel.type === type ? items.find(function(x) { return x.id === ficheSel.cle; }) : null;
        if (!it) { showToast('Cliquez sur un élément pour le sélectionner puis Modifier', 'fas fa-exclamation-triangle', true); return; }
        ficheListEdit(type, it.id);
        return;
      }
      if (action === 'supprimer') {
        const it = ficheSel && ficheSel.type === type ? items.find(function(x) { return x.id === ficheSel.cle; }) : null;
        if (!it) { showToast('Cliquez sur un élément pour le sélectionner puis Supprimer', 'fas fa-exclamation-triangle', true); return; }
        const ok = confirm('Supprimer « ' + it.texte +' » ?');
        if (ok) ficheListDel(type, it.id);
        return;
      }
    }

    function ficheEch(s) {
      return String(s == null ? '' : s).replace(/[&<>"']/g, function(c) {
        return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
      });
    }

    function ficheVide(id) {
      return { id: id, nom: '', membres: [], objectifs: [], etapes: [], materiel: [], methode: '' };
    }

    function ficheLoad() {
      try {
        const raw = JSON.parse(localStorage.getItem(FICHES_KEY));
        ficheList = Array.isArray(raw) ? raw : [];
      } catch (e) { ficheList = []; }
      if (ficheId === null && ficheList.length) ficheId = ficheList[0].id;
      ficheToutRendre();
    }

    function ficheCourant() {
      return ficheList.find(function(p) { return p.id === ficheId; }) || null;
    }

    function ficheSauvegarder() {
      try {
        const p = ficheCourant();
        if (p) { if (!p.cree) p.cree = new Date().toISOString(); p.modif = Date.now(); }
        localStorage.setItem(FICHES_KEY, JSON.stringify(ficheList));
        archiverProjet(p);
        const flash = document.getElementById('ficheFlash');
        flash.classList.add('on');
        setTimeout(function() { flash.classList.remove('on'); }, 1200);
        showToast('Fiche projet sauvegardée et archivée', 'fas fa-save');
      } catch (e) {
        showToast('Sauvegarde impossible (stockage saturé)', 'fas fa-exclamation-triangle', true);
      }
    }

    // ---- 1. Nom du projet ----
    const TRI_KEY = 'ps_fiche_tri';

    function ficheTriChoix() {
      let v = '';
      try { v = localStorage.getItem(TRI_KEY) || ''; } catch (e) {}
      return ['chrono', 'chrono-inv', 'alpha', 'modif'].indexOf(v) >= 0 ? v : 'chrono';
    }

    function ficheTriChanger() {
      const s = document.getElementById('ficheTri');
      if (!s) return;
      try { localStorage.setItem(TRI_KEY, s.value); } catch (e) {}
      ficheRendreProjets();
    }

    // Date de creation d'un projet (les anciens projets sont dates a la migration)
    function ficheDateP(p, i) {
      if (p.cree) {
        const t = new Date(p.cree).getTime();
        if (!isNaN(t)) return t;
      }
      const n = ficheList.length;
      return Date.now() - (n - (i || 0)) * 60000;
    }

    function ficheDateLisible(p) {
      const d = new Date(ficheDateP(p, ficheList.indexOf(p)));
      if (isNaN(d.getTime())) return '';
      return d.toLocaleDateString('fr-FR') + ' ' + d.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' });
    }

    // Classe automatiquement les projets (chronologique par defaut)
    function ficheTrier(liste) {
      const out = liste.slice();
      const t = ficheTriChoix();
      if (t === 'alpha') {
        out.sort(function(a, b) { return (a.nom || '').localeCompare(b.nom || '', 'fr', { sensitivity: 'base' }); });
      } else if (t === 'modif') {
        out.sort(function(a, b) { return (b.modif || 0) - (a.modif || 0); });
      } else {
        out.sort(function(a, b) {
          const d = ficheDateP(a, liste.indexOf(a)) - ficheDateP(b, liste.indexOf(b));
          if (t === 'chrono-inv') return -d;
          return d !== 0 ? d : (a.nom || '').localeCompare(b.nom || '', 'fr', { sensitivity: 'base' });
        });
      }
      return out;
    }

    // Migration : date les projets deja enregistres (conserve l'ordre existant)
    function ficheDates() {
      const n = ficheList.length;
      let change = false;
      ficheList.forEach(function(p, i) {
        if (!p.cree) {
          p.cree = new Date(Date.now() - (n - i) * 60000).toISOString();
          change = true;
        }
        if (!p.modif) { p.modif = Date.now() - (n - i) * 1000; change = true; }
      });
      if (change) { try { localStorage.setItem(FICHES_KEY, JSON.stringify(ficheList)); } catch (e) {} }
    }

    function ficheRendreProjets() {
      const grid = document.getElementById('projGrid');
      grid.innerHTML = '';
      const selTri = document.getElementById('ficheTri');
      if (selTri) selTri.value = ficheTriChoix();
      document.getElementById('ficheProjCount').textContent = ficheList.length ? ficheList.length + ' projet(s)' : '';
      ficheRendrePhotos();
      if (!ficheList.length) {
        grid.innerHTML = '<p class="fiche-empty" style="grid-column:1/-1;text-align:center;">Aucun projet — saisissez un nom puis cliquez sur « Ajouter ».</p>';
        return;
      }
      ficheTrier(ficheList).forEach(function(p) {
        const card = document.createElement('div');
        card.className = 'proj-card' + (p.id === ficheId ? ' active' : '');
        card.innerHTML =
          '<h4><i class="fas fa-folder-open"></i> ' + ficheEch(p.nom || 'Sans nom') + '</h4>' +
          '<div class="proj-card-date"><i class="fas fa-calendar-alt"></i> ' + ficheEch(ficheDateLisible(p)) + '</div>' +
          '<div class="proj-card-meta">' +
            '<span><i class="fas fa-users"></i> ' + (p.membres || []).filter(membreRempli).length + '/' + MEMBRE_MAX + '</span>' +
            '<span><i class="fas fa-bullseye"></i> ' + (p.objectifs || []).length + '</span>' +
            '<span><i class="fas fa-list-ol"></i> ' + (p.etapes || []).length + '</span>' +
            '<span><i class="fas fa-toolbox"></i> ' + (p.materiel || []).length + '</span>' +
            (p.notes && Object.keys(p.notes).length ? '<span><i class="fas fa-star"></i> ' + (function() {
              let t = 0; (p.criteres || []).forEach(function(c) { t += (p.notes[c.id] || 0); });
              return (Math.round(t * 100) / 100) + '/20';
            })() + '</span>' : '') +
          '</div>' +
          '<div class="member-actions" style="margin-top:.6rem;">' +
            '<button class="btn btn-accent" onclick="event.stopPropagation(); projCharger(\'' + p.id + '\')"><i class="fas fa-pen"></i> Ouvrir</button>' +
            '<button class="btn btn-danger" onclick="event.stopPropagation(); projSupprimerId(\'' + p.id + '\')"><i class="fas fa-trash"></i> Supprimer</button>' +
          '</div>';
        card.addEventListener('click', function() { projCharger(p.id); });
        grid.appendChild(card);
      });
    }

    function projAjouter() {
      const nom = document.getElementById('projNom').value.trim();
      if (!nom) { showToast('Saisissez le nom du projet', 'fas fa-exclamation-triangle', true); return; }
      if (ficheList.some(function(p) { return (p.nom || '').toLowerCase() === nom.toLowerCase(); })) {
        showToast('Ce projet existe déjà', 'fas fa-exclamation-triangle', true);
        return;
      }
      const p = ficheVide(Date.now() + '' + Math.floor(Math.random() * 1000));
      p.nom = nom;
      p.cree = new Date().toISOString();
      p.modif = Date.now();
      ficheList.push(p);
      ficheId = p.id;
      ficheSel = null;
      ficheSelPhoto = null;
      document.getElementById('projNom').value = '';
      ficheSauvegarder();
      ficheToutRendre();
      showToast('Projet ajouté : ' + nom, 'fas fa-folder-plus');
    }

    function projNouveau() {
      ficheSel = null;
      ficheSelPhoto = null;
      const inp = document.getElementById('projNom');
      inp.value = '';
      inp.focus();
      ficheToutRendre();
      window.scrollTo({ top: 0, behavior: 'smooth' });
      showToast('Nouveau projet — saisissez le nom puis cliquez sur Ajouter', 'fas fa-folder-plus');
    }

    function projCharger(id) {
      ficheId = id;
      ficheSel = null;
      ficheSelPhoto = null;
      const p = ficheCourant();
      if (!p) return;
      document.getElementById('projNom').value = p.nom || '';
      ficheToutRendre();
      showToast('Fiche ouverte : ' + p.nom, 'fas fa-folder-open');
    }

    function projModifier() {
      const p = ficheCourant();
      if (!p) { showToast('Sélectionnez ou créez d\'abord un projet', 'fas fa-exclamation-triangle', true); return; }
      const nom = document.getElementById('projNom').value.trim();
      if (!nom) { showToast('Saisissez le nom du projet', 'fas fa-exclamation-triangle', true); return; }
      p.nom = nom;
      ficheSauvegarder();
      ficheToutRendre();
      showToast('Nom du projet modifié', 'fas fa-pen');
    }

    function projSupprimer() {
      if (ficheId === null) { showToast('Sélectionnez d\'abord un projet', 'fas fa-exclamation-triangle', true); return; }
      projSupprimerId(ficheId);
    }

    // ================= PAGE NOTATION DU PROJET =================
    const NOTATION_CRITERES = [
      { id: 'c1', p100: 15, p20: 3 },
      { id: 'c2', p100: 15, p20: 3 },
      { id: 'c3', p100: 15, p20: 3 },
      { id: 'c4', p100: 15, p20: 3 },
      { id: 'c5', p100: 10, p20: 2 },
      { id: 'c6', p100: 10, p20: 2 },
      { id: 'c7', p100: 10, p20: 2 },
      { id: 'c8', p100: 5, p20: 1 },
      { id: 'c9', p100: 5, p20: 1 }
    ];
    const NOTATION_BAREME = [
      { min20: 18, min100: 90, app: 'app1', niv: 1, aff20: '18 – 20', aff100: '90 – 100' },
      { min20: 16, min100: 80, app: 'app2', niv: 2, aff20: '16 – 17,9', aff100: '80 – 89' },
      { min20: 14, min100: 70, app: 'app3', niv: 3, aff20: '14 – 15,9', aff100: '70 – 79' },
      { min20: 12, min100: 60, app: 'app4', niv: 4, aff20: '12 – 13,9', aff100: '60 – 69' },
      { min20: 10, min100: 50, app: 'app5', niv: 5, aff20: '10 – 11,9', aff100: '50 – 59' },
      { min20: -1, min100: -1, app: 'app6', niv: 6, aff20: '< 10', aff100: '< 50' }
    ];
    let notationId = null;
    let notationEditCrit = null;
    const CRIT_MAX = 15;
    const PAGES_PROF = ['page-profile', 'page-archive', 'page-notation', 'page-params'];
    function estStagiaire() { return sessionStorage.getItem(SESSION_TYPE_KEY) === 'stagiaire'; }

    function criteresDefaut() {
      return NOTATION_CRITERES.map(function(c) { return { id: c.id, p100: c.p100, p20: c.p20 }; });
    }

    function notationCriteres(p) {
      if (!p) return [];
      if (!p.criteres || !p.criteres.length) p.criteres = criteresDefaut();
      return p.criteres;
    }

    function notationLibelle(c, dico) {
      if (c.texte) return c.texte;
      return (dico && dico[c.id]) || c.id;
    }

    function notationDico() {
      let lang = 'fr';
      try { lang = localStorage.getItem(LANG_KEY) || 'fr'; } catch (e) {}
      return langDico(lang);
    }

    // ---- Critères : Modifier / Ajouter / Supprimer ----
    function notationCritModifier(id) {
      const p = notationProjet();
      if (!p) return;
      const c = notationCriteres(p).find(function(x) { return x.id === id; });
      if (!c) return;
      notationEditCrit = (notationEditCrit === id) ? null : id;
      notationRendreGrille();
    }

    function notationCritAnnuler() {
      notationEditCrit = null;
      notationRendreGrille();
    }

    function notationCritValider(id) {
      const p = notationProjet();
      if (!p) return;
      const c = notationCriteres(p).find(function(x) { return x.id === id; });
      if (!c) return;
      const t = document.getElementById('editCritTexte');
      const p100 = document.getElementById('editCrit100');
      const p20 = document.getElementById('editCrit20');
      const nouveau = t ? t.value.trim() : '';
      if (!nouveau) { showToast('L\'intitulé du critère ne peut pas être vide', 'fas fa-exclamation-triangle', true); return; }
      const v100 = Math.max(0, Math.min(100, parseFloat(p100 ? p100.value : 0) || 0));
      const v20 = Math.max(0, Math.min(20, parseFloat(p20 ? p20.value : 0) || 0));
      c.texte = nouveau;
      c.key = null;
      c.p100 = v100;
      c.p20 = v20;
      notationEditCrit = null;
      notationRendreGrille();
      notationSauver();
      showToast('Critère modifié', 'fas fa-pen');
    }

    function notationCritAjouter() {
      const p = notationProjet();
      if (!p) { showToast('Sélectionnez d\'abord un projet', 'fas fa-exclamation-triangle', true); return; }
      const cr = notationCriteres(p);
      if (cr.length >= CRIT_MAX) { showToast('Maximum de ' + CRIT_MAX + ' critères', 'fas fa-exclamation-triangle', true); return; }
      const inp = document.getElementById('critInpTexte');
      const i100 = document.getElementById('critInp100');
      const i20 = document.getElementById('critInp20');
      const texte = inp ? inp.value.trim() : '';
      if (!texte) { showToast('Saisissez l\'intitulé du critère', 'fas fa-exclamation-triangle', true); if (inp) inp.focus(); return; }
      cr.push({
        id: 'cx' + Date.now() + '' + Math.floor(Math.random() * 100),
        texte: texte,
        p100: Math.max(0, Math.min(100, parseFloat(i100 ? i100.value : 0) || 0)),
        p20: Math.max(0, Math.min(20, parseFloat(i20 ? i20.value : 0) || 0))
      });
      if (inp) inp.value = '';
      notationRendreGrille();
      notationCalculer();
      notationSauver();
      showToast('Critère ajouté', 'fas fa-plus');
    }

    function notationCritSupprimer(id) {
      const p = notationProjet();
      if (!p) return;
      const cr = notationCriteres(p);
      const c = cr.find(function(x) { return x.id === id; });
      if (!c) return;
      const dico = notationDico();
      if (!confirm('Supprimer le critère « ' + notationLibelle(c, dico) + ' » ?')) return;
      p.criteres = cr.filter(function(x) { return x.id !== id; });
      if (p.notes) delete p.notes[id];
      notationEditCrit = null;
      notationRendreGrille();
      notationCalculer();
      notationSauver();
      showToast('Critère supprimé', 'fas fa-trash');
    }


    function notationProjet() {
      return ficheList.find(function(p) { return p.id === notationId; }) || null;
    }

    function notationRendreSelect() {
      const sel = document.getElementById('notationProjet');
      if (!sel) return;
      const courant = notationId;
      sel.innerHTML = '';
      if (!ficheList.length) {
        sel.innerHTML = '<option value="">—</option>';
        const e = document.getElementById('notationEmpty');
        if (e) e.style.display = '';
        notationId = null;
        notationRendreGrille();
        return;
      }
      const emp = document.getElementById('notationEmpty');
      if (emp) emp.style.display = 'none';
      let h = '';
      ficheList.forEach(function(p) {
        h += '<option value="' + p.id + '"' + (p.id === courant ? ' selected' : '') + '>' + ficheEch(p.nom || 'Sans nom') + '</option>';
      });
      sel.innerHTML = h;
      if (!ficheList.some(function(p) { return p.id === notationId; })) notationId = ficheList[0].id;
      sel.value = notationId;
    }

    function notationChanger(id) {
      notationId = id || null;
      notationRendreMembres();
      notationRendreGrille();
      notationCalculer();
    }

    function notationRendreMembres() {
      const g = document.getElementById('notationMembres');
      if (!g) return;
      const p = notationProjet();
      membreAssurer(p || { membres: [] });
      let h = '';
      for (let i = 0; i < MEMBRE_MAX; i++) {
        const m = (p && p.membres && p.membres[i]) || null;
        const nom = m ? mComplet(m) : '';
        h += '<div class="notif-ligne' + (nom ? '' : ' vide') + '">' +
             '<span class="ni-num">' + (i + 1) + '</span>' +
             '<span>' + (nom ? ficheEch(nom) : '<span data-lang-key="notation-membre-vide">— non renseigné —</span>') + '</span>' +
             '</div>';
      }
      g.innerHTML = h;
      if (typeof ficheAppliquerLang === 'function') ficheAppliquerLang();
    }

    function notationRendreGrille() {
      const body = document.getElementById('notationBody');
      const bareme = document.getElementById('baremeBody');
      if (!body) return;
      const p = notationProjet();
      const dico = notationDico();
      const cr = notationCriteres(p);
      const notes = (p && p.notes) || {};
      const selId = ficheSel && ficheSel.type === 'criteres' ? ficheSel.cle : null;
      let h = '';
      cr.forEach(function(c, idx) {
        const v = (notes[c.id] === undefined || notes[c.id] === null) ? '' : notes[c.id];
        const sel = selId === c.id ? ' selected' : '';
        h += '<tr class="' + sel.trim() + '" onclick="ficheSelectionner(\'criteres\',\'' + c.id + '\')">';
        h += '<td style="text-align:center;font-weight:800;">' + (idx + 1) + '</td>';
        if (notationEditCrit === c.id) {
          h += '<td><input type="text" class="edit-inp" id="editCritTexte" value="' + ficheEch(notationLibelle(c, dico)) + '"></td>' +
               '<td><input type="number" class="edit-inp center" id="editCrit100" min="0" max="100" step="1" value="' + c.p100 + '"></td>' +
               '<td><input type="number" class="edit-inp center" id="editCrit20" min="0" max="20" step="0.5" value="' + c.p20 + '"></td>';
        } else {
          h += '<td data-lang-key="' + (c.texte ? '' : c.id) + '">' + (c.texte ? ficheEch(c.texte) : '') + '</td>' +
               '<td>' + c.p100 + '</td><td>' + c.p20 + '</td>';
        }
        h += '<td><input type="number" class="note-inp" min="0" max="' + c.p20 + '" step="0.5" data-crit="' + c.id + '" value="' + v + '" oninput="notationCalculer()" onchange="notationSauver(false)"></td>';
        h += '<td><div class="member-actions" style="margin:0;">' +
             (notationEditCrit === c.id
               ? '<button class="btn btn-success" onclick="event.stopPropagation(); notationCritValider(\'' + c.id + '\')"><i class="fas fa-check"></i> <span data-lang-key="b-valider">Valider</span></button>' +
                 '<button class="btn btn-secondary" onclick="event.stopPropagation(); notationCritAnnuler()"><i class="fas fa-xmark"></i> <span data-lang-key="b-annuler">Annuler</span></button>'
               : '<button class="btn btn-accent" onclick="event.stopPropagation(); notationCritModifier(\'' + c.id + '\')"><i class="fas fa-pen"></i> <span data-lang-key="b-modifier">Modifier</span></button>' +
                 '<button class="btn btn-danger" onclick="event.stopPropagation(); notationCritSupprimer(\'' + c.id + '\')"><i class="fas fa-trash"></i> <span data-lang-key="b-supprimer">Supprimer</span></button>') +
             '</div></td></tr>';
      });
      body.innerHTML = h;

      const f100 = cr.reduce(function(a, c) { return a + (c.p100 || 0); }, 0);
      const f20 = cr.reduce(function(a, c) { return a + (c.p20 || 0); }, 0);
      const elF100 = document.getElementById('notifFoot100');
      const elF20 = document.getElementById('notifFoot20');
      if (elF100) elF100.textContent = f100;
      if (elF20) elF20.textContent = f20;

      if (bareme) {
        let b = '';
        NOTATION_BAREME.forEach(function(l, i) {
          b += '<tr class="appr" id="baremeRow' + i + '" data-niveau="' + l.niv + '" data-min="' + l.min20 + '">' +
               '<td>' + l.aff20 + '</td><td>' + l.aff100 + '</td>' +
               '<td><span class="appr-pill" data-lang-key="' + l.app + '"></span></td>' +
               '<td class="bareme-note">—</td></tr>';
        });
        bareme.innerHTML = b;
      }
      const lg = document.getElementById('baremeLegend');
      if (lg) {
        const d = notationDico();
        lg.innerHTML = NOTATION_BAREME.map(function(l) {
          return '<span class="lg" data-niveau="' + l.niv + '"><i style="background:' +
            ['#047857', '#0d9488', '#0369a1', '#4f46e5', '#b45309', '#b91c1c'][l.niv] + '"></i>' +
            ficheEch(d[l.app] || l.app) + '</span>';
        }).join('<span style="opacity:.4">|</span>') +
        '<span class="lg" style="margin-left:.4rem;"><i class="fas fa-check" style="width:auto;height:auto;color:var(--primary);background:none !important;"></i> <span data-lang-key="bareme-legende">' + 'niveau atteint par la note</span></span>';
      }
      if (typeof ficheAppliquerLang === 'function') ficheAppliquerLang();
      notationRendreEnTete();
      notationRendreFinal();
    }

    function notationLire() {
      const out = {};
      document.querySelectorAll('#notationBody .note-inp').forEach(function(inp) {
        const v = inp.value.trim();
        if (v !== '') out[inp.dataset.crit] = Math.max(0, Math.min(20, parseFloat(v) || 0));
      });
      return out;
    }

    function notationAppreciation(total) {
      for (let i = 0; i < NOTATION_BAREME.length; i++) {
        const l = NOTATION_BAREME[i];
        if (l.min20 === -1) return l.app;
        if (total >= l.min20) return l.app;
      }
      return 'app6';
    }

    function notationNiveau(total) {
      for (let i = 0; i < NOTATION_BAREME.length; i++) {
        const l = NOTATION_BAREME[i];
        if (l.min20 === -1) return i;
        if (total >= l.min20) return i;
      }
      return NOTATION_BAREME.length - 1;
    }

    // Met en évidence automatiquement la ligne du barème correspondant à la note
    // et y rattache chaque stagiaire selon sa note finale
    function notationBareme(t20, t100, actif) {
      const rows = document.querySelectorAll('#baremeBody tr');
      if (!rows.length) return;
      const p = notationProjet();
      const stags = notationStagiaires();
      const chips = {};
      if (p && p.final) {
        stags.forEach(function(s) {
          const f = p.final.notes[s.index];
          if (!f) return;
          const niv = notationNiveau(f.n20);
          (chips[niv] = chips[niv] || []).push('<span class="stag-chip" title="' + ficheEch(s.nom) + '">' + ficheEch(s.nom.split(' ').slice(-1)[0] || s.nom) + ' : ' + f.n20 + '</span>');
        });
      }
      rows.forEach(function(r, i) {
        r.classList.remove('actif', 'actif-stag');
        const c = r.querySelector('.bareme-note');
        let html = (actif && i === notationNiveau(t20))
          ? '<b>' + t20 + ' / 20</b> <i class="fas fa-arrow-right"></i> <b>' + t100 + ' / 100</b>' : '—';
        if (chips[i]) html += '<div class="stag-chips">' + chips[i].join('') + '</div>';
        if (c) c.innerHTML = html;
        if (chips[i]) r.classList.add('actif-stag');
      });
      if (actif) {
        const row = rows[notationNiveau(t20)];
        if (row) row.classList.add('actif');
      }
    }

    // Borne la note /100 dans la plage du bareme correspondant a la note /20
    // (le bareme du modele est en /100 entier : 50-59, 60-69, 70-79, 80-89, 90-100)
    function notationPlafond100(t20, t100) {
      const i = notationNiveau(t20);
      const l = NOTATION_BAREME[i];
      if (!l) return t100;
      let v = Math.max(0, Math.min(100, Math.floor(t100 * 10) / 10));
      if (l.min100 >= 0) v = Math.max(v, l.min100);
      const haut = NOTATION_BAREME[i - 1];
      if (haut && haut.min100 >= 0) v = Math.min(v, haut.min100 - 1);
      return Math.round(v * 10) / 10;
    }

    function notationCalculer() {
      const p = notationProjet();
      const cr = notationCriteres(p);
      const notes = notationLire();
      let t20 = 0, t100 = 0;
      cr.forEach(function(c) {
        const v = notes[c.id] || 0;
        t20 += v;
        if (c.p20 > 0) t100 += (v / c.p20) * c.p100;
      });
      t20 = Math.round(t20 * 100) / 100;
      t100 = notationPlafond100(t20, Math.round(t100 * 10) / 10);
      const el20 = document.getElementById('notifTotal20');
      const el100 = document.getElementById('notifTotal100');
      const elApp = document.getElementById('notifApp');
      const elFoot = document.getElementById('notifFoot20');
      const elFootN = document.getElementById('notifFootNote');
      const vide = !Object.keys(notes).length;
      if (el20) el20.textContent = vide ? '—' : t20 + ' / 20';
      if (el100) el100.textContent = vide ? '—' : t100 + ' / 100';
      if (elFoot) elFoot.textContent = Math.round(cr.reduce(function(a, c) { return a + (c.p20 || 0); }, 0) * 100) / 100;
      if (elFootN) elFootN.textContent = vide ? '—' : t20;
      if (elApp) {
        const key = notationAppreciation(t20);
        elApp.textContent = notationDico()[key] || key;
      }
      notationBareme(t20, t100, !vide);
      return { t20: t20, t100: t100 };
    }

    function notationSauver(silent) {
      const p = notationProjet();
      if (!p) { if (!silent) showToast('Sélectionnez d\'abord un projet', 'fas fa-exclamation-triangle', true); return; }
      p.notes = notationLire();
      try {
        localStorage.setItem(FICHES_KEY, JSON.stringify(ficheList));
        archiverProjet(p);
        if (!silent) showToast('Notation enregistrée : ' + (notationCalculer().t20) + ' / 20', 'fas fa-save');
      } catch (e) {
        showToast('Sauvegarde impossible (stockage saturé)', 'fas fa-exclamation-triangle', true);
      }
    }

    // ================= FINALISATION & NOTES FINALES =================
    function notationStagiaires() {
      const p = notationProjet();
      if (!p) return [];
      membreAssurer(p);
      const out = [];
      p.membres.forEach(function(m, i) { if (membreRempli(m)) out.push({ index: i, nom: mComplet(m) }); });
      return out;
    }

    function notationFinaliser() {
      const p = notationProjet();
      if (!p) { showToast('Sélectionnez d\'abord un projet', 'fas fa-exclamation-triangle', true); return; }
      const stags = notationStagiaires();
      if (!stags.length) { showToast('Ajoutez au moins un stagiaire dans la page « Fiche Projet »', 'fas fa-exclamation-triangle', true); return; }
      const notes = notationLire();
      const manquants = notationCriteres(p).filter(function(c) { return notes[c.id] === undefined; }).length;
      if (manquants && !confirm(manquants + ' critère(s) sans note. Finaliser le projet quand même ?')) return;
      const t = notationCalculer();
      const now = new Date();
      const final = {
        date: now.toLocaleDateString('fr-FR') + ' à ' + now.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' }),
        ts: now.getTime(),
        total20: t.t20,
        total100: t.t100,
        app: notationAppreciation(t.t20),
        notes: {}
      };
      stags.forEach(function(s) { final.notes[s.index] = { n20: t.t20, n100: t.t100, niveau: notationNiveau(t.t20), app: notationAppreciation(t.t20) }; });
      p.final = final;
      localStorage.setItem(FICHES_KEY, JSON.stringify(ficheList));
      archiverProjet(p);
      notationRendreFinal();
      ficheRendreProjets();
      showToast('Projet finalisé — notes finales enregistrées', 'fas fa-flag-checkered');
    }

    function notationAnnulerFinal() {
      const p = notationProjet();
      if (!p || !p.final) return;
      if (!confirm('Annuler la finalisation du projet ? Les notes finales seront effacées.')) return;
      delete p.final;
      localStorage.setItem(FICHES_KEY, JSON.stringify(ficheList));
      notationRendreFinal();
      ficheRendreProjets();
      showToast('Finalisation annulée', 'fas fa-rotate-left');
    }

    function notationFinalNote(index) {
      const p = notationProjet();
      if (!p || !p.final) return;
      const f = p.final.notes[index] || { n20: 0 };
      const inp = document.getElementById('finalInp' + index);
      let v = inp ? parseFloat(inp.value) : f.n20;
      if (isNaN(v)) v = 0;
      v = Math.max(0, Math.min(20, Math.round(v * 100) / 100));
      f.n20 = v;
      f.n100 = notationPlafond100(v, (v / 20) * 100);
      f.niveau = notationNiveau(v);
      f.app = notationAppreciation(v);
      p.final.notes[index] = f;
      p.final.ts = Date.now();
      p.final.date = new Date().toLocaleDateString('fr-FR') + ' à ' + new Date().toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' });
      localStorage.setItem(FICHES_KEY, JSON.stringify(ficheList));
      archiverProjet(p);
      notationRendreFinal();
      showToast('Note finale du stagiaire enregistrée', 'fas fa-save');
    }

    const NOTATION_CANAUX = {
      whatsapp:  { ic: 'fab fa-whatsapp', lbl: 'WhatsApp',  couleur: '#25d366' },
      telegram: { ic: 'fab fa-telegram', lbl: 'Telegram', couleur: '#229ed9' },
      messenger:{ ic: 'fab fa-facebook-messenger', lbl: 'Messenger', couleur: '#0084ff' },
      sms:      { ic: 'fas fa-comment-sms', lbl: 'SMS',   couleur: '#6b7280' }
    };

    function notationFinalTel(index) {
      const p = notationProjet();
      if (!p || !p.final) return;
      const inp = document.getElementById('finalTel' + index);
      if (!p.final.phones) p.final.phones = {};
      p.final.phones[index] = inp ? inp.value.trim() : '';
      try {
        localStorage.setItem(FICHES_KEY, JSON.stringify(ficheList));
        archiverProjet(p);
        showToast('Téléphone enregistré', 'fas fa-phone');
      } catch (e) {
        showToast('Erreur de sauvegarde', 'fas fa-triangle-exclamation', true);
      }
    }

    function notationTelPropre(tel) {
      let t = String(tel || '').replace(/[^\d+]/g, '');
      if (t.charAt(0) === '+') t = '+' + t.slice(1).replace(/\D/g, '');
      else if (t.charAt(0) === '0') t = '+213' + t.slice(1);
      return t;
    }

    function notationMsgFinal(index) {
      const p = notationProjet();
      const stags = notationStagiaires();
      const s = stags.filter(function(x) { return x.index === index; })[0];
      const f = p && p.final ? (p.final.notes[index] || null) : null;
      if (!s || !f) return '';
      const dico = notationDico();
      return 'INSFP EL HIDHAB — Projet : ' + (p.nom || '') + '\n' +
        'Stagiaire : ' + s.nom + '\n' +
        'Note finale : ' + f.n20 + ' / 20  (' + f.n100 + ' / 100)\n' +
        'Appréciation : ' + (dico[f.app] || f.app);
    }

    function notationLien(canal, tel, msg) {
      const t = notationTelPropre(tel);
      if (canal === 'whatsapp') return 'https://wa.me/' + encodeURIComponent(t) + '?text=' + encodeURIComponent(msg);
      if (canal === 'messenger') return 'https://m.me/' + encodeURIComponent(t) + '?text=' + encodeURIComponent(msg);
      if (canal === 'telegram') return 'https://t.me/share/url?url=&text=' + encodeURIComponent(msg);
      return 'sms:' + (t ? t : '') + '?body=' + encodeURIComponent(msg);
    }

    function notationBoutonsEnvoi(index) {
      let h = '';
      Object.keys(NOTATION_CANAUX).forEach(function(c) {
        const k = NOTATION_CANAUX[c];
        h += '<button type="button" class="send-btn" data-canal="' + c + '" title="' + k.lbl + '" ' +
             'onclick="notationEnvoyer(' + index + ',\'' + c + '\')">' +
             '<i class="' + k.ic + '"></i></button>';
      });
      return '<div class="send-btns">' + h + '</div>';
    }

    function notationEnvoyer(index, canal) {
      const p = notationProjet();
      if (!p || !p.final) return;
      if (!p.final.phones) p.final.phones = {};
      let tel = p.final.phones[index] || '';
      if (canal !== 'telegram' && !notationTelPropre(tel)) {
        const r = prompt('Numéro de téléphone du stagiaire (ex : 0555 12 34 56) :', tel);
        if (r === null) return;
        tel = r.trim();
        p.final.phones[index] = tel;
        const inp = document.getElementById('finalTel' + index);
        if (inp) inp.value = tel;
        try { localStorage.setItem(FICHES_KEY, JSON.stringify(ficheList)); } catch (e) {}
      }
      if (canal !== 'telegram' && !notationTelPropre(tel)) {
        showToast('Numéro de téléphone manquant', 'fas fa-triangle-exclamation', true);
        return;
      }
      window.open(notationLien(canal, tel, notationMsgFinal(index)), '_blank');
    }

    // Envoi automatique : ouvre le message pre-rempli pour chaque stagiaire d'un coup
    function notationEnvoyerTous(canal) {
      const p = notationProjet();
      if (!p || !p.final) { showToast('Projet non finalisé', 'fas fa-triangle-exclamation', true); return; }
      const stags = notationStagiaires();
      if (!stags.length) return;
      if (!p.final.phones) p.final.phones = {};
      let manquants = 0, envoyes = 0;
      stags.forEach(function(s) {
        const tel = p.final.phones[s.index] || '';
        if (canal !== 'telegram' && !notationTelPropre(tel)) { manquants++; return; }
        window.open(notationLien(canal, tel, notationMsgFinal(s.index)), '_blank');
        envyes++;
      });
      showToast(envyes + ' message(s) ouvert(s) sur ' + NOTATION_CANAUX[canal].lbl + (manquants ? ' — ' + manquants + ' sans téléphone' : ''), 'fas fa-paper-plane');
    }

    // ===== EXPORT DU PROJET EN ZIP (HTML + CSS + JS + licence) =====
    const ZIP_LICENCE = [
      "LICENCE D'UTILISATION",
      "Les Projets des Stagiaires - INSFP El Hidhab 2026",
      "(c) 2026 Professeur Douadi Nabil - INSFP El Hidhab, Setif, Algerie. Tous droits reserves.",
      "",
      "1. OBJET",
      "La presente licence regit l'utilisation du Logiciel, incluant son code source",
      "HTML, CSS et JavaScript, ses interfaces et sa documentation.",
      "",
      "2. PROPRIETE",
      "Le Logiciel est une oeuvre originale creee par le Professeur Douadi Nabil, qui en",
      "conserve l'integralite des droits patrimoniaux et moraux (ordonnance n 03-05",
      "du 19 juillet 2003, Algerie).",
      "",
      "3. DROITS ACCORDES",
      "Droit d'usage personnel et/ou institutionnel, non exclusif, non transférable,",
      "limite a la gestion des stagiaires, des presences et de la messagerie interne",
      "de l'etablissement destinataire, sans droit de sous-licence.",
      "",
      "4. INTERDICTIONS",
      "Sans autorisation ecrite prealable de l'auteur, il est strictement interdit de :",
      "copier, reproduire ou dupliquer le Logiciel ; modifier, decompiler ou tenter",
      "d'extraire le code source ; distribuer, revendre, louer ou ceder le Logiciel ;",
      "retirer ou alterer les mentions de copyright ; utiliser le Logiciel dans un",
      "autre projet, commercial ou non.",
      "",
      "5. ABSENCE DE GARANTIE",
      "Le Logiciel est fourni tel quel, sans garantie d'aucune sorte.",
      "",
      "6. DUREE ET RESILIATION",
      "La licence prend effet des l'utilisation et peut etre resiliee de plein droit",
      "en cas de non-respect des conditions ci-dessus.",
      "",
      "7. DROIT APPLICABLE",
      "Droit algerien. Tout litige releve de la competence des juridictions algeriennes.",
      "",
      "CONTACT",
      "Professeur Douadi Nabil - INSFP El Hidhab, Setif",
      "Salutation82nobl@gmail.com - Tel. : +213 774 89 20 34 / +213 659 97 87 55",
      "",
      "(c) 2026 Professeur Douadi Nabil - Tous droits reserves."
    ].join('\n');

    const ZIP_CRC = (function() {
      const t = new Uint32Array(256);
      for (let n = 0; n < 256; n++) {
        let c = n;
        for (let k = 0; k < 8; k++) c = (c & 1) ? (0xEDB88320 ^ (c >>> 1)) : (c >>> 1);
        t[n] = c >>> 0;
      }
      return t;
    })();

    function zipCrc32(buf) {
      let c = 0xFFFFFFFF;
      for (let i = 0; i < buf.length; i++) c = ZIP_CRC[(c ^ buf[i]) & 0xFF] ^ (c >>> 8);
      return (c ^ 0xFFFFFFFF) >>> 0;
    }

    // Cree une archive ZIP (methode "stored", compatible tous navigateurs)
    function zipCreer(entrees) {
      const enc = new TextEncoder();
      const morceaux = [], central = [];
      let offset = 0;
      entrees.forEach(function(e) {
        const nom = enc.encode(e.nom);
        const data = e.data;
        const crc = zipCrc32(data);
        const lf = new Uint8Array(30 + nom.length);
        const dv = new DataView(lf.buffer);
        dv.setUint32(0, 0x04034B50, true);
        dv.setUint16(4, 20, true);
        dv.setUint16(6, 0x0800, true);
        dv.setUint16(8, 0, true);
        dv.setUint16(10, 0, true);
        dv.setUint16(12, 0x2821, true);
        dv.setUint32(14, crc, true);
        dv.setUint32(18, data.length, true);
        dv.setUint32(22, data.length, true);
        dv.setUint16(26, nom.length, true);
        lf.set(nom, 30);
        morceaux.push(lf, data);

        const cd = new Uint8Array(46 + nom.length);
        const cv = new DataView(cd.buffer);
        cv.setUint32(0, 0x02014B50, true);
        cv.setUint16(4, 20, true);
        cv.setUint16(6, 20, true);
        cv.setUint16(8, 0x0800, true);
        cv.setUint16(10, 0, true);
        cv.setUint16(12, 0, true);
        cv.setUint16(14, 0x2821, true);
        cv.setUint32(16, crc, true);
        cv.setUint32(20, data.length, true);
        cv.setUint32(24, data.length, true);
        cv.setUint16(28, nom.length, true);
        cv.setUint32(42, offset, true);
        cd.set(nom, 46);
        central.push(cd);
        offset += lf.length + data.length;
      });
      const tailleCentral = central.reduce(function(a, b) { return a + b.length; }, 0);
      const fin = new Uint8Array(22);
      const ev = new DataView(fin.buffer);
      ev.setUint32(0, 0x06054B50, true);
      ev.setUint16(8, entrees.length, true);
      ev.setUint16(10, entrees.length, true);
      ev.setUint32(12, tailleCentral, true);
      ev.setUint32(16, offset, true);
      return new Blob(morceaux.concat(central, [fin]), { type: 'application/zip' });
    }

    function zipTexte(txt) { return new TextEncoder().encode(txt); }

    // Reconstitue un HTML propre (sans CSS ni JS integres) pour le ZIP
    function zipHtmlSource() {
      const clone = document.documentElement.cloneNode(true);
      // 1. Retire les elements generes a l'execution
      const fps = clone.querySelector('#fichePageStyle');
      if (fps && fps.parentNode) fps.parentNode.removeChild(fps);
      const wm = clone.querySelector('#wmProtec');
      if (wm) wm.innerHTML = '';
      ['#projGrid', '#archBody', '#baremeBody', '#finalBody', '#toastContainer', '#galerie', '#ficheBlocks']
        .forEach(function(sel) {
          const el = clone.querySelector(sel);
          if (el) el.innerHTML = '';
        });
      const corps = clone.querySelector('body');
      if (corps) corps.className = 'locked show-accueil';
      // 2. Externalise le CSS vers style.css
      clone.querySelectorAll('style').forEach(function(s) {
        const l = document.createElement('link');
        l.rel = 'stylesheet';
        l.href = 'style.css';
        s.parentNode.replaceChild(l, s);
      });
      // 3. Externalise uniquement le JS integre (conserve les scripts externes comme pdf.js)
      clone.querySelectorAll('script:not([src])').forEach(function(s) {
        const ext = document.createElement('script');
        ext.src = 'script.js';
        s.parentNode.replaceChild(ext, s);
      });
      return '<!DOCTYPE html>\n' + clone.outerHTML + '\n';
    }

    function projetTelechargerZip() {
      try {
        const base = (document.getElementById('setTitle') && document.getElementById('setTitle').value.trim()) || 'Les Projets des Stagiaires';
        const nomHtml = base + '.html';
        const css = Array.prototype.map.call(document.querySelectorAll('style'), function(s) { return s.textContent; }).join('\n\n');
        const js = Array.prototype.map.call(document.querySelectorAll('script:not([src])'), function(s) { return s.textContent; }).join('\n\n');
        const blob = zipCreer([
          { nom: nomHtml, data: zipTexte(zipHtmlSource()) },
          { nom: 'style.css', data: zipTexte(css) },
          { nom: 'script.js', data: zipTexte(js) },
          { nom: 'LICENCE.txt', data: zipTexte(ZIP_LICENCE) },
          { nom: 'LISEZ-MOI.txt', data: zipTexte(
              base + ' - INSTALLATION\n\n' +
              '1. Decompressez le dossier ZIP.\n' +
              '2. Double-cliquez sur "' + nomHtml + '" pour ouvrir l\'application.\n' +
              '3. Identifiants professeur (administrateur) : nom d\'utilisateur et mot de passe du professeur (aucun code en clair dans les fichiers)\n\n' +
              'Fichiers :\n' +
              '- ' + nomHtml + ' : structure de la page\n' +
              '- style.css : design (couleurs, mise en page)\n' +
              '- script.js : logique de l\'application\n' +
              '- LICENCE.txt : licence d\'utilisation (propriete exclusive)\n' +
              '- LISEZ-MOI.txt : ce fichier\n\n' +
              '(c) 2026 Professeur Douadi Nabil - INSFP El Hidhab, Setif.\n'
            ) }
        ]);
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = base + ' (code source).zip';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        setTimeout(function() { URL.revokeObjectURL(url); }, 4000);
        showToast('ZIP téléchargé : ' + base + '.html + style.css + script.js', 'fas fa-file-archive');
      } catch (e) {
        showToast('Export impossible : ' + e.message, 'fas fa-triangle-exclamation', true);
      }
    }

    const NOTATION_NIV_COULEURS = ['#047857', '#0d9488', '#0369a1', '#4f46e5', '#b45309', '#b91c1c'];

    // Histogramme de repartition des niveaux (utilise en Notation et en Archive)
    function repartitionHTML(cpt, total, videKey) {
      const d = notationDico();
      let h = '';
      if (!total) {
        return '<p class="gest-empty" style="margin:0;"><span data-lang-key="' + videKey + '">Aucune note finale enregistree.</span></p>';
      }
      h += '<div class="repart-bars">';
      NOTATION_BAREME.forEach(function(l, i) {
        const n = cpt[i] || 0;
        const pct = Math.round(n / total * 100);
        h += '<div class="repart-lig' + (n ? '' : ' vide') + '" data-niveau="' + i + '">' +
          '<span class="repart-lbl">' + ficheEch(d[l.app] || l.app) + '</span>' +
          '<span class="repart-bar"><i style="width:' + pct + '%"></i></span>' +
          '<span class="repart-val">' + n + ' · ' + pct + '%</span></div>';
      });
      return h + '</div>';
    }

    // Niveau d'un projet (finalise = moyenne des notes finales, sinon grille)
    function notationNiveauProjet(p) {
      if (!p) return null;
      let t = null;
      if (p.final && p.final.notes) {
        const vals = Object.keys(p.final.notes).map(function(k) { return p.final.notes[k].n20; })
          .filter(function(v) { return typeof v === 'number'; });
        if (vals.length) t = vals.reduce(function(a, b) { return a + b; }, 0) / vals.length;
      } else if (p.notes && p.criteres && Object.keys(p.notes).length) {
        let s = 0;
        p.criteres.forEach(function(c) { s += p.notes[c.id] || 0; });
        t = s;
      }
      if (t === null) return null;
      return { total: Math.round(t * 100) / 100, niv: notationNiveau(t) };
    }

    function notationRepartition() {
      const el = document.getElementById('notationRepart');
      if (!el) return;
      const p = notationProjet();
      const stags = notationStagiaires();
      const cpt = [0, 0, 0, 0, 0, 0];
      let notes = 0;
      stags.forEach(function(s) {
        const f = p && p.final ? p.final.notes[s.index] : null;
        if (!f) return;
        cpt[notationNiveau(f.n20)]++;
        notes++;
      });
      el.innerHTML = '<h3><i class="fas fa-chart-simple"></i> <span data-lang-key="repart-h">Repartition des niveaux</span></h3>' +
        repartitionHTML(cpt, notes, 'repart-vide');
    }

    function archRepartition() {
      const el = document.getElementById('archRepart');
      if (!el) return;
      const cpt = [0, 0, 0, 0, 0, 0];
      let notes = 0;
      archiveList.forEach(function(a) {
        const c = a.contenu;
        if (!c || !c.final || !c.final.notes) return;
        Object.keys(c.final.notes).forEach(function(k) {
          const f = c.final.notes[k];
          if (f && typeof f.n20 === 'number') { cpt[notationNiveau(f.n20)]++; notes++; }
        });
      });
      el.innerHTML = '<h3><i class="fas fa-chart-simple"></i> <span data-lang-key="repart-h">Repartition des niveaux</span></h3>' +
        repartitionHTML(cpt, notes, 'repart-vide-arch');
    }

    function notationRendreFinal() {
      const body = document.getElementById('finalBody');
      if (!body) return;
      const p = notationProjet();
      const stags = notationStagiaires();
      const badge = document.getElementById('finalBadge');
      const btnF = document.getElementById('btnFinaliser');
      const btnA = document.getElementById('btnAnnulerFinal');
      const vide = document.getElementById('finalVide');
      const att = document.getElementById('finalPending');
      const final = (p && p.final) ? p.final : null;
      const dico = notationDico();

      if (btnF) btnF.style.display = final ? 'none' : '';
      if (btnA) btnA.style.display = final ? '' : 'none';
      if (badge) badge.style.display = final ? '' : 'none';
      const sendAll = document.getElementById('sendAll');
      if (sendAll) sendAll.style.display = final ? '' : 'none';
      if (final) {
        const fd = document.getElementById('finalDate');
        const ft = document.getElementById('finalTotal');
        if (fd) fd.textContent = final.date;
        if (ft) ft.textContent = final.total20 + ' / 20  •  ' + final.total100 + ' / 100  •  ' + (dico[final.app] || final.app);
      }
      if (vide) vide.style.display = stags.length ? 'none' : '';
      if (att) att.style.display = (stags.length && !final) ? '' : 'none';

      let h = '';
      stags.forEach(function(s, i) {
        const f = final ? (final.notes[s.index] || null) : null;
        const n20 = f ? f.n20 : null;
        const n100 = f ? (f.n100 !== undefined ? f.n100 : notationPlafond100(n20, (n20 / 20) * 100)) : null;
        const app = f ? f.app : null;
        h += '<tr class="' + (final ? 'est-finalise' : '') + '" data-niveau="' + (f ? notationNiveau(n20) : '') + '">' +
          '<td style="text-align:center;font-weight:800;">' + (i + 1) + '</td>' +
          '<td><i class="fas fa-user-graduate" style="color:var(--primary);margin-right:.35rem;"></i>' + ficheEch(s.nom) + '</td>' +
          '<td>' + (final
            ? '<input type="number" class="final-inp" id="finalInp' + s.index + '" min="0" max="20" step="0.5" value="' + n20 + '" onchange="notationFinalNote(' + s.index + ')">'
            : '<span style="color:var(--text-muted);">—</span>') + '</td>' +
          '<td><b>' + (n100 === null ? '—' : n100) + '</b></td>' +
          '<td class="final-app">' + (app ? ficheEch(dico[app] || app) : '—') + '</td>' +
          '<td><input type="tel" class="final-tel-inp" id="finalTel' + s.index + '" placeholder="+213…" value="' + ficheEch(final && final.phones ? (final.phones[s.index] || '') : '') + '" onchange="notationFinalTel(' + s.index + ')"></td>' +
          '<td class="final-send-cell">' + (final ? notationBoutonsEnvoi(s.index) : '<span style="color:var(--text-muted);font-size:.8rem;">—</span>') + '</td>' +
        '</tr>';
      });
      body.innerHTML = h;
      notationRepartition();
      const tb = notationCalculer();
      notationBareme(tb.t20, tb.t100, Object.keys(notationLire()).length > 0);
    }

    function notationRendreEnTete() {
      const p = notationProjet();
      remplirEnTeteOfficiel(document.getElementById('notationPrintHead'),
        'Notation — ' + (p ? (p.nom || 'Projet') : 'Projet'));
    }

    function notationOuvrir() {
      if (estStagiaire()) { showToast('Accès réservé à l\'administrateur', 'fas fa-lock', true); return; }
      notationRendreSelect();
      notationRendreMembres();
      notationRendreGrille();
      notationCalculer();
      notationRendreFinal();
    }

    function ficheAppliquerLang() {
      let lang = 'fr';
      try { lang = localStorage.getItem(LANG_KEY) || 'fr'; } catch (e) {}
      const dict = langDico(lang);
      document.querySelectorAll('#photosGrid [data-lang-key]').forEach(function(el) {
        const k = el.getAttribute('data-lang-key');
        if (k && dict[k] !== undefined) el.innerHTML = dict[k];
      });
      const ph = document.getElementById('critInpTexte');
      if (ph && dict['crit-ph'] !== undefined) ph.placeholder = dict['crit-ph'];
      if (dict['membre-ph'] !== undefined) window.__membrePh = dict['membre-ph'];
    }

    function ficheSelProchainePhoto() {
      const p = ficheCourant();
      if (!p) return -1;
      const ph = p.photos || [];
      if (ph.length < PHOTO_MAX) return ph.length;
      for (let i = 0; i < PHOTO_MAX; i++) if (!ph[i]) return i;
      return -1;
    }

    function ficheRendrePhotos() {
      const g = document.getElementById('photosGrid');
      if (!g) return;
      const p = ficheCourant();
      if (!p) { g.innerHTML = ''; return; }
      const ph = p.photos || [];
      let h = '';
      for (let i = 0; i < PHOTO_MAX; i++) {
        const src = ph[i] || '';
        h += '<div class="photo-slot' + (src ? ' rempli' : '') + '"' + (ficheSelPhoto === i ? ' style="border-color:var(--accent)"' : '') + '>';
        h += '<span class="ph-n">' + (i + 1) + '</span>';
        if (src) h += '<img src="' + src + '" alt="Photo ' + (i + 1) + '" onclick="fichePhotoAgrandir(' + i + ')">';
        else h += '<i class="fas fa-camera photo-ic"></i><small style="font-size:.66rem;color:var(--text-muted)">Photo ' + (i + 1) + '</small>';
        h += '<div class="ph-tools">' +
             '<button class="btn btn-accent" onclick="fichePhotoModifier(' + i + ')" title="Modifier"><i class="fas fa-pen"></i> <span data-lang-key="b-modifier">Modifier</span></button>' +
             (src ? '<button class="btn btn-danger" onclick="fichePhotoSupprimer(' + i + ')" title="Supprimer"><i class="fas fa-trash"></i> <span data-lang-key="b-supprimer">Supprimer</span></button>' : '') +
             '</div></div>';
      }
      g.innerHTML = h;
      if (typeof ficheAppliquerLang === 'function') ficheAppliquerLang();
    }

    function fichePhotoCible(i) {
      const p = ficheCourant();
      if (!p) { showToast('Créez ou sélectionnez d\'abord un projet', 'fas fa-exclamation-triangle', true); return -1; }
      if (i === undefined || i === null) {
        const s = ficheSelPhoto;
        i = (s !== null && s !== undefined && (p.photos || [])[s]) ? s : ficheSelProchainePhoto();
        if (i < 0) { showToast('Les ' + PHOTO_MAX + ' emplacements sont occupés — cliquez sur une photo pour la remplacer', 'fas fa-exclamation-triangle', true); return -1; }
      }
      ficheSelPhoto = i;
      document.getElementById('fichePhotoInput').click();
      return i;
    }

    function fichePhotoAjouter() { if (fichePhotoCible(null) >= 0) showToast('Choisissez la photo (format image)', 'fas fa-image'); }
    function fichePhotoModifier(i) { if (fichePhotoCible(i) >= 0) showToast('Remplacez la photo sélectionnée', 'fas fa-pen'); }

    function fichePhotoSupprimer(i) {
      const p = ficheCourant();
      if (!p) { showToast('Créez ou sélectionnez d\'abord un projet', 'fas fa-exclamation-triangle', true); return; }
      if (i === undefined || i === null) i = ficheSelPhoto;
      if (i === null || i === undefined || !(p.photos || [])[i]) { showToast('Sélectionnez d\'abord une photo à supprimer', 'fas fa-exclamation-triangle', true); return; }
      if (!confirm('Supprimer la photo ' + (i + 1) + ' ?')) return;
      p.photos[i] = '';
      ficheSelPhoto = null;
      ficheRendrePhotos();
      ficheSauvegarder();
      showToast('Photo ' + (i + 1) + ' supprimée', 'fas fa-trash');
    }

    function fichePhotoFichier(input) {
      const f = input.files && input.files[0];
      input.value = '';
      if (!f) return;
      const p = ficheCourant();
      const i = ficheSelPhoto;
      if (!p || i === null || i === undefined) return;
      if (!f.type.match(/^image\//)) { showToast('Choisissez un fichier image', 'fas fa-exclamation-triangle', true); return; }
      if (f.size > 6 * 1024 * 1024) { showToast('Image trop lourde (max 6 Mo)', 'fas fa-exclamation-triangle', true); return; }
      compresserImage(f, 340, .7, function(data) {
        if (!p.photos) p.photos = [];
        p.photos[i] = data;
        ficheRendrePhotos();
        ficheSauvegarder();
        showToast('Photo ' + (i + 1) + ' enregistrée', 'fas fa-check');
      });
    }

    function fichePhotoAgrandir(i) {
      const p = ficheCourant();
      const src = p && (p.photos || [])[i];
      if (!src) return;
      ficheSelPhoto = i;
      const w = window.open('', '_blank');
      if (!w) { showToast('Autorisez les fenêtres pop-up pour agrandir la photo', 'fas fa-exclamation-triangle', true); return; }
      w.document.write('<!DOCTYPE html><html><head><meta charset="utf-8"><title>Photo ' + (i + 1) + ' - ' + ficheEch(p.nom || 'Projet') + '</title>' +
        '<style>body{margin:0;background:#0f172a;display:flex;align-items:center;justify-content:center;height:100vh}img{max-width:96vw;max-height:96vh;object-fit:contain}</style>' +
        '</head><body><img src="' + src + '" alt=""></body></html>');
      w.document.close();
    }

    function projSupprimerId(id) {
      const p = ficheList.find(function(x) { return x.id === id; });
      if (!p) return;
      if (!confirm('Supprimer la fiche projet « ' + p.nom + ' » et tout son contenu ?')) return;
      ficheList = ficheList.filter(function(x) { return x.id !== id; });
      if (ficheId === id) { ficheId = ficheList.length ? ficheList[0].id : null; ficheSel = null; ficheSelPhoto = null; }
      try { localStorage.setItem(FICHES_KEY, JSON.stringify(ficheList)); } catch (e) {}
      ficheToutRendre();
      showToast('Fiche projet supprimée', 'fas fa-trash');
    }

    // ---- 2. Membres du projet (1 à 5) ----
    function ficheRendreMembres() {
      const grid = document.getElementById('memberGrid');
      grid.innerHTML = '';
      const p = ficheCourant();
      for (let i = 0; i < MEMBRE_MAX; i++) {
        const m = (p && p.membres && p.membres[i]) || null;
        const slot = document.createElement('div');
        slot.className = 'member-slot' + (membreRempli(m) ? ' filled' : '') +
          (ficheSel && ficheSel.type === 'membres' && ficheSel.cle === i ? ' selected' : '');
        slot.style.animationDelay = (i * 60) + 'ms';
        slot.setAttribute('onclick', 'ficheSelectionner(\'membres\',' + i + ')');
        slot.innerHTML =
          '<div class="member-slot-head"><span class="member-badge"><span data-lang-key="membre-stag">Stagiaire</span> ' + (i + 1) + '</span>' +
            (m && mComplet(m) ? '<i class="fas fa-circle-check" style="color:#059669;"></i>' : '<i class="fas fa-circle" style="color:#94a3b8;"></i>') +
          '</div>' +
          '<input type="text" class="membre-nom" placeholder="' + (window.__membrePh || 'Nom et prénom...') + '" value="' + ficheEch(m ? mComplet(m) : '') + '" data-membre="' + i + '">' +
          '<div class="member-actions">' +
            '<button class="btn btn-success" onclick="membreAjouter(' + i + ')"><i class="fas fa-plus"></i> <span data-lang-key="b-ajouter">Ajouter</span></button>' +
            '<button class="btn btn-accent" onclick="membreModifier(' + i + ')"><i class="fas fa-pen"></i> <span data-lang-key="b-modifier">Modifier</span></button>' +
            '<button class="btn btn-danger" onclick="membreSupprimer(' + i + ')"><i class="fas fa-trash"></i> <span data-lang-key="b-supprimer">Supprimer</span></button>' +
          '</div>';
        grid.appendChild(slot);
      }
      if (typeof ficheAppliquerLang === 'function') ficheAppliquerLang();
      grid.querySelectorAll('input[data-membre]').forEach(function(inp) {
        inp.addEventListener('keydown', function(e) {
          if (e.key !== 'Enter') return;
          e.preventDefault();
          const i = parseInt(inp.dataset.membre, 10);
          const p = ficheCourant();
          if (p && p.membres && p.membres[i] && mComplet(p.membres[i])) membreModifier(i);
          else membreAjouter(i);
        });
      });
    }

    // Nom complet (compatible avec les anciennes fiches nom/prenom séparés)
    function mComplet(m) {
      if (!m) return '';
      if (typeof m === 'string') return m.trim();
      return ((m.nom || '') + ' ' + (m.prenom || '')).trim().replace(/\s+/g, ' ');
    }

    function membreRempli(m) { return mComplet(m) !== ''; }

    function membreLire(i) {
      const inp = document.querySelector('input[data-membre="' + i + '"]');
      return { nom: inp ? inp.value.trim().replace(/\s+/g, ' ') : '', prenom: '' };
    }

    function membreAssurer(p) {
      if (!p.membres) p.membres = [];
      while (p.membres.length < MEMBRE_MAX) p.membres.push(null);
      p.membres = p.membres.slice(0, MEMBRE_MAX);
    }

    function membreLibre(p) {
      membreAssurer(p);
      for (let i = 0; i < MEMBRE_MAX; i++) if (!membreRempli(p.membres[i])) return i;
      return -1;
    }

    function membreFocus(i) {
      const inp = document.querySelector('input[data-membre="' + i + '"]');
      if (inp) { inp.focus(); inp.select(); }
    }

    function membreEnregistrer(i, ajouter) {
      const p = ficheCourant();
      if (!p) { showToast('Créez ou sélectionnez d\'abord un projet', 'fas fa-exclamation-triangle', true); return false; }
      membreAssurer(p);
      const d = membreLire(i);
      const deja = membreRempli(p.membres[i]);
      if (!d.nom) {
        if (ajouter && deja) return true;
        showToast('Saisissez le nom et prénom du stagiaire ' + (i + 1), 'fas fa-exclamation-triangle', true);
        membreFocus(i);
        return false;
      }
      if (ajouter && deja) {
        showToast('Le stagiaire ' + (i + 1) + ' est déjà enregistré — utilisez Modifier', 'fas fa-exclamation-triangle', true);
        return false;
      }
      p.membres[i] = { nom: d.nom, prenom: '' };
      ficheSauvegarder();
      ficheRendreMembres();
      showToast('Stagiaire ' + (i + 1) + (ajouter ? ' ajouté' : ' modifié'), ajouter ? 'fas fa-user-plus' : 'fas fa-pen');
      return true;
    }

    function membreAjouter(i) {
      const p = ficheCourant();
      if (!p) { showToast('Créez ou sélectionnez d\'abord un projet', 'fas fa-exclamation-triangle', true); return; }
      membreAssurer(p);
      if (membreRempli(p.membres[i])) {
        showToast('Le stagiaire ' + (i + 1) + ' est déjà enregistré — utilisez Modifier', 'fas fa-exclamation-triangle', true);
        return;
      }
      if (!membreEnregistrer(i, true)) return;
      const suivant = membreLibre(p);
      if (suivant >= 0) { ficheSel = { type: 'membres', cle: suivant }; membreFocus(suivant); }
    }

    function membreModifier(i) {
      membreEnregistrer(i, false);
    }

    function membreSupprimer(i) {
      const p = ficheCourant();
      if (!p) return;
      membreAssurer(p);
      if (!membreRempli(p.membres[i])) { showToast('La fiche stagiaire ' + (i + 1) + ' est déjà vide', 'fas fa-exclamation-triangle', true); return; }
      const nom = mComplet(p.membres[i]);
      if (!confirm('Supprimer le stagiaire « ' + nom +' » ?')) return;
      p.membres[i] = null;
      ficheSauvegarder();
      ficheRendreMembres();
      showToast('Stagiaire ' + (i + 1) + ' supprimé', 'fas fa-trash');
    }

    function membreToutVider() {
      const p = ficheCourant();
      if (!p) return;
      if (!confirm('Vider les ' + MEMBRE_MAX + ' fiches stagiaires de ce projet ?')) return;
      p.membres = [];
      membreAssurer(p);
      ficheSauvegarder();
      ficheRendreMembres();
      showToast('Fiches stagiaires vidées', 'fas fa-eraser');
    }

    // ---- 3-4-5-1 : listes dynamiques (objectifs, étapes, matériel) ----
    function ficheRendreListe(cle) {
      const cfg = LISTE_CFG[cle];
      const zone = document.getElementById(cfg.zone);
      const p = ficheCourant();
      const items = (p && p[cle]) || [];
      zone.innerHTML = '';
      document.getElementById(cfg.cnt).textContent = items.length ? items.length + ' élément(s)' : '';
      if (!items.length) {
        zone.innerHTML = '<p class="fiche-empty">' + cfg.vide + '</p>';
        return;
      }
      items.forEach(function(it, idx) {
        const row = document.createElement('div');
        row.className = 'fiche-item' + (ficheSel && ficheSel.type === cle && ficheSel.cle === it.id ? ' selected' : '');
        row.style.animationDelay = (idx * 45) + 'ms';
        row.setAttribute('onclick', 'ficheSelectionner(\'' + cle + '\',\'' + it.id + '\')');
        row.innerHTML =
          '<span class="fiche-item-num">' + (idx + 1) + '</span>' +
          '<span class="fiche-item-txt">' + ficheEch(it.texte) + '</span>' +
          '<div class="member-actions">' +
            '<button class="btn btn-accent" onclick="ficheListEdit(\'' + cle + '\',\'' + it.id + '\')"><i class="fas fa-pen"></i> Modifier</button>' +
            '<button class="btn btn-danger" onclick="ficheListDel(\'' + cle + '\',\'' + it.id + '\')"><i class="fas fa-trash"></i> Supprimer</button>' +
          '</div>';
        zone.appendChild(row);
      });
    }

    function ficheListAdd(cle) {
      const cfg = LISTE_CFG[cle];
      const p = ficheCourant();
      if (!p) { showToast('Créez ou sélectionnez d\'abord un projet', 'fas fa-exclamation-triangle', true); return; }
      const inp = document.getElementById(cfg.inp);
      const texte = inp.value.trim();
      if (!texte) { showToast('Le champ est vide', 'fas fa-exclamation-triangle', true); return; }
      if (!p[cle]) p[cle] = [];
      p[cle].push({ id: Date.now() + '' + Math.floor(Math.random() * 1000), texte: texte });
      inp.value = '';
      ficheSauvegarder();
      ficheRendreListe(cle);
      ficheProgression();
    }

    function ficheListEdit(cle, id) {
      const cfg = LISTE_CFG[cle];
      const p = ficheCourant();
      if (!p) return;
      const it = p[cle].find(function(x) { return x.id === id; });
      if (!it) return;
      const nouveau = window.prompt('Modifier l\'élément :', it.texte);
      if (nouveau === null) return;
      if (!nouveau.trim()) { showToast('Le champ ne peut pas être vide', 'fas fa-exclamation-triangle', true); return; }
      it.texte = nouveau.trim();
      ficheSauvegarder();
      ficheRendreListe(cle);
      showToast('Élément modifié', 'fas fa-pen');
    }

    function ficheListDel(cle, id) {
      const p = ficheCourant();
      if (!p) return;
      p[cle] = p[cle].filter(function(x) { return x.id !== id; });
      ficheSauvegarder();
      ficheRendreListe(cle);
      ficheProgression();
      showToast('Élément supprimé', 'fas fa-trash');
    }

    // ---- Progression ----
    function ficheMethodeAutoSave() {
      const p = ficheCourant();
      if (!p) return;
      p.methode = document.getElementById('ficheMethode').value;
      try { localStorage.setItem(FICHES_KEY, JSON.stringify(ficheList)); } catch (e) {}
      ficheProgression();
    }

    function ficheProgression() {
      const p = ficheCourant();
      let pct = 0;
      if (p) {
        const parts = [];
        if (p.nom) parts.push(1);
        parts.push(Math.min(1, (p.membres || []).filter(membreRempli).length / 3));
        parts.push(p.objectifs && p.objectifs.length ? 1 : 0);
        parts.push(p.etapes && p.etapes.length ? 1 : 0);
        parts.push(p.materiel && p.materiel.length ? 1 : 0);
        parts.push(p.methode ? 1 : 0);
        pct = Math.round(parts.reduce(function(a, b) { return a + b; }, 0) / parts.length * 100);
      }
      document.getElementById('ficheProgBar').style.width = pct + '%';
      document.getElementById('ficheProgTxt').textContent = pct + '%';
      document.getElementById('ficheCtx').textContent = p ? ('Fiche active : ' + p.nom) : 'Aucun projet sélectionné';
    }

    function ficheToutRendre() {
      ficheRendreProjets();
      ficheRendreMembres();
      Object.keys(LISTE_CFG).forEach(ficheRendreListe);
      const m = document.getElementById('ficheMethode');
      const p = ficheCourant();
      m.value = p && p.methode ? p.methode : '';
      m.disabled = !p;
      ficheProgression();
      notationRendreSelect();
      notationRendreMembres();
      notationRendreGrille();
      notationCalculer();
    }

    // ---- Impression & export (A3 / A4 / .doc / .docx) ----
    const ENTETE_OFFICIEL = [
      'République Algérienne Démocratique et Populaire',
      'Ministère De La Formation et de l\'enseignement Professionnels',
      'Institut National Spécialisé de la formation Professionnelle (ELHidhab)'
    ];

    function remplirEnTeteOfficiel(g, sousTitre) {
      if (!g) return;
      const lg = document.getElementById('logoLeftImg');
      const ld = document.querySelector('#logoLeft .logo-placeholder');
      const rg = document.getElementById('logoRightImg');
      const rd = document.querySelector('#logoRight .logo-placeholder');
      const gauche = (lg && lg.getAttribute('src')) || '';
      const droite = (rg && rg.getAttribute('src')) || '';
      g.innerHTML =
        '<div class="ph-row">' +
          (gauche ? '<img class="ph-logo" src="' + gauche + '" alt="">' : (ld ? '<div style="width:22mm;text-align:center;font-size:20pt;">' + (ld.innerHTML || '') + '</div>' : '')) +
          '<div class="ph-txt">' + ENTETE_OFFICIEL.map(function(t) { return '<p>' + ficheEch(t) + '</p>'; }).join('') + '</div>' +
          (droite ? '<img class="ph-logo" src="' + droite + '" alt="">' : (rd ? '<div style="width:22mm;text-align:center;font-size:20pt;">' + (rd.innerHTML || '') + '</div>' : '')) +
        '</div>' +
        '<div class="ph-bottom"><span>' + ficheEch(ENTETE_OFFICIEL[2]) + '</span>' +
        '<span>' + ficheEch(sousTitre || 'Fiche Projet') + '</span></div>';
    }

    function ficheRendreEnTeteImpression() {
      const p = ficheCourant();
      remplirEnTeteOfficiel(document.getElementById('fichePrintHead'), (p ? p.nom || 'Fiche Projet' : 'Fiche Projet'));
    }

    function ficheImprimer(format) {
      if (!ficheCourant()) { showToast('Sélectionnez un projet à imprimer', 'fas fa-exclamation-triangle', true); return; }
      ficheRendreEnTeteImpression();
      const ancien = document.getElementById('fichePageStyle');
      if (ancien) ancien.remove();
      const style = document.createElement('style');
      style.id = 'fichePageStyle';
      style.textContent = format === 'a3'
        ? '@media print { @page { size: A3 portrait; margin: 12mm; } }'
        : '@media print { @page { size: A4 portrait; margin: 15mm; } }';
      document.head.appendChild(style);
      const cleanup = function() {
        const s = document.getElementById('fichePageStyle');
        if (s) s.remove();
        window.removeEventListener('afterprint', cleanup);
      };
      window.addEventListener('afterprint', cleanup);
      showToast('Impression ' + (format === 'a3' ? 'A3' : 'A4') + '...', 'fas fa-print');
      setTimeout(function() { window.print(); }, 120);
    }

    function ficheSections(p) {
      const membres = (p.membres || []).filter(membreRempli);
      return [
        { t: '1. Nom du projet', v: p.nom || '—' },
        { t: '2. Les membres du projet', v: membres.length
            ? membres.map(function(m, i) { return (i + 1) + '. ' + mComplet(m); })
            : ['—'] },
        { t: '3. Objectifs du projet', v: (p.objectifs || []).map(function(o, i) { return (i + 1) + '. ' + o.texte; }) },
        { t: '4. Étapes du projet', v: (p.etapes || []).map(function(o, i) { return (i + 1) + '. ' + o.texte; }) },
        { t: '5-1. Matériel nécessaire', v: (p.materiel || []).map(function(o, i) { return (i + 1) + '. ' + o.texte; }) },
        { t: '5-2. Méthode', v: p.methode ? [p.methode] : [] }
      ];
    }

    function ficheTexte(p) {
      return ENTETE_OFFICIEL.join('\n') + '\n' + new Array(60).join('=') + '\n\n' +
        'FICHE PROJET\n\n' +
        ficheSections(p).map(function(s) {
          return s.t + '\n' + s.v.map(function(l) { return '   ' + l; }).join('\n');
        }).join('\n\n') +
        '\n\nEdité par : Professeur ' + (settingsForm && settingsForm.profName ? settingsForm.profName : 'Douadi Nabil') +
        ' — INSFP ELHidhab ' + new Date().toLocaleDateString('fr-FR');
    }

    function ficheTelecharger(format) {
      const p = ficheCourant();
      if (!p) { showToast('Sélectionnez un projet à télécharger', 'fas fa-exclamation-triangle', true); return; }
      const nomFichier = 'fiche_projet_' + (p.nom || 'projet').replace(/[^\w\u00C0-\uFFFF]+/g, '_').slice(0, 50);
      if (format === 'doc') {
        const corps = ENTETE_OFFICIEL.map(function(t) {
          return '<p style="text-align:center;font-weight:bold;margin:0;">' + ficheEch(t) + '</p>';
        }).join('');
        const blocs = ficheSections(p).map(function(s) {
          return '<h2 style="font-size:13pt;color:#0369a1;margin:12pt 0 4pt;border-bottom:1pt solid #0369a1;">' + ficheEch(s.t) + '</h2>' +
            (s.v.length
              ? (s.v.length === 1 && s.t.indexOf('Nom') !== -1
                  ? '<p style="font-size:14pt;font-weight:bold;">' + ficheEch(s.v[0]) + '</p>'
                  : '<ol style="font-size:11.5pt;line-height:1.6;">' + s.v.map(function(l) { return '<li>' + ficheEch(l) + '</li>'; }).join('') + '</ol>')
              : '<p style="font-style:italic;color:#888;">—</p>');
        }).join('');
        const html = '<html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:w="urn:schemas-microsoft-com:office:word" xmlns="http://www.w3.org/TR/REC-html40">' +
          '<head><meta charset="utf-8"><title>Fiche projet - ' + ficheEch(p.nom || '') + '</title>' +
          '<style>@page{size:A4 portrait;margin:1.6cm}body{font-family:"Times New Roman",serif;font-size:12pt;color:#000}' +
          '.bdr{border:1pt solid #000;padding:6pt;margin-bottom:10pt;text-align:center}</style></head><body>' +
          '<div class="bdr">' + corps + '</div>' + blocs +
          '<p style="margin-top:18pt;font-size:9.5pt;text-align:center;">Edité par : Professeur ' + ficheEch(settingsForm && settingsForm.profName ? settingsForm.profName : 'Douadi Nabil') + ' — INSFP ELHidhab — ' + new Date().toLocaleDateString('fr-FR') + '</p>' +
          '</body></html>';
        const blob = new Blob(['\ufeff', html], { type: 'application/msword;charset=utf-8' });
        ficheTelechargerBlob(blob, nomFichier + '.doc');
      } else {
        const blob = ficheConstruireDocx(p);
        ficheTelechargerBlob(blob, nomFichier + '.docx');
      }
    }

    function ficheTelechargerBlob(blob, nomFichier) {
      const a = document.createElement('a');
      a.href = URL.createObjectURL(blob);
      a.download = nomFichier;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      setTimeout(function() { URL.revokeObjectURL(a.href); }, 1500);
      showToast('Fichier téléchargé : ' + nomFichier, 'fas fa-download');
    }

    // --- Générateur DOCX (ZIP sans compression) ---
    function ficheCrcTable() {
      if (ficheCrcTable.t) return ficheCrcTable.t;
      const t = new Uint32Array(256);
      for (let n = 0; n < 256; n++) {
        let c = n;
        for (let k = 0; k < 8; k++) c = (c & 1) ? (0xEDB88320 ^ (c >>> 1)) : (c >>> 1);
        t[n] = c >>> 0;
      }
      ficheCrcTable.t = t;
      return t;
    }

    function ficheCrc32(u8) {
      const t = ficheCrcTable();
      let c = 0xFFFFFFFF;
      for (let i = 0; i < u8.length; i++) c = t[(c ^ u8[i]) & 0xFF] ^ (c >>> 8);
      return (c ^ 0xFFFFFFFF) >>> 0;
    }

    function ficheXml(s) {
      return String(s == null ? '' : s)
        .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;').replace(/'/g, '&apos;');
    }

    function ficheZip(fichiers) {
      const enc = new TextEncoder();
      const parties = [];
      const central = [];
      let offset = 0;
      const heure = 0, date = 0x2821;
      fichiers.forEach(function(f) {
        const nom = enc.encode(f.nom);
        const data = f.donnees;
        const crc = ficheCrc32(data);
        const lh = new Uint8Array(30 + nom.length);
        const dv = new DataView(lh.buffer);
        dv.setUint32(0, 0x04034b50, true);
        dv.setUint16(4, 20, true);
        dv.setUint16(6, 0x0800, true);
        dv.setUint16(8, 0, true);
        dv.setUint16(10, heure, true);
        dv.setUint16(12, date, true);
        dv.setUint32(14, crc, true);
        dv.setUint32(18, data.length, true);
        dv.setUint32(22, data.length, true);
        dv.setUint16(26, nom.length, true);
        lh.set(nom, 30);
        parties.push(lh, data);
        const cd = new Uint8Array(46 + nom.length);
        const cv = new DataView(cd.buffer);
        cv.setUint32(0, 0x02014b50, true);
        cv.setUint16(4, 20, true);
        cv.setUint16(6, 20, true);
        cv.setUint16(8, 0x0800, true);
        cv.setUint16(10, 0, true);
        cv.setUint16(12, heure, true);
        cv.setUint16(14, date, true);
        cv.setUint32(16, crc, true);
        cv.setUint32(20, data.length, true);
        cv.setUint32(24, data.length, true);
        cv.setUint16(28, nom.length, true);
        cv.setUint32(42, offset, true);
        cd.set(nom, 46);
        central.push(cd);
        offset += lh.length + data.length;
      });
      const tailleCentral = central.reduce(function(a, c) { return a + c.length; }, 0);
      const eocd = new Uint8Array(22);
      const ev = new DataView(eocd.buffer);
      ev.setUint32(0, 0x06054b50, true);
      ev.setUint16(8, fichiers.length, true);
      ev.setUint16(10, fichiers.length, true);
      ev.setUint32(12, tailleCentral, true);
      ev.setUint32(16, offset, true);
      return new Blob(parties.concat(central, [eocd]), {
        type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
      });
    }

    function ficheConstruireDocx(p) {
      const enc = new TextEncoder();
      const paragraphe = function(texte, opts) {
        opts = opts || {};
        return '<w:p><w:pPr>' +
          (opts.centré ? '<w:jc w:val="center"/>' : '') +
          (opts.avant ? '<w:spacing w:before="' + opts.avant + '"/>' : '') +
          '<w:rPr>' +
            (opts.taille ? '<w:sz w:val="' + opts.taille + '"/><w:szCs w:val="' + opts.taille + '"/>' : '') +
            (opts.gras ? '<w:b/>' : '') +
            (opts.italique ? '<w:i/>' : '') +
            (opts.couleur ? '<w:color w:val="' + opts.couleur + '"/>' : '') +
          '</w:rPr></w:pPr><w:r><w:rPr>' +
            (opts.taille ? '<w:sz w:val="' + opts.taille + '"/><w:szCs w:val="' + opts.taille + '"/>' : '') +
            (opts.gras ? '<w:b/>' : '') +
            (opts.italique ? '<w:i/>' : '') +
            (opts.couleur ? '<w:color w:val="' + opts.couleur + '"/>' : '') +
          '</w:rPr><w:t xml:space="preserve">' + ficheXml(texte) + '</w:t></w:r></w:p>';
      };
      const puces = [];
      ENTETE_OFFICIEL.forEach(function(t, i) {
        puces.push(paragraphe(t, { centré: true, gras: true, taille: i === 0 ? 24 : 22 }));
      });
      puces.push(paragraphe('──────────────────────────────────────────', { centré: true, taille: 18 }));
      puces.push(paragraphe('', { taille: 16 }));
      puces.push(paragraphe('FICHE PROJET', { centré: true, gras: true, taille: 32, couleur: '0369A1', avant: 120 }));
      ficheSections(p).forEach(function(s) {
        puces.push(paragraphe(s.t, { gras: true, taille: 24, couleur: '0369A1', avant: 200 }));
        if (!s.v.length) {
          puces.push(paragraphe('—', { italique: true, taille: 22 }));
        } else if (s.t.indexOf('Nom') !== -1) {
          puces.push(paragraphe(s.v[0], { gras: true, taille: 26 }));
        } else {
          s.v.forEach(function(l) { puces.push(paragraphe('• ' + l, { taille: 22 })); });
        }
      });
      puces.push(paragraphe('', { taille: 16 }));
      puces.push(paragraphe('Edité par : Professeur ' + (settingsForm && settingsForm.profName ? settingsForm.profName : 'Douadi Nabil') +
        ' — INSFP ELHidhab — ' + new Date().toLocaleDateString('fr-FR'), { centré: true, italique: true, taille: 18 }));

      const documentXml = '<?xml version="1.0" encoding="UTF-8" standalone="yes"?>' +
        '<w:document xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main"><w:body>' +
        puces.join('') +
        '<w:sectPr><w:pgSz w:w="11906" w:h="16838"/><w:pgMar w:top="1134" w:right="1134" w:bottom="1134" w:left="1134"/></w:sectPr>' +
        '</w:body></w:document>';

      const contentTypes = '<?xml version="1.0" encoding="UTF-8" standalone="yes"?>' +
        '<Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types">' +
        '<Default Extension="rels" ContentType="application/vnd.openxmlformats-package.relationships+xml"/>' +
        '<Default Extension="xml" ContentType="application/xml"/>' +
        '<Override PartName="/word/document.xml" ContentType="application/vnd.openxmlformats-officedocument.wordprocessingml.document.main+xml"/>' +
        '</Types>';

      const rels = '<?xml version="1.0" encoding="UTF-8" standalone="yes"?>' +
        '<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">' +
        '<Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/officeDocument" Target="word/document.xml"/>' +
        '</Relationships>';

      return ficheZip([
        { nom: '[Content_Types].xml', donnees: enc.encode(contentTypes) },
        { nom: '_rels/.rels', donnees: enc.encode(rels) },
        { nom: 'word/document.xml', donnees: enc.encode(documentXml) }
      ]);
    }

    // ===== Archive des Projets (copie automatique) =====
    const ARCHIVE_KEY = 'ps_archive_projets';
    let archiveList = [];

    function archCharger() {
      try {
        const raw = JSON.parse(localStorage.getItem(ARCHIVE_KEY));
        archiveList = Array.isArray(raw) ? raw : [];
      } catch (e) { archiveList = []; }
      archRendre();
    }

    function archSauver() {
      try { localStorage.setItem(ARCHIVE_KEY, JSON.stringify(archiveList)); }
      catch (e) { showToast('Archive : stockage saturé', 'fas fa-exclamation-triangle', true); }
    }

    function archInstant() {
      const d = new Date();
      return {
        iso: d.toISOString(),
        texte: d.toLocaleString('fr-FR', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' }),
        jour: d.toLocaleDateString('fr-FR'),
        heure: d.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })
      };
    }

    // Archivage automatique : met à jour la copie du projet, sans doublon
    function archiverProjet(p) {
      if (!p) return;
      const inst = archInstant();
      const copie = JSON.parse(JSON.stringify(p));
      const existant = archiveList.find(function(a) { return a.projetId === p.id; });
      if (existant) {
        existant.nom = p.nom || 'Sans nom';
        existant.date = inst.texte;
        existant.iso = inst.iso;
        existant.contenu = copie;
        existant.maj = inst.texte;
      } else {
        archiveList.push({
          id: Date.now() + '' + Math.floor(Math.random() * 1000),
          projetId: p.id,
          nom: p.nom || 'Sans nom',
          date: inst.texte,
          jour: inst.jour,
          heure: inst.heure,
          iso: inst.iso,
          contenu: copie
        });
      }
      archSauver();
      archRendre();
    }

    function archiverDepuisFiche(manuel) {
      const p = ficheCourant();
      if (!p) { showToast('Sélectionnez un projet à archiver', 'fas fa-exclamation-triangle', true); return; }
      archiverProjet(p);
      if (manuel !== true) return;
      showToast('Projet archivé : ' + (p.nom || 'Sans nom'), 'fas fa-box-archive');
    }

    function archiverTout() {
      if (!ficheList.length) { showToast('Aucun projet à archiver', 'fas fa-exclamation-triangle', true); return; }
      if (!confirm('Archiver une copie de tous les projets (' + ficheList.length + ') ?')) return;
      ficheList.forEach(function(p) {
        const inst = archInstant();
        const idx = archiveList.findIndex(function(a) { return a.projetId === p.id; });
        const entree = {
          id: Date.now() + '' + Math.floor(Math.random() * 1000) + idx,
          projetId: p.id,
          nom: p.nom || 'Sans nom',
          date: inst.texte, jour: inst.jour, heure: inst.heure, iso: inst.iso,
          contenu: JSON.parse(JSON.stringify(p))
        };
        if (idx >= 0) archiveList[idx] = entree; else archiveList.push(entree);
      });
      archSauver();
      archRendre();
      showToast(ficheList.length + ' projet(s) archivé(s)', 'fas fa-box-archive');
    }

    function archRendre() {
      const body = document.getElementById('archBody');
      if (!body) return;
      body.innerHTML = '';
      document.getElementById('archTotal').textContent = archiveList.length;
      document.getElementById('archDernier').textContent = archiveList.length
        ? archiveList[archiveList.length - 1].jour + ' · ' + archiveList[archiveList.length - 1].heure
        : '—';
      document.getElementById('archEmpty').style.display = archiveList.length ? 'none' : 'block';
      archiveList.slice().reverse().forEach(function(a, idx) {
        const n = archiveList.length - idx;
        const niv = notationNiveauProjet(a.contenu);
        const dico = notationDico();
        const app = niv ? (dico[NOTATION_BAREME[niv.niv].app] || NOTATION_BAREME[niv.niv].app) : '';
        const tr = document.createElement('tr');
        if (niv) tr.setAttribute('data-niveau', niv.niv);
        tr.innerHTML =
          '<td>' + n + '</td>' +
          '<td><strong><i class="fas fa-folder-open"></i> ' + ficheEch(a.nom) + '</strong>' +
            (a.contenu && a.contenu.final ? ' <span class="niv-pill" style="background:#0b1220;" title="' + ficheEch(a.contenu.final.date || '') + '"><i class="fas fa-flag-checkered"></i></span>' : '') + '</td>' +
          '<td><span class="arch-stamp"><i class="fas fa-clock"></i> ' + ficheEch(a.date) + '</span></td>' +
          '<td>' + (niv
            ? '<span class="arch-niv"><span class="niv-pill" data-niveau="' + niv.niv + '">' + ficheEch(app) + '</span><b>' + niv.total + '/20</b></span>'
            : '<span style="color:var(--text-muted);font-size:.78rem;">' + (a.contenu && a.contenu.notes && Object.keys(a.contenu.notes).length ? 'en cours' : '—') + '</span>') + '</td>' +
          '<td><div class="member-actions">' +
            '<button class="btn btn-success" onclick="archWord(\'' + a.id + '\')"><i class="fas fa-file-word"></i> Word</button>' +
            '<button class="btn btn-success" onclick="archPdf(\'' + a.id + '\')"><i class="fas fa-file-pdf"></i> PDF</button>' +
            '<button class="btn btn-primary" onclick="archImprimer(\'' + a.id + '\')"><i class="fas fa-print"></i> Imprimer</button>' +
            '<button class="btn btn-danger" onclick="archSupprimer(\'' + a.id + '\')"><i class="fas fa-trash"></i> Supprimer</button>' +
          '</div></td>';
        body.appendChild(tr);
      });
      archRepartition();
    }

    function archTrouver(id) {
      return archiveList.find(function(a) { return a.id === id; }) || null;
    }

    function archSupprimer(id) {
      const a = archTrouver(id);
      if (!a) return;
      if (!confirm('Supprimer l\'archive « ' + a.nom + ' » ?')) return;
      archiveList = archiveList.filter(function(x) { return x.id !== id; });
      archSauver();
      archRendre();
      showToast('Archive supprimée', 'fas fa-trash');
    }

    function archiveVider() {
      if (!archiveList.length) return;
      if (!confirm('Vider toute l\'archive (' + archiveList.length + ' entrées) ?')) return;
      archiveList = [];
      archSauver();
      archRendre();
      showToast('Archive vidée', 'fas fa-trash');
    }

    function archLignes(a) {
      const lignes = [];
      ENTETE_OFFICIEL.forEach(function(t, i) { lignes.push((i === 0 ? '##' : '') + t); });
      lignes.push('');
      lignes.push('##FICHE PROJET');
      lignes.push('');
      lignes.push('##Nom du projet : ' + (a.nom || '—'));
      lignes.push('##Archivé le : ' + a.date);
      lignes.push('');
      const p = a.contenu || {};
      ficheSections(p).forEach(function(s) {
        if (s.t.indexOf('Nom') === 0) return;
        lignes.push('##' + s.t);
        if (!s.v.length) lignes.push('   —');
        else s.v.forEach(function(l) { lignes.push('   ' + l); });
        lignes.push('');
      });
      lignes.push('Edité par : Professeur ' + (settingsForm && settingsForm.profName ? settingsForm.profName : 'Douadi Nabil') + ' — INSFP ELHidhab');
      return lignes;
    }

    function archNomFichier(a, ext) {
      return 'archive_' + (a.nom || 'projet').replace(/[^\w\u00C0-\uFFFF]+/g, '_').slice(0, 50) + '_' + (a.jour || '').replace(/\//g, '-') + ext;
    }

    function archWord(id) {
      const a = archTrouver(id);
      if (!a) return;
      const corps = ENTETE_OFFICIEL.map(function(t) {
        return '<p style="text-align:center;font-weight:bold;margin:0;">' + ficheEch(t) + '</p>';
      }).join('');
      const blocs = ficheSections(a.contenu || {}).map(function(s) {
        if (s.t.indexOf('Nom') === 0) {
          return '<h2 style="font-size:13pt;color:#0369a1;margin:12pt 0 4pt;border-bottom:1pt solid #0369a1;">' + ficheEch(s.t) + '</h2>' +
            '<p style="font-size:14pt;font-weight:bold;">' + ficheEch(s.v[0] || '—') + '</p>';
        }
        return '<h2 style="font-size:13pt;color:#0369a1;margin:12pt 0 4pt;border-bottom:1pt solid #0369a1;">' + ficheEch(s.t) + '</h2>' +
          (s.v.length
            ? '<ol style="font-size:11.5pt;line-height:1.6;">' + s.v.map(function(l) { return '<li>' + ficheEch(l) + '</li>'; }).join('') + '</ol>'
            : '<p style="font-style:italic;color:#888;">—</p>');
      }).join('');
      const html = '<html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:w="urn:schemas-microsoft-com:office:word" xmlns="http://www.w3.org/TR/REC-html40">' +
        '<head><meta charset="utf-8"><title>Archive - ' + ficheEch(a.nom || '') + '</title>' +
        '<style>@page{size:A4 portrait;margin:1.6cm}body{font-family:"Times New Roman",serif;font-size:12pt;color:#000}</style></head><body>' +
        '<div style="border:1pt solid #000;padding:6pt;margin-bottom:10pt;text-align:center">' + corps + '</div>' + blocs +
        '<p style="margin-top:16pt;font-size:9.5pt;text-align:center;">Archivé le ' + ficheEch(a.date) + '</p>' +
        '</body></html>';
      const blob = new Blob(['\ufeff', html], { type: 'application/msword;charset=utf-8' });
      ficheTelechargerBlob(blob, archNomFichier(a, '.doc'));
    }

    function archImprimer(id) {
      const a = archTrouver(id);
      if (!a) return;
      const txt = ENTETE_OFFICIEL.join('\n') + '\n' + new Array(60).join('=') + '\n\nFICHE PROJET\n' + archLignes(a).slice(4).join('\n');
      const w = window.open('', '_blank');
      if (!w) { showToast('Autorisez les fenêtres pop-up pour imprimer', 'fas fa-exclamation-triangle', true); return; }
      w.document.write('<!DOCTYPE html><html lang="fr"><head><meta charset="utf-8"><title>Archive - ' + ficheEch(a.nom || '') + '</title>' +
        '<style>@page{size:A4 portrait;margin:1.4cm}body{font-family:system-ui,Arial,sans-serif;max-width:900px;margin:1.5rem auto;color:#0f172a;line-height:1.6}' +
        'pre{white-space:pre-wrap;font-family:inherit;margin:0}h1{color:#0369a1}</style></head><body><pre>' + ficheEch(txt) + '</pre>' +
        '<p style="margin-top:2rem"><button onclick="window.print()">Imprimer / PDF</button> <button onclick="window.close()">Fermer</button></p>' +
        '<script>window.onload=function(){window.print()}<\/script></body></html>');
      w.document.close();
    }

    // --- Générateur PDF natif (texte, polices Helvetica) ---
    function pdfLatin(s) {
      let out = '';
      for (let i = 0; i < s.length; i++) {
        const c = s.charCodeAt(i);
        out += (c > 31 && c < 256) ? String.fromCharCode(c) : (c === 10 ? '\n' : '?');
      }
      return out;
    }

    function pdfEsc(s) {
      return pdfLatin(s).replace(/\\/g, '\\\\').replace(/\(/g, '\\(').replace(/\)/g, '\\)');
    }

    function pdfDecouper(texte, largeur) {
      const mots = texte.split(/\s+/);
      const lignes = [];
      let cur = '';
      mots.forEach(function(m) {
        if (!cur.length) { cur = m; return; }
        if ((cur + ' ' + m).length <= largeur) cur += ' ' + m;
        else { lignes.push(cur); cur = m; }
      });
      if (cur) lignes.push(cur);
      return lignes;
    }

    function archPdf(id) {
      const a = archTrouver(id);
      if (!a) return;
      const brut = archLignes(a);
      const lignes = [];
      brut.forEach(function(l) {
        if (l.indexOf('##') === 0) {
          const gras = l.slice(2);
          if (gras.length > 88) pdfDecouper(gras, 88).forEach(function(x, i) { lignes.push({ t: i ? '   ' + x : x, g: i === 0 }); });
          else lignes.push({ t: gras, g: true });
        } else {
          if (l.length > 92) pdfDecouper(l, 92).forEach(function(x) { lignes.push({ t: x, g: false }); });
          else lignes.push({ t: l, g: false });
        }
      });
      const parPage = 44;
      const pages = [];
      for (let i = 0; i < lignes.length; i += parPage) pages.push(lignes.slice(i, i + parPage));
      if (!pages.length) pages.push([{ t: '', g: false }]);

      const P = pages.length;
      const flux = pages.map(function(page, k) {
        let s = '0.85 w 56 792 m 539 792 l S\n';
        s += 'BT /F2 9.5 Tf 1 0 0 1 56 812 Tm (' + pdfEsc(ENTETE_OFFICIEL[0]) + ') Tj ET\n';
        s += 'BT /F2 9 Tf 1 0 0 1 56 801 Tm (' + pdfEsc(ENTETE_OFFICIEL[1]) + ') Tj ET\n';
        s += 'BT /F2 9 Tf 1 0 0 1 56 790 Tm (' + pdfEsc(ENTETE_OFFICIEL[2]) + ') Tj ET\n';
        s += '0.6 w 56 783 m 539 783 l S\n';
        let y = 764;
        page.forEach(function(l) {
          s += 'BT /' + (l.g ? 'F2' : 'F1') + ' ' + (l.g ? '10.5' : '10') + ' Tf 1 0 0 1 56 ' + y + ' Tm (' + pdfEsc(l.t) + ') Tj ET\n';
          y -= 14.5;
        });
        s += 'BT /F1 8 Tf 1 0 0 1 56 40 Tm (' + pdfEsc('Archive — ' + a.nom + ' — page ' + (k + 1) + '/' + P + ' — INSFP ELHidhab') + ') Tj ET\n';
        return s;
      });

      const objets = [];
      const idFlux = k => 5 + k;
      const idF1 = 5 + P;
      const idF2 = 6 + P;
      objets[1] = '<< /Type /Catalog /Pages 2 0 R >>';
      let kids = '';
      for (let k = 0; k < P; k++) kids += (3 + k) + ' 0 R ';
      objets[2] = '<< /Type /Pages /Kids [' + kids + '] /Count ' + P + ' >>';
      for (let k = 0; k < P; k++) {
        objets[3 + k] = '<< /Type /Page /Parent 2 0 R /MediaBox [0 0 595 842] ' +
          '/Resources << /Font << /F1 ' + idF1 + ' 0 R /F2 ' + idF2 + ' 0 R >> >> /Contents ' + idFlux(k) + ' 0 R >>';
      }
      flux.forEach(function(c, k) {
        objets[idFlux(k)] = '<< /Length ' + c.length + ' >>\nstream\n' + c + 'endstream';
      });
      objets[idF1] = '<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica /Encoding /WinAnsiEncoding >>';
      objets[idF2] = '<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica-Bold /Encoding /WinAnsiEncoding >>';

      let pdf = '%PDF-1.4\n';
      const offsets = [];
      for (let i = 1; i < objets.length; i++) {
        offsets[i] = pdf.length;
        pdf += i + ' 0 obj\n' + objets[i] + '\nendobj\n';
      }
      const xref = pdf.length;
      pdf += 'xref\n0 ' + objets.length + '\n0000000000 65535 f \n';
      for (let i = 1; i < objets.length; i++) {
        pdf += ('0000000000' + offsets[i]).slice(-10) + ' 00000 n \n';
      }
      pdf += 'trailer\n<< /Size ' + objets.length + ' /Root 1 0 R >>\nstartxref\n' + xref + '\n%%EOF';

      const octets = new Uint8Array(pdf.length);
      for (let i = 0; i < pdf.length; i++) octets[i] = pdf.charCodeAt(i) & 0xFF;
      ficheTelechargerBlob(new Blob([octets], { type: 'application/pdf' }), archNomFichier(a, '.pdf'));
    }

    // ===== Paramètres =====
    const SETTINGS_KEY = 'ps_ui_settings';
    const DEFAULT_SETTINGS = {
      primary: '#0ea5e9',
      secondary: '#10b981',
      accent: '#f59e0b',
      headerBg: '#ffffff',
      title: 'Les Projets des Stagiaires',
      loginSlogan: 'Je m\'exerce avec les Projets des Stagiaires',
      profName: 'Douadi Nabil'
    };

    let settingsForm = Object.assign({}, DEFAULT_SETTINGS);

    function openSettingsLock() {
      document.getElementById('settingsLockModal').classList.add('show');
      document.getElementById('settingsLockPass').value = '';
      document.getElementById('settingsLockError').textContent = '';
      document.getElementById('settingsLockPass').focus();
    }

    function closeSettingsLock() {
      document.getElementById('settingsLockModal').classList.remove('show');
    }

    function unlockSettings() {
      const pass = document.getElementById('settingsLockPass').value.trim();
      const errorEl = document.getElementById('settingsLockError');
      if (passHash(pass) === SETTINGS_PASS_HASH) {
        const section = document.getElementById('settingsSection');
        section.classList.remove('locked');
        section.querySelectorAll('input').forEach(function(i) { i.disabled = false; });
        section.querySelectorAll('.action-buttons button').forEach(function(b) { b.disabled = false; });
        document.getElementById('btnLockSettings').disabled = false;
        closeSettingsLock();
        showToast('Paramètres déverrouillés (admin)', 'fas fa-unlock-alt');
      } else {
        errorEl.textContent = '⚠ Mot de passe incorrect.';
        document.getElementById('settingsLockPass').value = '';
        document.getElementById('settingsLockPass').focus();
      }
    }

    function lockSettings() {
      const section = document.getElementById('settingsSection');
      section.classList.add('locked');
      section.querySelectorAll('input').forEach(function(i) { i.disabled = true; });
      section.querySelectorAll('.action-buttons button').forEach(function(b) { b.disabled = true; });
      document.getElementById('btnLockSettings').disabled = true;
      showToast('Paramètres verrouillés', 'fas fa-lock');
    }

    function openLicence() {
      document.getElementById('licenceModal').classList.add('show');
    }

    function closeLicence() {
      document.getElementById('licenceModal').classList.remove('show');
    }

    function fillSettingsForm(s) {
      document.getElementById('setPrimary').value = s.primary;
      document.getElementById('setSecondary').value = s.secondary;
      document.getElementById('setAccent').value = s.accent;
      document.getElementById('setHeaderBg').value = s.headerBg;
      document.getElementById('setTitle').value = s.title;
      document.getElementById('setLoginSlogan').value = s.loginSlogan;
      document.getElementById('setProfName').value = s.profName;
    }

    function applySettings(s) {
      settingsForm = Object.assign({}, s);
      const root = document.documentElement.style;
      root.setProperty('--primary', s.primary);
      root.setProperty('--secondary', s.secondary);
      root.setProperty('--accent', s.accent);

      const headerEl = document.querySelector('.official-header');
      if (headerEl) headerEl.style.background = s.headerBg;

      const titleEl = document.getElementById('appTitleText');
      if (titleEl) titleEl.textContent = s.title;
      document.title = s.title + ' - INSFP ELHIDHAB';

      const sloganEl = document.getElementById('loginBigTitle');
      if (sloganEl) sloganEl.textContent = s.loginSlogan;

      const profEl = document.getElementById('profNameStrong');
      if (profEl) profEl.textContent = s.profName;
      const footerEl = document.getElementById('footerProfName');
      if (footerEl) footerEl.textContent = s.profName;
      const loginProfEl = document.getElementById('loginProfName');
      if (loginProfEl) loginProfEl.textContent = s.profName;

      const accueilProfEl = document.querySelector('.accueil-professor');
      if (accueilProfEl) accueilProfEl.textContent = 'Professeur ' + s.profName;

      // Met à jour le titre de la page d'accueil uniquement si personnalisé
      const accueilTitle = document.querySelector('.accueil-main-title');
      if (accueilTitle) accueilTitle.innerHTML = '<i class="fas fa-diagram-project"></i> ' + s.title;
    }

    function saveSettings() {
      const s = {
        primary: document.getElementById('setPrimary').value,
        secondary: document.getElementById('setSecondary').value,
        accent: document.getElementById('setAccent').value,
        headerBg: document.getElementById('setHeaderBg').value || DEFAULT_SETTINGS.headerBg,
        title: document.getElementById('setTitle').value.trim() || DEFAULT_SETTINGS.title,
        loginSlogan: document.getElementById('setLoginSlogan').value.trim() || DEFAULT_SETTINGS.loginSlogan,
        profName: document.getElementById('setProfName').value.trim() || DEFAULT_SETTINGS.profName
      };
      localStorage.setItem(SETTINGS_KEY, JSON.stringify(s));
      applySettings(s);
      showToast('Paramètres de l\'interface enregistrés', 'fas fa-save');
    }

    function resetSettings() {
      localStorage.removeItem(SETTINGS_KEY);
      applySettings(DEFAULT_SETTINGS);
      fillSettingsForm(DEFAULT_SETTINGS);
      showToast('Paramètres réinitialisés par défaut', 'fas fa-undo');
    }

    function restoreSettings() {
      let s = DEFAULT_SETTINGS;
      try {
        const saved = JSON.parse(localStorage.getItem(SETTINGS_KEY));
        if (saved) s = Object.assign({}, DEFAULT_SETTINGS, saved);
      } catch (e) { /* valeurs par défaut */ }
      fillSettingsForm(s);
      applySettings(s);
    }

    // ===== Navigation entre les pages =====
    function switchAppPage(name) {
      const stu = sessionStorage.getItem(SESSION_TYPE_KEY) === 'stagiaire';
      if (stu && PAGES_PROF.indexOf(name) !== -1) {
        showToast('Accès réservé à l\'administrateur', 'fas fa-lock', true);
        name = 'page-fiche';
      }
      document.querySelectorAll('.app-page').forEach(function(p) {
        p.classList.toggle('active', p.id === name);
      });
      document.querySelectorAll('.page-tab').forEach(function(b) {
        b.classList.toggle('active', b.dataset.page === name);
      });
      if (name === 'page-archive') archRendre();
      if (name === 'page-notation') notationOuvrir();
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }

    // ===== Lancement =====
    window.addEventListener('load', function() {
      updateHeaderDateTime();
      restoreLogos();
      renderAccueilLogos();
      galerieCharger();
      restoreSettings();
      profLoad();
      ficheLoad();
      ficheDates();
      archCharger();
      notationRendreSelect();
      initAccueilLang();
      if (sessionStorage.getItem(SESSION_KEY) === '1') {
        document.body.classList.remove('locked');
        document.body.classList.remove('show-accueil');
        appliquerRole();
        if (sessionStorage.getItem(SESSION_TYPE_KEY) === 'stagiaire') {
          switchAppPage('page-fiche');
        }
      }
      setInterval(updateHeaderDateTime, 1000);
      document.getElementById('appPages').addEventListener('click', function(e) {
        const tab = e.target.closest('.page-tab');
        if (tab && tab.dataset.page) switchAppPage(tab.dataset.page);
      });
    });

    document.addEventListener('keydown', function(e) {
      if (e.key === 'Enter' && document.body.classList.contains('locked')) {
        const overlay = document.getElementById('accueilLoginOverlay');
        if (overlay && overlay.classList.contains('active')) {
          handleLogin();
        }
      }
    });
  