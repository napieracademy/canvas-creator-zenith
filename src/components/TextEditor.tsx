
import React from 'react';
import TextInput from '@/components/TextInput';
import SpacingControl from '@/components/SpacingControl';
import { Separator } from './ui/separator';
import { Label } from './ui/label';
import { Input } from './ui/input';

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
  onCreditsExtracted?: (credits: string) => void;
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
  onCreditsExtracted,
  disabled
}) => {
  const [authorName, setAuthorName] = React.useState("");
  const OUTLET_NAME = "IL GIORNALE";

  const handleAuthorNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newName = e.target.value;
    setAuthorName(newName);
    if (onCreditsExtracted) {
      const credits = newName ? `${newName} | ${OUTLET_NAME}` : "";
      onCreditsExtracted(credits);
    }
  };

  return (
    <div className="space-y-4">
      <div className="space-y-6">
        <div className="space-y-4">
          <Label className="text-sm font-medium text-gray-700">Credits</Label>
          <Input
            placeholder="Nome dell'autore"
            value={authorName}
            onChange={handleAuthorNameChange}
            className="bg-white/50 backdrop-blur-sm focus:bg-white transition-colors duration-200"
            disabled={disabled}
          />
          {authorName && (
            <div className="text-sm text-gray-500">
              {authorName} | {OUTLET_NAME}
            </div>
          )}
        </div>

        <Separator className="my-4" />

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
        />
        
        {description && (
          <SpacingControl
            value={spacing}
            onChange={onSpacingChange}
            disabled={disabled}
          />
        )}

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
        />
      </div>
    </div>
  );
};

export default TextEditor;
