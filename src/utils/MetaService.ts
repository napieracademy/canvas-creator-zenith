
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

      let title = 
        doc.querySelector('meta[property="og:title"]')?.getAttribute('content') ||
        doc.querySelector('title')?.textContent || '';
      console.log('📌 [MetaService] Titolo estratto:', title);

      let description = 
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
      const content = clone.textContent || '';

      console.log('📄 [MetaService] Lunghezza contenuto grezzo:', content.length);

      let credits = '';
      if (author || publisher) {
        credits = [author, publisher]
          .filter(Boolean)
          .map(text => text.toLowerCase())
          .join(' · ');
      }
      console.log('🏷️ [MetaService] Credits generati:', credits);

      if (content) {
        console.log('🔄 [MetaService] Inizio miglioramento contenuto');
        try {
          console.log('🎯 [MetaService] Tentativo miglioramento titolo');
          const titleResponse = await fetch('http://localhost:54321/functions/v1/improve-content', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              content: content.slice(0, 2000),
              type: 'title'
            }),
          });

          if (titleResponse.ok) {
            const { improvedText: improvedTitle } = await titleResponse.json();
            if (improvedTitle) {
              title = improvedTitle;
              console.log('✅ [MetaService] Titolo migliorato:', improvedTitle);
            }
          } else {
            console.log('⚠️ [MetaService] Errore nel miglioramento del titolo, status:', titleResponse.status);
          }

          console.log('🎯 [MetaService] Tentativo miglioramento descrizione');
          const descriptionResponse = await fetch('http://localhost:54321/functions/v1/improve-content', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              content: content.slice(0, 2000),
              type: 'description'
            }),
          });

          if (descriptionResponse.ok) {
            const { improvedText: improvedDescription } = await descriptionResponse.json();
            if (improvedDescription) {
              description = improvedDescription;
              console.log('✅ [MetaService] Descrizione migliorata:', improvedDescription);
            }
          } else {
            console.log('⚠️ [MetaService] Errore nel miglioramento della descrizione, status:', descriptionResponse.status);
          }
        } catch (error) {
          console.error('❌ [MetaService] Errore durante il miglioramento del contenuto:', error);
        }
      }

      const result = {
        success: true,
        title: title.trim(),
        description: description.trim(),
        image: image.trim(),
        credits: credits,
        content: content
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

CONTENUTO:
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
