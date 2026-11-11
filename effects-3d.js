/* ============================================================
   INTERFACE 3D ANIMÉE — couche d'effets
   ------------------------------------------------------------
   • Aurores animées + sol quadrillé en perspective
   • Inclinaison 3D des panneaux qui suivent la souris
   • Effets de relief sur les boutons et les onglets
   • Bouton « 3D » en bas à gauche pour activer / désactiver
   • Préférence mémorisée dans le navigateur (ps_3d_enabled)

   Ce fichier ne touche JAMAIS aux données de l'application.
   ============================================================ */
(function () {
  'use strict';

  var KEY = 'ps_3d_enabled';

  /* Panneaux qui peuvent s'incliner */
  var TILT = [
    '.official-header',
    '.settings-section',
    '.conseil-section',
    '.etapes-section',
    '.plan-section',
    '.gest-section',
    '.fiche-block',
    '.login-card',
    '.accueil-access-card',
    '.accueil-info',
    '.notif-card',
    '.arch-stat',
    '.settings-lock-card'
  ].join(',');

  var MAX_DEG = 3.2;          // inclinaison maximale
  var MIN_WIDTH = 820;        // pas d'inclinaison sur petit écran

  function store(on) {
    try { localStorage.setItem(KEY, on ? '1' : '0'); } catch (e) {}
  }
  function readPref() {
    try { return localStorage.getItem(KEY); } catch (e) { return null; }
  }

  var reduceMotion = false;
  try {
    reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  } catch (e) {}

  var pref = readPref();
  /* Par défaut : activé, sauf si l'utilisateur préfère moins d'animations */
  var enabled = pref === null ? !reduceMotion : pref === '1';

  /* ---------------- Décor ---------------- */
  function buildDecor() {
    if (document.querySelector('.d3-bg')) return;
    var bg = document.createElement('div');
    bg.className = 'd3-bg';
    bg.setAttribute('aria-hidden', 'true');
    bg.innerHTML =
      '<span class="d3-blob b1"></span>' +
      '<span class="d3-blob b2"></span>' +
      '<span class="d3-blob b3"></span>';

    var floor = document.createElement('div');
    floor.className = 'd3-floor';
    floor.setAttribute('aria-hidden', 'true');

    document.body.appendChild(bg);
    document.body.appendChild(floor);
  }

  /* ---------------- Bouton 3D ---------------- */
  function buildToggle() {
    if (document.getElementById('d3Toggle')) return;
    var b = document.createElement('button');
    b.id = 'd3Toggle';
    b.type = 'button';
    b.className = 'd3-toggle';
    b.title = 'Activer / désactiver les effets 3D';
    b.innerHTML = '<span class="d3-dot"></span><span class="d3-label">3D</span>';
    b.addEventListener('click', function () {
      setEnabled(!document.body.classList.contains('d3-on'));
    });
    document.body.appendChild(b);
  }

  function updateToggle() {
    var b = document.getElementById('d3Toggle');
    if (!b) return;
    b.setAttribute('aria-pressed', enabled ? 'true' : 'false');
    var lbl = b.querySelector('.d3-label');
    if (lbl) lbl.textContent = enabled ? '3D ON' : '3D OFF';
  }

  /* ---------------- Activation / désactivation ---------------- */
  function setEnabled(on) {
    enabled = !!on;
    store(enabled);
    document.documentElement.classList.toggle('d3-on', enabled);
    document.body.classList.toggle('d3-on', enabled);
    updateToggle();
    if (enabled) markTiltables();
    else resetAll();
  }

  /* ---------------- Marquage des panneaux ---------------- */
  function isSkipped(el) {
    /* Évite deux inclinaisons imbriquées (ex. section contenant des blocs) */
    if (el.matches('.gest-section') && el.querySelector('.fiche-block')) return true;
    return false;
  }

  function markTiltables() {
    var list = document.querySelectorAll(TILT);
    for (var i = 0; i < list.length; i++) {
      if (isSkipped(list[i])) continue;
      list[i].classList.add('d3-tilt');
    }
  }

  /* ---------------- Inclinaison qui suit la souris ---------------- */
  var current = null;

  function resetEl(el) {
    if (!el) return;
    el.classList.remove('is-tilting');
    el.style.removeProperty('--d3-rx');
    el.style.removeProperty('--d3-ry');
  }

  function resetAll() {
    var list = document.querySelectorAll('.is-tilting');
    for (var i = 0; i < list.length; i++) resetEl(list[i]);
    current = null;
  }

  function applyTilt(el, ev) {
    var r = el.getBoundingClientRect();
    if (!r.width || !r.height) return;
    var px = (ev.clientX - r.left) / r.width;
    var py = (ev.clientY - r.top) / r.height;
    var ry = (px - 0.5) * 2 * MAX_DEG;
    var rx = (0.5 - py) * 2 * MAX_DEG;
    el.style.setProperty('--d3-rx', rx.toFixed(2) + 'deg');
    el.style.setProperty('--d3-ry', ry.toFixed(2) + 'deg');
  }

  function findTiltable(node) {
    if (!node || !node.closest) return null;
    var el = node.closest(TILT);
    while (el && isSkipped(el)) {
      el = el.parentElement ? el.parentElement.closest(TILT) : null;
    }
    return el;
  }

  document.addEventListener('pointermove', function (ev) {
    if (!enabled) return;
    if (ev.pointerType === 'touch') return;
    if (window.innerWidth < MIN_WIDTH) return;

    var el = findTiltable(ev.target);
    if (el !== current) {
      resetEl(current);
      current = el;
    }
    if (!el) return;

    el.classList.add('d3-tilt', 'is-tilting');
    applyTilt(el, ev);
  }, { passive: true });

  document.addEventListener('pointerout', function (ev) {
    if (!current) return;
    if (ev.relatedTarget && current.contains(ev.relatedTarget)) return;
    resetEl(current);
    current = null;
  }, { passive: true });

  window.addEventListener('scroll', function () {
    if (current) { resetEl(current); current = null; }
  }, { passive: true });

  window.addEventListener('resize', function () {
    if (current) { resetEl(current); current = null; }
  }, { passive: true });

  /* ---------------- Apparition des nouveaux panneaux ---------------- */
  var pending = null;
  function scheduleMark() {
    if (pending) return;
    pending = setTimeout(function () {
      pending = null;
      if (enabled) markTiltables();
    }, 250);
  }

  function start() {
    buildDecor();
    buildToggle();
    setEnabled(enabled);
    if (window.MutationObserver) {
      var obs = new MutationObserver(function (muts) {
        for (var i = 0; i < muts.length; i++) {
          if (muts[i].addedNodes && muts[i].addedNodes.length) { scheduleMark(); return; }
        }
      });
      obs.observe(document.body, { childList: true, subtree: true });
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', start);
  } else {
    start();
  }
})();
