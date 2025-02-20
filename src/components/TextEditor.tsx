
import React from 'react';
import TextInput from '@/components/TextInput';
import SpacingControl from '@/components/SpacingControl';
import CreditsInput from '@/components/CreditsInput';
import { Separator } from './ui/separator';

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
  const [credits, setCredits] = React.useState("");

  React.useEffect(() => {
    const handleExtraction = (event: Event) => {
      const customEvent = event as CustomEvent;
      if (customEvent.detail?.credits) {
        if (onCreditsExtracted) {
          onCreditsExtracted(customEvent.detail.credits);
        }
      }
    };

    document.addEventListener('creditsExtracted', handleExtraction as EventListener);
    return () => {
      document.removeEventListener('creditsExtracted', handleExtraction as EventListener);
    };
  }, [onCreditsExtracted]);

  const handleCreditsChange = (newCredits: string) => {
    setCredits(newCredits);
    if (onCreditsExtracted) {
      onCreditsExtracted(newCredits);
    }
  };

  return (
    <div className="space-y-4">
      <div className="space-y-6">
        <CreditsInput
          value={credits}
          onChange={handleCreditsChange}
          disabled={disabled}
        />

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
