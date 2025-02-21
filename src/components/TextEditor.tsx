
import React, { useEffect } from 'react';
import TextInput from '@/components/TextInput';

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
  extractedContent?: string;
  onContentExtracted?: (content: string) => void;
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
  disabled,
  extractedContent,
  onContentExtracted
}) => {
  // Quando il contenuto estratto cambia, aggiorniamo il titolo
  useEffect(() => {
    if (extractedContent) {
      const newText = text.includes(extractedContent) ? text : `${text}\n\n${extractedContent}`;
      onTextChange(newText);
    }
  }, [extractedContent]);

  // Gestiamo il cambio del contenuto estratto
  const handleContentChange = (newContent: string) => {
    if (onContentExtracted) {
      onContentExtracted(newContent);
      const newText = `${text}\n\n${newContent}`;
      onTextChange(newText);
    }
  };

  return (
    <div className="space-y-4">
      <div className="space-y-6">
        <TextInput 
          value={text}
          onChange={onTextChange} 
          textAlign={textAlign}
          onTextAlignChange={onTextAlignChange}
          fontSize={fontSize}
          onFontSizeChange={onFontSizeChange}
          label="Titolo"
          disabled={disabled}
          onTitleExtracted={onTitleExtracted}
          onDescriptionExtracted={onDescriptionExtracted}
          onTabChange={onTabChange}
          onLoadingChange={onLoadingChange}
          otherText={description}
          extractedContent={extractedContent}
          onContentExtracted={onContentExtracted}
        />

        <TextInput 
          value={description} 
          onChange={onDescriptionChange} 
          textAlign={descriptionAlign}
          onTextAlignChange={onDescriptionAlignChange}
          fontSize={descriptionFontSize}
          onFontSizeChange={onDescriptionFontSizeChange}
          label="Descrizione"
          disabled={disabled}
          otherText={text}
          extractedContent={extractedContent}
          onContentExtracted={onContentExtracted}
        />

        <TextInput 
          value={extractedContent || ''} 
          onChange={handleContentChange} 
          textAlign={descriptionAlign}
          onTextAlignChange={onDescriptionAlignChange}
          fontSize={descriptionFontSize}
          onFontSizeChange={onDescriptionFontSizeChange}
          label="Prime 10 righe"
          disabled={disabled}
          otherText={text}
          extractedContent={extractedContent}
          onContentExtracted={onContentExtracted}
        />
      </div>
    </div>
  );
};

export default TextEditor;
