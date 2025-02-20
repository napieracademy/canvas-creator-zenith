
import { useState, useEffect, useCallback, useRef } from 'react';

export function useCanvasScale(
  canvasRef: React.RefObject<HTMLCanvasElement>,
  originalWidth: number,
  originalHeight: number
) {
  const [scale, setScale] = useState(100);
  const rafId = useRef<number>();
  const resizeTimeoutId = useRef<NodeJS.Timeout>();

  const updateScale = useCallback(() => {
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
  }, [canvasRef, originalWidth, originalHeight]);

  useEffect(() => {
    // Create a more efficient resize observer with throttling
    const resizeObserver = new ResizeObserver(() => {
      // Clear any existing timeout
      if (resizeTimeoutId.current) {
        clearTimeout(resizeTimeoutId.current);
      }

      // Clear any existing animation frame
      if (rafId.current) {
        cancelAnimationFrame(rafId.current);
      }

      // Throttle updates to prevent excessive calculations
      resizeTimeoutId.current = setTimeout(() => {
        rafId.current = requestAnimationFrame(() => {
          updateScale();
        });
      }, 150); // Increased throttle time to 150ms
    });

    // Observe the canvas container
    const canvas = canvasRef.current;
    if (canvas?.parentElement) {
      resizeObserver.observe(canvas.parentElement);
    }

    // Initial scale calculation
    rafId.current = requestAnimationFrame(updateScale);

    // Cleanup function
    return () => {
      resizeObserver.disconnect();
      
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
