import React, { useState } from 'react';

export default function BoardBar({
  boards,
  activeBoard,
  saveStatus, // 'saved' | 'saving' | 'error'
  statusMessage,
  isFullscreen,
  onSelectBoard,
  onRenameBoard,
  onCreateNewBoard,
  onOpenBoardsModal,
  onSaveBoard,
  onToggleFullscreen,
  onClose,
}) {
  const [isEditingName, setIsEditingName] = useState(false);
  const [nameVal, setNameVal] = useState(activeBoard?.name || '');

  const startEditing = () => {
    setNameVal(activeBoard?.name || '');
    setIsEditingName(true);
  };

  const saveName = () => {
    if (nameVal.trim() && activeBoard) {
      onRenameBoard(activeBoard.id, nameVal.trim());
    }
    setIsEditingName(false);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') saveName();
    if (e.key === 'Escape') setIsEditingName(false);
  };

  return (
    <div className="mb-wb-header">
      {/* ── Left Group ── */}
      <div className="mb-wb-header-left">
        <div className="mb-wb-title-group">
          <i className="fa-solid fa-chalkboard mb-wb-title-icon" aria-hidden="true"></i>
          <span>Whiteboard</span>
        </div>

        {/* Board Switcher Dropdown */}
        <div className="mb-wb-select-wrap">
          <i className="fa-solid fa-layer-group text-xs text-indigo-300" aria-hidden="true"></i>
          <select
            className="mb-wb-board-select"
            value={activeBoard?.id || ''}
            onChange={(e) => onSelectBoard(e.target.value)}
            aria-label="Select active board"
          >
            {boards.map((b) => (
              <option key={b.id} value={b.id}>
                {b.name}
              </option>
            ))}
          </select>
        </div>

        {/* Editable Name */}
        {isEditingName ? (
          <div className="flex items-center gap-1">
            <input
              type="text"
              className="mb-wb-input"
              style={{ width: '130px', padding: '0.2rem 0.5rem', fontSize: '0.78rem' }}
              value={nameVal}
              onChange={(e) => setNameVal(e.target.value)}
              onKeyDown={handleKeyDown}
              onBlur={saveName}
              autoFocus
            />
            <button
              type="button"
              className="mb-wb-btn mb-wb-btn-primary"
              style={{ padding: '0.2rem 0.5rem' }}
              onClick={saveName}
            >
              <i className="fa-solid fa-check text-xs"></i>
            </button>
          </div>
        ) : (
          <button
            type="button"
            className="mb-wb-btn mb-wb-btn-icon"
            onClick={startEditing}
            title="Rename active board"
            aria-label="Rename active board"
          >
            <i className="fa-solid fa-pen text-xs"></i>
          </button>
        )}

        {/* New Board Button */}
        <button
          type="button"
          className="mb-wb-btn"
          onClick={onCreateNewBoard}
          title="Create a new board"
        >
          <i className="fa-solid fa-plus text-xs"></i> New
        </button>

        {/* Manage Boards List Button */}
        <button
          type="button"
          className="mb-wb-btn"
          onClick={onOpenBoardsModal}
          title="View all saved boards"
        >
          <i className="fa-solid fa-folder-open text-xs"></i> Boards ({boards.length})
        </button>
      </div>

      {/* ── Right Group ── */}
      <div className="mb-wb-header-right">
        {/* Save Status Badge */}
        <div
          className={`mb-wb-status-badge mb-wb-status-${saveStatus}`}
          title={statusMessage || (saveStatus === 'saved' ? 'All changes saved to browser' : '')}
        >
          <span className="mb-wb-status-dot"></span>
          <span>
            {saveStatus === 'saving'
              ? 'Saving...'
              : saveStatus === 'error'
              ? 'Save Error'
              : 'Saved'}
          </span>
        </div>

        {/* Save Board Button */}
        <button
          type="button"
          className="mb-wb-btn mb-wb-btn-save"
          onClick={onSaveBoard}
          title="Save drawing immediately"
        >
          <i className="fa-solid fa-floppy-disk text-xs"></i> Save Board
        </button>

        {/* Fullscreen Toggle Button */}
        <button
          type="button"
          className="mb-wb-btn mb-wb-btn-icon"
          onClick={onToggleFullscreen}
          title={isFullscreen ? 'Exit fullscreen' : 'Expand fullscreen'}
          aria-label={isFullscreen ? 'Exit fullscreen' : 'Expand fullscreen'}
        >
          <i className={`fa-solid ${isFullscreen ? 'fa-compress' : 'fa-expand'} text-xs`}></i>
        </button>

        {/* Close Button */}
        <button
          type="button"
          id="wbBtnClose"
          className="mb-wb-btn mb-wb-btn-icon"
          onClick={onClose}
          title="Close whiteboard"
          aria-label="Close whiteboard"
        >
          <i className="fa-solid fa-xmark text-sm"></i>
        </button>
      </div>
    </div>
  );
}
