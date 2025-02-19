
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
    // Create a ResizeObserver instance
    const resizeObserver = new ResizeObserver((entries) => {
      // Use requestIdleCallback or setTimeout to debounce the update
      window.requestIdleCallback ? 
        window.requestIdleCallback(() => updateScale()) : 
        setTimeout(() => updateScale(), 0);
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
    };
  }, [updateScale]);

  return { scale, updateScale };
}
