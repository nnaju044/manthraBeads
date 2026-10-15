import React, { useState, useEffect, useRef } from 'react';

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
  onOpenSaveAsModal,
  onToggleFullscreen,
  onClose,
}) {
  const [isEditingName, setIsEditingName] = useState(false);
  const [nameVal, setNameVal] = useState(activeBoard?.name || '');
  const [saveBtnState, setSaveBtnState] = useState('idle'); // 'idle' | 'saving' | 'saved'
  const [isSaveMenuOpen, setIsSaveMenuOpen] = useState(false);
  const saveMenuRef = useRef(null);

  // Sync name input when activeBoard changes
  useEffect(() => {
    setNameVal(activeBoard?.name || '');
  }, [activeBoard?.id, activeBoard?.name]);

  // Close save dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (saveMenuRef.current && !saveMenuRef.current.contains(e.target)) {
        setIsSaveMenuOpen(false);
      }
    };
    if (isSaveMenuOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isSaveMenuOpen]);

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

  const handleSaveClick = async () => {
    if (saveBtnState === 'saving') return;
    setSaveBtnState('saving');

    try {
      const res = await onSaveBoard();
      if (res && res.success !== false) {
        setSaveBtnState('saved');
        setTimeout(() => {
          setSaveBtnState('idle');
        }, 2500);
      } else {
        setSaveBtnState('idle');
      }
    } catch (err) {
      console.error('[ManthraBeads Whiteboard] Save button error:', err);
      setSaveBtnState('idle');
    }
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
              style={{ width: '140px', padding: '0.2rem 0.5rem', fontSize: '0.78rem' }}
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
            {statusMessage ||
              (saveStatus === 'saving'
                ? 'Saving...'
                : saveStatus === 'error'
                ? 'Save Error'
                : 'Saved')}
          </span>
        </div>

        {/* Save Board Button Group */}
        <div className="mb-wb-save-group" ref={saveMenuRef}>
          <button
            type="button"
            className={`mb-wb-btn mb-wb-btn-save ${
              saveBtnState === 'saved' ? 'mb-wb-btn-save-success' : ''
            }`}
            onClick={handleSaveClick}
            disabled={saveBtnState === 'saving'}
            title="Save drawing immediately"
          >
            {saveBtnState === 'saving' ? (
              <>
                <i className="fa-solid fa-circle-notch fa-spin text-xs"></i>
                <span>Saving...</span>
              </>
            ) : saveBtnState === 'saved' ? (
              <>
                <i className="fa-solid fa-check text-xs"></i>
                <span>Saved! ✓</span>
              </>
            ) : (
              <>
                <i className="fa-solid fa-floppy-disk text-xs"></i>
                <span>Save Board</span>
              </>
            )}
          </button>

          {/* Dropdown Options for Save */}
          <button
            type="button"
            className="mb-wb-btn mb-wb-save-dropdown-trigger"
            onClick={() => setIsSaveMenuOpen((prev) => !prev)}
            title="Save options (Name, Save as New)"
            aria-label="Save options"
          >
            <i className={`fa-solid fa-chevron-down text-xs transition-transform ${isSaveMenuOpen ? 'rotate-180' : ''}`}></i>
          </button>

          {isSaveMenuOpen && (
            <div className="mb-wb-save-dropdown-menu">
              <button
                type="button"
                className="mb-wb-save-dropdown-item"
                onClick={() => {
                  setIsSaveMenuOpen(false);
                  if (onOpenSaveAsModal) onOpenSaveAsModal();
                }}
              >
                <i className="fa-solid fa-pen-to-square text-xs text-indigo-400"></i>
                <span>Save &amp; Name Board...</span>
              </button>
              <button
                type="button"
                className="mb-wb-save-dropdown-item"
                onClick={() => {
                  setIsSaveMenuOpen(false);
                  if (onOpenSaveAsModal) onOpenSaveAsModal();
                }}
              >
                <i className="fa-solid fa-copy text-xs text-emerald-400"></i>
                <span>Save as New Board...</span>
              </button>
            </div>
          )}
        </div>

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
