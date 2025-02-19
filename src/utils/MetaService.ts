
export class MetaService {
  static async extractMetadata(url: string): Promise<{ success: boolean; error?: string; title?: string; description?: string }> {
    try {
      const proxyUrl = `https://api.allorigins.win/get?url=${encodeURIComponent(url)}`;
      const response = await fetch(proxyUrl);
      const data = await response.json();
      
      if (!data.contents) {
        throw new Error('Failed to fetch URL contents');
      }

      const parser = new DOMParser();
      const doc = parser.parseFromString(data.contents, 'text/html');
      
      // Cerchiamo il titolo in ordine di priorità
      const metaTitle = doc.querySelector('meta[name="title"]')?.getAttribute('content');
      const ogTitle = doc.querySelector('meta[property="og:title"]')?.getAttribute('content');
      const titleTag = doc.querySelector('title')?.textContent;
      
      // Cerchiamo la descrizione in ordine di priorità
      const metaDescription = doc.querySelector('meta[name="description"]')?.getAttribute('content');
      const ogDescription = doc.querySelector('meta[property="og:description"]')?.getAttribute('content');
      
      const title = metaTitle || ogTitle || titleTag || 'No title found';
      const description = metaDescription || ogDescription || '';
      
      return {
        success: true,
        title,
        description
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to fetch URL'
      };
    }
  }
}
