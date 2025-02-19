
import React, { useState } from 'react';
import TextInput from '@/components/TextInput';
import Canvas from '@/components/Canvas';
import DownloadButton from '@/components/DownloadButton';
import TextAlignControl from '@/components/TextAlignControl';
import FontSizeControl from '@/components/FontSizeControl';
import ColorPresets from '@/components/ColorPresets';
import UrlInput from '@/components/UrlInput';
import { useIsMobile } from '@/hooks/use-mobile';

const Index = () => {
  const [text, setText] = useState('');
  const [backgroundColor, setBackgroundColor] = useState('#8B5CF6');
  const [textAlign, setTextAlign] = useState<'left' | 'center' | 'right'>('center');
  const [fontSize, setFontSize] = useState(64);
  const [effectiveFontSize, setEffectiveFontSize] = useState(64);
  const [textColor, setTextColor] = useState('#FFFFFF');
  const isMobile = useIsMobile();

  const handleColorSelect = (background: string, text: string) => {
    setBackgroundColor(background);
    setTextColor(text);
  };

  const handleTitleExtracted = (extractedTitle: string) => {
    setText(extractedTitle);
  };

  const handleDownload = () => {
    const canvas = document.querySelector('canvas');
    if (!canvas) return;

    const link = document.createElement('a');
    link.download = 'social-image.png';
    link.href = canvas.toDataURL('image/png');
    link.click();
  };

  if (isMobile) {
    return (
      <div className="min-h-screen w-full flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 p-6">
        <div className="glass-panel p-8 rounded-2xl max-w-md text-center space-y-4">
          <h1 className="text-2xl font-bold text-gray-900">Versione Desktop Raccomandata</h1>
          <p className="text-gray-600">
            Questa app è ottimizzata per l'utilizzo su desktop. Per la migliore esperienza, ti preghiamo di accedere da un computer.
          </p>
          <div className="text-sm text-gray-500">
            💻 Torna a visitarci dal tuo computer!
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full">
      <div className="controls-panel">
        <div className="space-y-1.5">
          <h1 className="text-xl font-semibold text-gray-900">Social Image Creator</h1>
          <p className="text-sm text-gray-500">Create beautiful social media images in seconds</p>
        </div>
        <UrlInput onTitleExtracted={handleTitleExtracted} />
        <TextInput value={text} onChange={setText} />
        <TextAlignControl value={textAlign} onChange={setTextAlign} />
        <FontSizeControl value={fontSize} onChange={setFontSize} effectiveSize={effectiveFontSize} />
        <ColorPresets 
          onSelectColors={handleColorSelect}
          currentBackground={backgroundColor}
          currentText={textColor}
        />
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
            onEffectiveFontSizeChange={setEffectiveFontSize}
          />
        </div>
      </div>
    </div>
  );
};

export default Index;
