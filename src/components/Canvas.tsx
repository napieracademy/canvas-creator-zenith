
import React, { useRef, useEffect } from 'react';

interface CanvasProps {
  text: string;
  backgroundColor: string;
}

const Canvas: React.FC<CanvasProps> = ({ text, backgroundColor }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set canvas size
    canvas.width = 1080;
    canvas.height = 1080;

    // Draw background
    ctx.fillStyle = backgroundColor;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Draw text
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 64px Inter';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';

    // Split text into lines
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

    // Draw lines with text shadow for better readability
    const lineHeight = 80;
    const totalHeight = lines.length * lineHeight;
    const startY = (canvas.height - totalHeight) / 2;

    lines.forEach((line, index) => {
      // Draw text shadow
      ctx.fillStyle = 'rgba(0,0,0,0.3)';
      ctx.fillText(line, canvas.width / 2 + 2, startY + index * lineHeight + 2);
      
      // Draw actual text
      ctx.fillStyle = '#ffffff';
      ctx.fillText(line, canvas.width / 2, startY + index * lineHeight);
    });
  }, [text, backgroundColor]);

  return (
    <canvas
      ref={canvasRef}
      style={{
        maxWidth: '100%',
        maxHeight: '100%',
        objectFit: 'contain',
      }}
    />
  );
};

export default Canvas;
