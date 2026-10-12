/**
 * whiteboard.js — ManthraBeads Canvas Whiteboard
 * Self-contained module. No external dependencies.
 * Persists strokes to localStorage after every completed stroke.
 */

(function () {
  'use strict';

  /* ============================================================
     CONSTANTS
     ============================================================ */
  var STORAGE_KEY = 'manthra_whiteboard_v1';

  /* ============================================================
     STATE
     ============================================================ */
  var canvas        = null;
  var ctx           = null;
  var isDrawing     = false;
  var currentTool   = 'pen';   // 'pen' | 'eraser'
  var penColor      = '#ffffff';
  var penSize       = 4;
  var eraserSize    = 28;
  var lastX         = 0;
  var lastY         = 0;
  var strokes       = [];      // persisted stroke data
  var currentStroke = null;   // stroke being built right now

  /* ============================================================
     DOM REFS — resolved lazily after modal is inserted
     ============================================================ */
  var $modal        = null;
  var $canvas       = null;
  var $btnClose     = null;
  var $btnPen       = null;
  var $btnEraser    = null;
  var $btnClear     = null;
  var $colorPicker  = null;
  var $penSizeInput = null;
  var $cursorDot    = null;

  /* ============================================================
     PUBLIC API  — called by the page
     ============================================================ */
  window.WhiteboardModal = {
    init: init,
    open: open,
    close: close,
  };

  /* ============================================================
     INIT
     ============================================================ */
  function init() {
    $modal        = document.getElementById('whiteboardModal');
    $canvas       = document.getElementById('whiteboardCanvas');
    $btnClose     = document.getElementById('wbBtnClose');
    $btnPen       = document.getElementById('wbBtnPen');
    $btnEraser    = document.getElementById('wbBtnEraser');
    $btnClear     = document.getElementById('wbBtnClear');
    $colorPicker  = document.getElementById('wbColorPicker');
    $penSizeInput = document.getElementById('wbPenSize');
    $cursorDot    = document.getElementById('wbCursorDot');

    if (!$modal || !$canvas) return;

    ctx = $canvas.getContext('2d');

    // Wire controls
    $btnClose.addEventListener('click', close);
    $btnPen.addEventListener('click', function () { setTool('pen'); });
    $btnEraser.addEventListener('click', function () { setTool('eraser'); });
    $btnClear.addEventListener('click', clearBoard);
    $colorPicker.addEventListener('input', function () { penColor = this.value; });
    $penSizeInput.addEventListener('input', function () { penSize = parseInt(this.value, 10); });

    // Close on backdrop click
    $modal.addEventListener('click', function (e) {
      if (e.target === $modal) close();
    });

    // Close on Escape
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && !$modal.classList.contains('wb-hidden')) close();
    });

    // Canvas events — mouse
    $canvas.addEventListener('mousedown',  onPointerDown);
    $canvas.addEventListener('mousemove',  onPointerMove);
    $canvas.addEventListener('mouseup',    onPointerUp);
    $canvas.addEventListener('mouseleave', onPointerUp);

    // Canvas events — touch / stylus
    $canvas.addEventListener('touchstart',  onTouchStart,  { passive: false });
    $canvas.addEventListener('touchmove',   onTouchMove,   { passive: false });
    $canvas.addEventListener('touchend',    onTouchEnd,    { passive: false });
    $canvas.addEventListener('touchcancel', onTouchEnd,    { passive: false });

    // Pointer events for stylus pressure (optional enhancement)
    $canvas.addEventListener('pointerenter', onPointerCursorMove);
    $canvas.addEventListener('pointermove',  onPointerCursorMove);
    $canvas.addEventListener('pointerleave', function () {
      if ($cursorDot) $cursorDot.style.display = 'none';
    });

    // Resize canvas when modal is shown
    window.addEventListener('resize', function () {
      if (!$modal.classList.contains('wb-hidden')) resizeCanvas();
    });

    updateToolUI();
  }

  /* ============================================================
     OPEN / CLOSE
     ============================================================ */
  function open() {
    if (!$modal) return;
    $modal.classList.remove('wb-hidden');
    // Small delay so CSS transition fires after display change
    requestAnimationFrame(function () {
      $modal.classList.add('wb-visible');
      resizeCanvas();
      restoreStrokes();
    });
  }

  function close() {
    if (!$modal) return;
    $modal.classList.remove('wb-visible');
    // Wait for fade-out transition
    setTimeout(function () {
      $modal.classList.add('wb-hidden');
    }, 250);
  }

  /* ============================================================
     CANVAS RESIZE
     ============================================================ */
  function resizeCanvas() {
    var surface = document.getElementById('wbSurface');
    if (!surface || !$canvas) return;

    var rect = surface.getBoundingClientRect();
    $canvas.width  = Math.floor(rect.width);
    $canvas.height = Math.floor(rect.height);
    // Replay persisted strokes on the freshly sized canvas (includes base fill)
    replayStrokes();
  }

  /* ============================================================
     TOOL MANAGEMENT
     ============================================================ */
  function setTool(tool) {
    currentTool = tool;
    updateToolUI();
  }

  function updateToolUI() {
    if (!$btnPen || !$btnEraser) return;
    $btnPen.classList.toggle('wb-tool-active', currentTool === 'pen');
    $btnEraser.classList.toggle('wb-tool-active', currentTool === 'eraser');
    $btnPen.setAttribute('aria-pressed', currentTool === 'pen' ? 'true' : 'false');
    $btnEraser.setAttribute('aria-pressed', currentTool === 'eraser' ? 'true' : 'false');
    if ($canvas) {
      $canvas.style.cursor = 'none'; // custom dot cursor always
    }
  }

  /* ============================================================
     CUSTOM CURSOR DOT
     ============================================================ */
  function onPointerCursorMove(e) {
    if (!$cursorDot || !$canvas) return;
    var rect   = $canvas.getBoundingClientRect();
    var dotR   = (currentTool === 'eraser' ? eraserSize : penSize) / 2;
    $cursorDot.style.display = 'block';
    $cursorDot.style.width   = (dotR * 2) + 'px';
    $cursorDot.style.height  = (dotR * 2) + 'px';
    $cursorDot.style.left    = (e.clientX - dotR) + 'px';
    $cursorDot.style.top     = (e.clientY - dotR) + 'px';
    $cursorDot.style.borderColor = currentTool === 'eraser' ? 'rgba(255,255,255,0.5)' : penColor;
  }

  /* ============================================================
     COORDINATE HELPERS
     ============================================================ */
  function getCanvasCoords(clientX, clientY) {
    var rect  = $canvas.getBoundingClientRect();
    var scaleX = $canvas.width  / rect.width;
    var scaleY = $canvas.height / rect.height;
    return {
      x: (clientX - rect.left) * scaleX,
      y: (clientY - rect.top)  * scaleY,
    };
  }

  /* ============================================================
     MOUSE HANDLERS
     ============================================================ */
  function onPointerDown(e) {
    isDrawing = true;
    var c = getCanvasCoords(e.clientX, e.clientY);
    lastX = c.x; lastY = c.y;
    startStroke(c.x, c.y);
  }

  function onPointerMove(e) {
    if (!isDrawing) return;
    var c = getCanvasCoords(e.clientX, e.clientY);
    drawSegment(lastX, lastY, c.x, c.y);
    addPoint(c.x, c.y);
    lastX = c.x; lastY = c.y;
  }

  function onPointerUp() {
    if (!isDrawing) return;
    isDrawing = false;
    endStroke();
  }

  /* ============================================================
     TOUCH / STYLUS HANDLERS
     ============================================================ */
  function onTouchStart(e) {
    e.preventDefault();
    var touch = e.changedTouches[0];
    isDrawing = true;
    var c = getCanvasCoords(touch.clientX, touch.clientY);
    lastX = c.x; lastY = c.y;
    startStroke(c.x, c.y);
  }

  function onTouchMove(e) {
    e.preventDefault();
    if (!isDrawing) return;
    var touch = e.changedTouches[0];
    var c = getCanvasCoords(touch.clientX, touch.clientY);
    drawSegment(lastX, lastY, c.x, c.y);
    addPoint(c.x, c.y);
    lastX = c.x; lastY = c.y;
  }

  function onTouchEnd(e) {
    e.preventDefault();
    if (!isDrawing) return;
    isDrawing = false;
    endStroke();
  }

  /* ============================================================
     DRAWING PRIMITIVES
     ============================================================ */
  function startStroke(x, y) {
    currentStroke = {
      tool:        currentTool,
      color:       penColor,
      size:        currentTool === 'eraser' ? eraserSize : penSize,
      points:      [{ x: x, y: y }],
    };

    ctx.beginPath();
    ctx.arc(x, y, currentStroke.size / 2, 0, Math.PI * 2);
    ctx.fillStyle = currentTool === 'eraser' ? '#1a1f4e' : penColor;
    ctx.fill();
  }

  function addPoint(x, y) {
    if (currentStroke) currentStroke.points.push({ x: x, y: y });
  }

  function drawSegment(x1, y1, x2, y2) {
    if (!ctx) return;
    var size  = currentTool === 'eraser' ? eraserSize : penSize;
    var color = currentTool === 'eraser' ? '#1a1f4e' : penColor;

    ctx.beginPath();
    ctx.moveTo(x1, y1);
    ctx.lineTo(x2, y2);
    ctx.strokeStyle = color;
    ctx.lineWidth   = size;
    ctx.lineCap     = 'round';
    ctx.lineJoin    = 'round';
    ctx.stroke();
  }

  function endStroke() {
    if (currentStroke && currentStroke.points.length > 0) {
      strokes.push(currentStroke);
      saveStrokes();
    }
    currentStroke = null;
  }

  /* ============================================================
     CLEAR
     ============================================================ */
  function clearBoard() {
    if (!ctx || !$canvas) return;
    ctx.fillStyle = '#1a1f4e';
    ctx.fillRect(0, 0, $canvas.width, $canvas.height);
    strokes = [];
    saveStrokes();
  }

  /* ============================================================
     REPLAY STROKES (used after resize / restore)
     ============================================================ */
  function replayStrokes() {
    if (!ctx || !$canvas) return;
    ctx.fillStyle = '#1a1f4e';
    ctx.fillRect(0, 0, $canvas.width, $canvas.height);

    strokes.forEach(function (stroke) {
      var pts   = stroke.points;
      var color = stroke.tool === 'eraser' ? '#1a1f4e' : stroke.color;
      var size  = stroke.size;

      if (pts.length === 0) return;

      // Dot for single-point strokes
      ctx.beginPath();
      ctx.arc(pts[0].x, pts[0].y, size / 2, 0, Math.PI * 2);
      ctx.fillStyle = color;
      ctx.fill();

      if (pts.length > 1) {
        ctx.beginPath();
        ctx.moveTo(pts[0].x, pts[0].y);
        for (var i = 1; i < pts.length; i++) {
          ctx.lineTo(pts[i].x, pts[i].y);
        }
        ctx.strokeStyle = color;
        ctx.lineWidth   = size;
        ctx.lineCap     = 'round';
        ctx.lineJoin    = 'round';
        ctx.stroke();
      }
    });
  }

  /* ============================================================
     PERSISTENCE
     ============================================================ */
  function saveStrokes() {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(strokes));
    } catch (e) {
      // Storage quota exceeded — silently ignore
    }
  }

  function restoreStrokes() {
    try {
      var raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        strokes = JSON.parse(raw) || [];
      } else {
        strokes = [];
      }
    } catch (e) {
      strokes = [];
    }
    replayStrokes();
  }

})();
