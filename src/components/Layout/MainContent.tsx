
import React from 'react';
import CanvasPreview from '@/components/CanvasPreview';
import MagicButton from '@/components/MagicButton';
import SafeZoneToggle from '@/components/SafeZoneToggle';
import DownloadButton from '@/components/DownloadButton';
import TextTranslateControl from '@/components/TextControls/TextTranslateControl';
import SpacingControl from '@/components/SpacingControl';
import UrlFetchControl from '@/components/TextControls/UrlFetchControl';
import SuperButton from '@/components/SuperButton';
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { Square, RectangleVertical, Zap } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

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
  logo?: string; // Aggiungiamo la prop logo
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
            {/* Gruppo Formato - sempre visibile */}
            <div className="flex items-center gap-2">
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant={format === 'post' ? 'default' : 'ghost'}
                      size="sm"
                      onClick={() => onFormatChange('post')}
                      disabled={isLoading}
                    >
                      <Square className="h-4 w-4" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Formato Post Instagram quadrato</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>

              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant={format === 'story' ? 'default' : 'ghost'}
                      size="sm"
                      onClick={() => onFormatChange('story')}
                      disabled={isLoading}
                    >
                      <RectangleVertical className="h-4 w-4" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Formato Story Instagram verticale</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>

            <Separator orientation="vertical" className="h-8 bg-white/20" />

            {/* Gruppo Vista - sempre visibile */}
            <div className="flex items-center gap-2">
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant={viewMode === 'fast' ? 'default' : 'ghost'}
                      size="sm"
                      onClick={() => onViewModeChange(viewMode === 'full' ? 'fast' : 'full')}
                      disabled={isLoading}
                    >
                      <Zap className="h-4 w-4" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>{viewMode === 'full' ? 'Passa alla modalità semplificata' : 'Torna alla modalità completa'}</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>

            <Separator orientation="vertical" className="h-8 bg-white/20" />

            {/* Gruppo Importazione/Input - sempre visibile */}
            <div className="flex items-center gap-2">
              <UrlFetchControl
                onTitleExtracted={onTitleExtracted}
                onDescriptionExtracted={onDescriptionExtracted}
                onTabChange={onTabChange}
                onLoadingChange={onLoadingChange}
                disabled={isLoading}
              />
              <SuperButton 
                text={text}
                description={description}
                onTextChange={onTextChange}
                onDescriptionChange={onDescriptionChange}
                onMagicOptimization={onMagicOptimization}
                disabled={isLoading}
              />
              <DownloadButton onDownload={onDownload} />
            </div>

            {viewMode === 'full' && (
              <>
                <Separator orientation="vertical" className="h-8 bg-white/20" />

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
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MainContent;
