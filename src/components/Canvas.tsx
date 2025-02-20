
import React, { useRef, useEffect } from 'react';
import { CanvasProps } from '@/types/canvas';
import { useCanvasScale } from '@/hooks/useCanvasScale';
import { 
  SAFE_ZONE_MARGIN,
  drawSafeZone,
  drawText,
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
  overlay,
  font,
  onFontSizeChange,
  onDescriptionFontSizeChange,
  onSpacingChange,
  onEffectiveFontSizeChange,
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  
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

    const getFontFamily = () => {
      switch (font) {
        case 'font-c64-system':
          return 'Press Start 2P';
        case 'font-c64-mono':
          return 'Share Tech Mono';
        case 'font-c64-bold':
          return 'VT323';
        case 'font-c64-wide':
          return 'Silkscreen';
        default:
          return 'Inter';
      }
    };

    const fontFamily = getFontFamily();

    const context = {
      ctx,
      width: ORIGINAL_WIDTH,
      height: ORIGINAL_HEIGHT,
      safeZoneMargin: SAFE_ZONE_MARGIN,
      fontFamily
    };

    document.fonts.ready.then(() => {
      if (backgroundColor.startsWith('url(')) {
        const img = new Image();
        img.onload = () => {
          const scale = Math.max(canvas.width / img.width, canvas.height / img.height);
          const x = (canvas.width - img.width * scale) / 2;
          const y = (canvas.height - img.height * scale) / 2;
          
          ctx.drawImage(img, x, y, img.width * scale, img.height * scale);

          if (overlay) {
            ctx.fillStyle = overlay;
            ctx.fillRect(0, 0, canvas.width, canvas.height);
          }

          if (showSafeZone) {
            drawSafeZone(ctx, ORIGINAL_WIDTH, ORIGINAL_HEIGHT);
          }

          drawText(context, text, textAlign, textColor, fontSize, 'title', spacing);
          
          if (description) {
            drawText(context, description, descriptionAlign, textColor, descriptionFontSize, 'description', spacing);
          }
        };
        img.src = backgroundColor.slice(4, -1);
      } else {
        if (backgroundColor.includes('gradient')) {
          const gradient = ctx.createLinearGradient(0, 0, ORIGINAL_WIDTH, ORIGINAL_HEIGHT);
          const colors = backgroundColor.match(/#[a-fA-F0-9]{6}/g);
          if (colors && colors.length >= 2) {
            gradient.addColorStop(0, colors[0]);
            gradient.addColorStop(1, colors[1]);
          }
          ctx.fillStyle = gradient;
        } else {
          ctx.fillStyle = backgroundColor;
        }
        ctx.fillRect(0, 0, ORIGINAL_WIDTH, ORIGINAL_HEIGHT);

        if (showSafeZone) {
          drawSafeZone(ctx, ORIGINAL_WIDTH, ORIGINAL_HEIGHT);
        }

        drawText(context, text, textAlign, textColor, fontSize, 'title', spacing);
        
        if (description) {
          drawText(context, description, descriptionAlign, textColor, descriptionFontSize, 'description', spacing);
        }
      }
    });
  }, [text, description, backgroundColor, textAlign, descriptionAlign, textColor, fontSize, descriptionFontSize, spacing, showSafeZone, format, overlay, font]);

  useEffect(() => {
    if (onEffectiveFontSizeChange) {
      onEffectiveFontSizeChange(fontSize);
    }
  }, [fontSize, onEffectiveFontSizeChange]);

  return (
    <div className="flex flex-col w-full h-full">
      <div ref={containerRef} className="relative w-full h-full">
        <CanvasRender canvasRef={canvasRef} />
      </div>
      <div className="mt-2 flex justify-end gap-2 text-sm text-gray-500">
        <div>{scale}%</div>
        <div>1080 × {ORIGINAL_HEIGHT} px</div>
      </div>
    </div>
  );
};

export default Canvas;
