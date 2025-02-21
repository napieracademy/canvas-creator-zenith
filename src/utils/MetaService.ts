
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

      const proxyUrl = `https://api.codetabs.com/v1/proxy?quest=${encodeURIComponent(url)}`;
      console.log('📡 [MetaService] Tentativo di fetch via proxy:', proxyUrl);
      
      const response = await fetch(proxyUrl);
      console.log('✨ [MetaService] Risposta proxy ricevuta, status:', response.status);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
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

      // Estrazione contenuto principale
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

      const unwantedSelectors = [
        'script', 'style', 'iframe', 'nav', 'header', 'footer', 'aside',
        'form', '.social', '.share', '.comments', '.related', '.sidebar',
        '.advertisement', '.newsletter', '.subscription'
      ];

      const clone = mainElement.cloneNode(true) as HTMLElement;

      // Rimuovi elementi non desiderati
      unwantedSelectors.forEach(selector => {
        const elements = clone.querySelectorAll(selector);
        elements.forEach(el => el.remove());
      });

      // Estrai solo i paragrafi con contenuto significativo
      const paragraphs = Array.from(clone.querySelectorAll('p'))
        .map(p => p.textContent?.trim())
        .filter(text => text && text.length > 20)  // Filtra paragrafi troppo corti
        .filter(text => !text.match(/^(cookie|privacy|copyright|share|follow|subscribe)/i));  // Filtra testo non rilevante

      const cleanContent = paragraphs.join('\n\n');
      console.log('📄 [MetaService] Contenuto pulito estratto');

      // Formatta i credits
      let credits = '';
      if (author || publisher) {
        credits = [author, publisher]
          .filter(Boolean)
          .join(' · ');
      }

      const result = {
        success: true,
        title: title.trim(),
        description: description.trim(),
        credits: credits,
        content: cleanContent,
        extractionDate: new Date().toLocaleString(),
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
