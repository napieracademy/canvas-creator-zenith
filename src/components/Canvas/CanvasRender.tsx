
import React from 'react';

interface CanvasRenderProps {
  canvasRef: React.RefObject<HTMLCanvasElement>;
}

const CanvasRender: React.FC<CanvasRenderProps> = ({ canvasRef }) => {
  return (
    <canvas
      ref={canvasRef}
      className="w-full h-full rounded-xl"
      style={{
        maxWidth: '100%',
        maxHeight: '100%',
        objectFit: 'contain',
      }}
    />
  );
};

export default CanvasRender;
