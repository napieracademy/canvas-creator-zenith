
import React from 'react';
import Canvas from '@/components/Canvas';

interface CanvasPreviewProps {
  text: string;
  description: string;
  backgroundColor: string;
  textAlign: 'left' | 'center' | 'right';
  fontSize: number;
  descriptionFontSize: number;
  textColor: string;
  onEffectiveFontSizeChange: (size: number) => void;
  showSafeZone: boolean;
  format: 'post' | 'story';
}

const CanvasPreview: React.FC<CanvasPreviewProps> = ({
  text,
  description,
  backgroundColor,
  textAlign,
  fontSize,
  descriptionFontSize,
  textColor,
  onEffectiveFontSizeChange,
  showSafeZone,
  format
}) => {
  return (
    <div className="preview-container">
      <div className="canvas-wrapper" style={{ aspectRatio: format === 'post' ? '1080/1350' : '1080/1920' }}>
        <Canvas 
          text={text}
          description={description}
          backgroundColor={backgroundColor} 
          textAlign={textAlign}
          fontSize={fontSize}
          descriptionFontSize={descriptionFontSize}
          textColor={textColor}
          onEffectiveFontSizeChange={onEffectiveFontSizeChange}
          showSafeZone={showSafeZone}
          format={format}
        />
      </div>
    </div>
  );
};

export default CanvasPreview;
