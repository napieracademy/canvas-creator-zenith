
import React, { useRef, useEffect, useState } from 'react';
import { CanvasProps } from '@/types/canvas';
import { useCanvasScale } from '@/hooks/useCanvasScale';
import { GripVertical, X } from 'lucide-react';
import { 
  SAFE_ZONE_MARGIN,
  drawBackground,
  drawSafeZone,
  textFitsInSafeZone,
  drawText,
  calculateLines
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
  font
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const isDraggingRef = useRef(false);
  const lastYRef = useRef(0);
  const [showSpacingControl, setShowSpacingControl] = useState(false);
  const [localSpacing, setLocalSpacing] = useState(spacing);
  const [editingText, setEditingText] = useState<'title' | 'description' | null>(null);
  const [editorPosition, setEditorPosition] = useState({ x: 0, y: 0 });
  const [editorValue, setEditorValue] = useState('');
  
  const ORIGINAL_WIDTH = 1080;
  const ORIGINAL_HEIGHT = format === 'post' ? 1350 : 1920;
  
  const { scale, updateScale } = useCanvasScale(canvasRef, ORIGINAL_WIDTH, ORIGINAL_HEIGHT);

  useEffect(() => {
    setLocalSpacing(spacing);
  }, [spacing]);

  const handleCanvasClick = (e: React.MouseEvent) => {
    if (!canvasRef.current || !containerRef.current) return;

    const rect = canvasRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    // Converti le coordinate del click in coordinate del canvas originale
    const canvasX = (x * ORIGINAL_WIDTH) / rect.width;
    const canvasY = (y * ORIGINAL_HEIGHT) / rect.height;

    const ctx = canvasRef.current.getContext('2d');
    if (!ctx) return;

    // Determina se il click è sul titolo o sulla descrizione
    const titleLines = calculateLines({ ctx, width: ORIGINAL_WIDTH, height: ORIGINAL_HEIGHT, safeZoneMargin: SAFE_ZONE_MARGIN, fontFamily: font || 'Inter' }, text, fontSize, 'title');
    const descLines = description ? calculateLines({ ctx, width: ORIGINAL_WIDTH, height: ORIGINAL_HEIGHT, safeZoneMargin: SAFE_ZONE_MARGIN, fontFamily: font || 'Inter' }, description, descriptionFontSize, 'description') : [];

    const titleY = (ORIGINAL_HEIGHT / 2) - (localSpacing / 2) - (titleLines.length * fontSize * 1.2);
    const descY = (ORIGINAL_HEIGHT / 2) + (localSpacing / 2);

    if (canvasY >= titleY && canvasY <= titleY + (titleLines.length * fontSize * 1.2)) {
      setEditingText('title');
      setEditorValue(text);
      setEditorPosition({ x: e.clientX, y: e.clientY });
    } else if (description && canvasY >= descY && canvasY <= descY + (descLines.length * descriptionFontSize * 1.2)) {
      setEditingText('description');
      setEditorValue(description);
      setEditorPosition({ x: e.clientX, y: e.clientY });
    }
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

          drawText(context, text, textAlign, textColor, fontSize, 'title', localSpacing);
          if (description) {
            drawText(context, description, descriptionAlign, textColor, descriptionFontSize, 'description', localSpacing);
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

        drawText(context, text, textAlign, textColor, fontSize, 'title', localSpacing);
        if (description) {
          drawText(context, description, descriptionAlign, textColor, descriptionFontSize, 'description', localSpacing);
        }
      }
    });
  }, [text, description, backgroundColor, textAlign, descriptionAlign, textColor, fontSize, descriptionFontSize, localSpacing, onEffectiveFontSizeChange, showSafeZone, format, overlay, font]);

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
          className="w-full h-full rounded-xl cursor-pointer"
          style={{
            maxWidth: '100%',
            maxHeight: '100%',
            objectFit: 'contain',
          }}
          onClick={handleCanvasClick}
        />
        {editingText && (
          <div 
            className="absolute z-50 bg-white rounded-lg shadow-xl p-4"
            style={{ 
              left: editorPosition.x, 
              top: editorPosition.y,
              transform: 'translate(-50%, -100%)',
              minWidth: '300px'
            }}
          >
            <div className="flex justify-between items-center mb-2">
              <div className="text-sm font-medium text-gray-700">
                {editingText === 'title' ? 'Modifica titolo' : 'Modifica descrizione'}
              </div>
              <button 
                onClick={() => setEditingText(null)}
                className="text-gray-500 hover:text-gray-700"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
            <textarea
              value={editorValue}
              onChange={(e) => setEditorValue(e.target.value)}
              className="w-full p-2 border rounded-md"
              rows={3}
              autoFocus
            />
          </div>
        )}
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
