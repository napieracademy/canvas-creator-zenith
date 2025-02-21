
export interface UrlInputProps {
  onTitleExtracted: (title: string) => void;
  onDescriptionExtracted: (description: string) => void;
  onImageExtracted?: (image: string) => void;
  onArticleContentExtracted?: (articleContent: string) => void;
  onTabChange?: (value: string) => void;
  onLoadingChange?: (loading: boolean) => void;
}

export interface SaveToDbData {
  url: string;
  title?: string;
  description?: string;
  articleContent?: string;
  credits?: string;
  image_url?: string;
  extraction_date?: string;
}
