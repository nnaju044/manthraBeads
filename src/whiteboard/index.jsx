import React from 'react';
import { createRoot } from 'react-dom/client';
import WhiteboardApp from './WhiteboardApp';

/**
 * Scroll-to helper — called by the Board button instead of opening a modal.
 */
function scrollToWhiteboard() {
  const section = document.getElementById('mathsWorkspaceSection');
  if (section) {
    section.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }
}

// Provide a backwards-compatible window.WhiteboardModal stub.
// `open` now scrolls to the inline board; modal logic is no longer used.
window.WhiteboardModal = window.WhiteboardModal || {
  init: () => {},
  open: scrollToWhiteboard,
  close: () => {},
  save: () => {},
  getBoards: () => [],
  getActiveBoard: () => null,
};

let reactRoot = null;

function mountWhiteboard() {
  // Mount into the inline container that lives on the page below the abacus.
  const container = document.getElementById('excalidrawInline');
  if (!container) return;

  if (!reactRoot) {
    reactRoot = createRoot(container);
    reactRoot.render(<WhiteboardApp inline />);
  }

  // Override WhiteboardModal.open now that React is mounted and we have the
  // real scroll target available.
  window.WhiteboardModal.open = scrollToWhiteboard;
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', mountWhiteboard);
} else {
  mountWhiteboard();
}

