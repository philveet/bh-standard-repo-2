import { NextResponse } from 'next/server';
import { createClient } from '@deepgram/sdk';

export const dynamic = 'force-dynamic';

// Increase the body size limit for audio files (default is 4mb)
export const config = {
  api: {
    bodyParser: {
      sizeLimit: '10mb',
    },
  },
};

// Direct Deepgram client instantiation for testing
const createDeepgramClient = () => {
  const apiKey = process.env.DEEPGRAM_API_KEY;
  if (!apiKey) {
    console.error('DEEPGRAM_API_KEY environment variable is not set');
    return null;
  }
  
  try {
    return createClient(apiKey);
  } catch (error) {
    console.error('Error creating Deepgram client:', error);
    return null;
  }
};

export async function POST(request: Request) {
  console.log('Deepgram test API route called');
  
  try {
    // Log environment variable status (without exposing the actual key)
    console.log('DEEPGRAM_API_KEY set:', !!process.env.DEEPGRAM_API_KEY);
    
    // Get content type to determine how to handle the request
    const contentType = request.headers.get('content-type') || '';
    
    let audioData: Buffer;
    let mimeType: string;
    
    // Handle different content types
    if (contentType.includes('application/json')) {
      const jsonData = await request.json();
      
      if (!jsonData.audio) {
        console.log('No audio data provided in request');
        return NextResponse.json(
          { error: 'Audio data is required' },
          { status: 400 }
        );
      }
      
      // Extract base64 audio data and decode it
      const base64Data = jsonData.audio.split(',')[1]; // Remove data URL prefix if present
      audioData = Buffer.from(base64Data, 'base64');
      mimeType = jsonData.mimeType || 'audio/webm';
    } else if (contentType.includes('multipart/form-data')) {
      // For form data file uploads
      const formData = await request.formData();
      const file = formData.get('audio') as File;
      
      if (!file) {
        console.log('No audio file provided in request');
        return NextResponse.json(
          { error: 'Audio file is required' },
          { status: 400 }
        );
      }
      
      const arrayBuffer = await file.arrayBuffer();
      audioData = Buffer.from(arrayBuffer);
      mimeType = file.type;
    } else {
      return NextResponse.json(
        { error: 'Unsupported content type' },
        { status: 400 }
      );
    }
    
    // Create Deepgram client directly for testing purposes
    const deepgram = createDeepgramClient();
    
    if (!deepgram) {
      console.error('Failed to create Deepgram client');
      return NextResponse.json(
        { error: 'Deepgram API not configured correctly' },
        { status: 500 }
      );
    }
    
    console.log('Sending request to Deepgram API...');
    console.log('Audio MIME type:', mimeType);
    console.log('Audio data size:', audioData.length, 'bytes');
    
    // Start the transcription
    const startTime = Date.now();
    
    // Prepare options for transcription
    const transcriptionOptions = {
      punctuate: true,
      model: 'nova-2',
      language: 'en',
      smart_format: true,
      filler_words: false
    };
    
    // Using the current Deepgram SDK API
    const response = await deepgram.listen.prerecorded.transcribeFile(
      audioData,
      {
        mimetype: mimeType,
        ...transcriptionOptions,
      }
    );
    
    const endTime = Date.now();
    const duration = (endTime - startTime) / 1000; // duration in seconds
    
    console.log('Response received from Deepgram API');
    
    // Extract transcript and metadata safely based on the SDK response structure
    // The Deepgram SDK returns a complex object with the result property
    let transcript = '';
    let confidence = 0;
    let words: any[] = [];
    let audioLength = 0;
    let modelName = 'nova-2';
    
    // Handle the response based on the Deepgram SDK structure
    if (response && typeof response === 'object') {
      // First check if it's an error response
      if ('error' in response) {
        throw new Error(`Deepgram API error: ${(response as any).error}`);
      }
      
      // Access the results as per the Deepgram API response structure
      if ('results' in response) {
        const results = (response as any).results;
        transcript = results?.channels?.[0]?.alternatives?.[0]?.transcript || '';
        confidence = results?.channels?.[0]?.alternatives?.[0]?.confidence || 0;
        words = results?.channels?.[0]?.alternatives?.[0]?.words || [];
        audioLength = results?.metadata?.duration || 0;
        modelName = results?.metadata?.model || 'nova-2';
      } else if ('result' in response) {
        // Alternative structure in some versions
        const result = (response as any).result;
        transcript = result?.channels?.[0]?.alternatives?.[0]?.transcript || '';
        confidence = result?.channels?.[0]?.alternatives?.[0]?.confidence || 0;
        words = result?.channels?.[0]?.alternatives?.[0]?.words || [];
        audioLength = result?.metadata?.duration || 0;
        modelName = result?.metadata?.model || 'nova-2';
      }
    }
    
    // Return the processed response
    return NextResponse.json({
      transcript,
      confidence,
      words,
      audioLength,
      processingTime: duration,
      model: modelName,
      timestamp: new Date().toISOString()
    });
  } catch (error: any) {
    // Enhanced error logging
    console.error('Deepgram test error details:', {
      message: error.message,
      name: error.name,
      stack: error.stack,
    });
    
    // Determine if it's a Deepgram-specific error
    const isDeepgramError = error.name === 'DeepgramError' || error.message?.includes('Deepgram');
    const statusCode = isDeepgramError ? 502 : 500; // 502 Bad Gateway for API errors
    
    return NextResponse.json(
      { 
        error: 'Failed to get response from Deepgram',
        details: error.message || String(error),
        type: error.name || 'Unknown'
      },
      { status: statusCode }
    );
  }
} 