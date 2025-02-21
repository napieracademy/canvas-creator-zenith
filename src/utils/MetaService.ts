
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

      // Cerchiamo prima il contenuto principale in selettori comuni
      const mainContentSelectors = [
        'article',
        '[role="main"]',
        'main',
        '.post-content',
        '.article-content',
        '.entry-content',
        '#article-body',
        '.story-body'
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
      const elementsToRemove = clone.querySelectorAll(
        'script, style, iframe, nav, header, footer, aside, .ad, .ads, .advertisement, ' +
        '.social-share, .comments, .related-posts, .sidebar, .widget, ' +
        '[role="complementary"], [role="navigation"], .nav, .menu, .search, ' +
        '.share, .social, .author-bio, .breadcrumb, .pagination'
      );
      elementsToRemove.forEach(el => el.remove());

      // Estraiamo i paragrafi con contenuto significativo
      const paragraphs = Array.from(clone.querySelectorAll('p, h1, h2, h3, h4, h5, h6'))
        .map(p => p.textContent?.trim())
        .filter(text => {
          if (!text) return false;
          if (text.length < 20) return false;
          if (text.includes('Cookie') || text.includes('Privacy')) return false;
          if (text.includes('Copyright') || text.includes('All rights reserved')) return false;
          if (/^\d{1,2}\/\d{1,2}\/\d{2,4}$/.test(text)) return false;
          return true;
        });

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
