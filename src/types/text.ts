
/**
 * Represents the possible text alignment options
 */
export type TextAlignment = 'left' | 'center' | 'right';

/**
 * Base properties for text input components
 */
export interface BaseTextProps {
  value: string;
  onChange: (value: string) => void;
  textAlign: TextAlignment;
  onTextAlignChange: (align: TextAlignment) => void;
  fontSize: number;
  onFontSizeChange: (size: number) => void;
  disabled?: boolean;
}

/**
 * Properties specific to content extraction
 */
export interface ContentExtractionProps {
  onTitleExtracted?: (title: string) => void;
  onDescriptionExtracted?: (description: string) => void;
  onImageExtracted?: (image: string) => void;
  onTabChange?: (value: string) => void;
  onLoadingChange?: (loading: boolean) => void;
  extractedContent?: string;
  onExtractedContentUpdated?: (content: string) => void;
}

/**
 * Complete TextInput component props
 */
export interface TextInputProps extends BaseTextProps, ContentExtractionProps {
  label: string;
  otherText?: string;
}

/**
 * TextEditor component props with additional spacing control
 */
export interface TextEditorProps extends BaseTextProps, ContentExtractionProps {
  description: string;
  descriptionAlign: TextAlignment;
  descriptionFontSize: number;
  spacing: number;
  onDescriptionChange: (description: string) => void;
  onDescriptionAlignChange: (align: TextAlignment) => void;
  onDescriptionFontSizeChange: (size: number) => void;
  onSpacingChange: (spacing: number) => void;
}
