'use client';

import { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import styles from '@/styles/ApiTest.module.css';
import formStyles from '@/styles/DeepgramTest.module.css';

type ResponseData = {
  transcript: string;
  confidence: number;
  words: any[];
  audioLength: number;
  processingTime: number;
  model: string;
  timestamp: string;
};

export default function DeepgramTestPage() {
  const router = useRouter();
  const [isRecording, setIsRecording] = useState(false);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [recordingTime, setRecordingTime] = useState(0);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [transcript, setTranscript] = useState<string>('');
  const [responseData, setResponseData] = useState<ResponseData | null>(null);
  
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const animationFrameRef = useRef<number | null>(null);
  
  // Clean up resources when component unmounts
  useEffect(() => {
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
      
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
      
      if (audioContextRef.current) {
        audioContextRef.current.close();
      }
    };
  }, []);
  
  // Format recording time as MM:SS
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };
  
  // Draw audio visualizer
  const drawVisualizer = () => {
    if (!analyserRef.current || !canvasRef.current) return;
    
    const canvas = canvasRef.current;
    const canvasCtx = canvas.getContext('2d');
    if (!canvasCtx) return;
    
    const width = canvas.width;
    const height = canvas.height;
    const analyser = analyserRef.current;
    const bufferLength = analyser.frequencyBinCount;
    const dataArray = new Uint8Array(bufferLength);
    
    const draw = () => {
      if (!isRecording) return;
      
      animationFrameRef.current = requestAnimationFrame(draw);
      analyser.getByteFrequencyData(dataArray);
      
      canvasCtx.fillStyle = 'rgb(35, 35, 35)';
      canvasCtx.fillRect(0, 0, width, height);
      
      const barWidth = (width / bufferLength) * 2.5;
      let barHeight;
      let x = 0;
      
      for (let i = 0; i < bufferLength; i++) {
        barHeight = dataArray[i] / 2;
        
        canvasCtx.fillStyle = `rgb(${barHeight + 100}, 50, 50)`;
        canvasCtx.fillRect(x, height - barHeight, barWidth, barHeight);
        
        x += barWidth + 1;
      }
    };
    
    draw();
  };
  
  // Start recording audio
  const startRecording = async () => {
    try {
      setError(null);
      audioChunksRef.current = [];
      
      // Request access to the microphone
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      
      // Set up the audio context and analyser
      if (!audioContextRef.current) {
        audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
      }
      
      const audioContext = audioContextRef.current;
      const analyser = audioContext.createAnalyser();
      analyser.fftSize = 256;
      
      const source = audioContext.createMediaStreamSource(stream);
      source.connect(analyser);
      analyserRef.current = analyser;
      
      // Create a media recorder
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      
      // Start recording
      mediaRecorder.start();
      setIsRecording(true);
      
      // Start the timer
      setRecordingTime(0);
      timerRef.current = setInterval(() => {
        setRecordingTime(prev => prev + 1);
      }, 1000);
      
      // Draw the visualizer
      drawVisualizer();
      
      // Handle data chunks
      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };
      
      // Handle recording stop
      mediaRecorder.onstop = () => {
        // Create a blob from the audio chunks
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
        const url = URL.createObjectURL(audioBlob);
        setAudioUrl(url);
        
        // Close all audio tracks
        stream.getTracks().forEach(track => track.stop());
      };
    } catch (err: any) {
      console.error('Error starting recording:', err);
      setError(err.message || 'Could not access the microphone');
      setIsRecording(false);
    }
  };
  
  // Stop recording audio
  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
      
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
        animationFrameRef.current = null;
      }
    }
  };
  
  // Transcribe the recorded audio
  const transcribeAudio = async () => {
    if (!audioUrl) return;
    
    setIsProcessing(true);
    setError(null);
    
    try {
      // Get the audio blob from the URL
      const response = await fetch(audioUrl);
      const audioBlob = await response.blob();
      
      // Convert blob to base64
      const reader = new FileReader();
      reader.readAsDataURL(audioBlob);
      
      reader.onloadend = async () => {
        const base64Audio = reader.result;
        
        // Send to the API
        const apiResponse = await fetch('/api/test/deepgram', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            audio: base64Audio,
            mimeType: audioBlob.type,
          }),
        });
        
        // Read response body as text first for debugging
        const responseText = await apiResponse.text();
        console.log('API Response text:', responseText);
        
        // Try to parse as JSON
        let data;
        try {
          data = JSON.parse(responseText);
        } catch (parseError) {
          console.error('Error parsing response as JSON:', parseError);
          throw new Error(`Invalid JSON response: ${responseText.substring(0, 100)}...`);
        }
        
        if (!apiResponse.ok) {
          const errorMessage = data.error || 'Unknown error';
          const errorDetails = data.details || '';
          throw new Error(`${errorMessage}${errorDetails ? ': ' + errorDetails : ''}`);
        }
        
        // Set the transcript and response data
        setTranscript(data.transcript);
        setResponseData(data);
      };
    } catch (err: any) {
      console.error('Error transcribing audio:', err);
      setError(err.message || 'An error occurred while transcribing the audio');
    } finally {
      setIsProcessing(false);
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
        <h1 className={styles.title}>Live test for Deepgram</h1>
        
        <div className={formStyles.recordingContainer}>
          <h2>Audio Recording</h2>
          
          <div className={formStyles.recordingVisualizer}>
            <canvas ref={canvasRef} className={formStyles.visualizerCanvas} width={1000} height={100} />
          </div>
          
          {(isRecording || recordingTime > 0) && (
            <div className={formStyles.recordingStatus}>
              <span>
                {isRecording ? "Recording..." : "Recording stopped"}
              </span>
              <span className={formStyles.recordingDuration}>
                {formatTime(recordingTime)}
              </span>
            </div>
          )}
          
          <div className={formStyles.recorderControls}>
            <button
              onClick={isRecording ? stopRecording : startRecording}
              className={`${formStyles.recordButton} ${isRecording ? formStyles.recording : ''}`}
              disabled={isProcessing}
              aria-label={isRecording ? "Stop recording" : "Start recording"}
              title={isRecording ? "Stop recording" : "Start recording"}
            >
              {isRecording ? "◼" : "●"}
            </button>
            
            <span className={formStyles.audioStatus}>
              {isRecording 
                ? "Click again to stop recording" 
                : audioUrl 
                  ? "Recording complete" 
                  : "Click to start recording"}
            </span>
          </div>
          
          {audioUrl && (
            <div>
              <audio 
                src={audioUrl} 
                controls 
                className={formStyles.audioPlayer} 
                onLoadedMetadata={(e) => {
                  // Log duration for debugging
                  console.log('Audio Duration:', (e.target as HTMLAudioElement).duration);
                }}
              />
              
              <button
                onClick={transcribeAudio}
                className={styles.backButton}
                disabled={isProcessing}
                style={{ marginTop: 0 }}
              >
                Transcribe Audio
              </button>
            </div>
          )}
        </div>
        
        {error && (
          <div className={formStyles.error}>
            <strong>Error:</strong> {error}
          </div>
        )}
        
        <div className={formStyles.transcriptContainer}>
          <h2>Transcription Result</h2>
          
          {isProcessing ? (
            <div className={formStyles.processingOverlay}>
              <div className={formStyles.loadingSpinner} />
              <p className={formStyles.processingText}>Processing audio...</p>
            </div>
          ) : (
            <div className={formStyles.transcriptBox}>
              {transcript ? transcript : (
                <div className={formStyles.noTranscript}>
                  {error 
                    ? "Error generating transcript" 
                    : "Record audio and click 'Transcribe Audio' to see the transcript here"}
                </div>
              )}
            </div>
          )}
          
          {responseData && (
            <div className={formStyles.statusContainer}>
              <div className={formStyles.status}>
                <span className={formStyles.statusLabel}>Model:</span>
                <span className={formStyles.statusValue}>{responseData.model}</span>
              </div>
              <div className={formStyles.status}>
                <span className={formStyles.statusLabel}>Confidence:</span>
                <span className={formStyles.statusValue}>
                  {(responseData.confidence * 100).toFixed(2)}%
                </span>
              </div>
              <div className={formStyles.status}>
                <span className={formStyles.statusLabel}>Audio Length:</span>
                <span className={formStyles.statusValue}>
                  {responseData.audioLength.toFixed(2)} seconds
                </span>
              </div>
              <div className={formStyles.status}>
                <span className={formStyles.statusLabel}>Processing Time:</span>
                <span className={formStyles.statusValue}>
                  {responseData.processingTime.toFixed(2)} seconds
                </span>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
} 