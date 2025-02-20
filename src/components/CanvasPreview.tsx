
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
  overlay?: string;
  onSpacingChange?: (spacing: number) => void;
  font?: string;
  onStickerAdd?: (sticker: string) => void;
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
  overlay,
  onSpacingChange,
  font,
  onStickerAdd
}) => {
  return (
    <div className="preview-container w-full h-full flex items-center justify-center">
      <div 
        className="canvas-wrapper relative w-full h-full max-h-[calc(100vh-120px)] flex items-center justify-center"
        style={{ 
          aspectRatio: format === 'post' ? '1080/1350' : '1080/1920',
          maxWidth: format === 'post' ? 'calc((100vh - 120px) * 0.8)' : 'calc((100vh - 120px) * 0.5625)'
        }}
      >
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
          overlay={overlay}
          onSpacingChange={onSpacingChange}
          font={font}
          onStickerAdd={onStickerAdd}
        />
      </div>
    </div>
  );
};

export default CanvasPreview;
