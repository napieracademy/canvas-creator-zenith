
interface MetadataResult {
  success: boolean;
  title?: string;
  description?: string;
  credits?: string;
  content?: string;
  error?: string;
  extractionDate?: string;
  url?: string;
}

export class MetaService {
  static async extractMetadata(url: string): Promise<MetadataResult> {
    try {
      console.log('🚀 [MetaService] Inizio estrazione metadati per URL:', url);

      // Proviamo prima con un proxy
      const proxyUrls = [
        `https://api.codetabs.com/v1/proxy?quest=${encodeURIComponent(url)}`,
        `https://cors-anywhere.herokuapp.com/${url}`,
        `https://api.allorigins.win/raw?url=${encodeURIComponent(url)}`
      ];

      let response = null;
      let error = null;

      // Prova ogni proxy finché uno non funziona
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

      // Estrazione titolo
      const title = 
        doc.querySelector('meta[property="og:title"]')?.getAttribute('content') ||
        doc.querySelector('title')?.textContent || '';
      console.log('📌 [MetaService] Titolo estratto:', title);

      // Estrazione descrizione
      const description = 
        doc.querySelector('meta[property="og:description"]')?.getAttribute('content') ||
        doc.querySelector('meta[name="description"]')?.getAttribute('content') || '';
      console.log('📝 [MetaService] Descrizione estratta:', description);

      // Estrazione autore e publisher
      const author = 
        doc.querySelector('meta[name="author"]')?.getAttribute('content') ||
        doc.querySelector('meta[property="article:author"]')?.getAttribute('content') || '';
      
      const publisher = 
        doc.querySelector('meta[property="og:site_name"]')?.getAttribute('content') ||
        doc.querySelector('meta[name="publisher"]')?.getAttribute('content') || 
        new URL(url).hostname.replace('www.', '');

      // Selettori da rimuovere
      const unwantedSelectors = [
        'script', 'style', 'iframe', 'nav', 'header', 'footer', 'aside',
        'form', '.social', '.share', '.comments', '.related', '.sidebar',
        '.advertisement', '.newsletter', '.subscription',
        '.tabs-nav', '[data-mrf-recirculation]', '.overtitle-art-logo',
        '.title-art-hp', '.nav-section', '.menu-section',
        '[data-type="related"]', '[data-type="highlights"]',
        '[data-mrf-recirculation="In Evidenza"]',
        '.related-articles', '.highlighted-content',
        '.breadcrumbs', '.pagination', '.article-navigation',
        '.article-footer', '.article-header', '.article-meta',
        '.has-text-black', '#article-navigation',
        '.is-pastone', '.is-small-medium'
      ];

      // Cerca il contenuto principale
      const mainContentSelectors = [
        'article',
        '[role="main"]',
        'main',
        '.post-content',
        '.article-content',
        '.entry-content',
        '#article-body',
        '.story-body',
        '.article-body',
        '.content-body',
        '.main-content',
        '.article-text',
        '.post-text',
        '.story-content'
      ];

      let mainElement = null;
      for (const selector of mainContentSelectors) {
        mainElement = doc.querySelector(selector);
        if (mainElement) break;
      }

      if (!mainElement) {
        mainElement = doc.body;
      }

      const clone = mainElement.cloneNode(true) as HTMLElement;

      // Rimuovi elementi non desiderati
      unwantedSelectors.forEach(selector => {
        const elements = clone.querySelectorAll(selector);
        elements.forEach(el => el.remove());
      });

      // Estrai solo i paragrafi con contenuto significativo e prendi le prime 10 righe
      const paragraphs = Array.from(clone.querySelectorAll('p'))
        .map(p => p.textContent?.trim())
        .filter(text => text && text.length > 20)
        .filter(text => {
          const unwantedPatterns = [
            /^in evidenza$/i,
            /^ultime notizie$/i,
            /^leggi anche$/i,
            /^potrebbe interessarti$/i,
            /^correlati$/i,
            /^articoli correlati$/i
          ];
          return !unwantedPatterns.some(pattern => pattern.test(text || ''));
        })
        .slice(0, 10);

      const cleanContent = paragraphs.join('\n\n');
      console.log('📄 [MetaService] Contenuto pulito estratto (prime 10 righe)');

      // Formatta i credits
      let credits = '';
      if (author || publisher) {
        credits = [author, publisher]
          .filter(Boolean)
          .join(' · ');
      }

      // Prepara il risultato con la data in formato ISO
      const result = {
        success: true,
        title: title.trim(),
        description: description.trim(),
        credits: credits,
        content: cleanContent,
        extractionDate: new Date().toISOString(),
        url: url
      };

      console.log('✅ [MetaService] Estrazione completata con successo');
      return result;

    } catch (error) {
      console.error('❌ [MetaService] Errore durante l\'estrazione:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Errore durante l\'estrazione dei metadati'
      };
    }
  }
}
