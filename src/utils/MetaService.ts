
interface MetadataResult {
  success: boolean;
  title?: string;
  description?: string;
  image?: string;
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
      console.log('📝 [MetaService] Lunghezza testo HTML ricevuto:', text.length);
      
      const parser = new DOMParser();
      const doc = parser.parseFromString(text, 'text/html');
      console.log('🔍 [MetaService] HTML parsato correttamente');

      const title = 
        doc.querySelector('meta[property="og:title"]')?.getAttribute('content') ||
        doc.querySelector('title')?.textContent || '';
      console.log('📌 [MetaService] Titolo estratto:', title);

      const description = 
        doc.querySelector('meta[property="og:description"]')?.getAttribute('content') ||
        doc.querySelector('meta[name="description"]')?.getAttribute('content') || '';
      console.log('📝 [MetaService] Descrizione estratta:', description);

      const image = 
        doc.querySelector('meta[property="og:image"]')?.getAttribute('content') ||
        doc.querySelector('meta[name="twitter:image"]')?.getAttribute('content') || '';
      console.log('🖼️ [MetaService] Immagine estratta:', image);

      const author = 
        doc.querySelector('meta[name="author"]')?.getAttribute('content') ||
        doc.querySelector('meta[property="article:author"]')?.getAttribute('content') || '';
      console.log('👤 [MetaService] Autore estratto:', author);

      const publisher = 
        doc.querySelector('meta[property="og:site_name"]')?.getAttribute('content') ||
        doc.querySelector('meta[name="publisher"]')?.getAttribute('content') || '';
      console.log('🏢 [MetaService] Editore estratto:', publisher);

      // Selettori da rimuovere estesi per catturare più elementi non necessari
      const unwantedSelectors = [
        'script', 'style', 'iframe', 'nav', 'header', 'footer', 'aside',
        '.ad', '.ads', '.advertisement', '.social-share', '.comments',
        '.related-posts', '.sidebar', '.widget', '[role="complementary"]',
        '[role="navigation"]', '.nav', '.menu', '.search', '.share', '.social',
        '.author-bio', '.breadcrumb', '.pagination', '.evidenza',
        '.highlight', '.featured', '.breaking', '.tag-list', '.tags',
        '.category', '.categories', '.toolbar', '.tools', '.utility-bar',
        '.newsletter', '.subscription', '.subscribe', '.recommended',
        '.popular', '.trending', '.most-read', '.most-shared',
        '.read-more', '.more-articles', '.more-stories', '.read-next',
        'aside', '[role="complementary"]', '.complementary', '.supplementary',
        '.additional', '.extra', '.bonus', '.sponsored', '.advertisement',
        '.promo', '.promotion', '.announcement', '.alert', '.notice',
        '.notification', '.cookie', '.gdpr', '.privacy', '.legal',
        '.terms', '.disclaimer', '.warning', '.note', '.meta',
        '.metadata', '.byline', '.dateline', '.timestamp', '.time',
        '.date', '.author', '.contributor', '.attribution', '.source',
        '.origin', '.credit', '.credits', '.rights', '.copyright',
        '.sharing', '.share-buttons', '.social-buttons', '.follow',
        '.follow-us', '.connect', '.stay-connected', '.stay-in-touch',
        '.contact', '.contact-us', '.reach-out', '.email-us',
        '.print', '.print-article', '.print-page', '.save',
        '.save-article', '.save-page', '.bookmark', '.favorite',
        '.like', '.rating', '.score', '.votes', '.poll',
        '.survey', '.quiz', '.test', '.assessment', '.evaluation',
        '[data-type="advertisement"]', '[data-type="sponsored"]',
        '[data-type="promo"]', '[data-type="promotion"]',
        '[data-role="advertisement"]', '[data-role="sponsored"]',
        '[data-role="promo"]', '[data-role="promotion"]'
      ];

      // Cerchiamo prima il contenuto principale in selettori comuni
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

      // Se non troviamo un contenitore specifico, usiamo il body
      if (!mainElement) {
        mainElement = doc.body;
      }

      // Cloniamo l'elemento principale per manipolarlo
      const clone = mainElement.cloneNode(true) as HTMLElement;

      // Rimuoviamo elementi non necessari
      unwantedSelectors.forEach(selector => {
        const elements = clone.querySelectorAll(selector);
        elements.forEach(el => el.remove());
      });

      // Funzione per verificare se un testo è significativo
      const isSignificantText = (text: string): boolean => {
        const minLength = 20;
        const unwantedPatterns = [
          /cookie/i,
          /privacy/i,
          /copyright/i,
          /all rights reserved/i,
          /^\d{1,2}\/\d{1,2}\/\d{2,4}$/,
          /^published/i,
          /^updated/i,
          /^posted/i,
          /^written by/i,
          /^author/i,
          /^share/i,
          /^follow/i,
          /^sign up/i,
          /^subscribe/i,
          /^advertisement/i,
          /^sponsored/i,
          /^recommended/i,
          /^related/i,
          /^popular/i,
          /^trending/i,
          /^breaking/i,
          /^featured/i,
          /^highlight/i,
          /^in evidenza/i,
          /^evidenza/i,
          /^tag/i,
          /^categoria/i,
          /^category/i
        ];

        if (text.length < minLength) return false;
        if (unwantedPatterns.some(pattern => pattern.test(text))) return false;
        return true;
      };

      // Estraiamo i paragrafi con contenuto significativo
      const paragraphs = Array.from(clone.querySelectorAll('p, h1, h2, h3, h4, h5, h6'))
        .map(p => p.textContent?.trim())
        .filter(text => text && isSignificantText(text));

      // Uniamo i paragrafi con doppia spaziatura
      const cleanContent = paragraphs.join('\n\n');
      console.log('📄 [MetaService] Contenuto pulito, lunghezza:', cleanContent.length);

      let credits = '';
      if (author || publisher) {
        credits = [author, publisher]
          .filter(Boolean)
          .map(text => text.toLowerCase())
          .join(' · ');
      }

      const cleanTitle = title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '_')
        .replace(/^_+|_+$/g, '')
        .substring(0, 50);

      const siteName = publisher || new URL(url).hostname.replace('www.', '');
      const cleanSiteName = siteName
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '_')
        .replace(/^_+|_+$/g, '');

      const timestamp = new Date().toISOString().split('T')[0];
      const filename = `${cleanTitle}_${cleanSiteName}_${timestamp}.txt`;

      const result = {
        success: true,
        title: title.trim(),
        description: description.trim(),
        image: image.trim(),
        credits: credits,
        content: cleanContent,
        extractionDate: new Date().toLocaleString(),
        url: url
      };

      // Creiamo il file di testo con i metadati
      const metadataText = `${cleanContent}\n\n---\n\nFonte: ${url}\nData: ${result.extractionDate}\nCrediti: ${credits || 'Non specificati'}`;

      const blob = new Blob([metadataText], { type: 'text/plain;charset=utf-8' });
      const downloadUrl = window.URL.createObjectURL(blob);

      const link = document.createElement('a');
      link.href = downloadUrl;
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(downloadUrl);

      console.log('✅ [MetaService] Estrazione completata con successo');
      return result;

    } catch (error) {
      console.error('❌ [MetaService] Errore fatale durante l\'estrazione:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Errore durante l\'estrazione dei metadati'
      };
    }
  }
}
