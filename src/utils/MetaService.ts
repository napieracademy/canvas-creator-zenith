
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

      const proxyUrl = `https://api.codetabs.com/v1/proxy?quest=${encodeURIComponent(url)}`;
      const response = await fetch(proxyUrl);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const text = await response.text();
      const parser = new DOMParser();
      const doc = parser.parseFromString(text, 'text/html');

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

      // Estrai tutto il contenuto del body, rimuovendo solo gli script e gli stili
      const clone = doc.body.cloneNode(true) as HTMLElement;
      const elementsToRemove = clone.querySelectorAll('script, style');
      elementsToRemove.forEach(el => el.remove());
      const content = clone.textContent || '';

      console.log('Raw content length:', content.length);

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
              content: content.slice(0, 2000),
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
              content: content.slice(0, 2000),
              type: 'description'
            }),
          });

          if (descriptionResponse.ok) {
            const { improvedText: improvedDescription } = await descriptionResponse.json();
            if (improvedDescription) description = improvedDescription;
          }
        } catch (error) {
          console.error('Error improving content:', error);
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

      // Genera un nome file pulito dal titolo
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

      // Aggiorniamo il risultato con il testo formattato
      result.content = metadataText;

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
