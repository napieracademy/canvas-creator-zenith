
import { useState, useEffect, useCallback, useRef } from 'react';

export function useCanvasScale(
  canvasRef: React.RefObject<HTMLCanvasElement>,
  originalWidth: number,
  originalHeight: number
) {
  const [scale, setScale] = useState(100);
  const frameRef = useRef<number>();

  const updateScale = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const container = canvas.parentElement;
    if (container) {
      const containerWidth = container.clientWidth;
      const containerHeight = container.clientHeight;
      const scaleFactor = Math.min(
        containerWidth / originalWidth,
        containerHeight / originalHeight
      );
      setScale(Math.round(scaleFactor * 100));
    }
  }, [canvasRef, originalWidth, originalHeight]);

  useEffect(() => {
    let timeout: NodeJS.Timeout;
    
    // Create a ResizeObserver instance
    const resizeObserver = new ResizeObserver(() => {
      // Cancel any pending updates
      if (frameRef.current) {
        cancelAnimationFrame(frameRef.current);
      }
      if (timeout) {
        clearTimeout(timeout);
      }

      // Schedule a new update with debouncing
      timeout = setTimeout(() => {
        frameRef.current = requestAnimationFrame(() => {
          updateScale();
        });
      }, 100); // 100ms debounce
    });

    // Observe the canvas parent element
    const canvas = canvasRef.current;
    if (canvas && canvas.parentElement) {
      resizeObserver.observe(canvas.parentElement);
    }

    // Initial update
    updateScale();
    
    // Cleanup
    return () => {
      resizeObserver.disconnect();
      if (frameRef.current) {
        cancelAnimationFrame(frameRef.current);
      }
      if (timeout) {
        clearTimeout(timeout);
      }
    };
  }, [updateScale]);

  return { scale, updateScale };
}
