interface MetadataResult {
  success: boolean;
  title?: string;
  description?: string;
  image?: string;
  credits?: string;
  content?: string;
  error?: string;
}

export class MetaService {
  static async extractMetadata(url: string): Promise<MetadataResult> {
    try {
      console.log('Attempting to fetch metadata via proxy for URL:', url);

      // Utilizziamo api.codetabs.com come proxy veloce e affidabile
      const proxyUrl = `https://api.codetabs.com/v1/proxy?quest=${encodeURIComponent(url)}`;
      const response = await fetch(proxyUrl);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const text = await response.text();
      const parser = new DOMParser();
      const doc = parser.parseFromString(text, 'text/html');

      // Usando let invece di const per permettere la modifica successiva
      let title = 
        doc.querySelector('meta[property="og:title"]')?.getAttribute('content') ||
        doc.querySelector('title')?.textContent || '';

      let description = 
        doc.querySelector('meta[property="og:description"]')?.getAttribute('content') ||
        doc.querySelector('meta[name="description"]')?.getAttribute('content') || '';

      const image = 
        doc.querySelector('meta[property="og:image"]')?.getAttribute('content') ||
        doc.querySelector('meta[name="twitter:image"]')?.getAttribute('content') || '';

      const author = 
        doc.querySelector('meta[name="author"]')?.getAttribute('content') ||
        doc.querySelector('meta[property="article:author"]')?.getAttribute('content') || '';

      const publisher = 
        doc.querySelector('meta[property="og:site_name"]')?.getAttribute('content') ||
        doc.querySelector('meta[name="publisher"]')?.getAttribute('content') || '';

      // Estrazione del contenuto principale dell'articolo
      let content = '';
      const possibleContentSelectors = [
        'article',
        '[role="main"]',
        'main',
        '.post-content',
        '.article-content',
        '.entry-content',
        '.content',
        '#content',
        '.post-body',
        '[itemprop="articleBody"]',
        // Aggiungiamo più selettori comuni
        '.article__body',
        '.story-body',
        '.story-content',
        '.article-text',
        '.article__content',
        '.post__content',
        '.main-content',
        '.body-content',
        '.article-body-content',
        '.rich-text',
        '.page-content',
        '.post-text',
        '.news-article-content',
        // Selettori per elementi specifici di blog
        '.blog-post',
        '.blog-entry',
        '.blog-content',
        // Selettori per aggregatori di notizie
        '.news-content',
        '.news-text',
        '.news-article',
        // Selettori per siti di notizie specifici
        '.ArticleBody-articleBody',
        '.paywall-article-content'
      ];

      // Cerca il contenuto usando i selettori comuni
      for (const selector of possibleContentSelectors) {
        const element = doc.querySelector(selector);
        if (element) {
          const clone = element.cloneNode(true) as HTMLElement;
          
          // Rimuovi elementi non necessari
          const elementsToRemove = clone.querySelectorAll(
            'script, style, nav, header, footer, .ad, .advertisement, .social-share, .related-posts, .comments, .sidebar, .newsletter, .subscription, .paywall, aside'
          );
          elementsToRemove.forEach(el => el.remove());

          // Estrai il testo pulito
          content = clone.textContent?.trim() || '';
          if (content) {
            console.log(`Found content using selector: ${selector}`);
            break;
          }
        }
      }

      // Se non troviamo contenuto con i selettori specifici, prova a prendere il corpo del testo
      if (!content) {
        console.log('No content found with specific selectors, trying body...');
        const clone = doc.body.cloneNode(true) as HTMLElement;
        const elementsToRemove = clone.querySelectorAll(
          'script, style, nav, header, footer, .ad, .advertisement, .social-share, .related-posts, .comments, .sidebar, .newsletter, .subscription, .paywall, aside'
        );
        elementsToRemove.forEach(el => el.remove());
        content = clone.textContent?.trim() || '';
      }

      let credits = '';
      if (author || publisher) {
        credits = [author, publisher]
          .filter(Boolean)
          .map(text => text.toLowerCase())
          .join(' · ');
      }

      // Se abbiamo del contenuto, proviamo a migliorare titolo e descrizione
      if (content) {
        try {
          // Migliora il titolo
          const titleResponse = await fetch('http://localhost:54321/functions/v1/improve-content', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              content: content.slice(0, 2000), // Limitiamo il contenuto per l'API
              type: 'title'
            }),
          });

          if (titleResponse.ok) {
            const { improvedText: improvedTitle } = await titleResponse.json();
            if (improvedTitle) title = improvedTitle;
          }

          // Migliora la descrizione
          const descriptionResponse = await fetch('http://localhost:54321/functions/v1/improve-content', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              content: content.slice(0, 2000), // Limitiamo il contenuto per l'API
              type: 'description'
            }),
          });

          if (descriptionResponse.ok) {
            const { improvedText: improvedDescription } = await descriptionResponse.json();
            if (improvedDescription) description = improvedDescription;
          }
        } catch (error) {
          console.error('Error improving content:', error);
          // Continuiamo con i metadati originali se l'ottimizzazione fallisce
        }
      }

      // Normalize content:
      // 1. Replace multiple spaces with single space
      // 2. Replace multiple newlines with double newline (for paragraphs)
      // 3. Trim whitespace from start and end
      // 4. Remove any zero-width spaces or other invisible characters
      const normalizedContent = content
        .replace(/[\u200B-\u200D\uFEFF]/g, '') // Remove zero-width spaces
        .replace(/\s+/g, ' ') // Replace multiple spaces with single space
        .replace(/\n\s*\n\s*\n/g, '\n\n') // Replace multiple newlines with double newline
        .replace(/^\s+|\s+$/g, '') // Trim start and end
        .split('\n') // Split into lines
        .map(line => line.trim()) // Trim each line
        .filter(line => line.length > 0) // Remove empty lines
        .join('\n\n'); // Join with double newlines for readability

      console.log('Content word count:', normalizedContent.split(/\s+/).filter(word => word.length > 0).length);
      console.log('Content length:', normalizedContent.length);
      
      const result = {
        success: true,
        title: title.trim(),
        description: description.trim(),
        image: image.trim(),
        credits: credits,
        content: normalizedContent
      };

      // Genera un nome file pulito dal titolo (rimuovi caratteri non validi)
      const cleanTitle = result.title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '_') // sostituisce caratteri non alfanumerici con underscore
        .replace(/^_+|_+$/g, '') // rimuove underscore all'inizio e alla fine
        .substring(0, 50); // limita la lunghezza del titolo

      // Estrai il nome del sito dai crediti o dall'URL
      const siteName = publisher || new URL(url).hostname.replace('www.', '');
      const cleanSiteName = siteName
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '_')
        .replace(/^_+|_+$/g, '');

      const timestamp = new Date().toISOString().split('T')[0]; // YYYY-MM-DD
      const filename = `${cleanTitle}_${cleanSiteName}_${timestamp}.txt`;
      
      const metadataText = `
URL Originale: ${url}
Data Estrazione: ${new Date().toLocaleString()}

METADATI ESTRATTI:
----------------
Titolo: ${result.title}
Descrizione: ${result.description}
Immagine: ${result.image}
Crediti: ${result.credits || 'Non specificati'}

CONTENUTO:
---------
${result.content || 'Nessun contenuto estratto'}
`;

      const blob = new Blob([metadataText], { type: 'text/plain;charset=utf-8' });
      const downloadUrl = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = downloadUrl;
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(downloadUrl);

      return result;

    } catch (error) {
      console.error('Error in metadata extraction:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Errore durante l\'estrazione dei metadati'
      };
    }
  }
}
