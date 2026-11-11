/**
 * Générateur de la version portable autonome.
 *
 * À partir du MÊME code que la version normale
 * (index.html + style.css + effects-3d.css + effects-3d.js + script.js),
 * ce script fabrique UN SEUL fichier HTML qui fonctionne sans serveur :
 *   dist/Les Projets des Stagiaires - Portable.html
 *
 * Tout est intégré : CSS, JavaScript et polices Font Awesome (base64).
 *
 * Utilisation :  node build-portable.js
 */
const fs = require('fs');
const path = require('path');

const root = __dirname;
const htmlPath = path.join(root, 'index.html');
const faCssPath = path.join(root, 'assets', 'fontawesome.min.css');
const webfontsDir = path.join(root, 'assets', 'webfonts');
const outDir = path.join(root, 'dist');
const outFile = path.join(outDir, 'Les Projets des Stagiaires - Portable.html');

function read(file) {
  return fs.readFileSync(file, 'utf8');
}

function woff2DataUri(file) {
  const buffer = fs.readFileSync(path.join(webfontsDir, file));
  return 'data:font/woff2;base64,' + buffer.toString('base64');
}

function isLocal(url) {
  return !/^(https?:|data:|mailto:|#|\/\/)/i.test(url);
}

// --- 1. Préparer le CSS Font Awesome avec les polices intégrées ---
let faCss = read(faCssPath);

// Supprimer les sources .ttf (les navigateurs modernes utilisent le .woff2)
faCss = faCss.replace(/,\s*url\([^)]*\.ttf\)\s*format\(["']truetype["']\)/gi, '');
faCss = faCss.replace(/url\(\s*["']?[^)]*\.woff2["']?\s*\)/gi, function (match) {
  const fileName = match.replace(/^url\(\s*["']?/i, '').replace(/["']?\s*\)$/, '').split('/').pop();
  const fullPath = path.join(webfontsDir, fileName);
  if (fs.existsSync(fullPath)) return 'url(' + woff2DataUri(fileName) + ')';
  return match;
});

// --- 2. Lire la page et intégrer toutes les ressources locales ---
let html = read(htmlPath);

// 2.a Font Awesome (avec les polices en base64)
html = html.replace(
  /<link[^>]+href=["']assets\/fontawesome\.min\.css["'][^>]*>/i,
  '<style>\n/* Font Awesome 6.5.1 - polices intégrées */\n' + faCss + '\n</style>'
);

// 2.b Toutes les feuilles de style locales restantes
html = html.replace(/<link[^>]+href=["']([^"']+\.css)["'][^>]*>/gi, function (tag, href) {
  if (!isLocal(href)) return tag;
  const file = path.join(root, href);
  if (!fs.existsSync(file)) {
    console.error('ERREUR : feuille de style introuvable : ' + href);
    process.exit(1);
  }
  return '<style>\n/* ' + href + ' */\n' + read(file) + '\n</style>';
});

// 2.c Tous les scripts locaux
html = html.replace(/<script[^>]+src=["']([^"']+\.js)["'][^>]*><\/script>/gi, function (tag, src) {
  if (!isLocal(src)) return tag;
  const file = path.join(root, src);
  if (!fs.existsSync(file)) {
    console.error('ERREUR : script introuvable : ' + src);
    process.exit(1);
  }
  let js = read(file);
  // Empêche une fermeture prématurée de la balise <script>
  js = js.replace(/<\/script/gi, '<\\/script');
  // Le mode portable est forcé pour ce fichier autonome
  const prefix = src === 'script.js'
    ? "window.APP_MODE = 'portable';\n"
    : '';
  return '<script>\n' + prefix + js + '\n</script>';
});

html = html.replace(
  '<!DOCTYPE html>',
  '<!DOCTYPE html>\n<!-- VERSION PORTABLE AUTONOME - générée automatiquement par build-portable.js -->'
);

// --- 3. Vérification : plus aucune ressource locale externe ---
const leftovers = [];
const linkRe = /<(?:link|script)[^>]+(?:href|src)=["']([^"']+)["']/gi;
let m;
while ((m = linkRe.exec(html)) !== null) {
  if (/\.(css|js)$/i.test(m[1]) && isLocal(m[1])) leftovers.push(m[1]);
}
if (leftovers.length) {
  console.error('ERREUR : ressources locales non intégrées : ' + leftovers.join(', '));
  process.exit(1);
}

// --- 4. Écriture ---
fs.mkdirSync(outDir, { recursive: true });
fs.writeFileSync(outFile, html, 'utf8');

const sizeMo = (Buffer.byteLength(html, 'utf8') / 1024 / 1024).toFixed(2);
console.log('Version portable générée :');
console.log('  ' + outFile);
console.log('  Taille : ' + sizeMo + ' Mo');
console.log('');
console.log('Copiez ce fichier sur une clé USB et ouvrez-le par double-clic.');
