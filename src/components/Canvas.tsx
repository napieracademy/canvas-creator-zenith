import React, { useRef, useEffect, useState } from 'react';

interface CanvasProps {
  text: string;
  backgroundColor: string;
  textAlign: 'left' | 'center' | 'right';
  textColor: string;
  fontSize: number;
  onEffectiveFontSizeChange?: (size: number) => void;
}

const Canvas: React.FC<CanvasProps> = ({ 
  text, 
  backgroundColor, 
  textAlign, 
  textColor, 
  fontSize,
  onEffectiveFontSizeChange 
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

    ctx.fillStyle = backgroundColor;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

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
      adjustedFontSize -= 1;
    }

    if (onEffectiveFontSizeChange) {
      onEffectiveFontSizeChange(adjustedFontSize);
    }

    ctx.font = `bold ${adjustedFontSize}px Inter`;
    ctx.fillStyle = textColor;
    ctx.textAlign = textAlign;
    ctx.textBaseline = 'middle';

    const lines = calculateLines(adjustedFontSize);
    const lineHeight = adjustedFontSize * 1.2;
    const totalHeight = lines.length * lineHeight;
    const startY = (ORIGINAL_HEIGHT - totalHeight) / 2;

    const x = textAlign === 'left' ? SAFE_ZONE_MARGIN : 
             textAlign === 'right' ? ORIGINAL_WIDTH - SAFE_ZONE_MARGIN : 
             ORIGINAL_WIDTH / 2;

    lines.forEach((line, index) => {
      ctx.fillText(line, x, startY + (index * lineHeight));
    });

    ctx.strokeStyle = 'rgba(255, 0, 0, 0.3)';
    ctx.strokeRect(SAFE_ZONE_MARGIN, SAFE_ZONE_MARGIN, 
                   ORIGINAL_WIDTH - (2 * SAFE_ZONE_MARGIN), 
                   ORIGINAL_HEIGHT - (2 * SAFE_ZONE_MARGIN));
  }, [text, backgroundColor, textAlign, textColor, fontSize, onEffectiveFontSizeChange]);

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
