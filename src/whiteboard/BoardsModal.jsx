import React, { useState } from 'react';

export default function BoardsModal({
  boards,
  activeBoardId,
  onSelectBoard,
  onRenameBoard,
  onRequestDeleteBoard,
  onCreateNewBoard,
  onClose,
}) {
  const [editingId, setEditingId] = useState(null);
  const [editName, setEditName] = useState('');

  const startRename = (b) => {
    setEditingId(b.id);
    setEditName(b.name);
  };

  const submitRename = (id) => {
    if (editName.trim()) {
      onRenameBoard(id, editName.trim());
    }
    setEditingId(null);
  };

  const handleKeyDown = (e, id) => {
    if (e.key === 'Enter') submitRename(id);
    if (e.key === 'Escape') setEditingId(null);
  };

  const formatDate = (ts) => {
    if (!ts) return '';
    try {
      const d = new Date(ts);
      return d.toLocaleDateString(undefined, {
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      });
    } catch (e) {
      return '';
    }
  };

  return (
    <div className="mb-wb-modal-backdrop" role="dialog" aria-modal="true" aria-labelledby="boardsModalTitle">
      <div className="mb-wb-modal-dialog">
        <div className="mb-wb-modal-header">
          <div className="flex items-center gap-2">
            <i className="fa-solid fa-folder-open text-indigo-400"></i>
            <h3 id="boardsModalTitle" className="mb-wb-modal-title">
              Saved Whiteboards
            </h3>
            <span className="text-xs text-indigo-200/60 font-semibold ml-1">
              ({boards.length})
            </span>
          </div>
          <button
            type="button"
            className="mb-wb-btn mb-wb-btn-icon"
            onClick={onClose}
            aria-label="Close dialog"
          >
            <i className="fa-solid fa-xmark"></i>
          </button>
        </div>

        <div className="mb-wb-modal-body">
          <div className="mb-wb-boards-list">
            {boards.map((b) => {
              const isActive = b.id === activeBoardId;
              const isEditing = editingId === b.id;
              const elemCount = Array.isArray(b.elements) ? b.elements.length : 0;

              return (
                <div
                  key={b.id}
                  className={`mb-wb-board-item ${isActive ? 'active-board' : ''}`}
                >
                  <div className="mb-wb-board-meta" style={{ flex: 1 }}>
                    {isEditing ? (
                      <div className="flex items-center gap-1.5">
                        <input
                          type="text"
                          className="mb-wb-input"
                          value={editName}
                          onChange={(e) => setEditName(e.target.value)}
                          onKeyDown={(e) => handleKeyDown(e, b.id)}
                          autoFocus
                          style={{ padding: '0.3rem 0.5rem', fontSize: '0.85rem' }}
                        />
                        <button
                          type="button"
                          className="mb-wb-btn mb-wb-btn-primary"
                          style={{ padding: '0.3rem 0.6rem' }}
                          onClick={() => submitRename(b.id)}
                          title="Save name"
                        >
                          <i className="fa-solid fa-check"></i>
                        </button>
                      </div>
                    ) : (
                      <>
                        <div className="flex items-center gap-2">
                          <span className="mb-wb-board-name" title={b.name}>
                            {b.name}
                          </span>
                          {isActive && (
                            <span
                              style={{
                                fontSize: '0.65rem',
                                padding: '0.1rem 0.4rem',
                                borderRadius: '9999px',
                                background: 'rgba(99, 102, 241, 0.3)',
                                color: '#a5b4fc',
                                fontWeight: 700,
                              }}
                            >
                              CURRENT
                            </span>
                          )}
                        </div>
                        <span className="mb-wb-board-date">
                          Updated {formatDate(b.updatedAt)} • {elemCount} elements
                        </span>
                      </>
                    )}
                  </div>

                  <div className="mb-wb-board-actions">
                    {!isActive && !isEditing && (
                      <button
                        type="button"
                        className="mb-wb-btn"
                        onClick={() => {
                          onSelectBoard(b.id);
                          onClose();
                        }}
                        title="Open this board"
                      >
                        <i className="fa-solid fa-arrow-right-to-bracket text-xs"></i> Open
                      </button>
                    )}

                    {!isEditing && (
                      <button
                        type="button"
                        className="mb-wb-btn mb-wb-btn-icon"
                        onClick={() => startRename(b)}
                        title="Rename board"
                        aria-label={`Rename ${b.name}`}
                      >
                        <i className="fa-solid fa-pen text-xs"></i>
                      </button>
                    )}

                    {!isEditing && (
                      <button
                        type="button"
                        className="mb-wb-btn mb-wb-btn-icon mb-wb-btn-danger"
                        onClick={() => onRequestDeleteBoard(b)}
                        title="Delete board"
                        aria-label={`Delete ${b.name}`}
                      >
                        <i className="fa-solid fa-trash-can text-xs"></i>
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="mb-wb-modal-footer" style={{ justifyContent: 'space-between' }}>
          <button
            type="button"
            className="mb-wb-btn mb-wb-btn-primary"
            onClick={() => {
              onCreateNewBoard();
              onClose();
            }}
          >
            <i className="fa-solid fa-plus mr-1"></i> New Board
          </button>

          <button type="button" className="mb-wb-btn" onClick={onClose}>
            Done
          </button>
        </div>
      </div>
    </div>
  );
}
