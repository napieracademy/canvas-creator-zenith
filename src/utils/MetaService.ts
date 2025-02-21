interface MetadataResult {
  success: boolean;
  title?: string;
  description?: string;
  credits?: string;
  extractedContent?: string;
  image?: string;
  error?: string;
  extractionDate?: string;
  url?: string;
  publicationDate?: string;
  modificationDate?: string;
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

      // Estrazione date di pubblicazione e modifica
      const publicationDate = 
        doc.querySelector('meta[property="article:published_time"]')?.getAttribute('content') ||
        doc.querySelector('meta[property="og:article:published_time"]')?.getAttribute('content') ||
        doc.querySelector('meta[property="publication_date"]')?.getAttribute('content') ||
        doc.querySelector('time[pubdate]')?.getAttribute('datetime') ||
        doc.querySelector('.published-date')?.getAttribute('datetime') ||
        doc.querySelector('time[class*="publish"]')?.getAttribute('datetime');

      const modificationDate = 
        doc.querySelector('meta[property="article:modified_time"]')?.getAttribute('content') ||
        doc.querySelector('meta[property="og:article:modified_time"]')?.getAttribute('content') ||
        doc.querySelector('meta[property="last-modified"]')?.getAttribute('content') ||
        doc.querySelector('time[class*="modified"]')?.getAttribute('datetime');

      console.log('📅 [MetaService] Data pubblicazione:', publicationDate);
      console.log('📅 [MetaService] Data modifica:', modificationDate);

      // Estrazione titolo
      const title = 
        doc.querySelector('meta[property="og:title"]')?.getAttribute('content') ||
        doc.querySelector('title')?.textContent || '';
      console.log('📌 [MetaService] Titolo estratto:', title);

      // Estrazione descrizione - migliorata
      const description = doc.querySelector('meta[property="og:description"]')?.getAttribute('content') ||
        doc.querySelector('meta[name="description"]')?.getAttribute('content') ||
        doc.querySelector('meta[name="twitter:description"]')?.getAttribute('content') ||
        doc.querySelector('meta[property="article:description"]')?.getAttribute('content');
      
      console.log('📝 [MetaService] Descrizione estratta:', description);

      // Se non troviamo una descrizione nei meta tag, cerchiamo nel contenuto
      let extractedDescription = description;
      if (!extractedDescription) {
        // Cerchiamo prima nei paragrafi con la classe description o summary
        const descriptionParagraph = 
          doc.querySelector('.description p, .summary p, [class*="description"] p, [class*="summary"] p')?.textContent ||
          doc.querySelector('article p:first-of-type')?.textContent ||
          doc.querySelector('.article-content p:first-of-type')?.textContent ||
          doc.querySelector('.post-content p:first-of-type')?.textContent;

        if (descriptionParagraph) {
          extractedDescription = descriptionParagraph.trim();
          console.log('📝 [MetaService] Descrizione estratta dal paragrafo:', extractedDescription);
        }
      }

      // Estrazione immagine
      let image = 
        doc.querySelector('meta[property="og:image"]')?.getAttribute('content') ||
        doc.querySelector('meta[property="twitter:image"]')?.getAttribute('content') ||
        doc.querySelector('meta[property="twitter:image:src"]')?.getAttribute('content') ||
        doc.querySelector('link[rel="image_src"]')?.getAttribute('href') ||
        doc.querySelector('meta[name="thumbnail"]')?.getAttribute('content');

      // Validazione e normalizzazione dell'URL dell'immagine
      if (image) {
        try {
          if (!image.startsWith('http')) {
            const baseUrl = new URL(url);
            image = new URL(image, baseUrl.origin).toString();
          }
          new URL(image);
        } catch (error) {
          console.warn('⚠️ [MetaService] URL immagine non valido:', image);
          image = undefined;
        }
      }

      console.log('🖼️ [MetaService] Immagine estratta:', image);

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
        '.advertisement', '.newsletter', '.subscription'
      ];

      // Cerchiamo il contenuto principale
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
        '.content-body'
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

      // Estrai solo i paragrafi con contenuto significativo
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
        });

      const cleanContent = paragraphs.join('\n\n');
      console.log('📄 [MetaService] Contenuto estratto');

      // Se ancora non abbiamo una descrizione, prendiamo il primo paragrafo valido
      if (!extractedDescription && paragraphs.length > 0) {
        extractedDescription = paragraphs[0];
        console.log('📝 [MetaService] Descrizione estratta dal primo paragrafo:', extractedDescription);
      }

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
        description: extractedDescription?.trim(),
        credits: credits,
        extractedContent: cleanContent,
        image: image,
        extractionDate: new Date().toISOString(),
        url: url,
        publicationDate: publicationDate || undefined,
        modificationDate: modificationDate || undefined
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
    // Se non abbiamo date di riferimento, non permettiamo la duplicazione
    if (!existingContent.publication_date && !existingContent.modification_date) {
      return false;
    }

    // Se abbiamo una nuova data di modifica, confrontiamola
    if (newMetadata.modificationDate && existingContent.modification_date) {
      const existingDate = new Date(existingContent.modification_date);
      const newDate = new Date(newMetadata.modificationDate);
      return newDate > existingDate;
    }

    // Se abbiamo solo la data di pubblicazione, confrontiamola
    if (newMetadata.publicationDate && existingContent.publication_date) {
      const existingDate = new Date(existingContent.publication_date);
      const newDate = new Date(newMetadata.publicationDate);
      return newDate > existingDate;
    }

    // Se non possiamo fare confronti validi, non permettiamo la duplicazione
    return false;
  }
}
