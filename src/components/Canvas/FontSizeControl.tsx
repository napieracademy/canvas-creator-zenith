
import React from 'react';
import { Type } from 'lucide-react';

interface FontSizeControlProps {
  fontSize: number;
  showControl: boolean;
  position: 'top' | 'bottom';
  spacing: number;
  onMouseDown: (e: React.MouseEvent, type: 'title-font' | 'desc-font') => void;
  type: 'title-font' | 'desc-font';
  onMouseEnter?: () => void;
  onMouseLeave?: () => void;
}

const FontSizeControl: React.FC<FontSizeControlProps> = ({
  fontSize,
  showControl,
  position,
  spacing,
  onMouseDown,
  type,
  onMouseEnter,
  onMouseLeave
}) => {
  return (
    <div 
      className={`absolute left-0 right-0 cursor-ns-resize transition-opacity duration-300`}
      style={{ 
        top: position === 'top' 
          ? `calc(50% - ${spacing}px - 120px)`
          : `calc(50% + ${spacing}px - 40px)`,
        height: '160px',
        zIndex: 10,
      }}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
    >
      <div 
        className={`absolute right-8 transition-opacity duration-300 ${showControl ? 'opacity-100' : 'opacity-0'}`}
        style={{ 
          [position]: '0',
          transform: position === 'bottom' ? 'translateY(-50%)' : undefined,
          top: position === 'bottom' ? '50%' : undefined,
        }}
        onMouseDown={(e) => onMouseDown(e, type)}
      >
        <div className="bg-black/50 backdrop-blur-sm text-white px-4 py-2 rounded-full flex items-center gap-3 select-none hover:bg-black/60 transition-colors">
          <Type className="h-6 w-6" />
          <span className="text-base font-medium">{Math.round(fontSize)}px</span>
        </div>
      </div>
    </div>
  );
};

export default FontSizeControl;
