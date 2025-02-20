
import React from 'react';
import CanvasPreview from '@/components/CanvasPreview';
import MagicButton from '@/components/MagicButton';
import SafeZoneToggle from '@/components/SafeZoneToggle';
import DownloadButton from '@/components/DownloadButton';
import TextTranslateControl from '@/components/TextControls/TextTranslateControl';
import SpacingControl from '@/components/SpacingControl';
import UrlFetchControl from '@/components/TextControls/UrlFetchControl';
import { Separator } from "@/components/ui/separator";

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
  onTitleExtracted: (title: string) => void;
  onDescriptionExtracted: (description: string) => void;
  onTabChange: (value: string) => void;
  onLoadingChange: (loading: boolean) => void;
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
  onDescriptionChange,
  onTitleExtracted,
  onDescriptionExtracted,
  onTabChange,
  onLoadingChange
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
        <div className="absolute top-3 right-3 flex items-center gap-2 p-2 rounded-lg bg-white/20 backdrop-blur-sm">
          {/* Gruppo Importazione/Input */}
          <div className="flex items-center gap-2">
            <UrlFetchControl
              onTitleExtracted={onTitleExtracted}
              onDescriptionExtracted={onDescriptionExtracted}
              onTabChange={onTabChange}
              onLoadingChange={onLoadingChange}
              disabled={isLoading}
            />
            <TextTranslateControl 
              texts={{ title: text, description }}
              onTranslate={handleTranslate}
              disabled={isLoading}
            />
          </div>

          <Separator orientation="vertical" className="h-8 bg-white/20" />

          {/* Gruppo Layout */}
          <div className="flex items-center gap-2">
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

          {/* Gruppo Azioni */}
          <div className="flex items-center gap-2">
            <MagicButton 
              onMagicOptimization={onMagicOptimization} 
              disabled={isLoading} 
            />
            <DownloadButton onDownload={onDownload} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default MainContent;
