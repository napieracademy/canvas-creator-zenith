
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
        imageRendering: 'crisp-edges', // Migliora la qualità del rendering
        backfaceVisibility: 'hidden', // Ottimizzazione performance
        transform: 'translateZ(0)', // Attiva hardware acceleration
      }}
    />
  );
};

export default React.memo(CanvasRender); // Previene re-render non necessari
