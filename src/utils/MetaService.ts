
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
        content: doc.body.textContent || '',
        credits: `Estratto da: ${url}`
      };

      console.log('ScraperAPI extraction successful:', metadata);

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
