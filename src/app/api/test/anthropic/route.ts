import { NextResponse } from 'next/server';
import Anthropic from '@anthropic-ai/sdk';

export const dynamic = 'force-dynamic';

// Direct Anthropic client instantiation for testing
// bypassing the library to isolate potential issues
const createAnthropicClient = () => {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    console.error('ANTHROPIC_API_KEY environment variable is not set');
    return null;
  }
  
  try {
    return new Anthropic({
      apiKey: apiKey,
    });
  } catch (error) {
    console.error('Error creating Anthropic client:', error);
    return null;
  }
};

export async function POST(request: Request) {
  console.log('Anthropic test API route called');
  
  try {
    // Log environment variable status (without exposing the actual key)
    console.log('ANTHROPIC_API_KEY set:', !!process.env.ANTHROPIC_API_KEY);
    
    const { message } = await request.json();
    
    if (!message) {
      console.log('No message provided in request');
      return NextResponse.json(
        { error: 'Message is required' },
        { status: 400 }
      );
    }
    
    // Create Anthropic client directly for testing purposes
    const anthropic = createAnthropicClient();
    
    if (!anthropic) {
      console.error('Failed to create Anthropic client');
      return NextResponse.json(
        { error: 'Anthropic API not configured correctly' },
        { status: 500 }
      );
    }
    
    console.log('Sending request to Anthropic API...');
    
    // Create a message with Claude
    const response = await anthropic.messages.create({
      model: 'claude-3-haiku-20240307',
      max_tokens: 150,
      system: 'You are a helpful assistant for testing the Anthropic API. Keep responses brief.',
      messages: [
        { role: 'user', content: message }
      ]
    });
    
    console.log('Response received from Anthropic API');
    
    // Extract text from the content block - handle different content types
    let replyText = '';
    if (response.content.length > 0) {
      const contentBlock = response.content[0];
      if (contentBlock.type === 'text') {
        replyText = contentBlock.text;
      } else {
        replyText = 'Received non-text response from Anthropic';
        console.log('Unexpected content type:', contentBlock.type);
      }
    }
    
    // Return the response
    return NextResponse.json({
      reply: replyText,
      model: response.model,
      usage: {
        input_tokens: response.usage.input_tokens,
        output_tokens: response.usage.output_tokens,
        total_tokens: response.usage.input_tokens + response.usage.output_tokens
      }
    });
  } catch (error: any) {
    // Enhanced error logging
    console.error('Anthropic test error details:', {
      message: error.message,
      name: error.name,
      stack: error.stack,
    });
    
    // Determine if it's an Anthropic-specific error
    const isAnthropicError = error.name === 'AnthropicError' || error.message?.includes('Anthropic');
    const statusCode = isAnthropicError ? 502 : 500; // 502 Bad Gateway for API errors
    
    return NextResponse.json(
      { 
        error: 'Failed to get response from Anthropic',
        details: error.message || String(error),
        type: error.name || 'Unknown'
      },
      { status: statusCode }
    );
  }
} 