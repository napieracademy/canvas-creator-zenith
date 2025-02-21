
import { MetadataResult } from './metadata/types';
import { extractDates } from './metadata/dateUtils';
import { parseMetadata } from './metadata/parserUtils';

export class MetaService {
  private static readonly TIMEOUT = 10000; // 10 secondi
  private static readonly CACHE_DURATION = 5 * 60 * 1000; // 5 minuti
  private static cache = new Map<string, { data: MetadataResult; timestamp: number }>();

  private static async fetchWithTimeout(url: string, options: RequestInit = {}, timeout = MetaService.TIMEOUT) {
    const controller = new AbortController();
    const id = setTimeout(() => controller.abort(), timeout);

    try {
      const response = await fetch(url, {
        ...options,
        signal: controller.signal
      });
      clearTimeout(id);
      return response;
    } catch (error) {
      clearTimeout(id);
      throw error;
    }
  }

  private static isValidUrl(url: string): boolean {
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  }

  private static getFromCache(url: string): MetadataResult | null {
    const cached = MetaService.cache.get(url);
    if (!cached) return null;

    const now = Date.now();
    if (now - cached.timestamp > MetaService.CACHE_DURATION) {
      MetaService.cache.delete(url);
      return null;
    }

    console.log('📦 [MetaService] Trovati dati in cache per:', url);
    return cached.data;
  }

  private static setCache(url: string, data: MetadataResult) {
    MetaService.cache.set(url, {
      data,
      timestamp: Date.now()
    });
  }

  static async extractMetadata(url: string): Promise<MetadataResult> {
    try {
      console.log('🚀 [MetaService] Inizio estrazione metadati per URL:', url);

      if (!url || !MetaService.isValidUrl(url)) {
        throw new Error('URL non valido');
      }

      // Controlla la cache
      const cached = MetaService.getFromCache(url);
      if (cached) return cached;

      // Lista aggiornata di proxy con fallback
      const proxyUrls = [
        `https://api.codetabs.com/v1/proxy?quest=${encodeURIComponent(url)}`,
        `https://cors-anywhere.herokuapp.com/${url}`,
        `https://api.allorigins.win/raw?url=${encodeURIComponent(url)}`,
        `https://thingproxy.freeboard.io/fetch/${url}`,
        `https://api.scraperapi.com?url=${encodeURIComponent(url)}`,
        // Tentativo diretto come ultima risorsa
        url
      ];

      let response = null;
      let error = null;

      const headers = {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
        'Accept-Language': 'en-US,en;q=0.5',
        'Cache-Control': 'no-cache',
        'Pragma': 'no-cache',
        'Upgrade-Insecure-Requests': '1',
        'Sec-Fetch-Dest': 'document',
        'Sec-Fetch-Mode': 'navigate',
        'Sec-Fetch-Site': 'cross-site'
      };

      for (const proxyUrl of proxyUrls) {
        try {
          console.log('📡 [MetaService] Tentativo di fetch via:', proxyUrl);
          
          const isDirectUrl = proxyUrl === url;
          const fetchOptions = {
            headers: isDirectUrl ? {
              ...headers,
              'Origin': window.location.origin,
              'Referer': window.location.origin
            } : headers,
            method: 'GET',
            mode: isDirectUrl ? 'cors' as const : 'no-cors' as const
          };

          response = await MetaService.fetchWithTimeout(proxyUrl, fetchOptions);
          
          if (response.ok || response.status === 0) { // status 0 può essere valido in modalità no-cors
            console.log('✨ [MetaService] Connessione riuscita via:', proxyUrl);
            break;
          }

          console.log('↪️ [MetaService] Risposta non valida:', response.status, response.statusText);
        } catch (e) {
          error = e;
          console.log('⚠️ [MetaService] Errore durante il fetch:', proxyUrl, e);
          if (e.name === 'AbortError') {
            console.log('⏱️ [MetaService] Timeout raggiunto per:', proxyUrl);
          }
          continue;
        }
      }

      if (!response || (!response.ok && response.status !== 0)) {
        throw error || new Error('Tutti i tentativi di fetch hanno fallito');
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

      MetaService.setCache(url, result);

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
