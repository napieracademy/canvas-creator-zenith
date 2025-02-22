
import { useState, useEffect, useCallback, useRef } from 'react';

export function useCanvasScale(
  canvasRef: React.RefObject<HTMLCanvasElement>,
  originalWidth: number,
  originalHeight: number
) {
  const [scale, setScale] = useState(100);
  const rafId = useRef<number>();
  const resizeObserver = useRef<ResizeObserver>();
  const isUpdating = useRef(false);

  const updateScale = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const container = canvas.parentElement;
    if (!container) return;

    // If we're already processing an update, schedule for next frame
    if (isUpdating.current) {
      if (rafId.current) {
        cancelAnimationFrame(rafId.current);
      }
      rafId.current = requestAnimationFrame(updateScale);
      return;
    }

    isUpdating.current = true;

    // Use RAF to ensure we're not fighting with the browser's layout calculations
    rafId.current = requestAnimationFrame(() => {
      try {
        const containerWidth = container.clientWidth;
        const containerHeight = container.clientHeight;
        
        const scaleFactor = Math.min(
          containerWidth / originalWidth,
          containerHeight / originalHeight
        );
        
        setScale(Math.round(scaleFactor * 100));
      } finally {
        isUpdating.current = false;
      }
    });
  }, [canvasRef, originalWidth, originalHeight]);

  useEffect(() => {
    // Create ResizeObserver only once
    resizeObserver.current = new ResizeObserver((entries) => {
      // Ignore empty entry lists
      if (!entries.length) return;

      // If we already have a pending update, don't schedule another one
      if (isUpdating.current) return;

      // Schedule update for next frame
      if (rafId.current) {
        cancelAnimationFrame(rafId.current);
      }
      rafId.current = requestAnimationFrame(updateScale);
    });

    // Observe the canvas container
    const canvas = canvasRef.current;
    if (canvas?.parentElement) {
      resizeObserver.current.observe(canvas.parentElement);
    }

    // Initial scale calculation
    updateScale();

    // Cleanup function
    return () => {
      if (resizeObserver.current) {
        resizeObserver.current.disconnect();
      }
      
      if (rafId.current) {
        cancelAnimationFrame(rafId.current);
      }

      isUpdating.current = false;
    };
  }, [updateScale]);

  return { scale, updateScale };
}
