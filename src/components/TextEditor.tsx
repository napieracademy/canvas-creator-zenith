
import React from 'react';
import TextInput from './TextInput';
import FontSizeControl from './TextControls/FontSizeControl';
import TextAlignControl from './TextControls/TextAlignControl';
import FontSelector from './TextControls/FontSelector';

interface TextEditorProps {
  text: string;
  description: string;
  textAlign: 'left' | 'center' | 'right';
  descriptionAlign: 'left' | 'center' | 'right';
  fontSize: number;
  descriptionFontSize: number;
  spacing: number;
  currentFont: string;
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
  onFontChange: (font: string) => void;
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
  currentFont,
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
  onFontChange,
  disabled
}) => {
  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <FontSelector 
          currentFont={currentFont}
          onFontChange={onFontChange}
          disabled={disabled}
        />
        
        <TextInput
          label="Titolo"
          value={text}
          onChange={onTextChange}
          placeholder="Inserisci il tuo testo..."
          disabled={disabled}
        />
        <div className="flex items-center gap-2">
          <FontSizeControl
            fontSize={fontSize}
            onFontSizeChange={onFontSizeChange}
            disabled={disabled}
          />
          <TextAlignControl
            align={textAlign}
            onAlignChange={onTextAlignChange}
            disabled={disabled}
          />
        </div>
      </div>

      <div className="space-y-4">
        <TextInput
          label="Descrizione"
          value={description}
          onChange={onDescriptionChange}
          placeholder="Inserisci una descrizione..."
          disabled={disabled}
        />
        <div className="flex items-center gap-2">
          <FontSizeControl
            fontSize={descriptionFontSize}
            onFontSizeChange={onDescriptionFontSizeChange}
            disabled={disabled}
          />
          <TextAlignControl
            align={descriptionAlign}
            onAlignChange={onDescriptionAlignChange}
            disabled={disabled}
          />
        </div>
      </div>
    </div>
  );
};

export default TextEditor;
