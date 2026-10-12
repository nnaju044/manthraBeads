/**
 * timer.js — ManthraBeads Stopwatch, Countdown Timer & Miniature Floating Watch
 * Self-contained module. Timestamp-based timing (immune to tab throttling).
 * Persists full state and miniature watch position to localStorage. No external dependencies.
 */

(function () {
  'use strict';

  /* ============================================================
     STORAGE KEYS
     ============================================================ */
  var STORAGE_KEY      = 'manthra_timer_v1';
  var STORAGE_KEY_MINI = 'manthra_mini_timer_v1';

  /* ============================================================
     STATE
     ============================================================ */
  var activeTab = 'stopwatch'; // 'stopwatch' | 'countdown'

  var sw = {
    running:     false,
    startTs:     null,   // timestamp when last resumed
    accumulated: 0,      // ms banked before last pause
  };

  var cd = {
    running:       false,
    startTs:       null,
    accumulated:   0,    // ms elapsed since last resume
    totalMs:       0,    // total duration set by user (ms)
    finished:      false,
  };

  var mini = {
    visible:   true,        // default visible
    collapsed: false,
    mode:      'stopwatch', // 'stopwatch' | 'countdown' | 'clock'
    pos:       null,        // { left, top }
  };

  var rafId = null;
  var alarmTimeout = null;
  var alarmAudio   = null;

  // Previous render values for change-detection (avoids redundant DOM writes)
  var prevSwText   = '';
  var prevCdText   = '';
  var prevCdStroke  = '';
  var prevCdColor   = '';
  var prevMiniText  = '';
  var prevMiniMs    = '';

  /* ============================================================
     DOM REFS
     ============================================================ */
  // Modal refs
  var $modal, $panel;
  var $tabSw, $tabCd;
  var $paneSw, $paneCd;

  // Stopwatch modal controls
  var $swDisplay, $swStart, $swPause, $swReset;

  // Countdown modal controls
  var $cdDisplay, $cdProgress;
  var $cdHours, $cdMinutes, $cdSeconds;
  var $cdStart, $cdPause, $cdReset;
  var $cdFinishedBanner;

  // Miniature Watch Widget
  var $miniWidget;
  var $miniHeader;
  var $miniDragHandle;
  var $miniDot;
  var $miniModeLabel;
  var $miniDisplay;
  var $miniMs;
  var $miniBtnMode;
  var $miniBtnExpand;
  var $miniBtnCollapse;
  var $miniBtnClose;
  var $miniCollapseIcon;
  var $miniBtnStart;
  var $miniBtnPause;
  var $miniBtnReset;
  var $btnMiniTimerToggle;

  /* ============================================================
     PUBLIC API
     ============================================================ */
  window.TimerModal = {
    init:       init,
    open:       open,
    close:      close,
    showMini:   showMini,
    hideMini:   hideMini,
    toggleMini: toggleMini,
    isMiniOpen: function () { return mini.visible; },
  };

  /* ============================================================
     INIT
     ============================================================ */
  function init() {
    // Modal refs
    $modal  = document.getElementById('timerModal');
    $panel  = document.getElementById('timerPanel');

    $tabSw  = document.getElementById('timerTabSw');
    $tabCd  = document.getElementById('timerTabCd');
    $paneSw = document.getElementById('timerPaneSw');
    $paneCd = document.getElementById('timerPaneCd');

    // Stopwatch modal
    $swDisplay = document.getElementById('swDisplay');
    $swStart   = document.getElementById('swStart');
    $swPause   = document.getElementById('swPause');
    $swReset   = document.getElementById('swReset');

    // Countdown modal
    $cdDisplay        = document.getElementById('cdDisplay');
    $cdProgress       = document.getElementById('cdProgress');
    $cdHours          = document.getElementById('cdHours');
    $cdMinutes        = document.getElementById('cdMinutes');
    $cdSeconds        = document.getElementById('cdSeconds');
    $cdStart          = document.getElementById('cdStart');
    $cdPause          = document.getElementById('cdPause');
    $cdReset          = document.getElementById('cdReset');
    $cdFinishedBanner = document.getElementById('cdFinishedBanner');

    // Miniature Watch Widget refs
    $miniWidget         = document.getElementById('miniTimerWidget');
    $miniHeader         = document.getElementById('miniTimerHeader');
    $miniDragHandle     = document.getElementById('miniTimerDragHandle');
    $miniDot            = document.getElementById('miniTimerDot');
    $miniModeLabel      = document.getElementById('miniTimerModeLabel');
    $miniDisplay        = document.getElementById('miniTimerDisplay');
    $miniMs             = document.getElementById('miniTimerMs');
    $miniBtnMode        = document.getElementById('miniTimerBtnMode');
    $miniBtnExpand      = document.getElementById('miniTimerBtnExpand');
    $miniBtnCollapse    = document.getElementById('miniTimerBtnCollapse');
    $miniBtnClose       = document.getElementById('miniTimerBtnClose');
    $miniCollapseIcon   = document.getElementById('miniTimerCollapseIcon');
    $miniBtnStart       = document.getElementById('miniTimerBtnStart');
    $miniBtnPause       = document.getElementById('miniTimerBtnPause');
    $miniBtnReset       = document.getElementById('miniTimerBtnReset');
    $btnMiniTimerToggle = document.getElementById('btnMiniTimerToggle');

    // Pre-build alarm audio once
    try {
      alarmAudio = new Audio();
      alarmAudio.src = buildAlarmDataUri();
    } catch (e) { alarmAudio = null; }

    // Restore timer & mini widget state from localStorage
    loadState();
    loadMiniState();

    // Bind modal tab switching
    if ($tabSw) $tabSw.addEventListener('click', function () { switchTab('stopwatch'); });
    if ($tabCd) $tabCd.addEventListener('click', function () { switchTab('countdown'); });

    // Stopwatch controls
    if ($swStart) $swStart.addEventListener('click', swStart);
    if ($swPause) $swPause.addEventListener('click', swPause);
    if ($swReset) $swReset.addEventListener('click', swReset);

    // Countdown inputs
    if ($cdHours) {
      $cdHours.addEventListener('change',   onCdInputChange);
      $cdHours.addEventListener('blur',     clampCdInputs);
    }
    if ($cdMinutes) {
      $cdMinutes.addEventListener('change', onCdInputChange);
      $cdMinutes.addEventListener('blur',   clampCdInputs);
    }
    if ($cdSeconds) {
      $cdSeconds.addEventListener('change', onCdInputChange);
      $cdSeconds.addEventListener('blur',   clampCdInputs);
    }

    // Countdown controls
    if ($cdStart) $cdStart.addEventListener('click', cdStart);
    if ($cdPause) $cdPause.addEventListener('click', cdPause);
    if ($cdReset) $cdReset.addEventListener('click', cdReset);

    // Backdrop / Escape close
    if ($modal) {
      $modal.addEventListener('click', function (e) {
        if (e.target === $modal) close();
      });
      document.addEventListener('keydown', function (e) {
        if (e.key === 'Escape' && !$modal.classList.contains('tm-hidden')) close();
      });
    }

    // Initialize Miniature Watch Widget
    if ($miniWidget) {
      initMiniDrag();
      applyMiniPos();
      window.addEventListener('resize', applyMiniPos);

      $miniWidget.classList.toggle('mini-hidden', !mini.visible);
      $miniWidget.classList.toggle('mini-collapsed', mini.collapsed);
      if ($miniCollapseIcon) {
        $miniCollapseIcon.className = mini.collapsed ? 'fa-solid fa-plus' : 'fa-solid fa-minus';
      }
      if ($btnMiniTimerToggle) {
        $btnMiniTimerToggle.classList.toggle('active-glow', mini.visible);
      }

      // Miniature widget event listeners
      if ($miniBtnStart) $miniBtnStart.addEventListener('click', onMiniStart);
      if ($miniBtnPause) $miniBtnPause.addEventListener('click', onMiniPause);
      if ($miniBtnReset) $miniBtnReset.addEventListener('click', onMiniReset);
      if ($miniBtnMode)  $miniBtnMode.addEventListener('click', cycleMiniMode);
      if ($miniBtnExpand) $miniBtnExpand.addEventListener('click', open);
      if ($miniBtnCollapse) $miniBtnCollapse.addEventListener('click', toggleCollapse);
      if ($miniBtnClose) $miniBtnClose.addEventListener('click', hideMini);

      // Clicking the time digits opens the full modal
      var $timeRow = $miniWidget.querySelector('.mini-time-row');
      if ($timeRow) $timeRow.addEventListener('click', open);
    }

    // Resume ticking if stopwatch, countdown, or clock mode is running
    if (sw.running || cd.running || (mini.visible && mini.mode === 'clock')) {
      startRaf();
    }
    updateSwButtons();
    updateCdButtons();
    renderAll();
    switchTab(activeTab, true /* silent */);

    // Save on tab close or refresh
    window.addEventListener('beforeunload', saveAll);
    window.addEventListener('pagehide', saveAll);
  }

  /* ============================================================
     OPEN / CLOSE MODAL
     ============================================================ */
  function open() {
    if (!$modal) return;
    $modal.classList.remove('tm-hidden');
    requestAnimationFrame(function () {
      $modal.classList.add('tm-visible');
    });
    if (sw.running || cd.running || (mini.visible && mini.mode === 'clock')) startRaf();
  }

  function close() {
    if (!$modal) return;
    $modal.classList.remove('tm-visible');
    setTimeout(function () { $modal.classList.add('tm-hidden'); }, 250);
  }

  /* ============================================================
     TAB SWITCHING
     ============================================================ */
  function switchTab(tab, silent) {
    activeTab = tab;
    var isSw = tab === 'stopwatch';

    if ($tabSw) $tabSw.classList.toggle('tm-tab-active', isSw);
    if ($tabCd) $tabCd.classList.toggle('tm-tab-active', !isSw);
    if ($paneSw) $paneSw.classList.toggle('tm-hidden', !isSw);
    if ($paneCd) $paneCd.classList.toggle('tm-hidden', isSw);

    // Only sync miniature widget mode if user explicitly switches tabs
    if (!silent) {
      if (mini.mode !== 'clock') {
        mini.mode = tab;
        saveMiniState();
      }
      saveState();
    }
    renderAll();
  }

  /* ============================================================
     STOPWATCH LOGIC
     ============================================================ */
  function swStart() {
    if (sw.running) return;
    sw.running = true;
    sw.startTs = Date.now();
    startRaf();
    updateSwButtons();
    renderMini();
    saveState();
  }

  function swPause() {
    if (!sw.running) return;
    sw.accumulated += Date.now() - sw.startTs;
    sw.running = false;
    sw.startTs = null;
    updateSwButtons();
    renderMini();
    saveState();
    if (!cd.running && !(mini.visible && mini.mode === 'clock')) stopRaf();
  }

  function swReset() {
    sw.running = false;
    sw.startTs = null;
    sw.accumulated = 0;
    updateSwButtons();
    renderSw();
    renderMini();
    saveState();
    if (!cd.running && !(mini.visible && mini.mode === 'clock')) stopRaf();
  }

  function swElapsedMs() {
    if (sw.running && sw.startTs) return sw.accumulated + (Date.now() - sw.startTs);
    return sw.accumulated;
  }

  function updateSwButtons() {
    if (!$swStart || !$swPause) return;
    $swStart.disabled = sw.running;
    $swPause.disabled = !sw.running;
    $swStart.classList.toggle('tm-btn-disabled', sw.running);
    $swPause.classList.toggle('tm-btn-disabled', !sw.running);
  }

  /* ============================================================
     COUNTDOWN LOGIC
     ============================================================ */
  function getCdTotalFromInputs() {
    if (!$cdHours || !$cdMinutes || !$cdSeconds) return 0;
    var h = Math.max(0, parseInt($cdHours.value,   10) || 0);
    var m = Math.max(0, parseInt($cdMinutes.value, 10) || 0);
    var s = Math.max(0, parseInt($cdSeconds.value, 10) || 0);
    return (h * 3600 + m * 60 + s) * 1000;
  }

  function onCdInputChange() {
    clampCdInputs();
    cd.totalMs     = getCdTotalFromInputs();
    cd.accumulated = 0;
    cd.finished    = false;
    hideCdFinished();
    renderCd();
    renderMini();
    saveState();
  }

  function clampCdInputs() {
    if (!$cdHours || !$cdMinutes || !$cdSeconds) return;
    var h = Math.min(99, Math.max(0, parseInt($cdHours.value,   10) || 0));
    var m = Math.min(59, Math.max(0, parseInt($cdMinutes.value, 10) || 0));
    var s = Math.min(59, Math.max(0, parseInt($cdSeconds.value, 10) || 0));
    $cdHours.value   = h;
    $cdMinutes.value = m;
    $cdSeconds.value = s;
  }

  function cdStart() {
    if (cd.running || cd.finished) return;
    if (cd.totalMs <= 0) {
      cd.totalMs = getCdTotalFromInputs();
      if (cd.totalMs <= 0) {
        cd.totalMs = 5 * 60 * 1000; // default 5 minutes
        if ($cdMinutes) $cdMinutes.value = 5;
      }
    }
    var remaining = cdRemainingMs();
    if (remaining <= 0) return;
    cd.running = true;
    cd.startTs = Date.now();
    startRaf();
    updateCdButtons();
    renderMini();
    saveState();
  }

  function cdPause() {
    if (!cd.running) return;
    cd.accumulated += Date.now() - cd.startTs;
    cd.running = false;
    cd.startTs = null;
    updateCdButtons();
    renderMini();
    saveState();
    if (!sw.running && !(mini.visible && mini.mode === 'clock')) stopRaf();
  }

  function cdReset() {
    cd.running     = false;
    cd.startTs     = null;
    cd.accumulated = 0;
    cd.finished    = false;
    cancelAlarm();
    hideCdFinished();
    renderCd();
    renderMini();
    updateCdButtons();
    saveState();
    if (!sw.running && !(mini.visible && mini.mode === 'clock')) stopRaf();
  }

  function cdRemainingMs() {
    var elapsed = cd.accumulated;
    if (cd.running && cd.startTs) elapsed += Date.now() - cd.startTs;
    var rem = cd.totalMs - elapsed;
    return rem < 0 ? 0 : rem;
  }

  function onCdFinished() {
    cd.running     = false;
    cd.startTs     = null;
    cd.finished    = true;
    cd.accumulated = cd.totalMs;
    updateCdButtons();
    renderAll();
    saveState();
    if (!sw.running && !(mini.visible && mini.mode === 'clock')) stopRaf();
    showCdFinished();
    playAlarm();
  }

  function updateCdButtons() {
    if (!$cdStart || !$cdPause) return;
    var canStart = !cd.running && !cd.finished && (cd.totalMs > 0 || getCdTotalFromInputs() > 0);
    $cdStart.disabled = !canStart;
    $cdPause.disabled = !cd.running;
    $cdStart.classList.toggle('tm-btn-disabled', !canStart);
    $cdPause.classList.toggle('tm-btn-disabled', !cd.running);

    var locked = cd.running;
    if ($cdHours)   $cdHours.disabled   = locked;
    if ($cdMinutes) $cdMinutes.disabled = locked;
    if ($cdSeconds) $cdSeconds.disabled = locked;
  }

  function showCdFinished() {
    if ($cdFinishedBanner) $cdFinishedBanner.classList.remove('tm-hidden');
  }
  function hideCdFinished() {
    if ($cdFinishedBanner) $cdFinishedBanner.classList.add('tm-hidden');
  }

  /* ============================================================
     ALARM  — pure data-URI beep (zero server dependency)
     ============================================================ */
  function buildAlarmDataUri() {
    var sampleRate = 8000;
    var duration   = 0.4;
    var freq       = 880;
    var numSamples = Math.floor(sampleRate * duration);
    var buf = new ArrayBuffer(44 + numSamples * 2);
    var view = new DataView(buf);

    function writeStr(off, str) {
      for (var i = 0; i < str.length; i++) view.setUint8(off + i, str.charCodeAt(i));
    }
    writeStr(0,  'RIFF');
    view.setUint32( 4,  36 + numSamples * 2, true);
    writeStr(8,  'WAVE');
    writeStr(12, 'fmt ');
    view.setUint32(16, 16, true);
    view.setUint16(20, 1, true);
    view.setUint16(22, 1, true);
    view.setUint32(24, sampleRate, true);
    view.setUint32(28, sampleRate * 2, true);
    view.setUint16(32, 2, true);
    view.setUint16(34, 16, true);
    writeStr(36, 'data');
    view.setUint32(40, numSamples * 2, true);

    for (var s = 0; s < numSamples; s++) {
      var envelope = s < numSamples * 0.1 ? s / (numSamples * 0.1) :
                     s > numSamples * 0.7 ? (numSamples - s) / (numSamples * 0.3) : 1;
      var sample = Math.sin(2 * Math.PI * freq * s / sampleRate) * envelope * 0x7fff;
      view.setInt16(44 + s * 2, sample | 0, true);
    }

    var bytes = new Uint8Array(buf);
    var binary = '';
    for (var i = 0; i < bytes.length; i++) binary += String.fromCharCode(bytes[i]);
    return 'data:audio/wav;base64,' + btoa(binary);
  }

  function playAlarm() {
    if (!alarmAudio) return;
    var plays = 0;
    function doPlay() {
      if (plays >= 3) return;
      plays++;
      alarmAudio.currentTime = 0;
      alarmAudio.play().catch(function () {});
      alarmTimeout = setTimeout(doPlay, 600);
    }
    doPlay();
  }

  function cancelAlarm() {
    if (alarmTimeout) { clearTimeout(alarmTimeout); alarmTimeout = null; }
    if (alarmAudio) { alarmAudio.pause(); alarmAudio.currentTime = 0; }
  }

  /* ============================================================
     RAF LOOP (Continuous frame-by-frame updates)
     ============================================================ */
  function startRaf() {
    if (rafId) return;
    function tick() {
      renderAll();
      // Check countdown completion
      if (cd.running && cdRemainingMs() === 0) {
        onCdFinished();
        return;
      }
      if (sw.running || cd.running || (mini.visible && mini.mode === 'clock')) {
        rafId = requestAnimationFrame(tick);
      } else {
        rafId = null;
      }
    }
    rafId = requestAnimationFrame(tick);
  }

  function stopRaf() {
    if (rafId) { cancelAnimationFrame(rafId); rafId = null; }
  }

  /* ============================================================
     RENDER
     ============================================================ */
  function renderAll() {
    renderSw();
    renderCd();
    renderMini();
  }

  function renderSw() {
    if (!$swDisplay) return;
    var text = formatMs(swElapsedMs(), true);
    if (text !== prevSwText) {
      $swDisplay.textContent = text;
      prevSwText = text;
    }
  }

  function renderCd() {
    if (!$cdDisplay) return;
    var rem = cdRemainingMs();
    var text = formatMs(rem, false);
    if (text !== prevCdText) {
      $cdDisplay.textContent = text;
      prevCdText = text;
    }

    if ($cdProgress) {
      var pct = cd.totalMs > 0 ? rem / cd.totalMs : 1;
      var circ = 2 * Math.PI * 54;
      var strokeVal = (circ * (1 - pct)).toFixed(2);
      if (strokeVal !== prevCdStroke) {
        $cdProgress.style.strokeDashoffset = strokeVal;
        prevCdStroke = strokeVal;
      }
      var color =
        pct > 0.5  ? '#34d399' :
        pct > 0.2  ? '#fbbf24' : '#f87171';
      if (color !== prevCdColor) {
        $cdProgress.style.stroke = color;
        prevCdColor = color;
      }
    }
    // Note: updateCdButtons() removed from render loop — called only on user actions
  }

  /* ============================================================
     MINIATURE WATCH / TIMER WIDGET RENDERING & CONTROLS
     ============================================================ */
  function renderMini() {
    if (!$miniWidget) return;

    if (mini.mode === 'stopwatch') {
      if ($miniModeLabel) $miniModeLabel.textContent = 'STOPWATCH';
      var ms = swElapsedMs();
      var totalSec = Math.floor(ms / 1000);
      var h = Math.floor(totalSec / 3600);
      var m = Math.floor((totalSec % 3600) / 60);
      var s = totalSec % 60;
      var hun = Math.floor((ms % 1000) / 10);

      var timeStr = pad(h) + ':' + pad(m) + ':' + pad(s);
      var msStr = '.' + pad(hun);
      if ($miniDisplay && timeStr !== prevMiniText) { $miniDisplay.textContent = timeStr; prevMiniText = timeStr; }
      if ($miniMs && msStr !== prevMiniMs) { $miniMs.textContent = msStr; prevMiniMs = msStr; }

      if ($miniDot) {
        if (sw.running) {
          $miniDot.className = 'mini-live-dot dot-running';
          $miniDot.title = 'Stopwatch running';
        } else if (sw.accumulated > 0) {
          $miniDot.className = 'mini-live-dot dot-paused';
          $miniDot.title = 'Stopwatch paused';
        } else {
          $miniDot.className = 'mini-live-dot';
          $miniDot.title = 'Stopwatch ready';
        }
      }

      $miniWidget.classList.toggle('is-running', sw.running);

      if ($miniBtnStart) {
        $miniBtnStart.disabled = sw.running;
        $miniBtnStart.classList.toggle('mini-disabled', sw.running);
      }
      if ($miniBtnPause) {
        $miniBtnPause.disabled = !sw.running;
        $miniBtnPause.classList.toggle('mini-disabled', !sw.running);
      }
      if ($miniBtnReset) {
        var canReset = sw.running || sw.accumulated > 0;
        $miniBtnReset.disabled = !canReset;
        $miniBtnReset.classList.toggle('mini-disabled', !canReset);
      }
    } else if (mini.mode === 'countdown') {
      if ($miniModeLabel) $miniModeLabel.textContent = 'TIMER';
      var rem = cdRemainingMs();
      var totalSec = Math.floor(rem / 1000);
      var h = Math.floor(totalSec / 3600);
      var m = Math.floor((totalSec % 3600) / 60);
      var s = totalSec % 60;
      var hun = Math.floor((rem % 1000) / 10);

      var timeStr = pad(h) + ':' + pad(m) + ':' + pad(s);
      var msStr = cd.finished ? 'DONE' : ('.' + pad(hun));
      if ($miniDisplay && timeStr !== prevMiniText) { $miniDisplay.textContent = timeStr; prevMiniText = timeStr; }
      if ($miniMs && msStr !== prevMiniMs) { $miniMs.textContent = msStr; prevMiniMs = msStr; }

      if ($miniDot) {
        if (cd.finished) {
          $miniDot.className = 'mini-live-dot dot-finished';
          $miniDot.title = 'Time is up!';
        } else if (cd.running) {
          $miniDot.className = 'mini-live-dot dot-running';
          $miniDot.title = 'Timer counting down';
        } else if (cd.accumulated > 0) {
          $miniDot.className = 'mini-live-dot dot-paused';
          $miniDot.title = 'Timer paused';
        } else {
          $miniDot.className = 'mini-live-dot';
          $miniDot.title = 'Timer ready';
        }
      }

      $miniWidget.classList.toggle('is-running', cd.running);

      if ($miniBtnStart) {
        var canStart = !cd.running && !cd.finished;
        $miniBtnStart.disabled = !canStart;
        $miniBtnStart.classList.toggle('mini-disabled', !canStart);
      }
      if ($miniBtnPause) {
        $miniBtnPause.disabled = !cd.running;
        $miniBtnPause.classList.toggle('mini-disabled', !cd.running);
      }
      if ($miniBtnReset) {
        var canReset = cd.running || cd.accumulated > 0 || cd.finished;
        $miniBtnReset.disabled = !canReset;
        $miniBtnReset.classList.toggle('mini-disabled', !canReset);
      }
    } else if (mini.mode === 'clock') {
      if ($miniModeLabel) $miniModeLabel.textContent = 'WATCH / CLOCK';
      var now = new Date();
      var ch = now.getHours();
      var cm = now.getMinutes();
      var cs = now.getSeconds();
      var ampm = ch >= 12 ? 'PM' : 'AM';
      var ch12 = ch % 12 || 12;

      var timeStr = pad(ch12) + ':' + pad(cm) + ':' + pad(cs);
      if ($miniDisplay && timeStr !== prevMiniText) { $miniDisplay.textContent = timeStr; prevMiniText = timeStr; }
      if ($miniMs && ampm !== prevMiniMs) { $miniMs.textContent = ampm; prevMiniMs = ampm; }

      if ($miniDot) {
        $miniDot.className = 'mini-live-dot dot-clock';
        $miniDot.title = 'Continuous Live Watch Time';
      }

      $miniWidget.classList.remove('is-running');

      if ($miniBtnStart) {
        $miniBtnStart.disabled = true;
        $miniBtnStart.classList.add('mini-disabled');
      }
      if ($miniBtnPause) {
        $miniBtnPause.disabled = true;
        $miniBtnPause.classList.add('mini-disabled');
      }
      if ($miniBtnReset) {
        $miniBtnReset.disabled = true;
        $miniBtnReset.classList.add('mini-disabled');
      }
    }
  }

  function onMiniStart() {
    if (mini.mode === 'stopwatch') {
      swStart();
    } else if (mini.mode === 'countdown') {
      cdStart();
    }
  }

  function onMiniPause() {
    if (mini.mode === 'stopwatch') {
      swPause();
    } else if (mini.mode === 'countdown') {
      cdPause();
    }
  }

  function onMiniReset() {
    if (mini.mode === 'stopwatch') {
      swReset();
    } else if (mini.mode === 'countdown') {
      cdReset();
    }
  }

  function cycleMiniMode() {
    if (mini.mode === 'stopwatch') {
      mini.mode = 'countdown';
    } else if (mini.mode === 'countdown') {
      mini.mode = 'clock';
    } else {
      mini.mode = 'stopwatch';
    }
    renderMini();
    if (mini.mode === 'clock' || sw.running || cd.running) {
      startRaf();
    }
    saveMiniState();
  }

  function showMini() {
    if (!$miniWidget) return;
    mini.visible = true;
    $miniWidget.classList.remove('mini-hidden');
    if ($btnMiniTimerToggle) $btnMiniTimerToggle.classList.add('active-glow');
    applyMiniPos();
    renderMini();
    if (sw.running || cd.running || mini.mode === 'clock') startRaf();
    saveMiniState();
  }

  function hideMini() {
    if (!$miniWidget) return;
    mini.visible = false;
    $miniWidget.classList.add('mini-hidden');
    if ($btnMiniTimerToggle) $btnMiniTimerToggle.classList.remove('active-glow');
    saveMiniState();
  }

  function toggleMini() {
    if (mini.visible) {
      hideMini();
    } else {
      showMini();
    }
  }

  function toggleCollapse() {
    if (!$miniWidget) return;
    mini.collapsed = !mini.collapsed;
    $miniWidget.classList.toggle('mini-collapsed', mini.collapsed);
    if ($miniCollapseIcon) {
      $miniCollapseIcon.className = mini.collapsed ? 'fa-solid fa-plus' : 'fa-solid fa-minus';
    }
    saveMiniState();
  }

  /* ============================================================
     DRAGGABLE MINIATURE WATCH POSITIONING
     ============================================================ */
  function applyMiniPos() {
    if (!$miniWidget) return;
    if (mini.pos && typeof mini.pos.left === 'number' && typeof mini.pos.top === 'number') {
      var widgetW = $miniWidget.offsetWidth || 224;
      var widgetH = $miniWidget.offsetHeight || 90;
      var maxL = Math.max(10, window.innerWidth - widgetW - 10);
      var maxT = Math.max(10, window.innerHeight - widgetH - 10);
      var clL = Math.min(Math.max(10, mini.pos.left), maxL);
      var clT = Math.min(Math.max(10, mini.pos.top), maxT);
      $miniWidget.style.left = clL + 'px';
      $miniWidget.style.top  = clT + 'px';
      $miniWidget.style.right = 'auto';
    } else {
      // Default: top 85px, right 20px
      $miniWidget.style.top = '85px';
      $miniWidget.style.right = '20px';
      $miniWidget.style.left = 'auto';
    }
  }

  function initMiniDrag() {
    if (!$miniHeader || !$miniWidget) return;
    var isDragging = false;
    var startX = 0, startY = 0;
    var startLeft = 0, startTop = 0;

    function getCoords(e) {
      if (e.touches && e.touches.length > 0) {
        return { x: e.touches[0].clientX, y: e.touches[0].clientY };
      }
      return { x: e.clientX, y: e.clientY };
    }

    function onPointerDown(e) {
      // Don't drag if user clicked an action button in the header
      if (e.target.closest('button')) return;
      isDragging = true;
      var c = getCoords(e);
      startX = c.x;
      startY = c.y;
      var rect = $miniWidget.getBoundingClientRect();
      startLeft = rect.left;
      startTop = rect.top;
      $miniWidget.classList.add('mini-is-dragging');

      document.addEventListener('mousemove', onPointerMove, { passive: false });
      document.addEventListener('mouseup', onPointerUp);
      document.addEventListener('touchmove', onPointerMove, { passive: false });
      document.addEventListener('touchend', onPointerUp);
      document.addEventListener('touchcancel', onPointerUp);
    }

    function onPointerMove(e) {
      if (!isDragging) return;
      if (e.cancelable) e.preventDefault();
      var c = getCoords(e);
      var dx = c.x - startX;
      var dy = c.y - startY;

      var newL = startLeft + dx;
      var newT = startTop + dy;
      var widgetW = $miniWidget.offsetWidth || 224;
      var widgetH = $miniWidget.offsetHeight || 90;
      var maxL = Math.max(10, window.innerWidth - widgetW - 10);
      var maxT = Math.max(10, window.innerHeight - widgetH - 10);
      newL = Math.min(Math.max(10, newL), maxL);
      newT = Math.min(Math.max(10, newT), maxT);

      $miniWidget.style.left = newL + 'px';
      $miniWidget.style.top  = newT + 'px';
      $miniWidget.style.right = 'auto';
    }

    function onPointerUp() {
      if (!isDragging) return;
      isDragging = false;
      $miniWidget.classList.remove('mini-is-dragging');
      document.removeEventListener('mousemove', onPointerMove);
      document.removeEventListener('mouseup', onPointerUp);
      document.removeEventListener('touchmove', onPointerMove);
      document.removeEventListener('touchend', onPointerUp);
      document.removeEventListener('touchcancel', onPointerUp);

      var rect = $miniWidget.getBoundingClientRect();
      mini.pos = { left: Math.round(rect.left), top: Math.round(rect.top) };
      saveMiniState();
    }

    $miniHeader.addEventListener('mousedown', onPointerDown);
    $miniHeader.addEventListener('touchstart', onPointerDown, { passive: false });
  }

  function formatMs(ms, showHundredths) {
    var totalSec = Math.floor(ms / 1000);
    var h   = Math.floor(totalSec / 3600);
    var m   = Math.floor((totalSec % 3600) / 60);
    var s   = totalSec % 60;
    var hun = Math.floor((ms % 1000) / 10);

    var base = pad(h) + ':' + pad(m) + ':' + pad(s);
    return showHundredths ? base + '.' + pad(hun) : base;
  }

  function pad(n) { return n < 10 ? '0' + n : '' + n; }

  /* ============================================================
     PERSISTENCE
     ============================================================ */
  function saveState() {
    try {
      var snapshot = {
        activeTab: activeTab,
        sw: {
          running:     sw.running,
          startTs:     sw.startTs,     // timestamp when current run started
          accumulated: sw.accumulated, // banked ms before current run
        },
        cd: {
          running:     cd.running,
          startTs:     cd.startTs,     // timestamp when current countdown started
          accumulated: cd.accumulated, // banked ms before current countdown
          totalMs:     cd.totalMs,
          finished:    cd.finished,
          hours:       parseInt($cdHours ? $cdHours.value : 0, 10) || 0,
          minutes:     parseInt($cdMinutes ? $cdMinutes.value : 0, 10) || 0,
          seconds:     parseInt($cdSeconds ? $cdSeconds.value : 0, 10) || 0,
        },
      };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(snapshot));
    } catch (e) {}
  }

  function loadState() {
    try {
      var raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return;
      var s = JSON.parse(raw);
      if (!s) return;

      activeTab = s.activeTab || 'stopwatch';

      if (s.sw) {
        sw.accumulated = (typeof s.sw.accumulated === 'number') ? s.sw.accumulated : 0;
        sw.running     = !!s.sw.running;
        // Keep the original startTs so elapsed time continues consistently across tab reload!
        if (sw.running && typeof s.sw.startTs === 'number') {
          sw.startTs = s.sw.startTs;
        } else {
          sw.startTs = null;
        }
      }

      if (s.cd) {
        cd.accumulated = (typeof s.cd.accumulated === 'number') ? s.cd.accumulated : 0;
        cd.finished    = !!s.cd.finished;
        cd.running     = !!s.cd.running && !cd.finished;

        // Keep the original startTs so countdown continues consistently across tab reload!
        if (cd.running && typeof s.cd.startTs === 'number') {
          cd.startTs = s.cd.startTs;
        } else {
          cd.startTs = null;
        }

        var h   = parseInt(s.cd.hours, 10) || 0;
        var m   = (typeof s.cd.minutes !== 'undefined') ? (parseInt(s.cd.minutes, 10) || 0) : 5;
        var sec = parseInt(s.cd.seconds, 10) || 0;
        if ($cdHours)   $cdHours.value   = h;
        if ($cdMinutes) $cdMinutes.value = m;
        if ($cdSeconds) $cdSeconds.value = sec;

        cd.totalMs = (typeof s.cd.totalMs === 'number' && s.cd.totalMs > 0)
          ? s.cd.totalMs
          : (h * 3600 + m * 60 + sec) * 1000;

        // Check if countdown expired while closed
        if (cd.running && cdRemainingMs() === 0) {
          cd.running     = false;
          cd.finished    = true;
          cd.startTs     = null;
          cd.accumulated = cd.totalMs;
        }
      }

      // If countdown is actively running, prioritize countdown
      if (cd.running && !sw.running) {
        activeTab = 'countdown';
        if (mini.mode !== 'clock') mini.mode = 'countdown';
      } else if (sw.running && !cd.running) {
        activeTab = 'stopwatch';
        if (mini.mode !== 'clock') mini.mode = 'stopwatch';
      }
    } catch (e) {}
  }

  function saveMiniState() {
    try {
      localStorage.setItem(STORAGE_KEY_MINI, JSON.stringify(mini));
    } catch (e) {}
  }

  function loadMiniState() {
    try {
      var raw = localStorage.getItem(STORAGE_KEY_MINI);
      if (!raw) {
        mini.visible = true;
        return;
      }
      var s = JSON.parse(raw);
      if (!s) return;
      if (typeof s.visible === 'boolean') mini.visible = s.visible;
      else mini.visible = true;
      if (typeof s.collapsed === 'boolean') mini.collapsed = s.collapsed;
      if (s.mode && ['stopwatch', 'countdown', 'clock'].indexOf(s.mode) !== -1) mini.mode = s.mode;
      if (s.pos && typeof s.pos.left === 'number' && typeof s.pos.top === 'number') mini.pos = s.pos;
    } catch (e) {
      mini.visible = true;
    }
  }

  function saveAll() {
    saveState();
    saveMiniState();
  }

})();
