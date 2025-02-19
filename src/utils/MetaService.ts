
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
      // Controlliamo che l'URL sia valido
      if (!url.startsWith('http://') && !url.startsWith('https://')) {
        return {
          success: false,
          error: 'URL non valido. Deve iniziare con http:// o https://'
        };
      }

      // Facciamo il fetch con le opzioni corrette
      const response = await fetch(`/api/metadata?url=${encodeURIComponent(url)}`, {
        method: 'GET',
        headers: {
          'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
          'Accept-Language': 'it-IT,it;q=0.9,en-US;q=0.8,en;q=0.7'
        },
        credentials: 'omit'
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      console.log('Response headers:', response.headers);
      console.log('Response status:', response.status);

      const text = await response.text();
      console.log('Response text:', text.substring(0, 200)); // Log dei primi 200 caratteri per debug

      const parser = new DOMParser();
      const doc = parser.parseFromString(text, 'text/html');

      // Estraiamo i metadati con fallback multipli
      const title = doc.querySelector('meta[property="og:title"]')?.getAttribute('content') ||
                   doc.querySelector('meta[name="twitter:title"]')?.getAttribute('content') ||
                   doc.querySelector('title')?.textContent ||
                   doc.querySelector('h1')?.textContent || '';

      const description = doc.querySelector('meta[property="og:description"]')?.getAttribute('content') ||
                         doc.querySelector('meta[name="twitter:description"]')?.getAttribute('content') ||
                         doc.querySelector('meta[name="description"]')?.getAttribute('content') ||
                         doc.querySelector('p')?.textContent || '';

      const image = doc.querySelector('meta[property="og:image"]')?.getAttribute('content') ||
                   doc.querySelector('meta[name="twitter:image"]')?.getAttribute('content') ||
                   doc.querySelector('link[rel="image_src"]')?.getAttribute('href') || '';

      console.log('Extracted metadata:', { title, description, image });

      if (!title && !description && !image) {
        return {
          success: false,
          error: 'Nessun metadato trovato nella pagina'
        };
      }

      return {
        success: true,
        title: title.trim(),
        description: description.trim(),
        image: image.trim()
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
