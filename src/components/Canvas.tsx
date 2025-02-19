
import React, { useRef, useEffect, useState } from 'react';
import { CanvasProps } from '@/types/canvas';
import { useCanvasScale } from '@/hooks/useCanvasScale';
import { GripVertical } from 'lucide-react';
import { 
  SAFE_ZONE_MARGIN,
  drawBackground,
  drawSafeZone,
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
  overlay,
  onSpacingChange,
  imageUrl,
  template = 'klaus'
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const isDraggingRef = useRef(false);
  const lastYRef = useRef(0);
  const [showSpacingControl, setShowSpacingControl] = useState(false);
  const [localSpacing, setLocalSpacing] = useState(spacing);
  
  const ORIGINAL_WIDTH = 1080;
  const ORIGINAL_HEIGHT = format === 'post' ? 1350 : 1920;
  
  const { scale, updateScale } = useCanvasScale(canvasRef, ORIGINAL_WIDTH, ORIGINAL_HEIGHT);

  useEffect(() => {
    setLocalSpacing(spacing);
  }, [spacing]);

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

    // Disegna lo sfondo
    drawBackground(ctx, ORIGINAL_WIDTH, ORIGINAL_HEIGHT, backgroundColor);

    // Gestisci l'immagine solo per il template Lucky
    if (template === 'lucky' && imageUrl) {
      const img = new Image();
      img.onload = () => {
        const maxHeight = ORIGINAL_HEIGHT * 0.4;
        const maxWidth = ORIGINAL_WIDTH - (2 * SAFE_ZONE_MARGIN);
        
        const imgAspectRatio = img.width / img.height;
        let targetWidth = maxWidth;
        let targetHeight = targetWidth / imgAspectRatio;
        
        if (targetHeight > maxHeight) {
          targetHeight = maxHeight;
          targetWidth = targetHeight * imgAspectRatio;
        }
        
        const x = (ORIGINAL_WIDTH - targetWidth) / 2;
        const y = SAFE_ZONE_MARGIN;

        ctx.drawImage(img, x, y, targetWidth, targetHeight);

        if (showSafeZone) {
          drawSafeZone(ctx, ORIGINAL_WIDTH, ORIGINAL_HEIGHT);
        }

        drawText(context, text, textAlign, textColor, fontSize, 'title', localSpacing, template);
        if (description) {
          drawText(context, description, descriptionAlign, textColor, descriptionFontSize, 'description', localSpacing, template);
        }
      };
      img.src = imageUrl;
    } else {
      // Per Klaus o Lucky senza immagine
      if (showSafeZone) {
        drawSafeZone(ctx, ORIGINAL_WIDTH, ORIGINAL_HEIGHT);
      }

      drawText(context, text, textAlign, textColor, fontSize, 'title', localSpacing, template);
      if (description) {
        drawText(context, description, descriptionAlign, textColor, descriptionFontSize, 'description', localSpacing, template);
      }
    }
  }, [text, description, backgroundColor, textAlign, descriptionAlign, textColor, fontSize, descriptionFontSize, localSpacing, onEffectiveFontSizeChange, showSafeZone, format, overlay, imageUrl, template]);

  const handleMouseDown = (e: React.MouseEvent) => {
    if (!containerRef.current) return;
    
    const rect = containerRef.current.getBoundingClientRect();
    const y = e.clientY - rect.top;
    
    isDraggingRef.current = true;
    lastYRef.current = y;
    setShowSpacingControl(true);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDraggingRef.current || !containerRef.current) return;
    
    const rect = containerRef.current.getBoundingClientRect();
    const y = e.clientY - rect.top;
    const delta = (y - lastYRef.current) * 2;
    
    const newSpacing = Math.max(0, Math.min(200, localSpacing + delta));
    setLocalSpacing(newSpacing);
    if (onSpacingChange) {
      onSpacingChange(newSpacing);
    }
    
    lastYRef.current = y;
  };

  const handleMouseUp = () => {
    isDraggingRef.current = false;
    setTimeout(() => setShowSpacingControl(false), 1500);
  };

  return (
    <div className="flex flex-col w-full h-full">
      <div 
        ref={containerRef}
        className="relative w-full h-full"
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
      >
        <canvas
          ref={canvasRef}
          className="w-full h-full rounded-xl"
          style={{
            maxWidth: '100%',
            maxHeight: '100%',
            objectFit: 'contain',
          }}
        />
        {description && (
          <div 
            className={`absolute left-1/2 -translate-x-1/2 cursor-ns-resize transition-opacity duration-300 ${showSpacingControl ? 'opacity-100' : 'opacity-0'}`}
            style={{ 
              top: `calc(50% - ${localSpacing/2}px)`,
              transform: 'translateX(-50%)',
              zIndex: 10 
            }}
            onMouseDown={handleMouseDown}
          >
            <div className="bg-black/50 backdrop-blur-sm text-white px-2 py-1 rounded-full flex items-center gap-2 select-none">
              <GripVertical className="h-4 w-4" />
              <span className="text-sm">{Math.round(localSpacing)}px</span>
            </div>
          </div>
        )}
      </div>
      <div className="mt-2 flex justify-end gap-2 text-sm text-gray-500">
        <div>{scale}%</div>
        <div>1080 × {ORIGINAL_HEIGHT} px</div>
      </div>
    </div>
  );
};

export default Canvas;
