'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import styles from '@/styles/ApiTest.module.css';
import formStyles from '@/styles/ReplicateTest.module.css';

type ResponseData = {
  result: string | string[];
  model: string;
  duration: number;
  timestamp: string;
};

export default function ReplicateTestPage() {
  const router = useRouter();
  const [modelUrl, setModelUrl] = useState('https://replicate.com/black-forest-labs/flux-dev');
  const [prompt, setPrompt] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [responseData, setResponseData] = useState<ResponseData | null>(null);
  const [imageUrl, setImageUrl] = useState<string | null>(null);

  const handleRunModel = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!modelUrl.trim() || !prompt.trim() || isLoading) return;
    
    setIsLoading(true);
    setError(null);
    setImageUrl(null);
    
    try {
      console.log('Sending request to Replicate test API...');
      
      // Send request to API
      const response = await fetch('/api/test/replicate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          modelUrl: modelUrl.trim(),
          prompt: prompt.trim() 
        }),
      });
      
      // Read response body as text first for debugging
      const responseText = await response.text();
      console.log('API Response text:', responseText);
      
      // Try to parse as JSON
      let data;
      try {
        data = JSON.parse(responseText);
      } catch (parseError) {
        console.error('Error parsing response as JSON:', parseError);
        throw new Error(`Invalid JSON response: ${responseText.substring(0, 100)}...`);
      }
      
      if (!response.ok) {
        const errorMessage = data.error || 'Unknown error';
        const errorDetails = data.details || '';
        throw new Error(`${errorMessage}${errorDetails ? ': ' + errorDetails : ''}`);
      }
      
      // Process the result - Replicate can return string or array
      let resultUrl = '';
      if (Array.isArray(data.result) && data.result.length > 0) {
        // Most image models return an array of URLs
        resultUrl = data.result[0];
      } else if (typeof data.result === 'string') {
        // Some models return a single URL
        resultUrl = data.result;
      }
      
      if (!resultUrl) {
        throw new Error('No image URL returned from model');
      }
      
      setImageUrl(resultUrl);
      setResponseData(data);
    } catch (err: any) {
      console.error('Error in Replicate test:', err);
      setError(err.message || 'An error occurred while communicating with Replicate');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <button 
          onClick={() => router.push('/')} 
          className={styles.backButton}
        >
          ← Back to API Panel
        </button>
      </header>
      <main className={styles.main}>
        <h1 className={styles.title}>Live test for Replicate</h1>
        
        <div className={formStyles.formContainer}>
          <form onSubmit={handleRunModel}>
            <div className={formStyles.formGroup}>
              <label htmlFor="modelUrl" className={formStyles.label}>
                Model URL:
              </label>
              <input
                id="modelUrl"
                type="text"
                value={modelUrl}
                onChange={(e) => setModelUrl(e.target.value)}
                placeholder="https://replicate.com/owner/model"
                className={formStyles.input}
                disabled={isLoading}
              />
            </div>
            
            <div className={formStyles.formGroup}>
              <label htmlFor="prompt" className={formStyles.label}>
                Prompt:
              </label>
              <textarea
                id="prompt"
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder="Enter a prompt for image generation..."
                className={formStyles.textarea}
                disabled={isLoading}
              />
            </div>
            
            <button
              type="submit"
              className={formStyles.button}
              disabled={isLoading || !modelUrl.trim() || !prompt.trim()}
            >
              Run Model
            </button>
          </form>
        </div>
        
        {error && (
          <div className={formStyles.error}>
            <strong>Error:</strong> {error}
          </div>
        )}
        
        <div className={formStyles.resultContainer}>
          <h2>Image Result</h2>
          
          <div className={formStyles.imageContainer}>
            {imageUrl ? (
              <img 
                src={imageUrl} 
                alt="Generated by Replicate" 
                className={formStyles.generatedImage} 
              />
            ) : (
              <div className={isLoading ? formStyles.loadingOverlay : ''}>
                {isLoading ? (
                  <>
                    <div className={formStyles.loadingSpinner}></div>
                    <p className={formStyles.loadingText}>Generating image...</p>
                  </>
                ) : (
                  <p className={formStyles.loadingText}>
                    {error ? 'Error generating image' : 'Enter a prompt and run the model to generate an image'}
                  </p>
                )}
              </div>
            )}
          </div>
          
          {responseData && (
            <div className={formStyles.statusContainer}>
              <div className={formStyles.status}>
                <span className={formStyles.statusLabel}>Model:</span>
                <span className={formStyles.statusValue}>{responseData.model}</span>
              </div>
              <div className={formStyles.status}>
                <span className={formStyles.statusLabel}>Generation time:</span>
                <span className={formStyles.statusValue}>{responseData.duration.toFixed(2)} seconds</span>
              </div>
              <div className={formStyles.status}>
                <span className={formStyles.statusLabel}>Timestamp:</span>
                <span className={formStyles.statusValue}>{new Date(responseData.timestamp).toLocaleString()}</span>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
} 