
import React from 'react';
import { GripVertical } from 'lucide-react';

interface SpacingControlProps {
  spacing: number;
  showControl: boolean;
  onMouseDown: (e: React.MouseEvent, type: 'spacing') => void;
  onMouseEnter?: () => void;
  onMouseLeave?: () => void;
}

const SpacingControl: React.FC<SpacingControlProps> = ({
  spacing,
  showControl,
  onMouseDown,
  onMouseEnter,
  onMouseLeave
}) => {
  return (
    <div 
      className={`absolute left-0 right-0 cursor-ns-resize transition-opacity duration-300`}
      style={{ 
        top: `calc(50% - ${spacing/2 + 40}px)`,
        height: '80px',
        zIndex: 10,
      }}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
    >
      <div 
        className={`absolute left-8 transition-opacity duration-300 ${showControl ? 'opacity-100' : 'opacity-0'}`}
        style={{ 
          top: '50%',
          transform: 'translateY(-50%)',
        }}
        onMouseDown={(e) => onMouseDown(e, 'spacing')}
      >
        <div className="bg-black/50 backdrop-blur-sm text-white px-4 py-2 rounded-full flex items-center gap-3 select-none hover:bg-black/60 transition-colors">
          <GripVertical className="h-6 w-6" />
          <span className="text-base font-medium">{Math.round(spacing)}px</span>
        </div>
      </div>
    </div>
  );
};

export default SpacingControl;
