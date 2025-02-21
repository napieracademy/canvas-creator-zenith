
import { useState, useEffect, useCallback, useRef } from 'react';

export function useCanvasScale(
  canvasRef: React.RefObject<HTMLCanvasElement>,
  originalWidth: number,
  originalHeight: number
) {
  const [scale, setScale] = useState(100);
  const rafId = useRef<number>();
  const resizeTimeoutId = useRef<NodeJS.Timeout>();
  const observer = useRef<ResizeObserver | null>(null);

  const updateScale = useCallback(() => {
    if (rafId.current) {
      cancelAnimationFrame(rafId.current);
    }

    rafId.current = requestAnimationFrame(() => {
      const canvas = canvasRef.current;
      if (!canvas) return;

      const container = canvas.parentElement;
      if (!container) return;

      const containerWidth = container.clientWidth;
      const containerHeight = container.clientHeight;
      const scaleFactor = Math.min(
        containerWidth / originalWidth,
        containerHeight / originalHeight
      );
      
      setScale(Math.round(scaleFactor * 100));
    });
  }, [canvasRef, originalWidth, originalHeight]);

  useEffect(() => {
    // Cleanup previous observer if it exists
    if (observer.current) {
      observer.current.disconnect();
    }

    // Create a new observer with debouncing
    observer.current = new ResizeObserver((entries) => {
      // Clear any existing timeout
      if (resizeTimeoutId.current) {
        clearTimeout(resizeTimeoutId.current);
      }

      // Debounce the resize updates
      resizeTimeoutId.current = setTimeout(() => {
        if (!entries.length) return;
        
        updateScale();
      }, 250); // Increased debounce time to 250ms
    });

    // Start observing
    const canvas = canvasRef.current;
    if (canvas?.parentElement) {
      observer.current.observe(canvas.parentElement);
    }

    // Initial scale calculation with RAF
    rafId.current = requestAnimationFrame(updateScale);

    // Cleanup
    return () => {
      if (observer.current) {
        observer.current.disconnect();
      }
      
      if (resizeTimeoutId.current) {
        clearTimeout(resizeTimeoutId.current);
      }
      
      if (rafId.current) {
        cancelAnimationFrame(rafId.current);
      }
    };
  }, [updateScale]);

  return { scale, updateScale };
}
