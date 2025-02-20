
import { useState, useEffect, useCallback } from 'react';

export function useCanvasScale(
  canvasRef: React.RefObject<HTMLCanvasElement>,
  originalWidth: number,
  originalHeight: number
) {
  const [scale, setScale] = useState(100);

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
    let timeoutId: number;
    let animationFrameId: number;

    // Create a ResizeObserver instance with debounced update
    const resizeObserver = new ResizeObserver((entries) => {
      // Clear any existing timeout
      if (timeoutId) {
        window.clearTimeout(timeoutId);
      }
      
      // Clear any existing animation frame
      if (animationFrameId) {
        window.cancelAnimationFrame(animationFrameId);
      }

      // Debounce the update using both setTimeout and requestAnimationFrame
      timeoutId = window.setTimeout(() => {
        animationFrameId = window.requestAnimationFrame(() => {
          updateScale();
        });
      }, 100); // 100ms debounce time
    });

    // Observe the canvas parent element
    const canvas = canvasRef.current;
    if (canvas && canvas.parentElement) {
      resizeObserver.observe(canvas.parentElement);
    }

    // Initial update with RAF to ensure smooth initial render
    animationFrameId = window.requestAnimationFrame(() => {
      updateScale();
    });
    
    // Cleanup
    return () => {
      resizeObserver.disconnect();
      if (timeoutId) {
        window.clearTimeout(timeoutId);
      }
      if (animationFrameId) {
        window.cancelAnimationFrame(animationFrameId);
      }
    };
  }, [updateScale]);

  return { scale, updateScale };
}
