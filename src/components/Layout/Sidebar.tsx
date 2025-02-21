
import React from 'react';
import { cn } from "@/lib/utils";
import TextInput from "@/components/TextInput";
import UrlInput from "@/components/UrlInput";
import TextEditor from "@/components/TextEditor";
import Header from '@/components/Layout/Header';
import { withFeatureVariants } from '@/components/withFeatureVariants';

interface SidebarProps {
  text: string;
  description: string;
  textAlign: 'left' | 'center' | 'right';
  descriptionAlign: 'left' | 'center' | 'right';
  backgroundColor: string;
  textColor: string;
  fontSize: number;
  descriptionFontSize: number;
  spacing: number;
  format: 'post' | 'story';
  currentFont: string;
  disabled?: boolean;
  extractedContent?: string;
  onTextChange: (text: string) => void;
  onDescriptionChange: (description: string) => void;
  onTextAlignChange: (align: 'left' | 'center' | 'right') => void;
  onDescriptionAlignChange: (align: 'left' | 'center' | 'right') => void;
  onFontSizeChange: (size: number) => void;
  onDescriptionFontSizeChange: (size: number) => void;
  onSpacingChange: (spacing: number) => void;
  onTitleExtracted: (title: string) => void;
  onDescriptionExtracted: (description: string) => void;
  onTabChange: (value: string) => void;
  onLoadingChange: (loading: boolean) => void;
  onFormatChange: (format: 'post' | 'story') => void;
  onColorSelect: (background: string, text: string) => void;
  onExtractedContentUpdated?: (extractedContent: string) => void;
  onLogoChange?: (logo: string) => void;
}

const Sidebar: React.FC<SidebarProps> = ({
  text,
  description,
  textAlign,
  descriptionAlign,
  backgroundColor,
  textColor,
  fontSize,
  descriptionFontSize,
  spacing,
  format,
  currentFont,
  disabled,
  extractedContent,
  onTextChange,
  onDescriptionChange,
  onTextAlignChange,
  onDescriptionAlignChange,
  onFontSizeChange,
  onDescriptionFontSizeChange,
  onSpacingChange,
  onTitleExtracted,
  onDescriptionExtracted,
  onTabChange,
  onLoadingChange,
  onFormatChange,
  onColorSelect,
  onExtractedContentUpdated,
  onLogoChange,
}) => {
  return (
    <div className={cn(
      "flex h-screen flex-col gap-4 border-r bg-background p-6",
      disabled && "pointer-events-none opacity-50"
    )}>
      <div className="space-y-4">
        <div className="space-y-4">
          <Header />
          
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
            disabled={disabled}
            extractedContent={extractedContent}
            onExtractedContentUpdated={onExtractedContentUpdated}
          />
        </div>
      </div>
    </div>
  );
};

export default withFeatureVariants(Sidebar, 'Sidebar');
