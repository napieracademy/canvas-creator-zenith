
import React from 'react';
import { useToast } from './ui/use-toast';
import TextInput from '@/components/TextInput';
import type { TextEditorProps } from '@/types/text';

/**
 * TextEditor component that manages both title and description inputs
 * @param props Component properties including text content and styling options
 */
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
  onImageExtracted,
  onTabChange,
  onLoadingChange,
  disabled,
  extractedContent,
  onExtractedContentUpdated
}) => {
  const { toast } = useToast();

  const handleError = (error: Error, context: string) => {
    console.error(`Error in TextEditor (${context}):`, error);
    toast({
      title: "Errore",
      description: `Si è verificato un errore durante ${context}`,
      variant: "destructive"
    });
  };

  const handleTextChange = (newText: string) => {
    try {
      onTextChange(newText);
    } catch (error) {
      handleError(error as Error, "la modifica del testo");
    }
  };

  const handleDescriptionChange = (newDescription: string) => {
    try {
      onDescriptionChange(newDescription);
    } catch (error) {
      handleError(error as Error, "la modifica della descrizione");
    }
  };

  return (
    <div className="space-y-4">
      <div className="space-y-6">
        <TextInput 
          value={text}
          onChange={handleTextChange} 
          textAlign={textAlign}
          onTextAlignChange={onTextAlignChange}
          fontSize={fontSize}
          onFontSizeChange={onFontSizeChange}
          label="Titolo"
          disabled={disabled}
          onTitleExtracted={onTitleExtracted}
          onDescriptionExtracted={onDescriptionExtracted}
          onImageExtracted={onImageExtracted}
          onTabChange={onTabChange}
          onLoadingChange={onLoadingChange}
          otherText={description}
          extractedContent={extractedContent}
          onExtractedContentUpdated={onExtractedContentUpdated}
        />

        <TextInput 
          value={description} 
          onChange={handleDescriptionChange} 
          textAlign={descriptionAlign}
          onTextAlignChange={onDescriptionAlignChange}
          fontSize={descriptionFontSize}
          onFontSizeChange={onDescriptionFontSizeChange}
          label="Descrizione"
          disabled={disabled}
          otherText={text}
          extractedContent={extractedContent}
          onExtractedContentUpdated={onExtractedContentUpdated}
        />
      </div>
    </div>
  );
};

export default TextEditor;
