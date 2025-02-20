
import React from 'react';
import FormatSelector from '@/components/FormatSelector';
import TextEditor from '@/components/TextEditor';
import ColorPresets from '@/components/ColorPresets';
import StickerPicker from '@/components/StickerPicker';
import Header from '@/components/Layout/Header';
import { toast } from '@/components/ui/use-toast';

interface SidebarProps {
  format: 'post' | 'story';
  text: string;
  description: string;
  textAlign: 'left' | 'center' | 'right';
  descriptionAlign: 'left' | 'center' | 'right';
  fontSize: number;
  descriptionFontSize: number;
  spacing: number;
  backgroundColor: string;
  textColor: string;
  isLoading: boolean;
  onFormatChange: (format: 'post' | 'story') => void;
  onTextChange: (text: string) => void;
  onDescriptionChange: (description: string) => void;
  onTextAlignChange: (align: 'left' | 'center' | 'right') => void;
  onDescriptionAlignChange: (align: 'left' | 'center' | 'right') => void;
  onFontSizeChange: (size: number) => void;
  onDescriptionFontSizeChange: (size: number) => void;
  onSpacingChange: (spacing: number) => void;
  onColorSelect: (background: string, text: string, overlay?: string, font?: string) => void;
  onStickerSelect?: (sticker: string) => void;
  onTitleExtracted: (title: string) => void;
  onDescriptionExtracted: (description: string) => void;
  onTabChange: (value: string) => void;
  onLoadingChange: (loading: boolean) => void;
}

const Sidebar: React.FC<SidebarProps> = ({
  format,
  text,
  description,
  textAlign,
  descriptionAlign,
  fontSize,
  descriptionFontSize,
  spacing,
  backgroundColor,
  textColor,
  isLoading,
  onFormatChange,
  onTextChange,
  onDescriptionChange,
  onTextAlignChange,
  onDescriptionAlignChange,
  onFontSizeChange,
  onDescriptionFontSizeChange,
  onSpacingChange,
  onColorSelect,
  onStickerSelect,
  onTitleExtracted,
  onDescriptionExtracted,
  onTabChange,
  onLoadingChange
}) => {
  return (
    <div className="h-screen p-6 border-r bg-white overflow-y-auto">
      <div className="space-y-6">
        <Header />
        
        <FormatSelector 
          format={format}
          onFormatChange={onFormatChange}
          disabled={isLoading}
        />

        <TextEditor 
          text={text}
          description={description}
          textAlign={textAlign}
          descriptionAlign={descriptionAlign}
          fontSize={fontSize}
          descriptionFontSize={descriptionFontSize}
          spacing={spacing}
          onTextChange={onTextChange}
          onDescriptionChange={onDescriptionChange}
          onTextAlignChange={onTextAlignChange}
          onDescriptionAlignChange={onDescriptionAlignChange}
          onFontSizeChange={onFontSizeChange}
          onDescriptionFontSizeChange={onDescriptionFontSizeChange}
          onSpacingChange={onSpacingChange}
          onTitleExtracted={onTitleExtracted}
          onDescriptionExtracted={onDescriptionExtracted}
          onTabChange={onTabChange}
          onLoadingChange={onLoadingChange}
          disabled={isLoading}
        />

        <ColorPresets 
          onSelectColors={onColorSelect}
          currentBackground={backgroundColor}
          currentText={textColor}
        />

        {onStickerSelect && (
          <div className="space-y-2">
            <h3 className="text-sm font-medium">Sticker & Emoji</h3>
            <StickerPicker onStickerSelect={onStickerSelect} />
          </div>
        )}
      </div>
    </div>
  );
};

export default Sidebar;
