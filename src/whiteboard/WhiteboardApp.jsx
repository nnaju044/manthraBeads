import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { Excalidraw, restoreElements, getSceneVersion } from '@excalidraw/excalidraw';
import '@excalidraw/excalidraw/index.css';
import './whiteboard.css';

import {
  loadBoardsData,
  saveBoardsData,
  createNewBoard,
  cleanAppStateForStorage,
} from './storage';

import BoardBar from './BoardBar';
import BoardsModal from './BoardsModal';
import SaveBoardModal from './SaveBoardModal';
import ConfirmDeleteModal from './ConfirmDeleteModal';

export default function WhiteboardApp() {
  const [data, setData] = useState(() => loadBoardsData());
  const [excalidrawAPI, setExcalidrawAPI] = useState(null);
  const [saveStatus, setSaveStatus] = useState('saved'); // 'saved' | 'saving' | 'error'
  const [statusMessage, setStatusMessage] = useState('');
  const [showBoardsModal, setShowBoardsModal] = useState(false);
  const [showSaveAsModal, setShowSaveAsModal] = useState(false);
  const [boardToDelete, setBoardToDelete] = useState(null);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [toast, setToast] = useState(null);

  const activeBoard =
    data.boards.find((b) => b.id === data.activeBoardId) || data.boards[0];

  const activeBoardRef = useRef(activeBoard);
  activeBoardRef.current = activeBoard;

  const dataRef = useRef(data);
  dataRef.current = data;

  const saveTimerRef = useRef(null);
  const toastTimerRef = useRef(null);
  const pendingChangesRef = useRef(null);
  const isLoadingBoardRef = useRef(true);
  const lastSavedVersionRef = useRef(getSceneVersion(activeBoard?.elements || []));

  // Memoize initialData once on mount so Excalidraw doesn't reload on parent re-renders
  const initialData = useMemo(() => {
    return {
      elements: activeBoard?.elements || [],
      appState: {
        viewBackgroundColor: activeBoard?.appState?.viewBackgroundColor || '#0b0f2e',
        theme: 'dark',
        ...cleanAppStateForStorage(activeBoard?.appState),
      },
      scrollToContent: true,
    };
  }, []);

  /**
   * Display floating toast with auto-dismiss
   */
  const showToast = useCallback((message, type = 'success', actions = []) => {
    if (toastTimerRef.current) {
      clearTimeout(toastTimerRef.current);
    }
    setToast({ message, type, actions });
    toastTimerRef.current = setTimeout(() => {
      setToast(null);
    }, 4000);
  }, []);

  /**
   * Flush any unpersisted drawing edits immediately to localStorage
   */
  const flushPendingSave = useCallback(() => {
    if (saveTimerRef.current) {
      clearTimeout(saveTimerRef.current);
      saveTimerRef.current = null;
    }

    if (!pendingChangesRef.current || !excalidrawAPI) {
      return { success: true };
    }

    const { elements, appState } = pendingChangesRef.current;
    pendingChangesRef.current = null;

    const currentData = dataRef.current;
    const currentActive = activeBoardRef.current;
    if (!currentActive) return { success: false, error: 'No active board' };

    const updatedBoards = currentData.boards.map((b) => {
      if (b.id === currentActive.id) {
        return {
          ...b,
          elements: elements || [],
          appState: cleanAppStateForStorage(appState),
          updatedAt: Date.now(),
        };
      }
      return b;
    });

    const newData = {
      ...currentData,
      boards: updatedBoards,
    };

    const res = saveBoardsData(newData);
    dataRef.current = newData;
    setData(newData);

    if (res.success) {
      lastSavedVersionRef.current = getSceneVersion(elements || []);
      setSaveStatus('saved');
    } else {
      setSaveStatus('error');
      setStatusMessage(res.error || 'Failed to save');
    }
    return res;
  }, [excalidrawAPI]);

  /**
   * Handle changes emitted by Excalidraw with debounce
   */
  const handleExcalidrawChange = useCallback(
    (elements, appState) => {
      if (isLoadingBoardRef.current) {
        return;
      }

      const currentVersion = getSceneVersion(elements || []);
      // Skip if elements haven't changed (prevents re-render save loops)
      if (currentVersion === lastSavedVersionRef.current) {
        return;
      }

      // Record pending elements and state
      pendingChangesRef.current = { elements, appState };
      setSaveStatus('saving');
      setStatusMessage('');

      if (saveTimerRef.current) {
        clearTimeout(saveTimerRef.current);
      }

      saveTimerRef.current = setTimeout(() => {
        flushPendingSave();
      }, 700);
    },
    [flushPendingSave]
  );

  /**
   * Select and switch to a board
   */
  const handleSelectBoard = useCallback(
    (targetBoardId) => {
      if (targetBoardId === activeBoard?.id) return;

      // 1. Flush any current pending edits
      flushPendingSave();

      const nextBoard = data.boards.find((b) => b.id === targetBoardId);
      if (!nextBoard) return;

      const nextData = {
        ...data,
        activeBoardId: targetBoardId,
      };

      dataRef.current = nextData;
      setData(nextData);
      saveBoardsData(nextData);
      lastSavedVersionRef.current = getSceneVersion(nextBoard.elements || []);

      // 2. Load the scene into Excalidraw
      if (excalidrawAPI) {
        try {
          isLoadingBoardRef.current = true;
          const restored = restoreElements(nextBoard.elements || []);
          excalidrawAPI.updateScene({
            elements: restored,
            appState: {
              viewBackgroundColor: nextBoard.appState?.viewBackgroundColor || '#0b0f2e',
              theme: 'dark',
              ...cleanAppStateForStorage(nextBoard.appState),
            },
            commitToHistory: false,
          });

          if (restored && restored.length > 0) {
            setTimeout(() => {
              excalidrawAPI.scrollToContent(restored, { fitToContent: true, animate: false });
            }, 50);
          }

          setTimeout(() => {
            isLoadingBoardRef.current = false;
          }, 250);
        } catch (err) {
          isLoadingBoardRef.current = false;
          console.error('[ManthraBeads Whiteboard] Failed to update scene for board:', err);
        }
      }
    },
    [activeBoard, data, excalidrawAPI, flushPendingSave]
  );

  /**
   * Create a new empty board
   */
  const handleCreateNewBoard = useCallback(() => {
    flushPendingSave();

    const count = data.boards.length + 1;
    const newBoard = createNewBoard(`Whiteboard ${count}`);

    const nextData = {
      ...data,
      activeBoardId: newBoard.id,
      boards: [...data.boards, newBoard],
    };

    dataRef.current = nextData;
    setData(nextData);
    saveBoardsData(nextData);
    lastSavedVersionRef.current = 0;

    if (excalidrawAPI) {
      excalidrawAPI.resetScene();
      excalidrawAPI.updateScene({
        elements: [],
        appState: {
          viewBackgroundColor: '#0b0f2e',
          theme: 'dark',
        },
        commitToHistory: false,
      });
    }

    setSaveStatus('saved');
    setStatusMessage('Saved');
    showToast(`Created new board "${newBoard.name}"`, 'success');
  }, [data, excalidrawAPI, flushPendingSave, showToast]);

  /**
   * Rename a board
   */
  const handleRenameBoard = useCallback(
    (boardId, newName) => {
      const updatedBoards = data.boards.map((b) => {
        if (b.id === boardId) {
          return { ...b, name: newName, updatedAt: Date.now() };
        }
        return b;
      });

      const nextData = { ...data, boards: updatedBoards };
      dataRef.current = nextData;
      setData(nextData);
      saveBoardsData(nextData);
    },
    [data]
  );

  /**
   * Delete a board after confirmation
   */
  const handleConfirmDelete = useCallback(
    (boardIdToDelete) => {
      flushPendingSave();

      let remainingBoards = data.boards.filter((b) => b.id !== boardIdToDelete);

      // If user deleted all boards, create a fresh default one
      if (remainingBoards.length === 0) {
        remainingBoards = [createNewBoard('Whiteboard 1')];
      }

      let newActiveId = data.activeBoardId;
      if (newActiveId === boardIdToDelete) {
        newActiveId = remainingBoards[0].id;
      }

      const nextData = {
        ...data,
        activeBoardId: newActiveId,
        boards: remainingBoards,
      };

      dataRef.current = nextData;
      setData(nextData);
      saveBoardsData(nextData);
      setBoardToDelete(null);

      // If active board changed, update Excalidraw scene
      if (newActiveId !== activeBoard.id && excalidrawAPI) {
        const nextActive = remainingBoards.find((b) => b.id === newActiveId);
        if (nextActive) {
          const restored = restoreElements(nextActive.elements || []);
          lastSavedVersionRef.current = getSceneVersion(restored);
          excalidrawAPI.updateScene({
            elements: restored,
            appState: {
              viewBackgroundColor: nextActive.appState?.viewBackgroundColor || '#0b0f2e',
              theme: 'dark',
              ...cleanAppStateForStorage(nextActive.appState),
            },
            commitToHistory: false,
          });
        }
      }

      showToast('Board deleted successfully', 'success');
    },
    [activeBoard, data, excalidrawAPI, flushPendingSave, showToast]
  );

  /**
   * Manual save button click — saves instantly with rich visual feedback
   */
  const handleSaveBoard = useCallback(() => {
    if (!excalidrawAPI) {
      console.warn('[ManthraBeads Whiteboard] Excalidraw API not ready yet');
      return { success: false, error: 'Whiteboard initializing...' };
    }

    try {
      const elements = excalidrawAPI.getSceneElements() || [];
      const appState = excalidrawAPI.getAppState() || {};
      pendingChangesRef.current = { elements, appState };

      const res = flushPendingSave();

      if (res && res.success) {
        setSaveStatus('saved');
        setStatusMessage('Saved just now');
        setTimeout(() => setStatusMessage(''), 3000);

        const activeCount = elements.filter((el) => !el.isDeleted).length;
        const currentName = activeBoardRef.current?.name || 'Whiteboard';

        showToast(
          `Board "${currentName}" saved (${activeCount} item${activeCount === 1 ? '' : 's'})`,
          'success',
          [
            {
              label: 'Rename',
              onClick: () => setShowSaveAsModal(true),
            },
            {
              label: 'View Boards',
              onClick: () => setShowBoardsModal(true),
            },
          ]
        );

        return { success: true, count: activeCount };
      } else {
        setSaveStatus('error');
        const errMsg = res?.error || 'Failed to save to local storage';
        setStatusMessage(errMsg);
        showToast(errMsg, 'error');
        return { success: false, error: errMsg };
      }
    } catch (err) {
      console.error('[ManthraBeads Whiteboard] Manual save error:', err);
      setSaveStatus('error');
      setStatusMessage('Error saving board');
      showToast('Error saving board to browser storage', 'error');
      return { success: false, error: err.message };
    }
  }, [excalidrawAPI, flushPendingSave, showToast]);

  /**
   * Save and update active board name
   */
  const handleSaveAndUpdate = useCallback(
    (newName) => {
      handleRenameBoard(activeBoard.id, newName);
      if (excalidrawAPI) {
        const elements = excalidrawAPI.getSceneElements();
        const appState = excalidrawAPI.getAppState();
        pendingChangesRef.current = { elements, appState };
      }
      flushPendingSave();
      setShowSaveAsModal(false);
      setSaveStatus('saved');
      setStatusMessage('Saved just now');
      setTimeout(() => setStatusMessage(''), 3000);
      showToast(`Board renamed and saved as "${newName}"`, 'success');
    },
    [activeBoard?.id, excalidrawAPI, flushPendingSave, handleRenameBoard, showToast]
  );

  /**
   * Save current canvas as a new board
   */
  const handleSaveAsNew = useCallback(
    (newName) => {
      let currentElements = activeBoard?.elements || [];
      let currentAppState = activeBoard?.appState || null;
      if (excalidrawAPI) {
        currentElements = excalidrawAPI.getSceneElements() || [];
        currentAppState = excalidrawAPI.getAppState() || null;
      }

      const newBoard = createNewBoard(newName, currentElements, currentAppState);
      const nextData = {
        ...data,
        activeBoardId: newBoard.id,
        boards: [...data.boards, newBoard],
      };

      dataRef.current = nextData;
      setData(nextData);
      saveBoardsData(nextData);
      lastSavedVersionRef.current = getSceneVersion(currentElements);
      setShowSaveAsModal(false);
      setSaveStatus('saved');
      setStatusMessage('Saved just now');
      setTimeout(() => setStatusMessage(''), 3000);
      showToast(`Saved as new board "${newName}"`, 'success');
    },
    [activeBoard, data, excalidrawAPI, showToast]
  );

  /**
   * Fullscreen toggle
   */
  const handleToggleFullscreen = useCallback(() => {
    setIsFullscreen((prev) => {
      const next = !prev;
      const panel = document.getElementById('whiteboardPanel');
      if (panel) {
        panel.classList.toggle('wb-fullscreen', next);
      }
      setTimeout(() => {
        if (excalidrawAPI) excalidrawAPI.refresh();
      }, 100);
      return next;
    });
  }, [excalidrawAPI]);

  /**
   * Close modal function
   */
  const handleClose = useCallback(() => {
    flushPendingSave();
    const modal = document.getElementById('whiteboardModal');
    if (modal) {
      modal.classList.remove('wb-visible');
      setTimeout(() => {
        modal.classList.add('wb-hidden');
      }, 250);
    }
  }, [flushPendingSave]);

  /**
   * Open modal helper (invoked externally via WhiteboardModal.open())
   */
  const handleOpen = useCallback(() => {
    const modal = document.getElementById('whiteboardModal');
    if (modal) {
      modal.classList.remove('wb-hidden');
      requestAnimationFrame(() => {
        modal.classList.add('wb-visible');
        setTimeout(() => {
          if (excalidrawAPI) {
            excalidrawAPI.refresh();
          }
        }, 80);
      });
    }
  }, [excalidrawAPI]);

  // Bind global WhiteboardModal API for backwards compatibility with existing site buttons
  useEffect(() => {
    window.WhiteboardModal = {
      open: handleOpen,
      close: handleClose,
      init: () => {},
      save: handleSaveBoard,
      getBoards: () => dataRef.current.boards,
      getActiveBoard: () => activeBoardRef.current,
    };

    const handleBeforeUnload = () => {
      flushPendingSave();
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    window.addEventListener('pagehide', handleBeforeUnload);

    // Escape key closes modal
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        const modal = document.getElementById('whiteboardModal');
        if (modal && !modal.classList.contains('wb-hidden')) {
          handleClose();
        }
      }
    };
    document.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
      window.removeEventListener('pagehide', handleBeforeUnload);
      document.removeEventListener('keydown', handleKeyDown);
      if (toastTimerRef.current) clearTimeout(toastTimerRef.current);
    };
  }, [handleClose, handleOpen, handleSaveBoard, flushPendingSave]);

  // When modal is clicked outside panel, close
  useEffect(() => {
    const modal = document.getElementById('whiteboardModal');
    if (!modal) return;
    const onModalClick = (e) => {
      if (e.target === modal) {
        handleClose();
      }
    };
    modal.addEventListener('click', onModalClick);
    return () => modal.removeEventListener('click', onModalClick);
  }, [handleClose]);

  // Initialize initial board elements into Excalidraw once API is ready
  useEffect(() => {
    if (!excalidrawAPI || !activeBoard) return;
    try {
      isLoadingBoardRef.current = true;
      const restored = restoreElements(activeBoard.elements || []);
      lastSavedVersionRef.current = getSceneVersion(restored);
      excalidrawAPI.updateScene({
        elements: restored,
        appState: {
          viewBackgroundColor: activeBoard.appState?.viewBackgroundColor || '#0b0f2e',
          theme: 'dark',
          ...cleanAppStateForStorage(activeBoard.appState),
        },
        commitToHistory: false,
      });
      if (restored.length > 0) {
        setTimeout(() => {
          excalidrawAPI.scrollToContent(restored, { fitToContent: true, animate: false });
        }, 50);
      }
      setTimeout(() => {
        isLoadingBoardRef.current = false;
      }, 350);
    } catch (e) {
      isLoadingBoardRef.current = false;
      console.warn('[ManthraBeads Whiteboard] Initial scene setup error:', e);
    }
  }, [excalidrawAPI]);

  const activeElementsCount =
    (activeBoard?.elements || []).filter((el) => !el.isDeleted).length;

  return (
    <div className="mb-wb-root" style={{ position: 'relative' }}>
      {/* ── Top Board Bar ── */}
      <BoardBar
        boards={data.boards}
        activeBoard={activeBoard}
        saveStatus={saveStatus}
        statusMessage={statusMessage}
        isFullscreen={isFullscreen}
        onSelectBoard={handleSelectBoard}
        onRenameBoard={handleRenameBoard}
        onCreateNewBoard={handleCreateNewBoard}
        onOpenBoardsModal={() => setShowBoardsModal(true)}
        onSaveBoard={handleSaveBoard}
        onOpenSaveAsModal={() => setShowSaveAsModal(true)}
        onToggleFullscreen={handleToggleFullscreen}
        onClose={handleClose}
      />

      {/* ── Floating Notification Toast ── */}
      {toast && (
        <div
          className={`mb-wb-toast mb-wb-toast-${toast.type || 'success'}`}
          role="status"
          aria-live="polite"
        >
          <div className="mb-wb-toast-icon">
            <i
              className={`fa-solid ${
                toast.type === 'error'
                  ? 'fa-circle-exclamation'
                  : 'fa-circle-check'
              }`}
            ></i>
          </div>
          <div className="mb-wb-toast-msg">{toast.message}</div>
          {toast.actions && toast.actions.length > 0 && (
            <div className="mb-wb-toast-actions">
              {toast.actions.map((act, idx) => (
                <button
                  key={idx}
                  type="button"
                  className="mb-wb-toast-btn"
                  onClick={act.onClick}
                >
                  {act.label}
                </button>
              ))}
            </div>
          )}
          <button
            type="button"
            className="mb-wb-toast-close"
            onClick={() => setToast(null)}
            aria-label="Dismiss notification"
          >
            <i className="fa-solid fa-xmark"></i>
          </button>
        </div>
      )}

      {/* ── Excalidraw Canvas Area ── */}
      <div className="mb-wb-canvas-wrap">
        <Excalidraw
          excalidrawAPI={(api) => setExcalidrawAPI(api)}
          initialData={initialData}
          onChange={handleExcalidrawChange}
          theme="dark"
          UIOptions={{
            canvasActions: {
              loadScene: false,
              saveAsImage: true,
              export: { saveFileToDisk: true },
              changeViewBackgroundColor: true,
            },
          }}
        />
      </div>

      {/* ── Boards List Management Modal ── */}
      {showBoardsModal && (
        <BoardsModal
          boards={data.boards}
          activeBoardId={data.activeBoardId}
          onSelectBoard={handleSelectBoard}
          onRenameBoard={handleRenameBoard}
          onRequestDeleteBoard={(b) => setBoardToDelete(b)}
          onCreateNewBoard={handleCreateNewBoard}
          onClose={() => setShowBoardsModal(false)}
        />
      )}

      {/* ── Save / Name Board Modal ── */}
      {showSaveAsModal && (
        <SaveBoardModal
          currentBoard={activeBoard}
          elementsCount={activeElementsCount}
          onSaveAndUpdate={handleSaveAndUpdate}
          onSaveAsNew={handleSaveAsNew}
          onClose={() => setShowSaveAsModal(false)}
        />
      )}

      {/* ── Delete Confirmation Dialog ── */}
      {boardToDelete && (
        <ConfirmDeleteModal
          board={boardToDelete}
          onConfirm={handleConfirmDelete}
          onCancel={() => setBoardToDelete(null)}
        />
      )}
    </div>
  );
}
