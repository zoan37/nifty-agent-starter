import { NextResponse } from 'next/server';

const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY;
const OPENROUTER_URL = 'https://openrouter.ai/api/v1/chat/completions';

export async function POST(request) {
  try {
    const { text, userName, userId, version } = await request.json();
    
    const messages = [
      {
        role: 'system',
        content: `You are an AI agent named "Agent X", living in Nifty Island. You are friendly, helpful, and aware that you're talking to players in the game. 
You are currently talking to player "${userName}" (userId = "${userId}").
You will receive their messages and should respond naturally as if you're a character in the game, while being helpful and engaging.`
      },
      {
        role: 'user',
        content: text
      }
    ];

    const response = await fetch(OPENROUTER_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${OPENROUTER_API_KEY}`,
        'HTTP-Referer': process.env.VERCEL_URL || 'http://localhost:3000',
        'X-Title': 'Nifty Agent Starter'
      },
      body: JSON.stringify({
        model: 'google/gemini-flash-1.5-8b',
        messages,
        max_tokens: 5000,
        stream: true
      })
    });

    // Accumulate the full response
    let fullResponse = '';
    const reader = response.body.getReader();
    const decoder = new TextDecoder();

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;

      const chunk = decoder.decode(value);
      const lines = chunk.split('\n').filter(line => 
        line.trim() && !line.includes('PROCESSING') && !line.includes('[DONE]')
      );

      for (const line of lines) {
        if (!line.startsWith('data:')) continue;
        
        try {
          const json = JSON.parse(line.slice(5));
          if (json.choices?.[0]?.delta?.content) {
            fullResponse += json.choices[0].delta.content;
          }
        } catch (e) {
          console.error('Error parsing chunk:', e);
        }
      }
    }

    // Return the complete response in Nifty format
    return NextResponse.json([{
      text: fullResponse,
      action: 'CHAT'
    }]);

  } catch (error) {
    console.error('API error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}