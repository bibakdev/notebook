import { useState, useRef, useCallback } from 'react';

interface UseDropTargetOptions {
  onDragEnter?: (e: React.DragEvent) => void;
  onDragLeave?: (e: React.DragEvent) => void;
  onDrop?: (e: React.DragEvent) => void;
}

/**
 * Manages drag-over state with a counter to correctly handle child elements.
 * Returns the necessary event props and a boolean `isDragOver`.
 */
export function useDropTarget(options: UseDropTargetOptions = {}) {
  const [isDragOver, setIsDragOver] = useState(false);
  const counterRef = useRef(0);

  const handleDragEnter = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      e.stopPropagation();
      counterRef.current++;
      if (counterRef.current === 1) {
        setIsDragOver(true);
        options.onDragEnter?.(e);
      }
    },
    [options]
  );

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  }, []);

  const handleDragLeave = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      e.stopPropagation();
      counterRef.current--;
      if (counterRef.current <= 0) {
        counterRef.current = 0;
        setIsDragOver(false);
        options.onDragLeave?.(e);
      }
    },
    [options]
  );

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      e.stopPropagation();
      counterRef.current = 0;
      setIsDragOver(false);
      options.onDrop?.(e);
    },
    [options]
  );

  return {
    dropTargetProps: {
      onDragEnter: handleDragEnter,
      onDragOver: handleDragOver,
      onDragLeave: handleDragLeave,
      onDrop: handleDrop
    },
    isDragOver
  };
}
