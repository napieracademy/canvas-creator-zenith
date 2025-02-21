
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const openAIApiKey = Deno.env.get('OPENAI_API_KEY');

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { title, description, length, tone } = await req.json();

    const getToneInstruction = (tone: string) => {
      switch (tone) {
        case 'formal': return 'in modo formale ed elegante';
        case 'casual': return 'in modo informale e rilassato';
        case 'professional': return 'in modo professionale e autorevole';
        case 'friendly': return 'in modo amichevole e accogliente';
        default: return 'mantenendo il tono originale';
      }
    };

    const titleSystemPrompt = `Sei un esperto copywriter specializzato in titoli per social media. 
Il tuo obiettivo è creare titoli:
- Chiari e diretti, evitando ambiguità
- Immediati da comprendere
- Incisivi e memorabili
- Rilevanti per il pubblico target
- Senza gergo tecnico non necessario
- Che mantengono il messaggio chiave originale

Non aggiungere mai virgolette o apici al testo.
Non usare punti esclamativi multipli.
Non SCRIVERE IN MAIUSCOLO se non necessario.
Mantieni il focus sul messaggio principale.`;

    const promptTitle = title ? `Migliora questo titolo ${getToneInstruction(tone)}. 
${length === 'shorter' ? 'IMPORTANTE: Riduci drasticamente a massimo 8-10 parole.' : length === 'longer' ? 'Aggiungi più dettagli mantenendo la chiarezza.' : 'Mantieni la stessa lunghezza circa.'}
Assicurati che il significato sia immediatamente chiaro.
Non aggiungere MAI virgolette o apici al testo.

Titolo da migliorare: ${title}` : '';

    const promptDescription = description ? `Migliora questa descrizione ${getToneInstruction(tone)}. 
${length === 'shorter' ? 'IMPORTANTE: Riduci drasticamente a 15-20 parole totali.' : length === 'longer' ? 'Espandi il testo mantenendo la chiarezza.' : 'Mantieni la stessa lunghezza circa.'}
Mantieni solo le informazioni essenziali.
Non aggiungere MAI virgolette o apici al testo.

Descrizione da migliorare: ${description}` : '';

    console.log('Invio richiesta a OpenAI:', { promptTitle, promptDescription });

    const results = await Promise.all([
      title ? fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${openAIApiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'gpt-4o-mini',
          messages: [
            { role: 'system', content: titleSystemPrompt },
            { role: 'user', content: promptTitle }
          ],
          temperature: 0.5,
          max_tokens: 150,
          presence_penalty: 0.2,
          frequency_penalty: 0.3
        }),
      }).then(r => r.json()) : null,
      
      description ? fetch('https://api.openai.com/v1/chat/completions', {
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
              content: 'Sei un esperto copywriter. Il tuo compito principale è condensare il testo al minimo essenziale mantenendo il significato chiave. Se richiesto, riduci drasticamente a 15-20 parole totali.' 
            },
            { role: 'user', content: promptDescription }
          ],
          temperature: 0.7,
          max_tokens: 250,
          presence_penalty: 0.3,
          frequency_penalty: 0.3
        }),
      }).then(r => r.json()) : null
    ]);

    console.log('Risposta da OpenAI:', results);

    return new Response(
      JSON.stringify({
        title: title ? { 
          improvedText: results[0].choices[0].message.content.trim() 
        } : null,
        description: description ? { 
          improvedText: results[1].choices[0].message.content.trim() 
        } : null
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } },
    );
  } catch (error) {
    console.error('Error:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      },
    );
  }
});
