
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
    const { texts, targetLanguage } = await req.json();
    const { title, description } = texts;

    const prompt = `Traduci il seguente testo in ${targetLanguage}. Mantieni lo stesso tono e stile del testo originale.

Titolo: ${title}
Descrizione: ${description}

Restituisci solo il testo tradotto, nel formato:
Titolo: [titolo tradotto]
Descrizione: [descrizione tradotta]`;

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openAIApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          { role: 'system', content: 'Sei un traduttore esperto. Traduci il testo mantenendo il suo significato e stile originale.' },
          { role: 'user', content: prompt }
        ],
      }),
    });

    const data = await response.json();
    const translatedText = data.choices[0].message.content;

    // Estrai titolo e descrizione dalla risposta
    const titleMatch = translatedText.match(/Titolo:\s*(.+)/);
    const descriptionMatch = translatedText.match(/Descrizione:\s*(.+)/s);

    return new Response(
      JSON.stringify({
        title: titleMatch?.[1] || title,
        description: descriptionMatch?.[1] || description,
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
