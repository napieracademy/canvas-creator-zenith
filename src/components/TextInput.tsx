
import React from 'react';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import TextAlignControl from './TextControls/TextAlignControl';
import FontSizeControl from './TextControls/FontSizeControl';
import TextImproveControl from './TextControls/TextImproveControl';
import DescriptionGenerateControl from './TextControls/DescriptionGenerateControl';
import { ChevronRight, ChevronDown, ChevronUp } from 'lucide-react';
import { Button } from './ui/button';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from './ui/collapsible';

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
  extractedContent?: string;
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
  otherText,
  extractedContent
}) => {
  const [isOpen, setIsOpen] = React.useState(false);
  const isDescription = label.toLowerCase() === 'descrizione';
  const hasTitle = isDescription && otherText && otherText.trim().length > 0;
  const isEmpty = !value || value.trim().length === 0;
  const hasExtractedContent = isDescription && extractedContent && extractedContent.trim().length > 0;

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
          <TextImproveControl 
            value={value} 
            onChange={onChange} 
            label={label} 
            disabled={disabled}
            otherText={otherText}
          />
          {isDescription && hasTitle && isEmpty && (
            <>
              <ChevronRight className="h-4 w-4 text-gray-400 animate-bounce-x" />
              <DescriptionGenerateControl
                title={otherText}
                onDescriptionGenerated={onChange}
                disabled={disabled}
              />
            </>
          )}
        </div>
      </div>
      
      <Textarea
        placeholder={isDescription && hasTitle && isEmpty 
          ? "Clicca sulla bacchetta magica per generare automaticamente una descrizione dal titolo..." 
          : `Scrivi il tuo ${label.toLowerCase()} qui...`}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="resize-none h-32 bg-white/50 backdrop-blur-sm focus:bg-white transition-colors duration-200"
        style={{ textAlign }}
        disabled={disabled}
      />

      {hasExtractedContent && (
        <Collapsible open={isOpen} onOpenChange={setIsOpen}>
          <div className="flex items-center gap-2">
            <CollapsibleTrigger asChild>
              <Button variant="ghost" size="sm" className="p-0">
                {isOpen ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                <span className="ml-2 text-sm text-gray-500">
                  {isOpen ? "Nascondi contenuto completo" : "Mostra contenuto completo"}
                </span>
              </Button>
            </CollapsibleTrigger>
          </div>
          <CollapsibleContent className="mt-2">
            <Textarea
              value={extractedContent}
              readOnly
              className="w-full min-h-[200px] max-h-[400px] text-sm bg-gray-50 resize-y"
            />
          </CollapsibleContent>
        </Collapsible>
      )}
    </div>
  );
};

export default TextInput;
