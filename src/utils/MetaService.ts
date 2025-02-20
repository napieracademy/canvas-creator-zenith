
interface MetadataResult {
  success: boolean;
  title?: string;
  description?: string;
  image?: string;
  author?: string;
  publisher?: string;
  error?: string;
}

export class MetaService {
  static async extractMetadata(url: string): Promise<MetadataResult> {
    try {
      console.log('Attempting to fetch metadata via proxy for URL:', url);

      // Usiamo un servizio proxy per evitare problemi CORS
      const proxyUrl = `https://api.allorigins.win/get?url=${encodeURIComponent(url)}`;
      const response = await fetch(proxyUrl);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      const contents = data.contents;

      const parser = new DOMParser();
      const doc = parser.parseFromString(contents, 'text/html');

      // Priorità ai tag Open Graph
      const title = 
        doc.querySelector('meta[property="og:title"]')?.getAttribute('content') ||
        doc.querySelector('title')?.textContent || '';

      let description = 
        doc.querySelector('meta[property="og:description"]')?.getAttribute('content') ||
        doc.querySelector('meta[name="description"]')?.getAttribute('content') || '';

      const image = 
        doc.querySelector('meta[property="og:image"]')?.getAttribute('content') ||
        doc.querySelector('meta[name="twitter:image"]')?.getAttribute('content') || '';

      // Estrazione dell'autore
      const author = 
        doc.querySelector('meta[name="author"]')?.getAttribute('content') ||
        doc.querySelector('meta[property="article:author"]')?.getAttribute('content') ||
        doc.querySelector('meta[property="og:article:author"]')?.getAttribute('content') ||
        doc.querySelector('a[rel="author"]')?.textContent || '';

      // Estrazione della testata/publisher
      const publisher = 
        doc.querySelector('meta[property="og:site_name"]')?.getAttribute('content') ||
        doc.querySelector('meta[name="publisher"]')?.getAttribute('content') ||
        doc.querySelector('meta[property="publisher"]')?.getAttribute('content') || '';

      // Aggiungiamo autore e testata alla descrizione se presenti
      if (author || publisher) {
        description = description.trim();
        if (author) {
          description += `\n\nAutore: ${author}`;
        }
        if (publisher) {
          description += `\n${publisher}`;
        }
      }

      console.log('Extracted metadata:', { title, description, image, author, publisher });

      return {
        success: true,
        title: title.trim(),
        description: description.trim(),
        image: image.trim(),
        author: author.trim(),
        publisher: publisher.trim()
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
