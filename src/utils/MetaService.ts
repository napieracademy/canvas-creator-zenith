
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
  private static API_KEY_STORAGE_KEY = 'scraper_api_key';

  static saveApiKey(apiKey: string): void {
    localStorage.setItem(this.API_KEY_STORAGE_KEY, apiKey);
    console.log('API key saved successfully');
  }

  static getApiKey(): string | null {
    return localStorage.getItem(this.API_KEY_STORAGE_KEY);
  }

  static async extractMetadata(url: string): Promise<MetaResult> {
    try {
      const apiKey = this.getApiKey();
      if (!apiKey) {
        return { 
          success: false, 
          error: 'API key non trovata. Inserisci la tua API key di ScraperAPI.' 
        };
      }

      console.log('Starting ScraperAPI extraction for URL:', url);
      const scraperUrl = `https://api.scraperapi.com?api_key=${apiKey}&url=${encodeURIComponent(url)}`;
      
      const response = await fetch(scraperUrl);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const html = await response.text();
      console.log('Raw HTML received:', html.substring(0, 500) + '...'); // Log first 500 chars of HTML
      
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
