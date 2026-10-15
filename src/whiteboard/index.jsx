import React from 'react';
import { createRoot } from 'react-dom/client';
import WhiteboardApp from './WhiteboardApp';

// Immediate fallback so WhiteboardModal is defined immediately even if called before React finishes mount
window.WhiteboardModal = window.WhiteboardModal || {
  open: () => {
    const modal = document.getElementById('whiteboardModal');
    if (modal) {
      modal.classList.remove('wb-hidden');
      requestAnimationFrame(() => modal.classList.add('wb-visible'));
    }
  },
  close: () => {
    const modal = document.getElementById('whiteboardModal');
    if (modal) {
      modal.classList.remove('wb-visible');
      setTimeout(() => modal.classList.add('wb-hidden'), 250);
    }
  },
  init: () => {},
};

let reactRoot = null;

function mountWhiteboard() {
  const container = document.getElementById('excalidrawAppRoot');
  if (!container) return;

  if (!reactRoot) {
    reactRoot = createRoot(container);
    reactRoot.render(<WhiteboardApp />);
  }
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', mountWhiteboard);
} else {
  mountWhiteboard();
}

