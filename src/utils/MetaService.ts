
interface MetadataResult {
  success: boolean;
  title?: string;
  description?: string;
  image?: string;
  error?: string;
}

type LanguageType = 'original' | 'it' | 'en' | 'fr' | 'de' | 'es';

export class MetaService {
  static async translateText(text: string, targetLanguage: string): Promise<string> {
    try {
      const response = await fetch('/api/improve-text', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          text,
          type: 'translate',
          targetLanguage,
        }),
      });

      if (!response.ok) {
        throw new Error('Translation failed');
      }

      const data = await response.json();
      return data.result || text;
    } catch (error) {
      console.error('Translation error:', error);
      return text;
    }
  }

  static async extractMetadata(url: string, language: LanguageType = 'it'): Promise<MetadataResult> {
    try {
      console.log('Attempting to fetch metadata via proxy for URL:', url, 'in language:', language);

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
      let title = 
        doc.querySelector('meta[property="og:title"]')?.getAttribute('content') ||
        doc.querySelector('title')?.textContent || '';

      let description = 
        doc.querySelector('meta[property="og:description"]')?.getAttribute('content') ||
        doc.querySelector('meta[name="description"]')?.getAttribute('content') || '';

      const image = 
        doc.querySelector('meta[property="og:image"]')?.getAttribute('content') ||
        doc.querySelector('meta[name="twitter:image"]')?.getAttribute('content') || '';

      console.log('Extracted metadata:', { title, description, image });

      // Traduci il contenuto se la lingua non è 'original'
      if (language !== 'original' && (title || description)) {
        if (title) {
          title = await this.translateText(title, language);
        }
        if (description) {
          description = await this.translateText(description, language);
        }
        console.log('Translated metadata:', { title, description });
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
