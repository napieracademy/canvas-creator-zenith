import React from 'react';
import { cn } from "@/lib/utils";
import TextEditor from '@/components/TextEditor';
import Header from '@/components/Layout/Header';
import ColorPresets from '@/components/ColorPresets';
import { Separator } from "@/components/ui/separator";
import { withFeatureVariants } from '@/components/withFeatureVariants';
import { ScrollArea } from "@/components/ui/scroll-area";
import { Label } from "@/components/ui/label";
import { ChevronDown, ChevronUp } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { useState } from 'react';

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
  onFormatChange: (format: 'post' | 'story') => void;
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
  onColorSelect: (background: string, text: string) => void;
  onContentExtracted?: (content: string) => void;
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
  onFormatChange,
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
  onColorSelect,
  onContentExtracted,
  onLogoChange,
}) => {
  const [showContent, setShowContent] = useState(false);
  
  console.log('Sidebar rendered with extractedContent:', extractedContent);

  return (
    <div className={cn(
      "flex h-screen flex-col gap-4 border-r bg-background p-6",
      disabled && "pointer-events-none opacity-50"
    )}>
      <div className="space-y-4">
        <div className="space-y-4">
          <Separator className="my-4" />
          
          <div className="space-y-6">
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
              onContentExtracted={onContentExtracted}
            />

            <ColorPresets 
              onSelectColors={onColorSelect}
              currentBackground={backgroundColor}
              currentText={textColor}
            />

            {extractedContent && (
              <div className="space-y-2">
                <Separator />
                <div className="space-y-2">
                  <Label className="text-sm font-medium text-gray-700">
                    Contenuto estratto (Debug)
                  </Label>
                  <ScrollArea className="h-[200px] w-full rounded-md border p-4">
                    <div className="text-sm text-gray-600 whitespace-pre-wrap">
                      {extractedContent || 'Nessun contenuto estratto'}
                    </div>
                  </ScrollArea>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default withFeatureVariants(Sidebar, 'Sidebar');
