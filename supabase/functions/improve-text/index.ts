
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const openAIApiKey = Deno.env.get('OPENAI_API_KEY');

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const MAX_TOKENS = {
  title: 100,    // Aumentato il limite per i titoli
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
    console.log('Richiesta ricevuta:', { text, type, length, targetLanguage });

    // Verifica la lingua del testo input
    const languageCheckResponse = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openAIApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o', // Corretto qui
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
    console.log('Lingua rilevata:', sourceLanguage);

    // Se la lingua sorgente è diversa dalla lingua target, traduciamo
    let textToImprove = text;
    if (sourceLanguage !== targetLanguage) {
      console.log('Avvio traduzione da', sourceLanguage, 'a', targetLanguage);
      const translationResponse = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${openAIApiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'gpt-4o', // Corretto qui
          messages: [
            { 
              role: 'system', 
              content: type === 'title' 
                ? `Sei un traduttore professionista esperto in localizzazione di contenuti digitali, specializzato in ${LANGUAGE_NAMES[targetLanguage]}. 
                   Il tuo compito è tradurre questo titolo dall'${LANGUAGE_NAMES[sourceLanguage]} mantenendo:
                   1. Il tono e lo stile originale
                   2. Il contesto culturale appropriato per il pubblico di destinazione
                   3. Le sfumature emotive e l'impatto del messaggio originale
                   4. La naturalezza della lingua di destinazione
                   
                   Se sono presenti giochi di parole o riferimenti culturali, adattali in modo che abbiano senso per il pubblico di destinazione.
                   La traduzione deve sembrare un contenuto originalmente scritto in ${LANGUAGE_NAMES[targetLanguage]}.
                   IMPORTANTE: Fornisci la traduzione completa senza troncare il testo.`
                : `Sei un traduttore professionista esperto in localizzazione di contenuti digitali, specializzato in ${LANGUAGE_NAMES[targetLanguage]}. 
                   Il tuo compito è tradurre questo testo dall'${LANGUAGE_NAMES[sourceLanguage]} mantenendo:
                   1. Il registro linguistico e il tono dell'originale
                   2. La precisione tecnica e la terminologia specifica del settore
                   3. La scorrevolezza e la naturalezza nella lingua di destinazione
                   4. Le sfumature culturali appropriate per il pubblico target
                   
                   La traduzione deve preservare il significato originale adattandolo al contesto culturale della lingua di destinazione.
                   Il risultato deve sembrare un testo scritto originariamente in ${LANGUAGE_NAMES[targetLanguage]}.` 
            },
            { role: 'user', content: text }
          ],
          temperature: 0.3,
          max_tokens: type === 'title' ? MAX_TOKENS.title : MAX_TOKENS.description
        }),
      });

      const translationData = await translationResponse.json();
      textToImprove = translationData.choices[0].message.content;
      console.log('Testo tradotto:', textToImprove);
    }

    // Ora procediamo con il miglioramento del testo
    let systemPrompt = `Sei un esperto copywriter e content strategist che scrive in ${LANGUAGE_NAMES[targetLanguage]} con un tono professionale e coinvolgente. `;

    const lengthInstruction = length === 'shorter' ? 'più breve dell\'originale' : 
                            length === 'longer' ? 'più lungo dell\'originale' : 
                            'simile all\'originale';
    
    if (type === 'title') {
      systemPrompt += `
        Migliora questo titolo seguendo queste linee guida:
        1. Mantieni il messaggio chiave e l'essenza del contenuto
        2. Usa un linguaggio preciso e d'impatto
        3. Evita cliché e frasi fatte
        4. Mantieni una lunghezza ${lengthInstruction}
        5. Assicurati che il tono sia appropriato per il pubblico target
        
        Il titolo deve essere memorabile e professionale, evitando sensazionalismi o esagerazioni.
        IMPORTANTE: Fornisci il titolo completo senza troncarlo.
      `;
    } else {
      systemPrompt += `
        Migliora questa descrizione seguendo queste linee guida:
        1. Mantieni il focus sui dettagli distintivi e specifici
        2. Usa un linguaggio chiaro e professionale
        3. Struttura il testo in modo logico e scorrevole
        4. Mantieni una lunghezza ${lengthInstruction}
        5. Assicurati che ogni frase aggiunga valore al messaggio complessivo
        
        La descrizione deve essere informativa e coinvolgente, evitando luoghi comuni e call-to-action generiche.
      `;
    }

    console.log('Avvio miglioramento testo');
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openAIApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o', // Corretto qui
        messages: [
          { role: 'system', content: systemPrompt },
          { 
            role: 'user', 
            content: `
              Testo originale: ${text}
              Testo da migliorare: ${textToImprove}
              
              Migliora questo testo mantenendo il significato originale ma rendendolo più efficace e naturale nella lingua di destinazione.
              La lunghezza deve essere ${lengthInstruction}.
              IMPORTANTE: Fornisci il testo completo senza troncarlo.
            `
          }
        ],
        temperature: type === 'title' ? 0.4 : 0.6,
        top_p: type === 'title' ? 0.7 : 0.9,
        max_tokens: type === 'title' ? MAX_TOKENS.title : MAX_TOKENS.description
      }),
    });

    if (!response.ok) {
      throw new Error('OpenAI API error: ' + await response.text());
    }

    const data = await response.json();
    const improvedText = data.choices[0].message.content;
    console.log('Testo migliorato:', improvedText);

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
