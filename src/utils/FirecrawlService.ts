
import FirecrawlApp from '@mendable/firecrawl-js';

interface ErrorResponse {
  success: false;
  error: string;
}

interface CrawlStatusResponse {
  success: true;
  status: string;
  completed: number;
  total: number;
  creditsUsed: number;
  expiresAt: string;
  data: any[];
}

type CrawlResponse = CrawlStatusResponse | ErrorResponse;

export class FirecrawlService {
  private static API_KEY = 'YOUR_FIRECRAWL_API_KEY'; // Sostituire con la tua API key
  private static firecrawlApp = new FirecrawlApp({ apiKey: FirecrawlService.API_KEY });

  static async crawlWebsite(url: string): Promise<{ success: boolean; error?: string; data?: any }> {
    try {
      const crawlResponse = await this.firecrawlApp.crawlUrl(url, {
        limit: 1,
        scrapeOptions: {
          formats: ['markdown', 'metadata'],
          extractMetaTags: true,
          extractOpenGraph: true
        }
      }) as CrawlResponse;

      if (!crawlResponse.success) {
        return { 
          success: false, 
          error: (crawlResponse as ErrorResponse).error 
        };
      }

      return { 
        success: true,
        data: crawlResponse
      };
    } catch (error) {
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Failed to connect to Firecrawl API' 
      };
    }
  }
}
