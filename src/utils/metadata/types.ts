
export interface MetadataResult {
  success: boolean;
  title?: string;
  description?: string;
  credits?: string;
  extractedContent?: string;
  image?: string;
  error?: string;
  extractionDate?: string;
  url?: string;
  publicationDate?: string;
  modificationDate?: string;
}

export interface ParsedDates {
  publicationDate?: string;
  modificationDate?: string;
}

export interface ParsedContent {
  title: string;
  description?: string;
  image?: string;
  author?: string;
  publisher?: string;
  extractedContent: string;
}
