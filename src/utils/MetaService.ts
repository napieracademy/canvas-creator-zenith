
interface MetaResult {
  success: boolean;
  title?: string;
  description?: string;
  image?: string;
  content?: string;
  credits?: string;
  error?: string;
}

export class MetaService {
  static async extractMetadata(url: string): Promise<MetaResult> {
    try {
      console.log('Starting metadata extraction for URL:', url);
      
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const html = await response.text();
      const parser = new DOMParser();
      const doc = parser.parseFromString(html, 'text/html');

      const metadata = {
        title: doc.querySelector('title')?.textContent || 
               doc.querySelector('meta[property="og:title"]')?.getAttribute('content') || 
               '',
        description: doc.querySelector('meta[name="description"]')?.getAttribute('content') || 
                    doc.querySelector('meta[property="og:description"]')?.getAttribute('content') || 
                    '',
        image: doc.querySelector('meta[property="og:image"]')?.getAttribute('content') || '',
        content: doc.querySelector('article')?.textContent || 
                doc.querySelector('.article-content')?.textContent ||
                doc.querySelector('.post-content')?.textContent ||
                doc.querySelector('main')?.textContent ||
                doc.body.textContent || '',
        credits: `Estratto da: ${url}`
      };

      console.log('Extracted metadata:', metadata);

      return {
        success: true,
        ...metadata
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
