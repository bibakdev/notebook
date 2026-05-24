import { useEffect, useRef } from 'react';

/**
 * Triggers a callback after a delay while dragging over a collapsed folder.
 */
export function useAutoExpandOnDrag(
  isDragOver: boolean,
  isExpanded: boolean,
  onExpand: () => void,
  delay = 800
) {
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (isDragOver && !isExpanded) {
      timerRef.current = setTimeout(() => {
        onExpand();
      }, delay);
    } else if (!isDragOver) {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
        timerRef.current = null;
      }
    }
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [isDragOver, isExpanded, onExpand, delay]);
}
