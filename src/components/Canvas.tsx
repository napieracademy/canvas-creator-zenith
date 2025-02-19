
import React, { useRef, useEffect, useState } from 'react';

interface CanvasProps {
  text: string;
  backgroundColor: string;
  textAlign: 'left' | 'center' | 'right';
  textColor: string;
  fontSize: number;
}

const Canvas: React.FC<CanvasProps> = ({ text, backgroundColor, textAlign, textColor, fontSize }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [scale, setScale] = useState(100);
  const ORIGINAL_SIZE = 1080;

  const updateScale = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const container = canvas.parentElement;
    if (container) {
      const containerWidth = container.clientWidth;
      const containerHeight = container.clientHeight;
      const scaleFactor = Math.min(
        (containerWidth - 40) / ORIGINAL_SIZE,  // Sottraiamo un po' di spazio per il padding
        (containerHeight - 40) / ORIGINAL_SIZE,
        0.9 // Limitiamo la scala al 90% per mantenere un po' di spazio intorno
      );
      setScale(Math.round(scaleFactor * 100));
    }
  };

  useEffect(() => {
    const handleResize = () => {
      requestAnimationFrame(updateScale); // Usiamo requestAnimationFrame per ottimizzare le performance
    };

    window.addEventListener('resize', handleResize);
    updateScale(); // Calcoliamo la scala iniziale
    
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set actual canvas size
    canvas.width = ORIGINAL_SIZE;
    canvas.height = ORIGINAL_SIZE;

    // Calculate initial scale
    updateScale();

    ctx.fillStyle = backgroundColor;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.fillStyle = textColor;
    ctx.font = `bold ${fontSize}px Inter`;
    ctx.textAlign = textAlign;
    ctx.textBaseline = 'middle';

    const words = text.split(' ');
    const lines: string[] = [];
    let currentLine = '';

    words.forEach(word => {
      const testLine = currentLine ? `${currentLine} ${word}` : word;
      const metrics = ctx.measureText(testLine);
      
      if (metrics.width > canvas.width - 200) {
        lines.push(currentLine);
        currentLine = word;
      } else {
        currentLine = testLine;
      }
    });
    if (currentLine) {
      lines.push(currentLine);
    }

    const lineHeight = fontSize * 1.2;
    const totalHeight = lines.length * lineHeight;
    const startY = (canvas.height - totalHeight) / 2;
    const x = textAlign === 'left' ? 100 : 
             textAlign === 'right' ? canvas.width - 100 : 
             canvas.width / 2;

    lines.forEach((line, index) => {
      ctx.fillText(line, x, startY + index * lineHeight);
    });
  }, [text, backgroundColor, textAlign, textColor, fontSize]);

  return (
    <div className="relative flex items-center justify-center w-full h-full p-5">
      <canvas
        ref={canvasRef}
        style={{
          width: `${scale}%`,
          height: `${scale}%`,
          maxWidth: `${ORIGINAL_SIZE}px`,
          maxHeight: `${ORIGINAL_SIZE}px`,
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
