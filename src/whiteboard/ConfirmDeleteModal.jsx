import React from 'react';

export default function ConfirmDeleteModal({ board, onConfirm, onCancel }) {
  if (!board) return null;

  return (
    <div className="mb-wb-modal-backdrop" role="dialog" aria-modal="true" aria-labelledby="delModalTitle">
      <div className="mb-wb-modal-dialog" style={{ maxWidth: '400px' }}>
        <div className="mb-wb-modal-header">
          <h3 id="delModalTitle" className="mb-wb-modal-title" style={{ color: '#f87171' }}>
            <i className="fa-solid fa-triangle-exclamation mr-1.5" aria-hidden="true"></i>
            Delete Board
          </h3>
          <button
            type="button"
            className="mb-wb-btn mb-wb-btn-icon"
            onClick={onCancel}
            aria-label="Close dialog"
          >
            <i className="fa-solid fa-xmark"></i>
          </button>
        </div>

        <div className="mb-wb-modal-body">
          <p style={{ margin: '0 0 0.75rem 0', fontSize: '0.9rem', lineHeight: '1.4' }}>
            Are you sure you want to delete <strong>"{board.name}"</strong>?
          </p>
          <p style={{ margin: 0, fontSize: '0.8rem', color: 'rgba(224, 231, 255, 0.6)' }}>
            This drawing will be permanently removed from your saved boards. This action cannot be undone.
          </p>
        </div>

        <div className="mb-wb-modal-footer">
          <button type="button" className="mb-wb-btn" onClick={onCancel}>
            Cancel
          </button>
          <button
            type="button"
            className="mb-wb-btn mb-wb-btn-danger"
            onClick={() => onConfirm(board.id)}
            autoFocus
          >
            <i className="fa-solid fa-trash-can mr-1"></i>
            Delete Board
          </button>
        </div>
      </div>
    </div>
  );
}
