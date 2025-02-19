
import React, { useState } from 'react';
import TextInput from '@/components/TextInput';
import ColorPicker from '@/components/ColorPicker';
import Canvas from '@/components/Canvas';
import DownloadButton from '@/components/DownloadButton';

const Index = () => {
  const [text, setText] = useState('');
  const [backgroundColor, setBackgroundColor] = useState('#000000');

  const handleDownload = () => {
    const canvas = document.querySelector('canvas');
    if (!canvas) return;

    const link = document.createElement('a');
    link.download = 'image.png';
    link.href = canvas.toDataURL('image/png');
    link.click();
  };

  return (
    <div className="min-h-screen w-full bg-gray-50 flex">
      <div className="controls-panel">
        <TextInput value={text} onChange={setText} />
        <ColorPicker color={backgroundColor} onChange={setBackgroundColor} />
        <DownloadButton onDownload={handleDownload} />
      </div>
      
      <div className="flex-1 p-4">
        <Canvas text={text} backgroundColor={backgroundColor} />
      </div>
    </div>
  );
};

export default Index;
