
import React, { useState } from 'react';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import TextAlignControl from './TextControls/TextAlignControl';
import FontSizeControl from './TextControls/FontSizeControl';
import TextImproveControl from './TextControls/TextImproveControl';
import DescriptionGenerateControl from './TextControls/DescriptionGenerateControl';
import { ChevronRight, Undo2 } from 'lucide-react';
import { Button } from './ui/button';
import { useToast } from './ui/use-toast';

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
  onContentExtracted?: (content: string) => void;
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
  extractedContent,
  onContentExtracted
}) => {
  const isDescription = label.toLowerCase() === 'descrizione';
  const hasTitle = isDescription && otherText && otherText.trim().length > 0;
  const isEmpty = !value || value.trim().length === 0;
  const { toast } = useToast();
  
  // Manteniamo l'ultimo valore salvato
  const [lastValue, setLastValue] = useState(value);

  const handleChange = (newValue: string) => {
    setLastValue(value); // Salviamo il valore corrente prima di cambiarlo
    onChange(newValue);
  };

  const handleUndo = () => {
    if (lastValue !== value) {
      onChange(lastValue);
      toast({
        title: "Modifiche annullate",
        description: "Il testo è stato ripristinato al valore precedente"
      });
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between mb-2">
        <Label className="text-sm font-medium text-gray-700">{label}</Label>
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={handleUndo}
            disabled={disabled || lastValue === value}
            className="h-8 w-8 p-0"
          >
            <Undo2 className="h-4 w-4" />
          </Button>
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
            onChange={handleChange} 
            label={label} 
            disabled={disabled}
            otherText={otherText}
          />
          {isDescription && hasTitle && isEmpty && (
            <>
              <ChevronRight className="h-4 w-4 text-gray-400 animate-bounce-x" />
              <DescriptionGenerateControl
                title={otherText}
                onDescriptionGenerated={handleChange}
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
        onChange={(e) => handleChange(e.target.value)}
        className="resize-none h-32 bg-white/50 backdrop-blur-sm focus:bg-white transition-colors duration-200"
        style={{ textAlign }}
        disabled={disabled}
      />

      {extractedContent && (
        <div className="mt-4">
          <Label className="text-sm font-medium text-gray-700">Contenuto estratto</Label>
          <Textarea
            value={extractedContent}
            readOnly
            className="mt-2 resize-y min-h-[100px] max-h-[400px] bg-gray-50 text-sm"
          />
        </div>
      )}
    </div>
  );
};

export default TextInput;

