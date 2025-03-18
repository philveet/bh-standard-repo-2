import { NextResponse } from 'next/server';
import { OpenAI } from 'openai';

export const dynamic = 'force-dynamic';

// Direct OpenAI client instantiation for testing 
// bypassing the library to isolate potential issues
const createOpenAIClient = () => {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    console.error('OPENAI_API_KEY environment variable is not set');
    return null;
  }
  
  try {
    return new OpenAI({
      apiKey: apiKey,
    });
  } catch (error) {
    console.error('Error creating OpenAI client:', error);
    return null;
  }
};

export async function POST(request: Request) {
  console.log('OpenAI test API route called');
  
  try {
    // Log environment variable status (without exposing the actual key)
    console.log('OPENAI_API_KEY set:', !!process.env.OPENAI_API_KEY);
    
    const { message } = await request.json();
    
    if (!message) {
      console.log('No message provided in request');
      return NextResponse.json(
        { error: 'Message is required' },
        { status: 400 }
      );
    }
    
    // Create OpenAI client directly for testing purposes
    const openai = createOpenAIClient();
    
    if (!openai) {
      console.error('Failed to create OpenAI client');
      return NextResponse.json(
        { error: 'OpenAI API not configured correctly' },
        { status: 500 }
      );
    }
    
    console.log('Sending request to OpenAI API...');
    
    // Create a chat completion with simplified parameters
    const response = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [
        { role: 'system', content: 'You are a helpful assistant for testing the OpenAI API. Keep responses brief.' },
        { role: 'user', content: message }
      ],
      max_tokens: 150
    });
    
    console.log('Response received from OpenAI API');
    
    // Return the response
    return NextResponse.json({
      reply: response.choices[0]?.message?.content || 'No response generated',
      model: response.model,
      usage: response.usage
    });
  } catch (error: any) {
    // Enhanced error logging
    console.error('OpenAI test error details:', {
      message: error.message,
      name: error.name,
      stack: error.stack,
    });
    
    // Determine if it's an OpenAI-specific error
    const isOpenAIError = error.name === 'OpenAIError' || error.message?.includes('OpenAI');
    const statusCode = isOpenAIError ? 502 : 500; // 502 Bad Gateway for API errors
    
    return NextResponse.json(
      { 
        error: 'Failed to get response from OpenAI',
        details: error.message || String(error),
        type: error.name || 'Unknown'
      },
      { status: statusCode }
    );
  }
} 