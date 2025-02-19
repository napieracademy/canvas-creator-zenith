
interface MetadataResult {
  success: boolean;
  title?: string;
  description?: string;
  image?: string;
  error?: string;
}

export class MetaService {
  static async extractMetadata(url: string): Promise<MetadataResult> {
    try {
      console.log('Attempting direct fetch for URL:', url);

      // Tentiamo il fetch diretto
      const response = await fetch(url);
      console.log('Direct fetch response status:', response.status);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const text = await response.text();
      console.log('Received HTML length:', text.length);

      const parser = new DOMParser();
      const doc = parser.parseFromString(text, 'text/html');

      const title = doc.querySelector('title')?.textContent || '';
      const description = doc.querySelector('meta[name="description"]')?.getAttribute('content') || '';
      const image = doc.querySelector('meta[property="og:image"]')?.getAttribute('content') || '';

      console.log('Extracted metadata:', { title, description, image });

      return {
        success: true,
        title: title.trim(),
        description: description.trim(),
        image: image.trim()
      };

    } catch (error) {
      console.error('Error in metadata extraction:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Errore durante l\'estrazione dei metadati'
      };
    }
  }
}
