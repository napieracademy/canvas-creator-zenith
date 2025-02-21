
import { useState, useEffect, useCallback, useRef } from 'react';

export function useCanvasScale(
  canvasRef: React.RefObject<HTMLCanvasElement>,
  originalWidth: number,
  originalHeight: number
) {
  const [scale, setScale] = useState(100);
  const isUpdating = useRef(false);
  const observer = useRef<ResizeObserver | null>(null);
  const timeoutId = useRef<NodeJS.Timeout>();
  
  const calculateScale = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas?.parentElement) return;

    const container = canvas.parentElement;
    const containerWidth = container.clientWidth;
    const containerHeight = container.clientHeight;

    if (containerWidth === 0 || containerHeight === 0) return;

    const scaleFactor = Math.min(
      containerWidth / originalWidth,
      containerHeight / originalHeight
    );
    
    const newScale = Math.round(scaleFactor * 100);
    
    // Evita aggiornamenti non necessari
    if (newScale !== scale) {
      setScale(newScale);
    }
  }, [canvasRef, originalWidth, originalHeight, scale]);

  const updateScale = useCallback(() => {
    if (isUpdating.current) return;
    
    isUpdating.current = true;
    
    // Usa requestAnimationFrame per sincronizzarsi con il browser
    requestAnimationFrame(() => {
      calculateScale();
      isUpdating.current = false;
    });
  }, [calculateScale]);

  useEffect(() => {
    // Cleanup function per la pulizia delle risorse
    const cleanup = () => {
      if (observer.current) {
        observer.current.disconnect();
        observer.current = null;
      }
      if (timeoutId.current) {
        clearTimeout(timeoutId.current);
      }
      isUpdating.current = false;
    };

    // Crea un nuovo observer con debouncing migliorato
    observer.current = new ResizeObserver((entries) => {
      // Ignora le notifiche se non ci sono entries valide
      if (!entries.length) return;
      
      // Pulisci il timeout precedente se esiste
      if (timeoutId.current) {
        clearTimeout(timeoutId.current);
      }

      // Usa un debounce con timeout più lungo per ridurre gli aggiornamenti
      timeoutId.current = setTimeout(() => {
        if (!isUpdating.current) {
          updateScale();
        }
      }, 150); // Aumentato a 150ms per ridurre la frequenza degli aggiornamenti
    });

    // Osserva il container del canvas
    const canvas = canvasRef.current;
    if (canvas?.parentElement) {
      observer.current.observe(canvas.parentElement);
      
      // Calcolo iniziale della scala
      updateScale();
    }

    // Cleanup quando il componente viene smontato
    return cleanup;
  }, [canvasRef, updateScale]);

  return { scale, updateScale };
}
