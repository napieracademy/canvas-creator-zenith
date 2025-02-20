
interface MetadataResult {
  success: boolean;
  title?: string;
  description?: string;
  image?: string;
  credits?: string;
  error?: string;
}

export class MetaService {
  static async extractMetadata(url: string): Promise<MetadataResult> {
    try {
      console.log('Attempting to fetch metadata via proxy for URL:', url);

      // Usiamo cors-anywhere come alternativa a allorigins
      const proxyUrl = `https://cors-anywhere.herokuapp.com/${url}`;
      const response = await fetch(proxyUrl, {
        headers: {
          'X-Requested-With': 'XMLHttpRequest'
        }
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const contents = await response.text();
      const parser = new DOMParser();
      const doc = parser.parseFromString(contents, 'text/html');

      const title = 
        doc.querySelector('meta[property="og:title"]')?.getAttribute('content') ||
        doc.querySelector('title')?.textContent || '';

      const description = 
        doc.querySelector('meta[property="og:description"]')?.getAttribute('content') ||
        doc.querySelector('meta[name="description"]')?.getAttribute('content') || '';

      const image = 
        doc.querySelector('meta[property="og:image"]')?.getAttribute('content') ||
        doc.querySelector('meta[name="twitter:image"]')?.getAttribute('content') || '';

      const author = 
        doc.querySelector('meta[name="author"]')?.getAttribute('content') ||
        doc.querySelector('meta[property="article:author"]')?.getAttribute('content') || '';

      const publisher = 
        doc.querySelector('meta[property="og:site_name"]')?.getAttribute('content') ||
        doc.querySelector('meta[name="publisher"]')?.getAttribute('content') || '';

      let credits = '';
      if (author || publisher) {
        credits = [author, publisher]
          .filter(Boolean)
          .map(text => text.toLowerCase())
          .join(' · ');
      }

      console.log('Extracted metadata:', { title, description, image, credits });

      return {
        success: true,
        title: title.trim(),
        description: description.trim(),
        image: image.trim(),
        credits: credits
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
