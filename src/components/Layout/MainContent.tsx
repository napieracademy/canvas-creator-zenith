
import React from 'react';
import CanvasPreview from '@/components/CanvasPreview';
import MagicButton from '@/components/MagicButton';
import SafeZoneToggle from '@/components/SafeZoneToggle';
import DownloadButton from '@/components/DownloadButton';
import TextTranslateControl from '@/components/TextControls/TextTranslateControl';

interface MainContentProps {
  text: string;
  description: string;
  backgroundColor: string;
  textAlign: 'left' | 'center' | 'right';
  descriptionAlign: 'left' | 'center' | 'right';
  textColor: string;
  fontSize: number;
  descriptionFontSize: number;
  spacing: number;
  showSafeZone: boolean;
  format: 'post' | 'story';
  currentFont: string;
  isLoading: boolean;
  credits: string;
  onEffectiveFontSizeChange: (size: number) => void;
  onShowSafeZoneChange: (show: boolean) => void;
  onSpacingChange: (spacing: number) => void;
  onMagicOptimization: () => void;
  onDownload: () => void;
  onTextChange: (text: string) => void;
  onDescriptionChange: (description: string) => void;
}

const MainContent: React.FC<MainContentProps> = ({
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
  currentFont,
  isLoading,
  credits,
  onEffectiveFontSizeChange,
  onShowSafeZoneChange,
  onSpacingChange,
  onMagicOptimization,
  onDownload,
  onTextChange,
  onDescriptionChange
}) => {
  const handleTranslate = ({ title, description }: { title: string; description: string }) => {
    onTextChange(title);
    onDescriptionChange(description);
  };

  return (
    <div className="h-screen p-6">
      <div className="relative">
        <CanvasPreview 
          text={text}
          description={description}
          backgroundColor={backgroundColor}
          textAlign={textAlign}
          descriptionAlign={descriptionAlign}
          textColor={textColor}
          fontSize={fontSize}
          descriptionFontSize={descriptionFontSize}
          spacing={spacing}
          onEffectiveFontSizeChange={onEffectiveFontSizeChange}
          showSafeZone={showSafeZone}
          format={format}
          onSpacingChange={onSpacingChange}
          font={currentFont}
          credits={credits}
        />
        <div className="absolute top-3 right-3 flex gap-2">
          <TextTranslateControl 
            texts={{ title: text, description }}
            onTranslate={handleTranslate}
            disabled={isLoading}
          />
          <MagicButton onMagicOptimization={onMagicOptimization} disabled={isLoading} />
          <SafeZoneToggle 
            showSafeZone={showSafeZone}
            onShowSafeZoneChange={onShowSafeZoneChange}
            disabled={isLoading}
          />
          <DownloadButton onDownload={onDownload} />
        </div>
      </div>
    </div>
  );
};

export default MainContent;
