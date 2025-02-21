
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

      // Cloniamo il body per manipolarlo senza toccare il documento originale
      const clone = doc.body.cloneNode(true) as HTMLElement;

      // Rimuoviamo tutti gli elementi non necessari
      const elementsToRemove = clone.querySelectorAll(
        'script, style, iframe, nav, header, footer, aside, .ad, .ads, .advertisement, .social-share, .comments'
      );
      elementsToRemove.forEach(el => el.remove());

      // Estraiamo il testo principale
      const mainContent = clone.textContent || '';
      
      // Puliamo il testo
      const cleanContent = mainContent
        .split('\n')
        .map(line => line.trim())
        .filter(line => {
          // Rimuoviamo righe vuote o troppo corte
          if (line.length < 10) return false;
          // Rimuoviamo righe che sembrano essere menu o footer
          if (line.includes('Cookie') || line.includes('Privacy') || line.includes('Menu')) return false;
          // Rimuoviamo linee che sembrano essere date
          if (/^\d{1,2}\/\d{1,2}\/\d{2,4}$/.test(line)) return false;
          return true;
        })
        .join('\n\n');

      console.log('📄 [MetaService] Contenuto pulito, lunghezza:', cleanContent.length);

      let credits = '';
      if (author || publisher) {
        credits = [author, publisher]
          .filter(Boolean)
          .map(text => text.toLowerCase())
          .join(' · ');
      }
      console.log('🏷️ [MetaService] Credits generati:', credits);

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
      console.log('📋 [MetaService] Nome file generato:', filename);
      
      const metadataText = `
URL Originale: ${url}
Data Estrazione: ${new Date().toLocaleString()}

METADATI ESTRATTI:
----------------
Titolo: ${title}
Descrizione: ${description}
Immagine: ${image}
Crediti: ${credits || 'Non specificati'}

CONTENUTO:
---------
${cleanContent}
`;

      console.log('📝 [MetaService] Testo metadata formattato generato, lunghezza:', metadataText.length);

      const blob = new Blob([metadataText], { type: 'text/plain;charset=utf-8' });
      const downloadUrl = window.URL.createObjectURL(blob);
      console.log('🔗 [MetaService] URL download generato:', downloadUrl);

      const link = document.createElement('a');
      link.href = downloadUrl;
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(downloadUrl);
      console.log('💾 [MetaService] Download file iniziato');

      const result = {
        success: true,
        title: title.trim(),
        description: description.trim(),
        image: image.trim(),
        credits: credits,
        content: metadataText,
        extractionDate: new Date().toLocaleString(),
        url: url
      };

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
