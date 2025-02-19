
export class MetaService {
  static async extractMetadata(url: string): Promise<{ success: boolean; error?: string; title?: string }> {
    try {
      const response = await fetch(url);
      const html = await response.text();
      
      // Creiamo un DOM parser
      const parser = new DOMParser();
      const doc = parser.parseFromString(html, 'text/html');
      
      // Cerchiamo il titolo in ordine di priorità:
      // 1. Meta title
      // 2. OG title
      // 3. Title tag
      const metaTitle = doc.querySelector('meta[name="title"]')?.getAttribute('content');
      const ogTitle = doc.querySelector('meta[property="og:title"]')?.getAttribute('content');
      const titleTag = doc.querySelector('title')?.textContent;
      
      const title = metaTitle || ogTitle || titleTag || 'No title found';
      
      return {
        success: true,
        title
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to fetch URL'
      };
    }
  }
}
