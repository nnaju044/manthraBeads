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
  var $rulesBtn = null;
  var $modeBtns = null;
  var $toggleValueBtn = null;
  var isValueHidden = false;

  var $rulesAuthModal = null;
  var $rulesAuthForm = null;
  var $rulesPasscodeInput = null;
  var $rulesPasscodeError = null;
  var $btnRulesAuthClose = null;
  var $btnRulesAuthCancel = null;

  var $rulesContentModal = null;
  var $btnRulesContentClose = null;
  var $btnRulesContentGotIt = null;

  var RULES_PASSCODE = '1234';

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
    $rulesBtn = document.getElementById('btnRules');
    $modeBtns = document.querySelectorAll('.mode-btn');
    $toggleValueBtn = document.getElementById('btnToggleValue');

    $rulesAuthModal = document.getElementById('rulesAuthModal');
    $rulesAuthForm = document.getElementById('rulesAuthForm');
    $rulesPasscodeInput = document.getElementById('rulesPasscodeInput');
    $rulesPasscodeError = document.getElementById('rulesPasscodeError');
    $btnRulesAuthClose = document.getElementById('btnRulesAuthClose');
    $btnRulesAuthCancel = document.getElementById('btnRulesAuthCancel');

    $rulesContentModal = document.getElementById('rulesContentModal');
    $btnRulesContentClose = document.getElementById('btnRulesContentClose');
    $btnRulesContentGotIt = document.getElementById('btnRulesContentGotIt');

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
        try { localStorage.setItem('abacus_mode', state.mode); } catch (e) { }
        applyMode();
      });
    });
    $rodSelect.addEventListener('change', function () {
      state.rodCount = parseInt($rodSelect.value, 10);
      try { localStorage.setItem('abacus_rods', state.rodCount); } catch (e) { }
      state.beads = emptyBeads(state.rodCount);
      buildAbacus();
      render();
    });
    $resetBtn.addEventListener('click', function () { state.beads = emptyBeads(state.rodCount); render(); });
    if ($rulesBtn) {
      $rulesBtn.addEventListener('click', openRulesAuthModal);
    }
    if ($btnRulesAuthClose) {
      $btnRulesAuthClose.addEventListener('click', closeRulesAuthModal);
    }
    if ($btnRulesAuthCancel) {
      $btnRulesAuthCancel.addEventListener('click', closeRulesAuthModal);
    }
    if ($rulesAuthForm) {
      $rulesAuthForm.addEventListener('submit', function (e) {
        e.preventDefault();
        verifyRulesPasscode();
      });
    }
    if ($rulesAuthModal) {
      $rulesAuthModal.addEventListener('click', function (e) {
        if (e.target === $rulesAuthModal) {
          closeRulesAuthModal();
        }
      });
    }
    if ($btnRulesContentClose) {
      $btnRulesContentClose.addEventListener('click', closeRulesContentModal);
    }
    if ($btnRulesContentGotIt) {
      $btnRulesContentGotIt.addEventListener('click', closeRulesContentModal);
    }
    if ($rulesContentModal) {
      $rulesContentModal.addEventListener('click', function (e) {
        if (e.target === $rulesContentModal) {
          closeRulesContentModal();
        }
      });
    }
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') {
        if ($rulesAuthModal && !$rulesAuthModal.classList.contains('hidden')) {
          closeRulesAuthModal();
        }
        if ($rulesContentModal && !$rulesContentModal.classList.contains('hidden')) {
          closeRulesContentModal();
        }
      }
    });
    if ($toggleValueBtn) {
      $toggleValueBtn.addEventListener('click', function () {
        isValueHidden = !isValueHidden;
        $toggleValueBtn.innerHTML = isValueHidden ? '<i class="fa-solid fa-eye-slash"></i>' : '<i class="fa-solid fa-eye"></i>';
      });
    }
  }

  /* ============================================================
     RULES AUTH MODAL
     ============================================================ */
  function openRulesAuthModal() {
    if (!$rulesAuthModal) return;
    $rulesAuthModal.classList.remove('hidden');
    if ($rulesPasscodeInput) {
      $rulesPasscodeInput.value = '';
    }
    if ($rulesPasscodeError) {
      $rulesPasscodeError.classList.add('hidden');
    }
    setTimeout(function () {
      if ($rulesPasscodeInput) $rulesPasscodeInput.focus();
    }, 50);
  }

  function closeRulesAuthModal() {
    if (!$rulesAuthModal) return;
    $rulesAuthModal.classList.add('hidden');
    if ($rulesPasscodeInput) {
      $rulesPasscodeInput.value = '';
    }
    if ($rulesPasscodeError) {
      $rulesPasscodeError.classList.add('hidden');
    }
  }

  function verifyRulesPasscode() {
    if (!$rulesPasscodeInput) return;
    var entered = $rulesPasscodeInput.value.trim();
    if (entered === RULES_PASSCODE) {
      closeRulesAuthModal();
      onRulesAuthenticated();
    } else {
      if ($rulesPasscodeError) {
        $rulesPasscodeError.classList.remove('hidden');
      }
      $rulesPasscodeInput.focus();
      $rulesPasscodeInput.select();
    }
  }

  function onRulesAuthenticated() {
    openRulesContentModal();
  }

  function openRulesContentModal() {
    if (!$rulesContentModal) return;
    $rulesContentModal.classList.remove('hidden');
  }

  function closeRulesContentModal() {
    if (!$rulesContentModal) return;
    $rulesContentModal.classList.add('hidden');
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

    var colW = beadPx + 18;
    var padding = 4;   // compact top/bottom inner padding

    // Heights — compact authentic soroban proportions
    var upperTravel = Math.max(7, Math.round(beadPx * 0.25));    // small travel distance for upper bead
    var upperSlot = beadPx + upperTravel;                         // heaven section
    var divH = 18;                                                // divider bar
    var lowerTravel = Math.max(9, Math.round(beadPx * 0.50));    // compact travel distance for earth beads
    var bottomGap = -1;                                            // short clearance below lowest earth bead
    var lowerSlot = lowerTravel + 4 * beadPx + bottomGap;         // earth section ending close to bead stack
    var boardH = padding + upperSlot + divH + lowerSlot + padding;

    // Frame width
    var frameW = n * colW + 28;
    $container.style.width = frameW + 'px';
    $container.style.height = (boardH + 28) + 'px';

    // Position divider
    $divider.style.top = (padding + upperSlot) + 'px';
    $divider.style.width = (n * colW) + 'px';

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
      // Rest position: resting at top of upper area with minimal gap
      // Active position: slides down to touch divider beam
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
      // Rest: stacked at resting position with compact gap from divider, touching each other vertically
      // Active: stacked touching each other just below divider
      var lowerBaseTop = padding + upperSlot + divH;

      for (var b = 0; b < 4; b++) {
        // Rest position: stacked at bottom touching each other (bead 0 topmost, bead 3 bottommost)
        var restTop = lowerBaseTop + lowerTravel + b * beadPx;
        // Active position: stacked just below divider touching each other
        var activeTop = lowerBaseTop + b * beadPx;
        var deltaY = activeTop - restTop; // negative value (moving upward)

        var lb = createBead(col, 'lower', b, beadPx);
        lb.style.position = 'absolute';
        lb.style.top = restTop + 'px';
        lb.style.left = '50%';
        lb.style.transform = 'translateX(-50%) translateY(0px)';
        lb.dataset.deltaY = deltaY;
        col$.appendChild(lb);
      }

      // // ---- PLACE VALUE LABELS (BOTTOM) ----
      // var posFromRight = n - 1 - col;

      // if (posFromRight === 0) {
      //   addLabel(col$, GROUP_NAMES[0], boardH);
      // } else if (posFromRight % 3 === 0) {
      //   var gi = Math.floor(posFromRight / 3);
      //   if (gi < GROUP_NAMES.length) {
      //     addLabel(col$, GROUP_NAMES[gi], boardH);
      //   }
      // }

      $rodsWrap.appendChild(col$);
    }

    // Build draggable beam marker dots on the horizontal divider
    buildDividerDots(n, colW);
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

  /* ============================================================
     DIVIDER BEAM DOTS (Draggable Markers)
     ============================================================ */
  function buildDividerDots(n, colW) {
    if (!$divider) return;
    $divider.innerHTML = '';
    $divider.removeAttribute('aria-hidden');

    var centerCol = Math.floor(n / 2);
    var dots = [];

    // Red dot at exact center rod
    dots.push({ col: centerCol, color: 'red' });

    // White dots every 3 rods to the left of center
    for (var lc = centerCol - 3; lc >= 0; lc -= 3) {
      dots.push({ col: lc, color: 'white' });
    }

    // White dots every 3 rods to the right of center
    for (var rc = centerCol + 3; rc < n; rc += 3) {
      dots.push({ col: rc, color: 'white' });
    }

    dots.forEach(function (cfg) {
      var dot = createBeamDot(cfg.col, cfg.color, n, colW);
      $divider.appendChild(dot);
    });
  }

  function createBeamDot(initialCol, color, n, colW) {
    var dot = document.createElement('div');
    var isRed = color === 'red';
    dot.className = 'rod-dot ' + (isRed ? 'dot-red' : 'dot-white');

    var initialLeft = (initialCol + 0.5) * colW;
    dot.style.left = initialLeft + 'px';
    dot.setAttribute('data-col', initialCol);
    dot.setAttribute('tabindex', '0');
    dot.setAttribute('role', 'slider');
    dot.setAttribute('aria-label', (isRed ? 'Red unit marker dot' : 'White reckoning marker dot') + ' on rod ' + (initialCol + 1));
    dot.setAttribute('aria-valuemin', '1');
    dot.setAttribute('aria-valuemax', n.toString());
    dot.setAttribute('aria-valuenow', (initialCol + 1).toString());

    var isDragging = false;
    var startX = 0;
    var startLeft = 0;

    function onPointerDown(e) {
      if (e.button !== undefined && e.button !== 0) return;
      e.preventDefault();
      e.stopPropagation();
      isDragging = true;
      startX = e.clientX;
      startLeft = parseFloat(dot.style.left) || ((parseInt(dot.getAttribute('data-col'), 10) + 0.5) * colW);
      dot.classList.add('is-dragging');
      dot.style.transition = 'none';
      if (dot.setPointerCapture) {
        try { dot.setPointerCapture(e.pointerId); } catch (err) { }
      }
    }

    function onPointerMove(e) {
      if (!isDragging) return;
      e.preventDefault();
      var dx = e.clientX - startX;
      var curX = startLeft + dx;
      var minX = 0.5 * colW;
      var maxX = (n - 0.5) * colW;
      if (curX < minX) curX = minX;
      if (curX > maxX) curX = maxX;
      dot.style.left = curX + 'px';
    }

    function onPointerUp(e) {
      if (!isDragging) return;
      isDragging = false;
      dot.classList.remove('is-dragging');
      if (dot.releasePointerCapture) {
        try { dot.releasePointerCapture(e.pointerId); } catch (err) { }
      }
      var curX = parseFloat(dot.style.left);
      var nearestCol = Math.round(curX / colW - 0.5);
      if (nearestCol < 0) nearestCol = 0;
      if (nearestCol >= n) nearestCol = n - 1;

      var snapX = (nearestCol + 0.5) * colW;
      dot.setAttribute('data-col', nearestCol);
      dot.setAttribute('aria-valuenow', (nearestCol + 1).toString());
      dot.setAttribute('aria-label', (isRed ? 'Red unit marker dot' : 'White reckoning marker dot') + ' on rod ' + (nearestCol + 1));
      dot.style.transition = 'left 150ms cubic-bezier(0.2, 0.8, 0.2, 1), transform 0.15s ease, box-shadow 0.15s ease';
      dot.style.left = snapX + 'px';
    }

    dot.addEventListener('pointerdown', onPointerDown);
    dot.addEventListener('pointermove', onPointerMove);
    dot.addEventListener('pointerup', onPointerUp);
    dot.addEventListener('pointercancel', onPointerUp);

    // Keyboard navigation: ArrowLeft / ArrowRight moves dot rod-by-rod
    dot.addEventListener('keydown', function (e) {
      var currentCol = parseInt(dot.getAttribute('data-col'), 10);
      var targetCol = currentCol;
      if (e.key === 'ArrowLeft') {
        if (currentCol > 0) targetCol = currentCol - 1;
      } else if (e.key === 'ArrowRight') {
        if (currentCol < n - 1) targetCol = currentCol + 1;
      } else {
        return;
      }
      e.preventDefault();
      var snapX = (targetCol + 0.5) * colW;
      dot.setAttribute('data-col', targetCol);
      dot.setAttribute('aria-valuenow', (targetCol + 1).toString());
      dot.setAttribute('aria-label', (isRed ? 'Red unit marker dot' : 'White reckoning marker dot') + ' on rod ' + (targetCol + 1));
      dot.style.transition = 'left 150ms cubic-bezier(0.2, 0.8, 0.2, 1), transform 0.15s ease, box-shadow 0.15s ease';
      dot.style.left = snapX + 'px';
    });

    return dot;
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
