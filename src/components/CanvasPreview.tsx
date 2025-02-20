
import React from 'react';
import Canvas from './Canvas';
import { CanvasProps } from '@/types/canvas';

const CanvasPreview: React.FC<CanvasProps> = (props) => {
  console.log('Credits in CanvasPreview:', props.credits); // Debug log
  
  return (
    <div className="preview-container w-full h-full flex items-center justify-center">
      <div 
        className="canvas-wrapper relative w-full h-full max-h-[calc(100vh-120px)] flex items-center justify-center"
        style={{ 
          aspectRatio: props.format === 'post' ? '1080/1350' : '1080/1920',
          maxWidth: props.format === 'post' ? 'calc((100vh - 120px) * 0.8)' : 'calc((100vh - 120px) * 0.5625)'
        }}
      >
        <Canvas {...props} />
      </div>
    </div>
  );
};

export default CanvasPreview;
