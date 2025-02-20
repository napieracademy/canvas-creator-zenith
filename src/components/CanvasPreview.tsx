
import React from 'react';
import Canvas from './Canvas';
import { CanvasProps } from '@/types/canvas';

const CanvasPreview: React.FC<CanvasProps> = (props) => {
  console.log('Credits in CanvasPreview:', props.credits); // Debug log
  
  return (
    <div className="w-full h-full">
      <Canvas {...props} />
    </div>
  );
};

export default CanvasPreview;
