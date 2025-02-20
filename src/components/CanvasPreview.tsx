
import React from 'react';
import Canvas from './Canvas';

interface CanvasPreviewProps {
  text: string;
  description: string;
  backgroundColor: string;
  textAlign: 'left' | 'center' | 'right';
  descriptionAlign: 'left' | 'center' | 'right';
  textColor: string;
  fontSize: number;
  descriptionFontSize: number;
  spacing: number;
  onEffectiveFontSizeChange: (size: number) => void;
  showSafeZone: boolean;
  format: 'post' | 'story';
  onSpacingChange: (spacing: number) => void;
  font: string;
  credits?: string;
}

const CanvasPreview: React.FC<CanvasPreviewProps> = ({
  text,
  description,
  backgroundColor,
  textAlign,
  descriptionAlign,
  textColor,
  fontSize,
  descriptionFontSize,
  spacing,
  onEffectiveFontSizeChange,
  showSafeZone,
  format,
  onSpacingChange,
  font,
  credits
}) => {
  console.log('CanvasPreview credits:', credits); // Debug log

  return (
    <div className="relative w-full h-full flex items-center justify-center rounded-lg overflow-hidden border border-gray-200 bg-white/50 backdrop-blur-sm">
      <Canvas
        text={text}
        description={description}
        backgroundColor={backgroundColor}
        textAlign={textAlign}
        descriptionAlign={descriptionAlign}
        textColor={textColor}
        fontSize={fontSize}
        descriptionFontSize={descriptionFontSize}
        spacing={spacing}
        onEffectiveFontSizeChange={onEffectiveFontSizeChange}
        showSafeZone={showSafeZone}
        format={format}
        onSpacingChange={onSpacingChange}
        font={font}
        credits={credits}
      />
    </div>
  );
};

export default CanvasPreview;
