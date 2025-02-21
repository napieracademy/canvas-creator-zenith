
import React, { useRef, useEffect, useCallback } from 'react';
import { CanvasProps } from '@/types/canvas';
import { useCanvasScale } from '@/hooks/useCanvasScale';
import { withFeatureVariants } from './withFeatureVariants';
import { 
  SAFE_ZONE_MARGIN,
  drawSafeZone,
  drawText,
  drawBackground,
} from '@/utils/canvasUtils';
import CanvasRender from './Canvas/CanvasRender';

const Canvas: React.FC<CanvasProps> = ({ 
  text, 
  description,
  backgroundColor, 
  textAlign, 
  descriptionAlign = textAlign,
  textColor, 
  fontSize,
  descriptionFontSize = 32,
  spacing = 40,
  showSafeZone = false,
  format = 'post',
  font,
  onEffectiveFontSizeChange,
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  
  const ORIGINAL_WIDTH = 1080;
  const ORIGINAL_HEIGHT = format === 'post' ? 1350 : 1920;
  
  const { scale, updateScale } = useCanvasScale(canvasRef, ORIGINAL_WIDTH, ORIGINAL_HEIGHT);

  const renderCanvas = useCallback(async () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    canvas.width = ORIGINAL_WIDTH;
    canvas.height = ORIGINAL_HEIGHT;
    
    updateScale();
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    const fontFamily = font === 'font-c64-system' ? 'Press Start 2P' :
                      font === 'font-c64-mono' ? 'Share Tech Mono' :
                      font === 'font-c64-bold' ? 'VT323' :
                      font === 'font-c64-wide' ? 'Silkscreen' : 'Inter';

    const context = {
      ctx,
      width: ORIGINAL_WIDTH,
      height: ORIGINAL_HEIGHT,
      safeZoneMargin: SAFE_ZONE_MARGIN,
      fontFamily
    };

    await document.fonts.ready;

    // Draw background
    await drawBackground(context, backgroundColor);

    // Draw safe zone if enabled
    if (showSafeZone) {
      drawSafeZone(ctx, ORIGINAL_WIDTH, ORIGINAL_HEIGHT);
    }

    // Draw text
    drawText(context, text, textAlign, textColor, fontSize, 'title', spacing);
    
    if (description) {
      drawText(context, description, descriptionAlign, textColor, descriptionFontSize, 'description', spacing);
    }
  }, [
    text,
    description,
    backgroundColor,
    textAlign,
    descriptionAlign,
    textColor,
    fontSize,
    descriptionFontSize,
    spacing,
    showSafeZone,
    format,
    font,
    ORIGINAL_HEIGHT,
    ORIGINAL_WIDTH,
    updateScale
  ]);

  useEffect(() => {
    renderCanvas().catch(console.error);
  }, [renderCanvas]);

  useEffect(() => {
    if (onEffectiveFontSizeChange) {
      onEffectiveFontSizeChange(fontSize);
    }
  }, [fontSize, onEffectiveFontSizeChange]);

  return (
    <div className="flex flex-col w-full h-full bg-background">
      <div 
        ref={containerRef} 
        className="relative w-full h-full flex items-center justify-center overflow-hidden"
      >
        <CanvasRender 
          canvasRef={canvasRef}
          className="max-w-full max-h-full object-contain"
          style={{
            transform: `scale(${scale / 100})`,
            transformOrigin: 'center'
          }}
        />
      </div>
      <div className="mt-2 flex justify-end gap-2 text-sm text-gray-500">
        <div>{scale}%</div>
        <div>1080 × {ORIGINAL_HEIGHT} px</div>
      </div>
    </div>
  );
};

export default withFeatureVariants(Canvas, 'Canvas');
