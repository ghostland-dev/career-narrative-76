import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const geminiApiKey = Deno.env.get('GEMINI_API_KEY');

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    if (!geminiApiKey) {
      throw new Error('GEMINI_API_KEY non configuré');
    }

    const { action, data } = await req.json();
    
    if (!action || !data) {
      throw new Error('Action et data requis');
    }
    
    let prompt = '';
    
    switch (action) {
      case 'optimize_cv':
        prompt = `En tant qu'expert en ressources humaines, optimise ce CV pour le rendre plus attractif et professionnel. Améliore le contenu sans changer les informations factuelles de base. Retourne uniquement le JSON optimisé avec la même structure :

CV à optimiser : ${JSON.stringify(data)}

Optimise spécialement :
- Le résumé professionnel (summary) pour qu'il soit plus impactant
- Les descriptions d'expériences pour mettre en valeur les réalisations
- La présentation des compétences
- L'orthographe et la grammaire

Retourne uniquement le JSON optimisé, sans commentaires.`;
        break;
        
      case 'enhance_experience':
        prompt = `Améliore cette description d'expérience professionnelle pour la rendre plus impactante et attrayante pour les recruteurs. Focus sur les réalisations et l'impact :

Expérience actuelle : "${data.description}"
Poste : ${data.title}
Entreprise : ${data.company}

Retourne une description optimisée qui :
- Met en valeur les réalisations concrètes
- Utilise des verbes d'action forts
- Quantifie les résultats quand possible
- Reste factuelle et professionnelle
- Fait 2-3 phrases maximum

Retourne uniquement la description optimisée, sans guillemets.`;
        break;
        
      case 'improve_summary':
        prompt = `Créé un résumé professionnel percutant basé sur ces informations :

Informations CV : ${JSON.stringify(data)}

Le résumé doit :
- Faire 2-3 phrases maximum
- Mettre en valeur les points forts
- Être adapté au secteur d'activité
- Être professionnel et engageant
- Mentionner les compétences clés

Retourne uniquement le résumé optimisé, sans guillemets.`;
        break;
        
      case 'suggest_skills':
        prompt = `Basé sur ce profil professionnel, suggère 8-12 compétences pertinentes et demandées dans le secteur :

Profil : ${JSON.stringify(data)}

Retourne uniquement une liste de compétences séparées par des virgules, sans commentaires.`;
        break;
        
      default:
        throw new Error('Action non reconnue');
    }

    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${geminiApiKey}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [{
          parts: [{
            text: prompt
          }]
        }],
        generationConfig: {
          temperature: 0.7,
          topK: 40,
          topP: 0.95,
          maxOutputTokens: 1024,
        }
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Erreur Gemini:', response.status, errorText);
      throw new Error(`Erreur API Gemini: ${response.status} - ${errorText}`);
    }

    const result = await response.json();
    
    if (!result.candidates || !result.candidates[0] || !result.candidates[0].content) {
      console.error('Réponse Gemini invalide:', result);
      throw new Error('Réponse Gemini invalide');
    }
    
    const generatedText = result.candidates[0].content.parts[0].text;

    return new Response(JSON.stringify({ 
      success: true,
      result: generatedText,
      action 
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Erreur dans ai-cv-optimizer:', error);
    return new Response(JSON.stringify({ 
      success: false,
      error: error.message 
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});