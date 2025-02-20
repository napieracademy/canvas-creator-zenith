
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
        '[itemprop="articleBody"]'
      ];

      // Cerca il contenuto usando i selettori comuni
      for (const selector of possibleContentSelectors) {
        const element = doc.querySelector(selector);
        if (element) {
          const clone = element.cloneNode(true) as HTMLElement;
          
          // Rimuovi elementi non necessari
          const elementsToRemove = clone.querySelectorAll(
            'script, style, nav, header, footer, .ad, .advertisement, .social-share, .related-posts, .comments'
          );
          elementsToRemove.forEach(el => el.remove());

          // Estrai il testo pulito
          content = clone.textContent?.trim() || '';
          if (content) break;
        }
      }

      // Se non troviamo contenuto con i selettori specifici, prova a prendere il corpo del testo
      if (!content) {
        const clone = doc.body.cloneNode(true) as HTMLElement;
        const elementsToRemove = clone.querySelectorAll(
          'script, style, nav, header, footer, .ad, .advertisement, .social-share, .related-posts, .comments'
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

      console.log('Extracted content:', content.slice(0, 200) + '...');
      console.log('Content word count:', content.split(/\s+/).filter(word => word.length > 0).length);
      
      return {
        success: true,
        title: title.trim(),
        description: description.trim(),
        image: image.trim(),
        credits: credits,
        content: content
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
