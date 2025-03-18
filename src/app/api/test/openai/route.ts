import { NextResponse } from 'next/server';
import { getOpenAIClient } from '@/lib/api/openai';

export const dynamic = 'force-dynamic';

export async function POST(request: Request) {
  try {
    const { message } = await request.json();
    
    if (!message) {
      return NextResponse.json(
        { error: 'Message is required' },
        { status: 400 }
      );
    }
    
    // Get OpenAI client
    const openai = getOpenAIClient();
    
    // Check if OpenAI client is available
    if (!openai) {
      return NextResponse.json(
        { error: 'OpenAI API not configured' },
        { status: 500 }
      );
    }
    
    // Create a chat completion
    const response = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [
        { role: 'system', content: 'You are a helpful assistant for testing the OpenAI API. Keep responses brief.' },
        { role: 'user', content: message }
      ],
      max_tokens: 150
    });
    
    // Return the response
    return NextResponse.json({
      reply: response.choices[0]?.message?.content || 'No response generated',
      model: response.model,
      usage: response.usage
    });
  } catch (error: any) {
    console.error('OpenAI test error:', error);
    return NextResponse.json(
      { 
        error: 'Failed to get response from OpenAI',
        details: error.message || String(error)
      },
      { status: 500 }
    );
  }
} 