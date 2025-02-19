
import React, { useRef, useEffect } from 'react';
import { CanvasProps } from '@/types/canvas';
import { useCanvasScale } from '@/hooks/useCanvasScale';
import { 
  SAFE_ZONE_MARGIN,
  drawBackground,
  drawSafeZone,
  textFitsInSafeZone,
  drawText
} from '@/utils/canvasUtils';

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
  onEffectiveFontSizeChange,
  showSafeZone = false,
  format = 'post'
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const ORIGINAL_WIDTH = 1080;
  const ORIGINAL_HEIGHT = format === 'post' ? 1350 : 1920;
  
  const { scale, updateScale } = useCanvasScale(canvasRef, ORIGINAL_WIDTH, ORIGINAL_HEIGHT);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    canvas.width = ORIGINAL_WIDTH;
    canvas.height = ORIGINAL_HEIGHT;
    
    updateScale();

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    const context = {
      ctx,
      width: ORIGINAL_WIDTH,
      height: ORIGINAL_HEIGHT,
      safeZoneMargin: SAFE_ZONE_MARGIN
    };

    // Create a temporary canvas for the gradient
    const tempCanvas = document.createElement('canvas');
    const tempCtx = tempCanvas.getContext('2d');
    if (!tempCtx) return;

    tempCanvas.width = ORIGINAL_WIDTH;
    tempCanvas.height = ORIGINAL_HEIGHT;

    if (backgroundColor.includes('gradient')) {
      // Create gradient
      const gradient = tempCtx.createLinearGradient(0, 0, ORIGINAL_WIDTH, ORIGINAL_HEIGHT);
      
      // Parse gradient colors
      const colors = backgroundColor.match(/#[a-fA-F0-9]{6}/g);
      if (colors && colors.length >= 2) {
        gradient.addColorStop(0, colors[0]);
        gradient.addColorStop(1, colors[1]);
      }
      
      tempCtx.fillStyle = gradient;
      tempCtx.fillRect(0, 0, ORIGINAL_WIDTH, ORIGINAL_HEIGHT);
      
      // Draw the gradient to the main canvas
      ctx.drawImage(tempCanvas, 0, 0);
    } else {
      // For solid colors, use the original drawBackground function
      drawBackground(ctx, ORIGINAL_WIDTH, ORIGINAL_HEIGHT, backgroundColor);
    }

    // Draw safe zone if enabled
    if (showSafeZone) {
      drawSafeZone(ctx, ORIGINAL_WIDTH, ORIGINAL_HEIGHT);
    }

    // Calculate and adjust font size for main text
    let adjustedFontSize = fontSize;
    const maxSafeHeight = ORIGINAL_HEIGHT - (2 * SAFE_ZONE_MARGIN);
    const totalContentHeight = description ? maxSafeHeight * 0.8 : maxSafeHeight;

    while (!textFitsInSafeZone(context, text, adjustedFontSize) && adjustedFontSize > 32) {
      adjustedFontSize -= 2;
    }

    while (!textFitsInSafeZone(context, text, adjustedFontSize) && adjustedFontSize > 12) {
      adjustedFontSize -= 1;
    }

    if (onEffectiveFontSizeChange) {
      onEffectiveFontSizeChange(adjustedFontSize);
    }

    // Draw main text
    drawText(context, text, textAlign, textColor, adjustedFontSize, 'title', spacing);

    // Draw description text if present
    if (description) {
      drawText(context, description, descriptionAlign, textColor, descriptionFontSize, 'description', spacing);
    }

  }, [text, description, backgroundColor, textAlign, descriptionAlign, textColor, fontSize, descriptionFontSize, spacing, onEffectiveFontSizeChange, showSafeZone, format]);

  return (
    <div className="flex flex-col w-full h-full">
      <canvas
        ref={canvasRef}
        className="w-full h-full rounded-xl"
        style={{
          maxWidth: '100%',
          maxHeight: '100%',
          objectFit: 'contain',
        }}
      />
      <div className="mt-2 flex justify-end gap-2 text-sm text-gray-500">
        <div>{scale}%</div>
        <div>1080 × {ORIGINAL_HEIGHT} px</div>
      </div>
    </div>
  );
};

export default Canvas;
