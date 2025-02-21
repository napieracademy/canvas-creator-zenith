
import React from 'react';
import CanvasPreview from '@/components/CanvasPreview';
import { Separator } from "@/components/ui/separator";
import FormatControls from './MainContent/FormatControls';
import ViewControls from './MainContent/ViewControls';
import ImportControls from './MainContent/ImportControls';
import TextToolbar from './MainContent/TextToolbar';

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
  viewMode: 'full' | 'fast';
  logo?: string;
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
  onFormatChange: (format: 'post' | 'story') => void;
  onViewModeChange: (mode: 'full' | 'fast') => void;
  onImageExtracted?: (image: string) => void;
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
  viewMode,
  logo,
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
  onLoadingChange,
  onFormatChange,
  onViewModeChange
}) => {
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
          logo={logo}
        />
        <div className="absolute top-3 right-3 flex items-center gap-2 p-2 rounded-lg bg-white/20 backdrop-blur-sm">
          <div className="flex items-center gap-2 ml-auto">
            <FormatControls 
              format={format}
              onFormatChange={onFormatChange}
              isLoading={isLoading}
            />

            <Separator orientation="vertical" className="h-8 bg-white/20" />

            <ViewControls 
              viewMode={viewMode}
              onViewModeChange={onViewModeChange}
              isLoading={isLoading}
            />

            <Separator orientation="vertical" className="h-8 bg-white/20" />

            <ImportControls 
              text={text}
              description={description}
              isLoading={isLoading}
              onTitleExtracted={onTitleExtracted}
              onDescriptionExtracted={onDescriptionExtracted}
              onTabChange={onTabChange}
              onLoadingChange={onLoadingChange}
              onTextChange={onTextChange}
              onDescriptionChange={onDescriptionChange}
              onMagicOptimization={onMagicOptimization}
              onDownload={onDownload}
            />

            {viewMode === 'full' && (
              <>
                <Separator orientation="vertical" className="h-8 bg-white/20" />
                <TextToolbar 
                  text={text}
                  description={description}
                  spacing={spacing}
                  showSafeZone={showSafeZone}
                  isLoading={isLoading}
                  onTextChange={onTextChange}
                  onDescriptionChange={onDescriptionChange}
                  onSpacingChange={onSpacingChange}
                  onShowSafeZoneChange={onShowSafeZoneChange}
                  onMagicOptimization={onMagicOptimization}
                />
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MainContent;
