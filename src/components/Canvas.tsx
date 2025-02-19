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
  format = 'post',
  overlay
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

    // Gestione sfondo
    if (backgroundColor.startsWith('url(')) {
      // Se è un'immagine di sfondo
      const img = new Image();
      img.onload = () => {
        // Disegna l'immagine coprendo tutto il canvas
        const scale = Math.max(canvas.width / img.width, canvas.height / img.height);
        const x = (canvas.width - img.width * scale) / 2;
        const y = (canvas.height - img.height * scale) / 2;
        
        ctx.drawImage(img, x, y, img.width * scale, img.height * scale);

        // Applica l'overlay se specificato
        if (overlay) {
          ctx.fillStyle = overlay;
          ctx.fillRect(0, 0, canvas.width, canvas.height);
        }

        // Ridisegna il testo sopra l'immagine
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
      // Sfondo normale
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
  }, [text, description, backgroundColor, textAlign, descriptionAlign, textColor, fontSize, descriptionFontSize, spacing, onEffectiveFontSizeChange, showSafeZone, format, overlay]);

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
