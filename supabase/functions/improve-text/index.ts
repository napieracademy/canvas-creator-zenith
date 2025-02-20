
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const openAIApiKey = Deno.env.get('OPENAI_API_KEY');

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const MAX_TOKENS = {
  title: 30,    
  description: 150  
};

const LANGUAGE_NAMES = {
  it: 'italiano',
  en: 'inglese',
  fr: 'francese',
  de: 'tedesco',
  pt: 'portoghese',
  zh: 'cinese mandarino',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { text, type, length, targetLanguage = 'it' } = await req.json();

    // Verifica la lingua del testo input
    const languageCheckResponse = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openAIApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          { 
            role: 'system', 
            content: `Sei un esperto linguista. Rispondi solo con il codice della lingua del testo tra: ${Object.keys(LANGUAGE_NAMES).join(', ')}` 
          },
          { role: 'user', content: text }
        ],
        temperature: 0,
        max_tokens: 10
      }),
    });

    const languageData = await languageCheckResponse.json();
    const sourceLanguage = languageData.choices[0].message.content.toLowerCase().trim();

    // Se la lingua sorgente è diversa dalla lingua target, traduciamo
    let textToImprove = text;
    if (sourceLanguage !== targetLanguage) {
      const translationResponse = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${openAIApiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'gpt-4o-mini',
          messages: [
            { 
              role: 'system', 
              content: type === 'title' 
                ? `Sei un traduttore esperto. Traduci questo titolo dall'${LANGUAGE_NAMES[sourceLanguage]} al ${LANGUAGE_NAMES[targetLanguage]} RIMANENDO IL PIÙ FEDELE POSSIBILE al significato originale. Non interpretare o rielaborare, mantieni la traduzione molto vicina all'originale. Usa solo parole semplici e dirette. Se ci sono giochi di parole o modi di dire, cerca l'equivalente più vicino possibile nella lingua target.`
                : `Sei un traduttore esperto. Traduci questo testo dall'${LANGUAGE_NAMES[sourceLanguage]} al ${LANGUAGE_NAMES[targetLanguage]} rimanendo il più fedele possibile al significato originale. Mantieni lo stesso tono e stile, evitando interpretazioni libere. Se ci sono espressioni idiomatiche, usa l'equivalente più vicino possibile nella lingua target.` 
            },
            { role: 'user', content: text }
          ],
          temperature: 0.3,
          max_tokens: type === 'title' ? MAX_TOKENS.title : MAX_TOKENS.description
        }),
      });

      const translationData = await translationResponse.json();
      textToImprove = translationData.choices[0].message.content;
    }

    // Calcola la lunghezza attuale del testo (in parole)
    const currentWordCount = textToImprove.split(/\s+/).length;
    const targetWordCount = length === 'shorter' 
      ? Math.max(Math.floor(currentWordCount * 0.7), type === 'title' ? 3 : 10)  // Riduci del 30% ma mantieni un minimo
      : length === 'longer' 
        ? Math.min(Math.ceil(currentWordCount * 1.3), type === 'title' ? 8 : 50)  // Aumenta del 30% ma mantieni un massimo
        : currentWordCount;  // Mantieni la lunghezza attuale

    // Ora procediamo con il miglioramento del testo
    let systemPrompt = `Sei un esperto copywriter che scrive con un tono professionale e autorevole in ${LANGUAGE_NAMES[targetLanguage]}. `;
    
    if (type === 'title') {
      systemPrompt += `Migliora questo titolo mantenendolo MOLTO conciso e d'impatto. Il testo finale DEVE contenere circa ${targetWordCount} parole. Rimuovi parole non essenziali e mantieni solo il messaggio chiave. `;
    } else {
      systemPrompt += `Migliora questa descrizione mantenendola informativa e coinvolgente. Il testo finale DEVE contenere circa ${targetWordCount} parole. EVITA ASSOLUTAMENTE frasi come "Non perdere l'occasione" o "Da non perdere" o simili inviti all'azione generici. Concentrati invece sui dettagli unici e specifici del film. `;
    }

    if (length === 'shorter') {
      systemPrompt += "IMPORTANTE: Il testo risultante DEVE essere PIÙ CORTO dell'originale. ";
    } else if (length === 'longer') {
      systemPrompt += "IMPORTANTE: Evita di allungare il testo con frasi fatte o ripetizioni. Aggiungi solo dettagli rilevanti e specifici. ";
    }

    systemPrompt += type === 'title'
      ? "Il titolo deve essere memorabile ma senza esagerazioni o sensazionalismi."
      : "IMPORTANTE: Concludi il testo in modo naturale, senza call-to-action o frasi ad effetto. Concentrati sui dettagli distintivi del film e lascia che siano questi a suscitare interesse.";

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openAIApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          { role: 'system', content: systemPrompt },
          { 
            role: 'user', 
            content: `Testo originale: ${text}\nTesto da migliorare: ${textToImprove}\nLunghezza desiderata: ${targetWordCount} parole` 
          }
        ],
        temperature: type === 'title' ? 0.5 : 0.7,
        top_p: type === 'title' ? 0.7 : 0.9,
        max_tokens: type === 'title' ? MAX_TOKENS.title : MAX_TOKENS.description
      }),
    });

    if (!response.ok) {
      throw new Error('OpenAI API error: ' + await response.text());
    }

    const data = await response.json();
    const improvedText = data.choices[0].message.content;

    return new Response(
      JSON.stringify({ 
        improvedText,
        wasTranslated: sourceLanguage !== targetLanguage 
      }),
      { 
        headers: { 
          ...corsHeaders,
          'Content-Type': 'application/json'
        } 
      }
    );
  } catch (error) {
    console.error('Error:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        status: 500,
        headers: { 
          ...corsHeaders,
          'Content-Type': 'application/json'
        } 
      }
    );
  }
});
