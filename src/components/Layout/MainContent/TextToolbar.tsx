
import React from 'react';
import TextTranslateControl from '@/components/TextControls/TextTranslateControl';
import SpacingControl from '@/components/SpacingControl';
import SafeZoneToggle from '@/components/SafeZoneToggle';
import MagicButton from '@/components/MagicButton';
import { Separator } from "@/components/ui/separator";

interface TextToolbarProps {
  text: string;
  description: string;
  spacing: number;
  showSafeZone: boolean;
  isLoading: boolean;
  onTextChange: (text: string) => void;
  onDescriptionChange: (description: string) => void;
  onSpacingChange: (spacing: number) => void;
  onShowSafeZoneChange: (show: boolean) => void;
  onMagicOptimization: () => void;
}

const TextToolbar: React.FC<TextToolbarProps> = ({
  text,
  description,
  spacing,
  showSafeZone,
  isLoading,
  onTextChange,
  onDescriptionChange,
  onSpacingChange,
  onShowSafeZoneChange,
  onMagicOptimization
}) => {
  return (
    <>
      <div className="flex items-center gap-2 animate-fade-in">
        <TextTranslateControl 
          texts={{ title: text, description }}
          onTranslate={({ title, description }) => {
            onTextChange(title);
            onDescriptionChange(description);
          }}
          disabled={isLoading}
        />
      </div>

      <Separator orientation="vertical" className="h-8 bg-white/20" />

      <div className="flex items-center gap-2 animate-fade-in">
        <SpacingControl 
          value={spacing} 
          onChange={onSpacingChange} 
          disabled={isLoading}
        />
        <SafeZoneToggle 
          showSafeZone={showSafeZone}
          onShowSafeZoneChange={onShowSafeZoneChange}
          disabled={isLoading}
        />
      </div>

      <Separator orientation="vertical" className="h-8 bg-white/20" />

      <div className="flex items-center gap-2 animate-fade-in">
        <MagicButton 
          onMagicOptimization={onMagicOptimization} 
          disabled={isLoading} 
        />
      </div>
    </>
  );
};

export default TextToolbar;
