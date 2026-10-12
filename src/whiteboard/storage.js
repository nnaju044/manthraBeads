/**
 * storage.js — LocalStorage Persistence & Board Management for ManthraBeads Whiteboard
 * Key: manthrabeads_excalidraw_boards
 */

export const STORAGE_KEY = 'manthrabeads_excalidraw_boards';
export const LEGACY_STORAGE_KEY = 'manthra_whiteboard_v1';
export const CURRENT_VERSION = 1;

/**
 * Clean appState to persist only essential view state and exclude ephemeral internals
 */
export function cleanAppStateForStorage(appState) {
  if (!appState) return {};
  return {
    viewBackgroundColor: appState.viewBackgroundColor || '#0b0f2e',
    gridSize: appState.gridSize ?? null,
    zoom: appState.zoom ? { value: appState.zoom.value } : { value: 1 },
    scrollX: typeof appState.scrollX === 'number' ? appState.scrollX : 0,
    scrollY: typeof appState.scrollY === 'number' ? appState.scrollY : 0,
    theme: appState.theme || 'dark',
  };
}

/**
 * Convert legacy canvas strokes (if any) into Excalidraw freedraw elements safely
 */
export function convertLegacyStrokesToExcalidraw(legacyStrokes) {
  if (!Array.isArray(legacyStrokes) || legacyStrokes.length === 0) return [];
  const elements = [];
  const now = Date.now();

  legacyStrokes.forEach((stroke, idx) => {
    if (!stroke || !Array.isArray(stroke.points) || stroke.points.length === 0) return;
    const firstPoint = stroke.points[0];
    const originX = firstPoint.x || 0;
    const originY = firstPoint.y || 0;

    // Excalidraw points are [xOffset, yOffset] relative to element's (x, y)
    const points = stroke.points.map((pt) => [
      (pt.x || 0) - originX,
      (pt.y || 0) - originY,
    ]);

    let minX = 0, minY = 0, maxX = 0, maxY = 0;
    points.forEach(([px, py]) => {
      if (px < minX) minX = px;
      if (px > maxX) maxX = px;
      if (py < minY) minY = py;
      if (py > maxY) maxY = py;
    });

    elements.push({
      type: 'freedraw',
      id: `legacy_${idx}_${now}`,
      x: originX,
      y: originY,
      width: Math.max(1, maxX - minX),
      height: Math.max(1, maxY - minY),
      angle: 0,
      strokeColor: stroke.tool === 'eraser' ? '#0b0f2e' : (stroke.color || '#ffffff'),
      backgroundColor: 'transparent',
      fillStyle: 'solid',
      strokeWidth: stroke.size || 4,
      strokeStyle: 'solid',
      roughness: 0,
      opacity: 100,
      points,
      pressures: points.map(() => 0.5),
      simulatePressure: true,
      isDeleted: false,
      groupIds: [],
      frameId: null,
      roundness: null,
      seed: Math.floor(Math.random() * 100000),
      version: 1,
      versionNonce: 1,
    });
  });

  return elements;
}

/**
 * Create a new board object
 */
export function createNewBoard(name, elements = [], appState = null) {
  const id = `board_${Date.now()}_${Math.random().toString(36).substr(2, 6)}`;
  return {
    id,
    name: name || 'Whiteboard',
    createdAt: Date.now(),
    updatedAt: Date.now(),
    elements: elements || [],
    appState: cleanAppStateForStorage(appState || { viewBackgroundColor: '#0b0f2e', theme: 'dark' }),
  };
}

/**
 * Load all boards from localStorage with safe fallback and legacy migration
 */
export function loadBoardsData() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (parsed && Array.isArray(parsed.boards) && parsed.boards.length > 0) {
        return {
          version: parsed.version || CURRENT_VERSION,
          activeBoardId: parsed.activeBoardId || parsed.boards[0].id,
          boards: parsed.boards,
        };
      }
    }
  } catch (err) {
    console.warn('[ManthraBeads Whiteboard] Failed to parse saved boards:', err);
  }

  // Check if legacy data exists in manthra_whiteboard_v1
  let initialElements = [];
  try {
    const legacyRaw = localStorage.getItem(LEGACY_STORAGE_KEY);
    if (legacyRaw) {
      const legacyStrokes = JSON.parse(legacyRaw);
      if (Array.isArray(legacyStrokes) && legacyStrokes.length > 0) {
        initialElements = convertLegacyStrokesToExcalidraw(legacyStrokes);
      }
    }
  } catch (err) {
    console.warn('[ManthraBeads Whiteboard] Legacy strokes migration check error:', err);
  }

  const defaultBoard = createNewBoard(
    initialElements.length > 0 ? 'Restored Drawing' : 'Whiteboard 1',
    initialElements
  );

  const initialData = {
    version: CURRENT_VERSION,
    activeBoardId: defaultBoard.id,
    boards: [defaultBoard],
  };

  // Save the initial structure
  saveBoardsData(initialData);
  return initialData;
}

/**
 * Save boards structure to localStorage safely
 */
export function saveBoardsData(data) {
  if (!data || !Array.isArray(data.boards)) {
    return { success: false, error: 'Invalid data structure' };
  }

  try {
    const serialized = JSON.stringify({
      version: CURRENT_VERSION,
      activeBoardId: data.activeBoardId,
      boards: data.boards,
    });
    localStorage.setItem(STORAGE_KEY, serialized);
    return { success: true };
  } catch (err) {
    console.error('[ManthraBeads Whiteboard] Storage write failed:', err);
    const isQuota =
      err &&
      (err.name === 'QuotaExceededError' ||
        err.name === 'NS_ERROR_DOM_QUOTA_REACHED' ||
        err.code === 22);
    return {
      success: false,
      isQuota,
      error: isQuota
        ? 'Browser storage is full. Please delete or export older boards.'
        : 'Failed to save drawing to browser storage.',
    };
  }
}
