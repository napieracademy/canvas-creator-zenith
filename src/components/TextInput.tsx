
import React, { useState, useCallback, useMemo } from 'react';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import TextAlignControl from './TextControls/TextAlignControl';
import FontSizeControl from './TextControls/FontSizeControl';
import TextImproveControl from './TextControls/TextImproveControl';
import DescriptionGenerateControl from './TextControls/DescriptionGenerateControl';
import { ChevronRight, Undo2 } from 'lucide-react';
import { Button } from './ui/button';
import { useToast } from './ui/use-toast';
import type { TextInputProps } from '@/types/text';

/**
 * TextInput component for handling text input with various controls
 * @param props Component properties
 */
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
  onImageExtracted,
  onTabChange,
  onLoadingChange,
  otherText,
  extractedContent,
  onExtractedContentUpdated
}) => {
  const [charHistory, setCharHistory] = useState<string[]>([value]);
  const { toast } = useToast();

  // Memoize input type checks
  const inputType = useMemo(() => {
    const labelLower = label.toLowerCase();
    return {
      isDescription: labelLower === 'descrizione',
      isArticle: labelLower === 'contenuto articolo',
      isTitle: labelLower === 'titolo'
    };
  }, [label]);

  // Memoize state checks
  const { hasTitle, isEmpty } = useMemo(() => ({
    hasTitle: inputType.isDescription && otherText && otherText.trim().length > 0,
    isEmpty: !value || value.trim().length === 0
  }), [inputType.isDescription, otherText, value]);

  const handleError = useCallback((error: Error, context: string) => {
    console.error(`Error in TextInput (${context}):`, error);
    toast({
      title: "Errore",
      description: `Si è verificato un errore durante ${context}`,
      variant: "destructive"
    });
  }, [toast]);

  /**
   * Handles text changes while maintaining history
   */
  const handleChange = useCallback((newValue: string) => {
    try {
      if (newValue !== charHistory[charHistory.length - 1]) {
        setCharHistory(prev => [...prev, newValue]);
        onChange(newValue);
      }
    } catch (error) {
      handleError(error as Error, "la modifica del testo");
    }
  }, [charHistory, onChange, handleError]);

  /**
   * Handles undo operation
   */
  const handleUndo = useCallback(() => {
    if (charHistory.length > 1) {
      try {
        const newHistory = charHistory.slice(0, -1);
        const previousValue = newHistory[newHistory.length - 1];
        
        setCharHistory(newHistory);
        onChange(previousValue);
        
        toast({
          title: "Carattere annullato",
          description: "L'ultima modifica è stata annullata"
        });
      } catch (error) {
        handleError(error as Error, "l'annullamento dell'ultima modifica");
      }
    }
  }, [charHistory, onChange, toast, handleError]);

  // Memoize placeholder text
  const placeholder = useMemo(() => {
    if (inputType.isDescription && hasTitle && isEmpty) {
      return "Clicca sulla bacchetta magica per generare automaticamente una descrizione dal titolo...";
    }
    if (inputType.isArticle) {
      return "Il contenuto dell'articolo estratto apparirà qui...";
    }
    return `Scrivi il tuo ${label.toLowerCase()} qui...`;
  }, [inputType.isDescription, inputType.isArticle, hasTitle, isEmpty, label]);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between mb-2">
        <Label className="text-sm font-medium text-gray-700">{label}</Label>
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={handleUndo}
            disabled={disabled || charHistory.length <= 1}
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
          {inputType.isDescription && hasTitle && isEmpty && (
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
        placeholder={placeholder}
        value={inputType.isArticle ? (extractedContent || '') : value}
        onChange={(e) => handleChange(e.target.value)}
        className={`resize-none ${inputType.isArticle ? 'h-64' : 'h-32'} bg-white/50 backdrop-blur-sm focus:bg-white transition-colors duration-200`}
        style={{ textAlign }}
        disabled={disabled}
      />
    </div>
  );
};

export default TextInput;
