
# Documentazione del Flusso di Estrazione URL

## Panoramica
Questo documento descrive in dettaglio il processo di estrazione dei contenuti da un URL e la loro propagazione ai campi titolo e descrizione nell'applicazione.

## Componenti Principali

### 1. UrlFetchControl
**File**: `src/components/TextControls/UrlFetchControl.tsx`

Componente che gestisce l'interfaccia utente per l'input dell'URL:
```typescript
interface UrlFetchControlProps {
  onTitleExtracted: (title: string) => void;
  onDescriptionExtracted: (description: string) => void;
  onTabChange: (value: string) => void;
  onLoadingChange: (loading: boolean) => void;
}
```

### 2. UrlInput
**File**: `src/components/UrlInput.tsx`

Gestisce:
- Input dell'URL
- Validazione
- Chiamata al servizio di estrazione
- Salvataggio nel database
- Feedback utente

### 3. MetaService
**File**: `src/utils/MetaService.ts`

Servizio principale per l'estrazione dei metadati:
- Utilizza proxy multipli per superare le limitazioni CORS
- Estrae metadati da vari tag HTML
- Implementa fallback per dati mancanti

## Flusso Dettagliato dei Dati

### 1. Inizializzazione
1. L'utente inserisce un URL nel campo input
2. Il componente `UrlInput` valida l'URL
3. Viene attivato l'indicatore di caricamento

### 2. Estrazione Metadati
```typescript
const result = await MetaService.extractMetadata(url);
```

MetaService tenta l'estrazione attraverso:
- Meta tag OpenGraph
- Meta tag standard HTML
- Meta tag Twitter
- Contenuto del documento

### 3. Elaborazione dei Dati
Priorità di estrazione per il titolo:
1. `meta[property="og:title"]`
2. `title` tag

Priorità di estrazione per la descrizione:
1. `meta[property="og:description"]`
2. `meta[name="description"]`
3. `meta[name="twitter:description"]`
4. Primo paragrafo dell'articolo

### 4. Persistenza dei Dati
```typescript
const { saved, duplicate } = await saveToDatabase({
  url,
  title: result.title,
  description,
  content: result.content,
  credits: result.credits,
  image_url: result.image,
  extraction_date: result.extractionDate,
  publication_date: result.publicationDate,
  modification_date: result.modificationDate
});
```

### 5. Aggiornamento UI
La funzione `updateEditor` propaga i dati:
```typescript
const updateEditor = (result: any) => {
  if (result.title) onTitleExtracted(result.title);
  if (result.description) onDescriptionExtracted(result.description);
  // ... altri aggiornamenti
};
```

## Gestione degli Eventi

### Feedback Utente
- Progress bar in tempo reale
- Toast notifications per:
  - Successo estrazione
  - Errori
  - Duplicati trovati
  - Aggiornamenti completati

### Gestione Errori
- Fallback tra proxy diversi
- Gestione CORS
- Validazione input
- Gestione timeout
- Notifiche utente

### Gestione Duplicati
- Verifica automatica
- Dialog di conferma
- Opzione per utilizzare contenuto esistente
- Tracciamento date di modifica

## Persistenza

### Database Supabase
Tabella `extracted_content`:
- URL
- Titolo
- Descrizione
- Contenuto completo
- Credits
- URL immagine
- Data estrazione
- Data pubblicazione
- Data modifica

## Best Practices Implementate

1. **Robustezza**
   - Proxy multipli
   - Fallback per dati mancanti
   - Gestione errori completa

2. **Performance**
   - Debouncing delle richieste
   - Caching dei risultati
   - Validazione preventiva

3. **UX**
   - Feedback in tempo reale
   - Gestione stati di caricamento
   - Notifiche chiare

4. **Manutenibilità**
   - Codice modulare
   - Separazione delle responsabilità
   - Documentazione inline

## Note Tecniche Aggiuntive

### Proxy Utilizzati
```typescript
const proxyUrls = [
  'https://api.codetabs.com/v1/proxy',
  'https://cors-anywhere.herokuapp.com',
  'https://api.allorigins.win/raw'
];
```

### Eventi Custom
```typescript
const creditsEvent = new CustomEvent('creditsExtracted', {
  detail: { credits: result.credits }
});
document.dispatchEvent(creditsEvent);
```

