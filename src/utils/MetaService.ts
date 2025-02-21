
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

      const clone = doc.body.cloneNode(true) as HTMLElement;
      const elementsToRemove = clone.querySelectorAll('script, style');
      elementsToRemove.forEach(el => el.remove());
      const rawContent = clone.textContent || '';
      
      // Prendiamo solo le prime 10 righe del contenuto
      const contentLines = rawContent.split('\n')
        .filter(line => line.trim().length > 0) // Rimuove le righe vuote
        .slice(0, 10) // Prende solo le prime 10 righe
        .join('\n');

      console.log('📄 [MetaService] Lunghezza contenuto limitato:', contentLines.length);

      let credits = '';
      if (author || publisher) {
        credits = [author, publisher]
          .filter(Boolean)
          .map(text => text.toLowerCase())
          .join(' · ');
      }
      console.log('🏷️ [MetaService] Credits generati:', credits);

      const result = {
        success: true,
        title: title.trim(),
        description: description.trim(),
        image: image.trim(),
        credits: credits,
        content: contentLines
      };

      console.log('📦 [MetaService] Oggetto risultato creato:', result);

      const cleanTitle = result.title
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
Titolo: ${result.title}
Descrizione: ${result.description}
Immagine: ${result.image}
Crediti: ${result.credits || 'Non specificati'}

CONTENUTO (Prime 10 righe):
---------
${result.content || 'Nessun contenuto estratto'}
`;

      console.log('📝 [MetaService] Testo metadata formattato generato, lunghezza:', metadataText.length);

      // Aggiorniamo il risultato con il testo formattato
      result.content = metadataText;
      console.log('🔄 [MetaService] Contenuto risultato aggiornato con testo formattato');

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
