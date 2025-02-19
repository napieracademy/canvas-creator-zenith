
import React, { useState } from 'react';
import TextInput from '@/components/TextInput';
import ColorPicker from '@/components/ColorPicker';
import Canvas from '@/components/Canvas';
import DownloadButton from '@/components/DownloadButton';

const Index = () => {
  const [text, setText] = useState('');
  const [backgroundColor, setBackgroundColor] = useState('#8B5CF6');

  const handleDownload = () => {
    const canvas = document.querySelector('canvas');
    if (!canvas) return;

    const link = document.createElement('a');
    link.download = 'social-image.png';
    link.href = canvas.toDataURL('image/png');
    link.click();
  };

  return (
    <div className="min-h-screen w-full">
      <div className="controls-panel">
        <div className="space-y-1.5">
          <h1 className="text-xl font-semibold text-gray-900">Social Image Creator</h1>
          <p className="text-sm text-gray-500">Create beautiful social media images in seconds</p>
        </div>
        <TextInput value={text} onChange={setText} />
        <ColorPicker color={backgroundColor} onChange={setBackgroundColor} />
        <DownloadButton onDownload={handleDownload} />
      </div>
      
      <div className="preview-container">
        <div className="canvas-wrapper">
          <Canvas text={text} backgroundColor={backgroundColor} />
        </div>
      </div>
    </div>
  );
};

export default Index;
