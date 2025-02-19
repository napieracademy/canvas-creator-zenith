import React, { useRef, useEffect, useState } from 'react';

interface CanvasProps {
  text: string;
  backgroundColor: string;
  textAlign: 'left' | 'center' | 'right';
  textColor: string;
  fontSize: number;
  onEffectiveFontSizeChange?: (size: number) => void;
  showSafeZone?: boolean;
  format?: 'post' | 'story';
}

const Canvas: React.FC<CanvasProps> = ({ 
  text, 
  backgroundColor, 
  textAlign, 
  textColor, 
  fontSize,
  onEffectiveFontSizeChange,
  showSafeZone = false,
  format = 'post'
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [scale, setScale] = useState(100);
  const ORIGINAL_WIDTH = 1080;
  const ORIGINAL_HEIGHT = format === 'post' ? 1350 : 1920;
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

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    ctx.fillStyle = backgroundColor;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    if (showSafeZone) {
      ctx.fillStyle = 'rgba(0, 0, 0, 0.1)';
      ctx.fillRect(0, 0, ORIGINAL_WIDTH, SAFE_ZONE_MARGIN);
      ctx.fillRect(0, ORIGINAL_HEIGHT - SAFE_ZONE_MARGIN, ORIGINAL_WIDTH, SAFE_ZONE_MARGIN);
      ctx.fillRect(0, SAFE_ZONE_MARGIN, SAFE_ZONE_MARGIN, ORIGINAL_HEIGHT - (2 * SAFE_ZONE_MARGIN));
      ctx.fillRect(ORIGINAL_WIDTH - SAFE_ZONE_MARGIN, SAFE_ZONE_MARGIN, SAFE_ZONE_MARGIN, ORIGINAL_HEIGHT - (2 * SAFE_ZONE_MARGIN));
      
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

    const textFitsInSafeZone = (size: number) => {
      const lines = calculateLines(size);
      const totalHeight = lines.length * (size * 1.2);
      return totalHeight <= MAX_HEIGHT && lines.every(line => {
        const metrics = ctx.measureText(line);
        return metrics.width <= MAX_WIDTH;
      });
    };

    let adjustedFontSize = fontSize;
    while (!textFitsInSafeZone(adjustedFontSize) && adjustedFontSize > 32) {
      adjustedFontSize -= 2;
    }

    while (!textFitsInSafeZone(adjustedFontSize) && adjustedFontSize > 12) {
      adjustedFontSize -= 1;
    }

    if (onEffectiveFontSizeChange) {
      onEffectiveFontSizeChange(adjustedFontSize);
    }

    if (text.trim()) {
      ctx.font = `bold ${adjustedFontSize}px Inter`;
      ctx.fillStyle = textColor;
      ctx.textAlign = textAlign;
      ctx.textBaseline = 'middle';
      ctx.setLineDash([]);

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
      ctx.font = '32px Inter';
      ctx.fillStyle = 'rgba(255, 255, 255, 0.5)';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText('Inserisci il tuo testo...', ORIGINAL_WIDTH / 2, ORIGINAL_HEIGHT / 2);
    }

  }, [text, backgroundColor, textAlign, textColor, fontSize, onEffectiveFontSizeChange, showSafeZone, format]);

  return (
    <div className="space-y-2">
      <div className="relative w-full h-full bg-transparent rounded-xl overflow-hidden">
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
      </div>
      <div className="flex justify-end gap-2 text-sm text-gray-500">
        <div>{scale}%</div>
        <div>1080 × {ORIGINAL_HEIGHT} px</div>
      </div>
    </div>
  );
};

export default Canvas;
