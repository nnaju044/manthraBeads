import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Excalidraw, restoreElements } from '@excalidraw/excalidraw';
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
import ConfirmDeleteModal from './ConfirmDeleteModal';

export default function WhiteboardApp() {
  const [data, setData] = useState(() => loadBoardsData());
  const [excalidrawAPI, setExcalidrawAPI] = useState(null);
  const [saveStatus, setSaveStatus] = useState('saved'); // 'saved' | 'saving' | 'error'
  const [statusMessage, setStatusMessage] = useState('');
  const [showBoardsModal, setShowBoardsModal] = useState(false);
  const [boardToDelete, setBoardToDelete] = useState(null);
  const [isFullscreen, setIsFullscreen] = useState(false);

  const activeBoard =
    data.boards.find((b) => b.id === data.activeBoardId) || data.boards[0];

  const activeBoardRef = useRef(activeBoard);
  activeBoardRef.current = activeBoard;

  const dataRef = useRef(data);
  dataRef.current = data;

  const saveTimerRef = useRef(null);
  const pendingChangesRef = useRef(null);
  const isLoadingBoardRef = useRef(true);

  /**
   * Flush any unpersisted drawing edits immediately to localStorage
   */
  const flushPendingSave = useCallback(() => {
    if (saveTimerRef.current) {
      clearTimeout(saveTimerRef.current);
      saveTimerRef.current = null;
    }

    if (!pendingChangesRef.current || !excalidrawAPI) return;

    const { elements, appState } = pendingChangesRef.current;
    pendingChangesRef.current = null;

    const currentData = dataRef.current;
    const currentActive = activeBoardRef.current;
    if (!currentActive) return;

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
    setData(newData);

    if (res.success) {
      setSaveStatus('saved');
      setStatusMessage('');
    } else {
      setSaveStatus('error');
      setStatusMessage(res.error || 'Failed to save');
    }
  }, [excalidrawAPI]);

  /**
   * Handle changes emitted by Excalidraw with debounce
   */
  const handleExcalidrawChange = useCallback(
    (elements, appState) => {
      if (isLoadingBoardRef.current) return;

      // Record pending elements and state
      pendingChangesRef.current = { elements, appState };
      setSaveStatus('saving');

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

      setData(nextData);
      saveBoardsData(nextData);

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

    setData(nextData);
    saveBoardsData(nextData);

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
  }, [data, excalidrawAPI, flushPendingSave]);

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

      setData(nextData);
      saveBoardsData(nextData);
      setBoardToDelete(null);

      // If active board changed, update Excalidraw scene
      if (newActiveId !== activeBoard.id && excalidrawAPI) {
        const nextActive = remainingBoards.find((b) => b.id === newActiveId);
        if (nextActive) {
          const restored = restoreElements(nextActive.elements || []);
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
    },
    [activeBoard, data, excalidrawAPI, flushPendingSave]
  );

  /**
   * Manual save button click
   */
  const handleSaveBoard = useCallback(() => {
    if (excalidrawAPI) {
      const elements = excalidrawAPI.getSceneElements();
      const appState = excalidrawAPI.getAppState();
      pendingChangesRef.current = { elements, appState };
    }
    flushPendingSave();
    setSaveStatus('saved');
    setStatusMessage('Saved!');
    setTimeout(() => setStatusMessage(''), 2000);
  }, [excalidrawAPI, flushPendingSave]);

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

  return (
    <div className="mb-wb-root">
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
        onToggleFullscreen={handleToggleFullscreen}
        onClose={handleClose}
      />

      {/* ── Excalidraw Canvas Area ── */}
      <div className="mb-wb-canvas-wrap">
        <Excalidraw
          excalidrawAPI={(api) => setExcalidrawAPI(api)}
          initialData={{
            elements: activeBoard?.elements || [],
            appState: {
              viewBackgroundColor: activeBoard?.appState?.viewBackgroundColor || '#0b0f2e',
              theme: 'dark',
              ...cleanAppStateForStorage(activeBoard?.appState),
            },
            scrollToContent: true,
          }}
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
