import React, { useState } from 'react';

export default function SaveBoardModal({
  currentBoard,
  elementsCount = 0,
  onSaveAndUpdate,
  onSaveAsNew,
  onClose,
}) {
  const [boardName, setBoardName] = useState(currentBoard?.name || 'Whiteboard');
  const [error, setError] = useState('');

  const handleUpdate = (e) => {
    e.preventDefault();
    const trimmed = boardName.trim();
    if (!trimmed) {
      setError('Please enter a board name.');
      return;
    }
    onSaveAndUpdate(trimmed);
  };

  const handleSaveAsNew = (e) => {
    e.preventDefault();
    const trimmed = boardName.trim();
    if (!trimmed) {
      setError('Please enter a board name.');
      return;
    }
    onSaveAsNew(trimmed);
  };

  return (
    <div className="mb-wb-modal-overlay" role="dialog" aria-modal="true" aria-labelledby="saveModalTitle">
      <div className="mb-wb-modal-card" style={{ maxWidth: '440px' }}>
        {/* Header */}
        <div className="mb-wb-modal-header">
          <div className="flex items-center gap-2">
            <i className="fa-solid fa-floppy-disk text-emerald-400"></i>
            <h3 id="saveModalTitle" className="font-bold text-sm text-white">
              Save Whiteboard
            </h3>
          </div>
          <button
            type="button"
            className="mb-wb-btn-close"
            onClick={onClose}
            aria-label="Close dialog"
          >
            <i className="fa-solid fa-xmark"></i>
          </button>
        </div>

        {/* Content */}
        <div className="mb-wb-modal-body">
          <label className="block text-xs font-semibold text-indigo-200 mb-1.5">
            Board Name
          </label>
          <input
            type="text"
            className="mb-wb-input w-full mb-3"
            style={{ width: '100%', padding: '0.5rem 0.75rem', fontSize: '0.85rem' }}
            value={boardName}
            onChange={(e) => {
              setBoardName(e.target.value);
              if (error) setError('');
            }}
            placeholder="e.g. Lesson 2: Five Combinations"
            autoFocus
          />

          {error && (
            <p className="text-xs text-rose-400 mb-3">{error}</p>
          )}

          <div className="p-3 rounded-lg bg-indigo-950/40 border border-white/5 text-xs text-indigo-300/80 mb-4 flex items-center justify-between">
            <span className="flex items-center gap-1.5">
              <i className="fa-solid fa-shapes text-indigo-400"></i>
              {elementsCount} {elementsCount === 1 ? 'drawing element' : 'drawing elements'}
            </span>
            <span className="text-emerald-400/90 font-medium flex items-center gap-1">
              <i className="fa-solid fa-check text-xs"></i> Saved to browser storage
            </span>
          </div>

          <div className="flex flex-col gap-2">
            <button
              type="button"
              className="mb-wb-btn mb-wb-btn-primary w-full justify-center py-2"
              onClick={handleUpdate}
            >
              <i className="fa-solid fa-floppy-disk text-xs"></i> Save &amp; Update "{boardName.trim() || 'Board'}"
            </button>

            <button
              type="button"
              className="mb-wb-btn w-full justify-center py-2"
              onClick={handleSaveAsNew}
              title="Save a copy of this whiteboard as a new separate board"
            >
              <i className="fa-solid fa-copy text-xs"></i> Save as New Board
            </button>
          </div>
        </div>

        {/* Footer */}
        <div className="mb-wb-modal-footer flex justify-end">
          <button
            type="button"
            className="mb-wb-btn text-xs"
            onClick={onClose}
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}
