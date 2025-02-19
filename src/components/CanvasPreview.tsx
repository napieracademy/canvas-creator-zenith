
import React from 'react';
import Canvas from '@/components/Canvas';

interface CanvasPreviewProps {
  text: string;
  description: string;
  backgroundColor: string;
  textAlign: 'left' | 'center' | 'right';
  descriptionAlign?: 'left' | 'center' | 'right';
  textColor: string;
  fontSize: number;
  descriptionFontSize: number;
  spacing: number;
  onEffectiveFontSizeChange?: (size: number) => void;
  showSafeZone?: boolean;
  format?: 'post' | 'story';
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
  format
}) => {
  return (
    <div className="preview-panel">
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
      />
    </div>
  );
};

export default CanvasPreview;
