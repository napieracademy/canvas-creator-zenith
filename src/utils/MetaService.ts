
import { MetadataResult } from './metadata/types';
import { extractDates } from './metadata/dateUtils';
import { parseMetadata } from './metadata/parserUtils';

export class MetaService {
  static async extractMetadata(url: string): Promise<MetadataResult> {
    try {
      console.log('🚀 [MetaService] Inizio estrazione metadati per URL:', url);

      const proxyUrls = [
        `https://api.codetabs.com/v1/proxy?quest=${encodeURIComponent(url)}`,
        `https://cors-anywhere.herokuapp.com/${url}`,
        `https://api.allorigins.win/raw?url=${encodeURIComponent(url)}`
      ];

      let response = null;
      let error = null;

      for (const proxyUrl of proxyUrls) {
        try {
          console.log('📡 [MetaService] Tentativo di fetch via proxy:', proxyUrl);
          response = await fetch(proxyUrl, {
            headers: {
              'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
            }
          });
          
          if (response.ok) {
            console.log('✨ [MetaService] Proxy funzionante trovato:', proxyUrl);
            break;
          }
        } catch (e) {
          error = e;
          console.log('⚠️ [MetaService] Proxy fallito:', proxyUrl, e);
          continue;
        }
      }

      if (!response || !response.ok) {
        throw error || new Error('Tutti i proxy hanno fallito');
      }

      const text = await response.text();
      const parser = new DOMParser();
      const doc = parser.parseFromString(text, 'text/html');

      const dates = extractDates(doc);
      const parsedContent = parseMetadata(doc, url);
      const credits = [parsedContent.author, parsedContent.publisher]
        .filter(Boolean)
        .join(' · ');

      const result: MetadataResult = {
        success: true,
        title: parsedContent.title,
        description: parsedContent.description,
        credits,
        extractedContent: parsedContent.extractedContent,
        image: parsedContent.image,
        extractionDate: new Date().toISOString(),
        url,
        ...dates
      };

      console.log('✅ [MetaService] Estrazione completata con successo', result);
      return result;

    } catch (error) {
      console.error('❌ [MetaService] Errore durante l\'estrazione:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Errore durante l\'estrazione dei metadati'
      };
    }
  }

  static shouldAllowDuplicate(existingContent: any, newMetadata: MetadataResult): boolean {
    if (!existingContent.publication_date && !existingContent.modification_date) {
      return false;
    }

    if (newMetadata.modificationDate && existingContent.modification_date) {
      const existingDate = new Date(existingContent.modification_date);
      const newDate = new Date(newMetadata.modificationDate);
      return newDate > existingDate;
    }

    if (newMetadata.publicationDate && existingContent.publication_date) {
      const existingDate = new Date(existingContent.publication_date);
      const newDate = new Date(newMetadata.publicationDate);
      return newDate > existingDate;
    }

    return false;
  }
}
