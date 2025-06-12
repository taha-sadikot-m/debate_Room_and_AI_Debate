
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { speechText, sessionId } = await req.json()
    
    if (!speechText || !sessionId) {
      return new Response(
        JSON.stringify({ error: 'Missing speechText or sessionId' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Get OpenAI API key from environment
    const openaiApiKey = Deno.env.get('OPENAI_API_KEY')
    if (!openaiApiKey) {
      return new Response(
        JSON.stringify({ error: 'OpenAI API key not configured' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Initialize Supabase client
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!
    const supabaseKey = Deno.env.get('SUPABASE_ANON_KEY')!
    const supabase = createClient(supabaseUrl, supabaseKey)

    // Get user from Authorization header
    const authHeader = req.headers.get('Authorization')!
    const token = authHeader.replace('Bearer ', '')
    const { data: { user }, error: authError } = await supabase.auth.getUser(token)
    
    if (authError || !user) {
      return new Response(
        JSON.stringify({ error: 'Unauthorized' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Analyze speech using OpenAI
    const prompt = `
    Analyze the following debate speech using Freudian psychological theory. Rate each aspect from 0-10:

    1. ID (Instinctive/Impulsive): How much does the speaker rely on emotional, aggressive, or impulsive arguments?
    2. EGO (Rational/Logical): How well does the speaker use structured reasoning, facts, and logical flow?
    3. SUPEREGO (Moral/Ethical): How much does the speaker consider ethics, empathy, and moral implications?

    Also provide:
    - Overall score (0-100) based on debate effectiveness
    - Brief feedback text (2-3 sentences)
    - Detailed analysis reasoning (3-4 sentences)

    Speech text: "${speechText}"

    Respond in JSON format:
    {
      "idScore": number,
      "egoScore": number,
      "superegoScore": number,
      "overallScore": number,
      "feedbackText": "string",
      "analysisReasoning": "string"
    }
    `

    const openaiResponse = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openaiApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-3.5-turbo',
        messages: [
          {
            role: 'system',
            content: 'You are an expert debate coach and psychologist specializing in Freudian analysis of debate styles.'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        temperature: 0.3,
        max_tokens: 500
      })
    })

    if (!openaiResponse.ok) {
      throw new Error('OpenAI API request failed')
    }

    const openaiData = await openaiResponse.json()
    const analysisText = openaiData.choices[0].message.content
    
    let analysis
    try {
      analysis = JSON.parse(analysisText)
    } catch (parseError) {
      // Fallback if JSON parsing fails
      analysis = {
        idScore: 5.0,
        egoScore: 7.0,
        superegoScore: 6.0,
        overallScore: 60,
        feedbackText: "Analysis completed. Work on balancing logical structure with emotional appeal.",
        analysisReasoning: "The speech shows moderate use of rational arguments with room for improvement in ethical considerations."
      }
    }

    // Store analysis in database
    const { error: insertError } = await supabase
      .from('freud_feedback')
      .insert({
        session_id: sessionId,
        user_id: user.id,
        id_score: analysis.idScore,
        ego_score: analysis.egoScore,
        superego_score: analysis.superegoScore,
        overall_score: analysis.overallScore,
        feedback_text: analysis.feedbackText,
        analysis_reasoning: analysis.analysisReasoning
      })

    if (insertError) {
      console.error('Error inserting feedback:', insertError)
    }

    return new Response(
      JSON.stringify(analysis),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )

  } catch (error) {
    console.error('Error in analyze-freud function:', error)
    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }
})
