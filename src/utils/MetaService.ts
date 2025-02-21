
interface MetadataResult {
  success: boolean;
  title?: string;
  description?: string;
  image?: string;
  content?: string;
  credits?: string;
  error?: string;
}

export class MetaService {
  static async extractMetadata(url: string): Promise<MetadataResult> {
    try {
      // Utilizziamo AllOrigins in modalità get che è più stabile
      const proxyUrl = `https://api.allorigins.win/get?url=${encodeURIComponent(url)}&charset=UTF-8`;
      
      const response = await fetch(proxyUrl, {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
        },
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      
      if (!data || !data.contents) {
        throw new Error('Nessun contenuto ricevuto dal server');
      }

      const parser = new DOMParser();
      const doc = parser.parseFromString(data.contents, 'text/html');

      // Estrai il titolo
      const title = doc.querySelector('meta[property="og:title"]')?.getAttribute('content') || 
                   doc.querySelector('meta[name="twitter:title"]')?.getAttribute('content') ||
                   doc.title;

      // Estrai la descrizione
      const description = doc.querySelector('meta[property="og:description"]')?.getAttribute('content') ||
                         doc.querySelector('meta[name="twitter:description"]')?.getAttribute('content') ||
                         doc.querySelector('meta[name="description"]')?.getAttribute('content');

      // Estrai l'immagine
      const image = doc.querySelector('meta[property="og:image"]')?.getAttribute('content') ||
                   doc.querySelector('meta[name="twitter:image"]')?.getAttribute('content');

      // Estrai i credits
      const credits = doc.querySelector('meta[name="author"]')?.getAttribute('content') ||
                     doc.querySelector('meta[property="article:author"]')?.getAttribute('content');

      // Estrai il contenuto principale (optional)
      const content = doc.querySelector('article')?.textContent ||
                     doc.querySelector('main')?.textContent;

      return {
        success: true,
        title,
        description,
        image,
        content,
        credits
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
