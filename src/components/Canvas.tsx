import React, { useRef, useEffect, useState } from 'react';
import { CanvasProps } from '@/types/canvas';
import { useCanvasScale } from '@/hooks/useCanvasScale';
import { 
  SAFE_ZONE_MARGIN,
  drawBackground,
  drawSafeZone,
  textFitsInSafeZone,
  drawText
} from '@/utils/canvasUtils';
import FontSizeControl from './Canvas/FontSizeControl';
import SpacingControl from './Canvas/SpacingControl';
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
  onEffectiveFontSizeChange,
  showSafeZone = false,
  format = 'post',
  overlay,
  onSpacingChange,
  font,
  onFontSizeChange,
  onDescriptionFontSizeChange
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const isDraggingRef = useRef(false);
  const isResizingTitleRef = useRef(false);
  const isResizingDescRef = useRef(false);
  const lastYRef = useRef(0);
  const [showSpacingControl, setShowSpacingControl] = useState(false);
  const [showFontControls, setShowFontControls] = useState(false);
  const [localSpacing, setLocalSpacing] = useState(spacing);
  const [localFontSize, setLocalFontSize] = useState(fontSize);
  const [localDescFontSize, setLocalDescFontSize] = useState(descriptionFontSize);
  
  const ORIGINAL_WIDTH = 1080;
  const ORIGINAL_HEIGHT = format === 'post' ? 1350 : 1920;
  
  const { scale, updateScale } = useCanvasScale(canvasRef, ORIGINAL_WIDTH, ORIGINAL_HEIGHT);

  useEffect(() => {
    setLocalSpacing(spacing);
  }, [spacing]);

  useEffect(() => {
    setLocalFontSize(fontSize);
  }, [fontSize]);

  useEffect(() => {
    setLocalDescFontSize(descriptionFontSize);
  }, [descriptionFontSize]);

  const handleMouseDown = (e: React.MouseEvent, type: 'spacing' | 'title-font' | 'desc-font') => {
    if (!containerRef.current) return;
    
    const rect = containerRef.current.getBoundingClientRect();
    const y = e.clientY - rect.top;
    
    switch(type) {
      case 'spacing':
        isDraggingRef.current = true;
        setShowSpacingControl(true);
        break;
      case 'title-font':
        isResizingTitleRef.current = true;
        setShowFontControls(true);
        break;
      case 'desc-font':
        isResizingDescRef.current = true;
        setShowFontControls(true);
        break;
    }
    
    lastYRef.current = y;
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!containerRef.current) return;
    
    const rect = containerRef.current.getBoundingClientRect();
    const y = e.clientY - rect.top;
    const delta = Math.round((lastYRef.current - y) / 2);
    
    if (isDraggingRef.current && onSpacingChange) {
      const newSpacing = Math.max(0, Math.min(200, localSpacing + delta));
      setLocalSpacing(newSpacing);
      onSpacingChange(newSpacing);
    } else if (isResizingTitleRef.current && onFontSizeChange) {
      const newSize = Math.max(32, Math.min(120, localFontSize + delta));
      setLocalFontSize(newSize);
      onFontSizeChange(newSize);
    } else if (isResizingDescRef.current && onDescriptionFontSizeChange) {
      const newSize = Math.max(32, Math.min(120, localDescFontSize + delta));
      setLocalDescFontSize(newSize);
      onDescriptionFontSizeChange(newSize);
    }
    
    lastYRef.current = y;
  };

  const handleMouseUp = () => {
    isDraggingRef.current = false;
    isResizingTitleRef.current = false;
    isResizingDescRef.current = false;
  };

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

          drawText(context, text, textAlign, textColor, localFontSize, 'title', localSpacing);
          if (description) {
            drawText(context, description, descriptionAlign, textColor, localDescFontSize, 'description', localSpacing);
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

        drawText(context, text, textAlign, textColor, localFontSize, 'title', localSpacing);
        if (description) {
          drawText(context, description, descriptionAlign, textColor, localDescFontSize, 'description', localSpacing);
        }
      }
    });
  }, [text, description, backgroundColor, textAlign, descriptionAlign, textColor, localFontSize, localDescFontSize, localSpacing, onEffectiveFontSizeChange, showSafeZone, format, overlay, font]);

  return (
    <div className="flex flex-col w-full h-full">
      <div 
        ref={containerRef}
        className="relative w-full h-full"
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
      >
        <CanvasRender canvasRef={canvasRef} />
        
        <FontSizeControl
          fontSize={localFontSize}
          showControl={showFontControls}
          position="top"
          spacing={localSpacing}
          onMouseDown={handleMouseDown}
          type="title-font"
          onMouseEnter={() => setShowFontControls(true)}
          onMouseLeave={() => setTimeout(() => setShowFontControls(false), 1500)}
        />

        {description && (
          <>
            <SpacingControl
              spacing={localSpacing}
              showControl={showSpacingControl}
              onMouseDown={handleMouseDown}
              onMouseEnter={() => setShowSpacingControl(true)}
              onMouseLeave={() => setTimeout(() => setShowSpacingControl(false), 1500)}
            />

            <FontSizeControl
              fontSize={localDescFontSize}
              showControl={showFontControls}
              position="bottom"
              spacing={localSpacing}
              onMouseDown={handleMouseDown}
              type="desc-font"
              onMouseEnter={() => setShowFontControls(true)}
              onMouseLeave={() => setTimeout(() => setShowFontControls(false), 1500)}
            />
          </>
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
