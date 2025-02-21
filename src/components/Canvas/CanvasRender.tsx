
import React from 'react';

interface CanvasRenderProps {
  canvasRef: React.RefObject<HTMLCanvasElement>;
  className?: string;
  style?: React.CSSProperties;
}

const CanvasRender: React.FC<CanvasRenderProps> = ({ canvasRef, className, style }) => {
  return (
    <canvas
      ref={canvasRef}
      className={`w-full h-full rounded-xl ${className || ''}`}
      style={{
        maxWidth: '100%',
        maxHeight: '100%',
        objectFit: 'contain',
        ...style
      }}
    />
  );
};

export default CanvasRender;
