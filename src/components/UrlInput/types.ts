
export interface UrlInputProps {
  onTitleExtracted: (title: string) => void;
  onDescriptionExtracted: (description: string) => void;
  onImageExtracted?: (image: string) => void;
  onExtractedContentUpdated?: (extractedContent: string) => void;
  onTabChange?: (value: string) => void;
  onLoadingChange?: (loading: boolean) => void;
}

export interface SaveToDbData {
  url: string;
  title?: string;
  description?: string;
  extractedContent?: string;
  credits?: string;
  image_url?: string;
  extraction_date?: string;
}
