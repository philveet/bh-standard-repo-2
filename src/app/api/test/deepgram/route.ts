import { NextResponse } from 'next/server';
import { createClient } from '@deepgram/sdk';

// Route segment config
export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';
export const maxDuration = 60; // Set max duration to 60 seconds for processing larger audio files

// Direct Deepgram client instantiation for testing
const createDeepgramClient = () => {
  const apiKey = process.env.DEEPGRAM_API_KEY;
  if (!apiKey) {
    console.error('DEEPGRAM_API_KEY environment variable is not set');
    return null;
  }
  
  try {
    // Log a masked version of the API key for debugging (only first 4 and last 4 chars)
    const maskedKey = apiKey.length > 8 
      ? `${apiKey.slice(0, 4)}...${apiKey.slice(-4)}` 
      : '****';
    console.log(`Creating Deepgram client with API key: ${maskedKey}`);
    
    return createClient(apiKey);
  } catch (error) {
    console.error('Error creating Deepgram client:', error);
    return null;
  }
};

export async function POST(request: Request) {
  console.log('Deepgram test API route called');
  
  try {
    // Log environment variable status
    const hasApiKey = !!process.env.DEEPGRAM_API_KEY;
    console.log('DEEPGRAM_API_KEY set:', hasApiKey);
    
    if (!hasApiKey) {
      console.error('DEEPGRAM_API_KEY is not set in environment variables');
      return NextResponse.json(
        { error: 'Deepgram API not configured', details: 'API key missing' },
        { status: 500 }
      );
    }
    
    // Get content type to determine how to handle the request
    const contentType = request.headers.get('content-type') || '';
    console.log('Request content type:', contentType);
    
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
      
      // Check if audio data is a base64 string
      if (typeof jsonData.audio !== 'string' || !jsonData.audio.includes('base64')) {
        console.error('Invalid audio data format, expected base64 string');
        return NextResponse.json(
          { error: 'Invalid audio data format', details: 'Expected base64 encoded audio' },
          { status: 400 }
        );
      }
      
      // Extract base64 audio data and decode it
      const base64Data = jsonData.audio.split(',')[1]; // Remove data URL prefix if present
      audioData = Buffer.from(base64Data, 'base64');
      mimeType = jsonData.mimeType || 'audio/webm';
      
      console.log(`Decoded base64 audio data, size: ${audioData.length} bytes, type: ${mimeType}`);
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
      
      console.log(`Received form audio file, size: ${audioData.length} bytes, type: ${mimeType}`);
    } else {
      console.error(`Unsupported content type: ${contentType}`);
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
    
    console.log('Transcription options:', JSON.stringify(transcriptionOptions));
    
    try {
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
      
      console.log('Response received from Deepgram API after', duration, 'seconds');
      console.log('Response structure:', JSON.stringify(Object.keys(response || {})));
      
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
          throw new Error(`Deepgram API error: ${JSON.stringify((response as any).error)}`);
        }
        
        // Try to extract the response data, logging details along the way
        console.log('Response keys:', Object.keys(response));
        
        // Access the results as per the Deepgram API response structure
        if ('results' in response) {
          console.log('Found results structure in response');
          const results = (response as any).results;
          transcript = results?.channels?.[0]?.alternatives?.[0]?.transcript || '';
          confidence = results?.channels?.[0]?.alternatives?.[0]?.confidence || 0;
          words = results?.channels?.[0]?.alternatives?.[0]?.words || [];
          audioLength = results?.metadata?.duration || 0;
          modelName = results?.metadata?.model || 'nova-2';
        } else if ('result' in response) {
          console.log('Found result structure in response');
          const result = (response as any).result;
          transcript = result?.channels?.[0]?.alternatives?.[0]?.transcript || '';
          confidence = result?.channels?.[0]?.alternatives?.[0]?.confidence || 0;
          words = result?.channels?.[0]?.alternatives?.[0]?.words || [];
          audioLength = result?.metadata?.duration || 0;
          modelName = result?.metadata?.model || 'nova-2';
        } else {
          console.warn('Unexpected response structure from Deepgram:', response);
        }
      } else {
        console.warn('Response is not an object or is null:', response);
      }
      
      console.log('Extracted transcript:', transcript ? transcript.substring(0, 50) + '...' : '(empty)');
      
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
    } catch (apiError: any) {
      console.error('Error calling Deepgram API:', {
        message: apiError.message,
        name: apiError.name,
        code: apiError.code,
        response: apiError.response,
        fullDetails: JSON.stringify(apiError)
      });
      
      throw apiError; // Rethrow for the outer catch block
    }
  } catch (error: any) {
    // Enhanced error logging
    console.error('Deepgram test error details:', {
      message: error.message,
      name: error.name,
      stack: error.stack?.split('\n').slice(0, 3).join('\n'),
      code: error.code,
      fullError: JSON.stringify(error, Object.getOwnPropertyNames(error))
    });
    
    // Try to extract more details from the error
    let errorDetails = error.message || String(error);
    let errorType = error.name || 'Unknown';
    
    // Check for Deepgram specific error formats
    if (error.response) {
      try {
        errorDetails = JSON.stringify(error.response);
      } catch (e) {
        // Ignore stringify errors
      }
    }
    
    // Determine if it's a Deepgram-specific error
    const isDeepgramError = errorType === 'DeepgramError' || 
                           errorType === 'DeepgramApiError' || 
                           errorDetails.includes('Deepgram');
    const statusCode = isDeepgramError ? 502 : 500; // 502 Bad Gateway for API errors
    
    return NextResponse.json(
      { 
        error: 'Failed to get response from Deepgram',
        details: errorDetails,
        type: errorType,
        timestamp: new Date().toISOString()
      },
      { status: statusCode }
    );
  }
} 