
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
      const response = await fetch(`/api/metadata?url=${encodeURIComponent(url)}`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch metadata');
      }

      const text = await response.text();
      
      // Creiamo un DOM parser per estrarre i metadati dall'HTML
      const parser = new DOMParser();
      const doc = parser.parseFromString(text, 'text/html');

      // Estraiamo i metadati
      const title = doc.querySelector('meta[property="og:title"]')?.getAttribute('content') ||
                   doc.querySelector('meta[name="twitter:title"]')?.getAttribute('content') ||
                   doc.querySelector('title')?.textContent || '';

      const description = doc.querySelector('meta[property="og:description"]')?.getAttribute('content') ||
                         doc.querySelector('meta[name="twitter:description"]')?.getAttribute('content') ||
                         doc.querySelector('meta[name="description"]')?.getAttribute('content') || '';

      const image = doc.querySelector('meta[property="og:image"]')?.getAttribute('content') ||
                   doc.querySelector('meta[name="twitter:image"]')?.getAttribute('content') || '';

      if (!title && !description && !image) {
        return {
          success: false,
          error: 'Nessun metadato trovato nella pagina'
        };
      }

      return {
        success: true,
        title,
        description,
        image
      };

    } catch (error) {
      console.error('Error in metadata extraction:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Errore sconosciuto'
      };
    }
  }
}
