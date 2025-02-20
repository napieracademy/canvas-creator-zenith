
import React, { useRef, useEffect, useCallback } from 'react';
import { CanvasProps } from '@/types/canvas';
import { useCanvasScale } from '@/hooks/useCanvasScale';
import { 
  SAFE_ZONE_MARGIN,
  drawSafeZone,
  drawText,
  drawLogo,
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
  logo,
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  
  const ORIGINAL_WIDTH = 1080;
  const ORIGINAL_HEIGHT = format === 'post' ? 1350 : 1920;
  
  const { scale, updateScale } = useCanvasScale(canvasRef, ORIGINAL_WIDTH, ORIGINAL_HEIGHT);

  const renderCanvas = useCallback(async () => {
    const canvas = canvasRef.current;
    if (!canvas) {
      console.warn('Canvas element not found');
      return;
    }

    const ctx = canvas.getContext('2d');
    if (!ctx) {
      console.warn('Canvas context not found');
      return;
    }

    console.log('Starting canvas render with dimensions:', {
      width: ORIGINAL_WIDTH,
      height: ORIGINAL_HEIGHT
    });

    canvas.width = ORIGINAL_WIDTH;
    canvas.height = ORIGINAL_HEIGHT;
    
    updateScale();

    // Clear canvas
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
    console.log('Using font family:', fontFamily);

    const context = {
      ctx,
      width: ORIGINAL_WIDTH,
      height: ORIGINAL_HEIGHT,
      safeZoneMargin: SAFE_ZONE_MARGIN,
      fontFamily
    };

    // Wait for fonts to load
    await document.fonts.ready;
    console.log('Fonts loaded');

    // Draw background
    if (backgroundColor.startsWith('url(')) {
      console.log('Drawing background image');
      const img = new Image();
      img.crossOrigin = "anonymous";
      
      await new Promise((resolve, reject) => {
        img.onload = resolve;
        img.onerror = reject;
        img.src = backgroundColor.slice(4, -1);
      });

      const scale = Math.max(canvas.width / img.width, canvas.height / img.height);
      const x = (canvas.width - img.width * scale) / 2;
      const y = (canvas.height - img.height * scale) / 2;
      
      ctx.drawImage(img, x, y, img.width * scale, img.height * scale);

      if (overlay) {
        console.log('Applying overlay');
        ctx.fillStyle = overlay;
        ctx.fillRect(0, 0, canvas.width, canvas.height);
      }
    } else {
      console.log('Drawing background color/gradient');
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
    }

    // Draw logo if provided
    if (logo) {
      console.log('Drawing logo:', logo);
      drawLogo(context, logo);
    }

    // Draw safe zone if enabled
    if (showSafeZone) {
      console.log('Drawing safe zone');
      drawSafeZone(ctx, ORIGINAL_WIDTH, ORIGINAL_HEIGHT);
    }

    // Draw main text
    console.log('Drawing main text');
    drawText(context, text, textAlign, textColor, fontSize, 'title', spacing);
    
    // Draw description if provided
    if (description) {
      console.log('Drawing description');
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
    overlay,
    font,
    logo,
    ORIGINAL_HEIGHT,
    ORIGINAL_WIDTH,
    updateScale
  ]);

  useEffect(() => {
    console.log('Canvas effect triggered with dependencies');
    renderCanvas().catch(error => {
      console.error('Error rendering canvas:', error);
    });
  }, [renderCanvas]);

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
