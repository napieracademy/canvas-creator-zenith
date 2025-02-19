
import React, { useRef, useEffect, useState } from 'react';

interface CanvasProps {
  text: string;
  backgroundColor: string;
  textAlign: 'left' | 'center' | 'right';
  textColor: string;
  fontSize: number;
  onEffectiveFontSizeChange?: (size: number) => void;
  showSafeZone?: boolean;
}

const Canvas: React.FC<CanvasProps> = ({ 
  text, 
  backgroundColor, 
  textAlign, 
  textColor, 
  fontSize,
  onEffectiveFontSizeChange,
  showSafeZone = false
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [scale, setScale] = useState(100);
  const ORIGINAL_WIDTH = 1080;
  const ORIGINAL_HEIGHT = 1350;
  const SAFE_ZONE_MARGIN = 120;
  const MAX_WIDTH = ORIGINAL_WIDTH - (2 * SAFE_ZONE_MARGIN);
  const MAX_HEIGHT = ORIGINAL_HEIGHT - (2 * SAFE_ZONE_MARGIN);

  const updateScale = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const container = canvas.parentElement;
    if (container) {
      const containerWidth = container.clientWidth;
      const containerHeight = container.clientHeight;
      const scaleFactor = Math.min(
        containerWidth / ORIGINAL_WIDTH,
        containerHeight / ORIGINAL_HEIGHT
      );
      setScale(Math.round(scaleFactor * 100));
    }
  };

  useEffect(() => {
    const handleResize = () => {
      requestAnimationFrame(updateScale);
    };

    window.addEventListener('resize', handleResize);
    updateScale();
    
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    canvas.width = ORIGINAL_WIDTH;
    canvas.height = ORIGINAL_HEIGHT;
    
    updateScale();

    // Sfondo
    ctx.fillStyle = backgroundColor;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Safe zone
    if (showSafeZone) {
      // Overlay semi-trasparente fuori dalla safe zone
      ctx.fillStyle = 'rgba(0, 0, 0, 0.1)';
      // Top
      ctx.fillRect(0, 0, ORIGINAL_WIDTH, SAFE_ZONE_MARGIN);
      // Bottom
      ctx.fillRect(0, ORIGINAL_HEIGHT - SAFE_ZONE_MARGIN, ORIGINAL_WIDTH, SAFE_ZONE_MARGIN);
      // Left
      ctx.fillRect(0, SAFE_ZONE_MARGIN, SAFE_ZONE_MARGIN, ORIGINAL_HEIGHT - (2 * SAFE_ZONE_MARGIN));
      // Right
      ctx.fillRect(ORIGINAL_WIDTH - SAFE_ZONE_MARGIN, SAFE_ZONE_MARGIN, SAFE_ZONE_MARGIN, ORIGINAL_HEIGHT - (2 * SAFE_ZONE_MARGIN));
      
      // Bordo della safe zone
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.3)';
      ctx.lineWidth = 2;
      ctx.setLineDash([8, 8]);
      ctx.strokeRect(
        SAFE_ZONE_MARGIN, 
        SAFE_ZONE_MARGIN, 
        ORIGINAL_WIDTH - (2 * SAFE_ZONE_MARGIN), 
        ORIGINAL_HEIGHT - (2 * SAFE_ZONE_MARGIN)
      );
    }

    // Calcolo delle linee e dimensione del testo
    const calculateLines = (size: number) => {
      ctx.font = `bold ${size}px Inter`;
      const words = text.split(' ');
      const lines: string[] = [];
      let currentLine = '';

      for (const word of words) {
        const testLine = currentLine ? `${currentLine} ${word}` : word;
        const metrics = ctx.measureText(testLine);

        if (metrics.width > MAX_WIDTH) {
          if (currentLine) lines.push(currentLine);
          currentLine = word;
        } else {
          currentLine = testLine;
        }
      }
      if (currentLine) lines.push(currentLine);
      
      return lines;
    };

    // Verifica se il testo sta nella safe zone
    const textFitsInSafeZone = (size: number) => {
      const lines = calculateLines(size);
      const totalHeight = lines.length * (size * 1.2);
      return totalHeight <= MAX_HEIGHT && lines.every(line => {
        const metrics = ctx.measureText(line);
        return metrics.width <= MAX_WIDTH;
      });
    };

    // Trova la dimensione del font ottimale che garantisce che il testo stia nella safe zone
    let adjustedFontSize = fontSize;
    while (!textFitsInSafeZone(adjustedFontSize) && adjustedFontSize > 32) {
      adjustedFontSize -= 2; // Riduzione più aggressiva per trovare più velocemente la dimensione corretta
    }

    // Se ancora non entra, continua a ridurre fino a trovare una dimensione che funziona
    while (!textFitsInSafeZone(adjustedFontSize) && adjustedFontSize > 12) {
      adjustedFontSize -= 1;
    }

    if (onEffectiveFontSizeChange) {
      onEffectiveFontSizeChange(adjustedFontSize);
    }

    // Rendering del testo
    if (text.trim()) {
      ctx.font = `bold ${adjustedFontSize}px Inter`;
      ctx.fillStyle = textColor;
      ctx.textAlign = textAlign;
      ctx.textBaseline = 'middle';
      ctx.setLineDash([]); // Reset line dash

      const lines = calculateLines(adjustedFontSize);
      const lineHeight = adjustedFontSize * 1.2;
      const totalHeight = lines.length * lineHeight;
      const startY = (ORIGINAL_HEIGHT - totalHeight) / 2;

      const x = textAlign === 'left' ? SAFE_ZONE_MARGIN : 
               textAlign === 'right' ? ORIGINAL_WIDTH - SAFE_ZONE_MARGIN : 
               ORIGINAL_WIDTH / 2;

      lines.forEach((line, index) => {
        ctx.fillText(line, x, startY + (index * lineHeight) + (lineHeight / 2));
      });
    } else {
      // Placeholder quando non c'è testo
      ctx.font = '32px Inter';
      ctx.fillStyle = 'rgba(255, 255, 255, 0.5)';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText('Inserisci il tuo testo...', ORIGINAL_WIDTH / 2, ORIGINAL_HEIGHT / 2);
    }

  }, [text, backgroundColor, textAlign, textColor, fontSize, onEffectiveFontSizeChange, showSafeZone]);

  return (
    <div className="relative w-full h-full bg-white/50 rounded-xl overflow-hidden">
      <canvas
        ref={canvasRef}
        style={{
          width: '100%',
          height: '100%',
          maxWidth: `${ORIGINAL_WIDTH}px`,
          maxHeight: `${ORIGINAL_HEIGHT}px`,
          objectFit: 'contain',
        }}
      />
      <div className="absolute bottom-4 right-4 bg-black/70 text-white px-3 py-1.5 rounded-full text-sm font-medium">
        {scale}%
      </div>
    </div>
  );
};

export default Canvas;
