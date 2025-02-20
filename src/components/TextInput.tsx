
import React from 'react';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import TextAlignControl from './TextControls/TextAlignControl';
import FontSizeControl from './TextControls/FontSizeControl';
import TextImproveControl from './TextControls/TextImproveControl';
import { Button } from './ui/button';
import { Link } from 'lucide-react';
import { Popover, PopoverContent, PopoverTrigger } from './ui/popover';
import UrlInput from './UrlInput';

interface TextInputProps {
  value: string;
  onChange: (value: string) => void;
  textAlign: 'left' | 'center' | 'right';
  onTextAlignChange: (value: 'left' | 'center' | 'right') => void;
  fontSize: number;
  onFontSizeChange: (value: number) => void;
  label: string;
  disabled?: boolean;
  onTitleExtracted?: (title: string) => void;
  onDescriptionExtracted?: (description: string) => void;
  onTabChange?: (value: string) => void;
  onLoadingChange?: (loading: boolean) => void;
  otherText?: string;
}

const TextInput: React.FC<TextInputProps> = ({ 
  value, 
  onChange, 
  textAlign, 
  onTextAlignChange,
  fontSize,
  onFontSizeChange,
  label,
  disabled,
  onTitleExtracted,
  onDescriptionExtracted,
  onTabChange,
  onLoadingChange,
  otherText
}) => {
  const showFetchControl = label === "Titolo" && onTitleExtracted && onDescriptionExtracted;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between mb-2">
        <Label className="text-sm font-medium text-gray-700">{label}</Label>
        <div className="flex items-center gap-2">
          <TextAlignControl 
            textAlign={textAlign} 
            onTextAlignChange={onTextAlignChange} 
            disabled={disabled} 
          />
          <FontSizeControl 
            fontSize={fontSize} 
            onFontSizeChange={onFontSizeChange} 
            disabled={disabled} 
          />
          {showFetchControl && (
            <Popover>
              <PopoverTrigger asChild>
                <Button 
                  variant="outline" 
                  size="sm"
                  className="shrink-0"
                  disabled={disabled}
                >
                  <Link className="h-4 w-4" />
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
          )}
          <TextImproveControl 
            value={value} 
            onChange={onChange} 
            label={label} 
            disabled={disabled}
            otherText={otherText}
          />
        </div>
      </div>
      
      <Textarea
        placeholder={`Scrivi il tuo ${label.toLowerCase()} qui...`}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="resize-none h-32 bg-white/50 backdrop-blur-sm focus:bg-white transition-colors duration-200"
        style={{ textAlign }}
        disabled={disabled}
      />
    </div>
  );
};

export default TextInput;
