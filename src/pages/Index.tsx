
import React, { useState } from 'react';
import TextInput from '@/components/TextInput';
import ColorPicker from '@/components/ColorPicker';
import Canvas from '@/components/Canvas';
import DownloadButton from '@/components/DownloadButton';
import TextAlignControl from '@/components/TextAlignControl';
import FontSizeControl from '@/components/FontSizeControl';
import TextColorPicker from '@/components/TextColorPicker';
import UrlInput from '@/components/UrlInput';

const Index = () => {
  const [text, setText] = useState('');
  const [backgroundColor, setBackgroundColor] = useState('#8B5CF6');
  const [textAlign, setTextAlign] = useState<'left' | 'center' | 'right'>('center');
  const [fontSize, setFontSize] = useState(64);
  const [textColor, setTextColor] = useState('#FFFFFF');

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
        <UrlInput onTitleExtracted={setText} />
        <TextInput value={text} onChange={setText} />
        <TextAlignControl value={textAlign} onChange={setTextAlign} />
        <FontSizeControl value={fontSize} onChange={setFontSize} />
        <TextColorPicker color={textColor} onChange={setTextColor} />
        <ColorPicker color={backgroundColor} onChange={setBackgroundColor} />
        <DownloadButton onDownload={handleDownload} />
      </div>
      
      <div className="preview-container">
        <div className="canvas-wrapper">
          <Canvas 
            text={text} 
            backgroundColor={backgroundColor} 
            textAlign={textAlign}
            fontSize={fontSize}
            textColor={textColor}
          />
        </div>
      </div>
    </div>
  );
};

export default Index;
