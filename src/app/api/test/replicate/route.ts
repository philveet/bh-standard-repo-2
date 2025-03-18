import { NextResponse } from 'next/server';
import Replicate from 'replicate';

export const dynamic = 'force-dynamic';

// Direct Replicate client instantiation for testing
const createReplicateClient = () => {
  const apiToken = process.env.REPLICATE_API_TOKEN;
  if (!apiToken) {
    console.error('REPLICATE_API_TOKEN environment variable is not set');
    return null;
  }
  
  try {
    return new Replicate({
      auth: apiToken,
    });
  } catch (error) {
    console.error('Error creating Replicate client:', error);
    return null;
  }
};

export async function POST(request: Request) {
  console.log('Replicate test API route called');
  
  try {
    // Log environment variable status (without exposing the actual token)
    console.log('REPLICATE_API_TOKEN set:', !!process.env.REPLICATE_API_TOKEN);
    
    const { modelUrl, prompt } = await request.json();
    
    if (!modelUrl) {
      console.log('No model URL provided in request');
      return NextResponse.json(
        { error: 'Model URL is required' },
        { status: 400 }
      );
    }
    
    if (!prompt) {
      console.log('No prompt provided in request');
      return NextResponse.json(
        { error: 'Prompt is required' },
        { status: 400 }
      );
    }
    
    // Create Replicate client directly for testing purposes
    const replicate = createReplicateClient();
    
    if (!replicate) {
      console.error('Failed to create Replicate client');
      return NextResponse.json(
        { error: 'Replicate API not configured correctly' },
        { status: 500 }
      );
    }
    
    console.log(`Sending request to Replicate API for model: ${modelUrl}`);
    console.log(`Prompt: ${prompt}`);
    
    // Extract the model from URL format
    // e.g., "https://replicate.com/black-forest-labs/flux-dev" -> "black-forest-labs/flux-dev"
    let modelPath = modelUrl;
    if (modelUrl.includes('replicate.com/')) {
      modelPath = modelUrl.split('replicate.com/')[1];
    }
    
    console.log(`Using model path: ${modelPath}`);
    
    // Start the prediction
    const startTime = Date.now();
    const prediction = await replicate.run(modelPath, {
      input: {
        prompt: prompt
      }
    });
    
    const endTime = Date.now();
    const duration = (endTime - startTime) / 1000; // duration in seconds
    
    console.log('Response received from Replicate API');
    console.log('Prediction result:', prediction);
    
    // Return the response
    return NextResponse.json({
      result: prediction,
      model: modelPath,
      duration: duration,
      timestamp: new Date().toISOString()
    });
  } catch (error: any) {
    // Enhanced error logging
    console.error('Replicate test error details:', {
      message: error.message,
      name: error.name,
      stack: error.stack,
    });
    
    // Determine if it's a Replicate-specific error
    const isReplicateError = error.name === 'ReplicateError' || error.message?.includes('Replicate');
    const statusCode = isReplicateError ? 502 : 500; // 502 Bad Gateway for API errors
    
    return NextResponse.json(
      { 
        error: 'Failed to get response from Replicate',
        details: error.message || String(error),
        type: error.name || 'Unknown'
      },
      { status: statusCode }
    );
  }
} 