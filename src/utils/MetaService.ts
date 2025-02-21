
import FirecrawlApp from '@mendable/firecrawl-js';

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
  private static firecrawlApp: FirecrawlApp | null = null;
  private static API_KEY_STORAGE_KEY = 'firecrawl_api_key';

  static saveApiKey(apiKey: string): void {
    localStorage.setItem(this.API_KEY_STORAGE_KEY, apiKey);
    this.firecrawlApp = new FirecrawlApp({ apiKey });
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
          error: 'API key non trovata. Inserisci la tua API key di Firecrawl.' 
        };
      }

      if (!this.firecrawlApp) {
        this.firecrawlApp = new FirecrawlApp({ apiKey });
      }

      console.log('Starting Firecrawl extraction for URL:', url);
      const response = await this.firecrawlApp.crawlUrl(url, {
        limit: 1,
        scrapeOptions: {
          formats: ['markdown', 'html'],
          selectors: {
            title: 'h1, meta[property="og:title"]',
            description: 'meta[name="description"], meta[property="og:description"]',
            image: 'meta[property="og:image"]',
          }
        }
      });

      if (!response.success) {
        console.error('Firecrawl extraction failed:', response);
        return { 
          success: false, 
          error: 'Errore durante l\'estrazione dei contenuti' 
        };
      }

      console.log('Firecrawl extraction successful:', response);

      const data = response.data?.[0];
      if (!data) {
        return {
          success: false,
          error: 'Nessun contenuto trovato'
        };
      }

      return {
        success: true,
        title: data.title || '',
        description: data.description || '',
        image: data.image || '',
        content: data.content || '',
        credits: `Estratto da: ${url}`
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
