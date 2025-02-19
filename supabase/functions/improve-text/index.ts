
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
    const { text, tone, type, length } = await req.json();

    // Costruiamo il prompt in base al tipo di testo, al tono e alla lunghezza richiesta
    let systemPrompt = "Sei un esperto copywriter che ottimizza testi per i social media. ";
    
    if (type === 'title') {
      systemPrompt += "Migliora questo titolo mantenendolo conciso, accattivante e d'impatto. ";
    } else {
      systemPrompt += "Migliora questa descrizione mantenendola chiara, coinvolgente e persuasiva. ";
    }

    if (tone) {
      systemPrompt += `Usa un tono ${tone}. `;
    }

    // Aggiungiamo istruzioni per la lunghezza
    if (length === 'shorter') {
      systemPrompt += "Il testo risultante deve essere più corto dell'originale, ma mantenere tutti i concetti chiave. ";
    } else if (length === 'longer') {
      systemPrompt += "Espandi il testo aggiungendo più dettagli e sfumature, mantenendo lo stesso messaggio di base. ";
    } else {
      systemPrompt += "Mantieni approssimativamente la stessa lunghezza del testo originale. ";
    }

    systemPrompt += "Rendi il testo più efficace e memorabile.";

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
          { role: 'user', content: text }
        ],
        temperature: 0.7,
      }),
    });

    if (!response.ok) {
      throw new Error('OpenAI API error: ' + await response.text());
    }

    const data = await response.json();
    const improvedText = data.choices[0].message.content;

    return new Response(
      JSON.stringify({ improvedText }),
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
