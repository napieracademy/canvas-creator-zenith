
export class MetaService {
  static async extractMetadata(url: string): Promise<{ success: boolean; error?: string; title?: string }> {
    try {
      // Utilizziamo un proxy CORS per aggirare le restrizioni
      const proxyUrl = `https://api.allorigins.win/get?url=${encodeURIComponent(url)}`;
      const response = await fetch(proxyUrl);
      const data = await response.json();
      
      if (!data.contents) {
        throw new Error('Failed to fetch URL contents');
      }

      // Creiamo un DOM parser
      const parser = new DOMParser();
      const doc = parser.parseFromString(data.contents, 'text/html');
      
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
