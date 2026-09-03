/**
 * abacus.js - ManthraBeads Virtual Soroban
 * True soroban physics: 1 heaven bead (value 5) + 4 earth beads (value 1 each) per rod
 * Beads slide vertically via translateY. No canvas, no SVG, pure HTML/CSS/JS.
 */

(function () {
  'use strict';

  /* ============================================================
     CONFIG
     ============================================================ */
  var MODES = ['junior', 'intermediate', 'advanced', 'master'];
  var GROUP_NAMES = ['Units', 'Thousands', 'Millions', 'Billions', 'Trillions'];
  var DOT_CLASSES = ['dot-units', 'dot-thousands', 'dot-millions', 'dot-billions', 'dot-billions'];

  /* ============================================================
     STATE
     ============================================================ */
  var state = {
    mode: 'junior',
    rodCount: 13,
    beads: []   // [{upper:bool, lower:[bool,bool,bool,bool]}]
  };

  /* ============================================================
     DOM
     ============================================================ */
  var $body = null;
  var $container = null;
  var $rodsWrap = null;
  var $divider = null;
  var $valueNum = null;
  var $rodSelect = null;
  var $resetBtn = null;
  var $clearBtn = null;
  var $modeBtns = null;
  var $toggleValueBtn = null;
  var isValueHidden = false;

  /* ============================================================
     INIT
     ============================================================ */
  function init() {
    $body = document.getElementById('abacusBody');
    $container = document.getElementById('abacusContainer');
    $rodsWrap = document.getElementById('rodsContainer');
    $divider = document.getElementById('abacusDivider');
    $valueNum = document.getElementById('valueNumber');
    $rodSelect = document.getElementById('rodCountSelect');
    $resetBtn = document.getElementById('btnReset');
    $clearBtn = document.getElementById('btnClear');
    $modeBtns = document.querySelectorAll('.mode-btn');
    $toggleValueBtn = document.getElementById('btnToggleValue');

    // Parse URL params or localStorage for initial rods and mode
    var urlParams = new URLSearchParams(window.location.search);
    var urlRods = urlParams.get('rods') || localStorage.getItem('abacus_rods');
    var urlMode = urlParams.get('mode') || localStorage.getItem('abacus_mode');

    if (urlRods) {
      var parsedRods = parseInt(urlRods, 10);
      var validRods = [3, 5, 7, 10, 13, 15, 17];
      if (!isNaN(parsedRods) && validRods.indexOf(parsedRods) !== -1) {
        state.rodCount = parsedRods;
      }
    }
    if (urlMode && MODES.indexOf(urlMode) !== -1) {
      state.mode = urlMode;
    }

    if ($rodSelect) {
      $rodSelect.value = state.rodCount;
    }

    applyMode();

    state.beads = emptyBeads(state.rodCount);
    bindControls();
    buildAbacus();
    attachKeys();
    render();
  }

  function emptyBeads(n) {
    var arr = [];
    for (var i = 0; i < n; i++) {
      arr.push({ upper: false, lower: [false, false, false, false] });
    }
    return arr;
  }

  /* ============================================================
     CONTROLS
     ============================================================ */
  function bindControls() {
    $modeBtns.forEach(function (btn) {
      btn.addEventListener('click', function () {
        state.mode = btn.getAttribute('data-mode');
        try { localStorage.setItem('abacus_mode', state.mode); } catch (e) {}
        applyMode();
      });
    });
    $rodSelect.addEventListener('change', function () {
      state.rodCount = parseInt($rodSelect.value, 10);
      try { localStorage.setItem('abacus_rods', state.rodCount); } catch (e) {}
      state.beads = emptyBeads(state.rodCount);
      buildAbacus();
      render();
    });
    $resetBtn.addEventListener('click', function () { state.beads = emptyBeads(state.rodCount); render(); });
    $clearBtn.addEventListener('click', function () { state.beads = emptyBeads(state.rodCount); render(); });
    if ($toggleValueBtn) {
      $toggleValueBtn.addEventListener('click', function () {
        isValueHidden = !isValueHidden;
        $toggleValueBtn.innerHTML = isValueHidden ? '<i class="fa-solid fa-eye-slash"></i>' : '<i class="fa-solid fa-eye"></i>';
        renderValue();
      });
    }
  }

  function applyMode() {
    MODES.forEach(function (m) { $body.classList.remove('mode-' + m); });
    $body.classList.add('mode-' + state.mode);
    $modeBtns.forEach(function (btn) {
      var active = btn.getAttribute('data-mode') === state.mode;
      btn.classList.toggle('active', active);
      btn.setAttribute('aria-pressed', active ? 'true' : 'false');
    });
  }

  /* ============================================================
     BUILD ABACUS
     ============================================================ */
  function buildAbacus() {
    $rodsWrap.innerHTML = '';

    var n = state.rodCount;

    // Responsive bead size
    var beadPx = n <= 5 ? 56 :
      n <= 7 ? 50 :
        n <= 10 ? 44 :
          n <= 13 ? 36 :
            n <= 15 ? 31 : 27;

    var gap = 4;   // gap between lower beads
    var colW = beadPx + 18;
    var padding = 12;  // top/bottom inner padding

    // Heights — 30% taller than original for realistic soroban travel distance
    var upperSlot = Math.round((beadPx + 10) * 1.3);   // heaven section
    var divH = 18;                                       // divider bar
    var lowerSlot = Math.round(((beadPx + gap) * 4 + 10) * 1.3); // earth section
    var boardH = padding + upperSlot + divH + lowerSlot + padding;

    // Frame width
    var frameW = n * colW + 28;
    $container.style.width = frameW + 'px';
    $container.style.height = (boardH + 28) + 'px';

    // Position divider
    $divider.style.top = (padding + upperSlot) + 'px';

    // Rods container
    $rodsWrap.style.height = boardH + 'px';
    $rodsWrap.style.width = (n * colW) + 'px';

    for (var col = 0; col < n; col++) {
      var col$ = document.createElement('div');
      col$.className = 'rod-column';
      col$.style.width = colW + 'px';
      col$.style.height = boardH + 'px';
      col$.style.flex = '0 0 ' + colW + 'px';
      col$.style.position = 'relative';

      // Steel rod shaft
      var shaft = document.createElement('div');
      shaft.className = 'rod-shaft';
      col$.appendChild(shaft);

      // ---- UPPER (HEAVEN) BEAD ----
      // Rest position: pinned to top of upper area (away from divider)
      // Active position: slides down so bottom edge touches divider
      var upperRestTop = padding;
      var upperActiveTop = padding + upperSlot - beadPx;
      var upperDeltaY = upperActiveTop - upperRestTop;

      var upperBead = createBead(col, 'upper', 0, beadPx);
      upperBead.style.position = 'absolute';
      upperBead.style.top = upperRestTop + 'px';
      upperBead.style.left = '50%';
      upperBead.style.transform = 'translateX(-50%) translateY(0px)';
      upperBead.dataset.deltaY = upperDeltaY;
      col$.appendChild(upperBead);

      // ---- LOWER (EARTH) BEADS ----
      // Index 0 = closest to divider, 3 = furthest from divider
      // Rest: packed at the bottom of the earth section
      // Active: packed just below the divider
      var lowerBaseTop = padding + upperSlot + divH;

      for (var b = 0; b < 4; b++) {
        // Rest position: stacked at bottom (bead 0 topmost, bead 3 bottommost)
        var restTop = lowerBaseTop + lowerSlot - beadPx - (3 - b) * (beadPx + gap) - 10;
        // Active position: stacked just below divider
        var activeTop = lowerBaseTop + b * (beadPx + gap) + 2;
        var deltaY = activeTop - restTop; // negative value (moving upward)

        var lb = createBead(col, 'lower', b, beadPx);
        lb.style.position = 'absolute';
        lb.style.top = restTop + 'px';
        lb.style.left = '50%';
        lb.style.transform = 'translateX(-50%) translateY(0px)';
        lb.dataset.deltaY = deltaY;
        col$.appendChild(lb);
      }

      // ---- PLACE VALUE DOTS ----
      var posFromRight = n - 1 - col;

      // Units rod (rightmost)
      if (posFromRight === 0) {
        addDot(col$, DOT_CLASSES[0], padding + upperSlot + divH / 2);
        addLabel(col$, GROUP_NAMES[0], boardH);
      }

      // Every 3rd rod from right
      if (posFromRight > 0 && posFromRight % 3 === 0) {
        var gi = Math.floor(posFromRight / 3);
        if (gi < GROUP_NAMES.length) {
          addDot(col$, DOT_CLASSES[gi], padding + upperSlot + divH / 2);
          addLabel(col$, GROUP_NAMES[gi], boardH);
        }
      }

      $rodsWrap.appendChild(col$);
    }
  }

  function createBead(col, type, idx, size) {
    var el = document.createElement('div');
    el.className = 'bead ' + (type === 'upper' ? 'upper-type' : 'lower-type');
    el.setAttribute('data-col', col);
    el.setAttribute('data-type', type);
    el.setAttribute('data-idx', idx);
    el.style.width = size + 'px';
    el.style.height = size + 'px';
    // Smooth vertical slide — 200ms ease-out, no bounce
    el.style.transition = 'transform 200ms ease-out, filter 0.2s, box-shadow 0.25s';

    var rodNum = col + 1;
    el.setAttribute('tabindex', '0');
    el.setAttribute('role', 'checkbox');
    el.setAttribute('aria-label',
      type === 'upper'
        ? 'Rod ' + rodNum + ' heaven bead (value 5)'
        : 'Rod ' + rodNum + ' earth bead ' + (idx + 1) + ' (value 1)'
    );
    el.setAttribute('aria-checked', 'false');

    el.addEventListener('click', function () { toggleBead(col, type, idx); });
    el.addEventListener('keydown', function (e) {
      if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); toggleBead(col, type, idx); }
    });
    return el;
  }

  function addDot(parent, cls, topPx) {
    var d = document.createElement('div');
    d.className = 'rod-dot ' + cls;
    d.style.position = 'absolute';
    d.style.top = topPx + 'px';
    d.style.left = '50%';
    d.style.transform = 'translate(-50%, -50%)';
    d.style.zIndex = '12';
    d.setAttribute('aria-hidden', 'true');
    parent.appendChild(d);
  }

  function addLabel(parent, text, boardH) {
    var l = document.createElement('div');
    l.className = 'rod-label';
    l.textContent = text;
    l.style.position = 'absolute';
    l.style.bottom = '-18px';
    l.style.left = '50%';
    l.style.transform = 'translateX(-50%)';
    l.style.zIndex = '12';
    parent.appendChild(l);
  }

  /* ============================================================
     TOGGLE BEAD (True Soroban logic)
     ============================================================ */
  function toggleBead(col, type, idx) {
    var b = state.beads[col];
    if (type === 'upper') {
      // Heaven bead: simple toggle
      b.upper = !b.upper;
    } else {
      // Earth beads: grouped stacking toward divider
      var active = b.lower[idx];
      var i;
      if (!active) {
        // Activate this bead AND all beads between it and the divider (0..idx)
        // This simulates pushing beads upward — they stack against the beam
        for (i = 0; i <= idx; i++) b.lower[i] = true;
      } else {
        // Deactivate this bead AND all beads further from divider (idx..3)
        // This simulates pulling beads downward — they fall to the bottom
        for (i = idx; i < 4; i++) b.lower[i] = false;
      }
    }
    render();
  }

  /* ============================================================
     RENDER
     ============================================================ */
  function render() {
    renderBeads();
    renderValue();
  }

  function renderBeads() {
    var beads = $rodsWrap.querySelectorAll('.bead');
    beads.forEach(function (el) {
      var col = parseInt(el.getAttribute('data-col'), 10);
      var type = el.getAttribute('data-type');
      var idx = parseInt(el.getAttribute('data-idx'), 10);
      if (col >= state.beads.length) return;

      var b = state.beads[col];
      var active = type === 'upper' ? b.upper : b.lower[idx];
      var deltaY = parseFloat(el.dataset.deltaY);

      el.classList.toggle('active', active);
      el.setAttribute('aria-checked', active ? 'true' : 'false');

      // Animate via translateY — GPU-accelerated, smooth
      if (active) {
        el.style.transform = 'translateX(-50%) translateY(' + deltaY + 'px)';
      } else {
        el.style.transform = 'translateX(-50%) translateY(0px)';
      }
    });
  }

  function renderValue() {
    var total = 0;
    var n = state.rodCount;
    for (var col = 0; col < n; col++) {
      var place = Math.pow(10, n - 1 - col);
      var b = state.beads[col];
      var v = 0;
      for (var i = 0; i < 4; i++) { if (b.lower[i]) v++; }
      if (b.upper) v += 5;
      total += v * place;
    }
    $valueNum.textContent = isValueHidden ? '?' : total.toLocaleString();
    if (isValueHidden) {
      $valueNum.style.filter = 'blur(4px)';
      $valueNum.style.opacity = '0.7';
    } else {
      $valueNum.style.filter = 'none';
      $valueNum.style.opacity = '1';
    }
  }

  /* ============================================================
     KEYBOARD NAVIGATION
     ============================================================ */
  function attachKeys() {
    document.addEventListener('keydown', function (e) {
      var el = document.activeElement;
      if (!el || !el.classList.contains('bead')) return;
      var col = parseInt(el.getAttribute('data-col'), 10);
      var type = el.getAttribute('data-type');
      var idx = parseInt(el.getAttribute('data-idx'), 10);
      var next = null;

      if (e.key === 'ArrowLeft' && col > 0) next = getBead(col - 1, type, idx);
      if (e.key === 'ArrowRight' && col < state.rodCount - 1) next = getBead(col + 1, type, idx);
      if (e.key === 'ArrowUp') {
        if (type === 'lower' && idx > 0) next = getBead(col, 'lower', idx - 1);
        else if (type === 'lower') next = getBead(col, 'upper', 0);
      }
      if (e.key === 'ArrowDown') {
        if (type === 'upper') next = getBead(col, 'lower', 0);
        else if (idx < 3) next = getBead(col, 'lower', idx + 1);
      }

      if (next) { e.preventDefault(); next.focus(); }
    });
  }

  function getBead(col, type, idx) {
    return $rodsWrap.querySelector(
      '.bead[data-col="' + col + '"][data-type="' + type + '"][data-idx="' + idx + '"]'
    );
  }

  /* ============================================================
     BOOT
     ============================================================ */
  document.addEventListener('DOMContentLoaded', function () {
    init();
    applyMode();
  });

})();
