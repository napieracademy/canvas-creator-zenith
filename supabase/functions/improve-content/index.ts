
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
    const { content, type } = await req.json();

    const systemPrompt = type === 'title' 
      ? "Sei un esperto di social media marketing. Data una descrizione o un contenuto di un articolo, genera un titolo accattivante e coinvolgente che aumenti l'engagement. Il titolo deve essere conciso (max 80 caratteri) e deve catturare l'essenza del contenuto mantenendo un tono professionale."
      : "Sei un esperto di social media marketing. Data una descrizione o un contenuto di un articolo, genera una descrizione accattivante e coinvolgente che aumenti l'engagement. La descrizione deve essere concisa (max 200 caratteri) e deve riassumere i punti chiave del contenuto in modo interessante.";

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
          { role: 'user', content }
        ],
      }),
    });

    const data = await response.json();
    const improvedText = data.choices[0].message.content;

    return new Response(JSON.stringify({ improvedText }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error in improve-content function:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
