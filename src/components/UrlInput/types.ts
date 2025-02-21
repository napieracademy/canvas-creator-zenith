
export interface UrlInputProps {
  onTitleExtracted: (title: string) => void;
  onDescriptionExtracted: (description: string) => void;
  onImageExtracted?: (image: string) => void;
  onContentExtracted?: (content: string) => void;
  onTabChange?: (value: string) => void;
  onLoadingChange?: (loading: boolean) => void;
}

export interface SaveToDbData {
  url: string;
  title?: string;
  description?: string;
  content?: string;
  credits?: string;
  image_url?: string;
  extraction_date?: string;
  publication_date?: string;
  modification_date?: string;
}
