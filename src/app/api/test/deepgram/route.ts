import { NextResponse } from 'next/server';

// Route segment config
export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';
export const maxDuration = 60;

export async function POST(request: Request) {
  console.log('Simplified Deepgram API endpoint called');
  
  try {
    // Verify API key
    const apiKey = process.env.DEEPGRAM_API_KEY;
    if (!apiKey) {
      console.error('DEEPGRAM_API_KEY is not set');
      return NextResponse.json({ 
        error: 'Deepgram API not configured', 
        details: 'API key missing' 
      }, { status: 500 });
    }
    
    // Get request data
    const contentType = request.headers.get('content-type') || '';
    if (!contentType.includes('application/json')) {
      return NextResponse.json({ 
        error: 'Unsupported content type', 
        details: 'Only JSON requests are supported' 
      }, { status: 400 });
    }
    
    // Parse request body
    const requestData = await request.json();
    if (!requestData.audio) {
      return NextResponse.json({ 
        error: 'Missing audio data', 
        details: 'Audio data is required' 
      }, { status: 400 });
    }
    
    // Extract audio data (base64)
    const base64Audio = requestData.audio;
    const mimeType = requestData.mimeType || 'audio/wav';
    
    // Remove data URL prefix if present
    const base64Data = base64Audio.includes('base64,') 
      ? base64Audio.split('base64,')[1] 
      : base64Audio;
    
    // Convert base64 to binary
    const binaryData = Buffer.from(base64Data, 'base64');
    
    console.log(`Processing audio: ${binaryData.length} bytes, type: ${mimeType}`);
    
    // Direct API call to Deepgram (simplest possible implementation)
    try {
      console.log('Calling Deepgram API directly with fetch');
      
      const startTime = Date.now();
      
      // Make direct HTTP request to Deepgram API
      const response = await fetch('https://api.deepgram.com/v1/listen?model=nova-2&punctuate=true&language=en', {
        method: 'POST',
        headers: {
          'Authorization': `Token ${apiKey}`,
          'Content-Type': mimeType
        },
        body: binaryData
      });
      
      const endTime = Date.now();
      const processingTime = (endTime - startTime) / 1000;
      
      // Check if request was successful
      if (!response.ok) {
        const errorText = await response.text();
        console.error(`Deepgram API error: ${response.status}`, errorText);
        return NextResponse.json({ 
          error: 'Deepgram API error', 
          details: `HTTP ${response.status}: ${errorText}` 
        }, { status: 502 });
      }
      
      // Parse response
      const result = await response.json();
      console.log('Deepgram API response received');
      
      // Extract transcript and metadata
      const transcript = result.results?.channels?.[0]?.alternatives?.[0]?.transcript || '';
      const confidence = result.results?.channels?.[0]?.alternatives?.[0]?.confidence || 0;
      const words = result.results?.channels?.[0]?.alternatives?.[0]?.words || [];
      
      // Return formatted response
      return NextResponse.json({
        transcript,
        confidence,
        words,
        audioLength: result.metadata?.duration || 0,
        processingTime,
        model: result.metadata?.model || 'nova-2',
        timestamp: new Date().toISOString(),
        success: true
      });
    } catch (apiError: any) {
      console.error('Error calling Deepgram API directly:', apiError);
      return NextResponse.json({ 
        error: 'Failed to call Deepgram API', 
        details: apiError.message || String(apiError),
        timestamp: new Date().toISOString()
      }, { status: 502 });
    }
  } catch (error: any) {
    console.error('Unhandled error in Deepgram API route:', error);
    return NextResponse.json({ 
      error: 'Server error', 
      details: error.message || String(error),
      timestamp: new Date().toISOString()
    }, { status: 500 });
  }
} 