
import React from 'react';
import TextInput from '@/components/TextInput';
import SpacingControl from '@/components/SpacingControl';
import UrlInput from '@/components/UrlInput';
import { Button } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Download } from 'lucide-react';

interface TextEditorProps {
  text: string;
  description: string;
  textAlign: 'left' | 'center' | 'right';
  descriptionAlign: 'left' | 'center' | 'right';
  fontSize: number;
  descriptionFontSize: number;
  spacing: number;
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
  disabled?: boolean;
}

const TextEditor: React.FC<TextEditorProps> = ({
  text,
  description,
  textAlign,
  descriptionAlign,
  fontSize,
  descriptionFontSize,
  spacing,
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
  disabled
}) => {
  return (
    <div className="space-y-4">
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <div className="flex-1">
            <TextInput 
              value={text} 
              onChange={onTextChange} 
              textAlign={textAlign}
              onTextAlignChange={onTextAlignChange}
              fontSize={fontSize}
              onFontSizeChange={onFontSizeChange}
              label="Titolo"
              disabled={disabled}
            />
          </div>
          <Popover>
            <PopoverTrigger asChild>
              <Button 
                variant="outline" 
                size="icon"
                className="shrink-0"
                disabled={disabled}
              >
                <Download className="h-4 w-4" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-80">
              <UrlInput 
                onTitleExtracted={onTitleExtracted}
                onDescriptionExtracted={onDescriptionExtracted}
                onTabChange={onTabChange}
                onLoadingChange={onLoadingChange}
              />
            </PopoverContent>
          </Popover>
        </div>
        
        {description && (
          <SpacingControl
            value={spacing}
            onChange={onSpacingChange}
            disabled={disabled}
          />
        )}

        <div className="flex items-center gap-2">
          <div className="flex-1">
            <TextInput 
              value={description} 
              onChange={onDescriptionChange} 
              textAlign={descriptionAlign}
              onTextAlignChange={onDescriptionAlignChange}
              fontSize={descriptionFontSize}
              onFontSizeChange={onDescriptionFontSizeChange}
              label="Descrizione"
              disabled={disabled}
            />
          </div>
          <div className="w-9 h-9" /> {/* Spacer to align with title row */}
        </div>
      </div>
    </div>
  );
};

export default TextEditor;
