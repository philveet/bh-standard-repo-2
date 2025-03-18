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
  message?: string;
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
  const [isOptimizing, setIsOptimizing] = useState(false);
  const [debugInfo, setDebugInfo] = useState<string>('');
  
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const animationFrameRef = useRef<number | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  
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
      
      // Create a media recorder with optimized settings for better compatibility
      const mediaRecorder = new MediaRecorder(stream, {
        mimeType: MediaRecorder.isTypeSupported('audio/webm') 
          ? 'audio/webm' 
          : (MediaRecorder.isTypeSupported('audio/mp4') 
            ? 'audio/mp4' 
            : 'audio/ogg'),
        audioBitsPerSecond: 128000 // 128kbps - balances quality and file size
      });
      
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
        const audioBlob = new Blob(audioChunksRef.current, { type: mediaRecorder.mimeType });
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
  
  // Optimize audio for transcription
  const optimizeAudio = async (audioBlob: Blob): Promise<{ optimizedBlob: Blob, mimeType: string, debug: string }> => {
    setIsOptimizing(true);
    let debugLog = `Original audio: ${(audioBlob.size / 1024).toFixed(2)}KB, type: ${audioBlob.type}\n`;
    
    try {
      // We'll try to convert to WAV format which is well-supported by Deepgram
      const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
      
      // Load the audio blob
      const arrayBuffer = await audioBlob.arrayBuffer();
      debugLog += `ArrayBuffer created: ${(arrayBuffer.byteLength / 1024).toFixed(2)}KB\n`;
      
      // Decode the audio
      const audioBuffer = await audioContext.decodeAudioData(arrayBuffer);
      debugLog += `Audio decoded: ${audioBuffer.duration.toFixed(2)}s, ${audioBuffer.numberOfChannels} channels, ${audioBuffer.sampleRate}Hz\n`;
      
      // Prepare for downsampling if needed (16kHz mono is good for speech recognition)
      const targetSampleRate = 16000;
      const numberOfChannels = 1; // Mono
      
      let offlineContext;
      let bufferSource;
      
      // Check if we need to resample
      if (audioBuffer.sampleRate !== targetSampleRate || audioBuffer.numberOfChannels !== numberOfChannels) {
        debugLog += `Resampling audio to ${targetSampleRate}Hz, ${numberOfChannels} channel\n`;
        
        // Create an offline context for processing
        offlineContext = new OfflineAudioContext(
          numberOfChannels, 
          audioBuffer.duration * targetSampleRate, 
          targetSampleRate
        );
        
        // Create a buffer source
        bufferSource = offlineContext.createBufferSource();
        bufferSource.buffer = audioBuffer;
        
        // Connect and start
        bufferSource.connect(offlineContext.destination);
        bufferSource.start(0);
        
        // Render the audio
        const renderedBuffer = await offlineContext.startRendering();
        debugLog += `Audio resampled: ${renderedBuffer.duration.toFixed(2)}s, ${renderedBuffer.numberOfChannels} channels, ${renderedBuffer.sampleRate}Hz\n`;
        
        // Create WAV from the processed buffer
        const wavBlob = audioBufferToWav(renderedBuffer);
        debugLog += `WAV created: ${(wavBlob.size / 1024).toFixed(2)}KB\n`;
        
        setIsOptimizing(false);
        return { optimizedBlob: wavBlob, mimeType: 'audio/wav', debug: debugLog };
      } else {
        debugLog += `No resampling needed\n`;
        
        // Convert directly to WAV
        const wavBlob = audioBufferToWav(audioBuffer);
        debugLog += `WAV created: ${(wavBlob.size / 1024).toFixed(2)}KB\n`;
        
        setIsOptimizing(false);
        return { optimizedBlob: wavBlob, mimeType: 'audio/wav', debug: debugLog };
      }
    } catch (err: any) {
      debugLog += `Optimization error: ${err.message}\n`;
      console.error('Audio optimization error:', err);
      
      // Fall back to original audio
      debugLog += `Falling back to original audio\n`;
      setIsOptimizing(false);
      return { optimizedBlob: audioBlob, mimeType: audioBlob.type, debug: debugLog };
    }
  };
  
  // Convert AudioBuffer to WAV format
  const audioBufferToWav = (buffer: AudioBuffer): Blob => {
    const numChannels = buffer.numberOfChannels;
    const sampleRate = buffer.sampleRate;
    const format = 1; // PCM
    const bitDepth = 16;
    
    const bytesPerSample = bitDepth / 8;
    const blockAlign = numChannels * bytesPerSample;
    
    const dataLength = buffer.length * numChannels * bytesPerSample;
    const bufferLength = 44 + dataLength;
    
    const arrayBuffer = new ArrayBuffer(bufferLength);
    const view = new DataView(arrayBuffer);
    
    // RIFF identifier
    writeString(view, 0, 'RIFF');
    // RIFF chunk length
    view.setUint32(4, 36 + dataLength, true);
    // RIFF type
    writeString(view, 8, 'WAVE');
    // format chunk identifier
    writeString(view, 12, 'fmt ');
    // format chunk length
    view.setUint32(16, 16, true);
    // sample format (raw)
    view.setUint16(20, format, true);
    // channel count
    view.setUint16(22, numChannels, true);
    // sample rate
    view.setUint32(24, sampleRate, true);
    // byte rate (sample rate * block align)
    view.setUint32(28, sampleRate * blockAlign, true);
    // block align (channel count * bytes per sample)
    view.setUint16(32, blockAlign, true);
    // bits per sample
    view.setUint16(34, bitDepth, true);
    // data chunk identifier
    writeString(view, 36, 'data');
    // data chunk length
    view.setUint32(40, dataLength, true);
    
    // Write the PCM samples
    const offset = 44;
    let pos = offset;
    
    // Interleave channels
    for (let i = 0; i < buffer.length; i++) {
      for (let channel = 0; channel < numChannels; channel++) {
        const sample = Math.max(-1, Math.min(1, buffer.getChannelData(channel)[i]));
        // Convert to 16-bit signed integer
        const int16 = sample < 0 ? sample * 0x8000 : sample * 0x7FFF;
        view.setInt16(pos, int16, true);
        pos += 2;
      }
    }
    
    return new Blob([arrayBuffer], { type: 'audio/wav' });
  };
  
  // Helper function for writing strings to the WAV buffer
  const writeString = (view: DataView, offset: number, string: string) => {
    for (let i = 0; i < string.length; i++) {
      view.setUint8(offset + i, string.charCodeAt(i));
    }
  };
  
  // Transcribe the recorded audio
  const transcribeAudio = async () => {
    if (!audioUrl) return;
    
    setIsProcessing(true);
    setError(null);
    setDebugInfo('');
    
    try {
      // Get the audio blob from the URL
      const response = await fetch(audioUrl);
      const audioBlob = await response.blob();
      
      // Optimize the audio for better transcription reliability
      const { optimizedBlob, mimeType, debug } = await optimizeAudio(audioBlob);
      setDebugInfo(debug);
      
      // Convert blob to base64
      const reader = new FileReader();
      reader.readAsDataURL(optimizedBlob);
      
      reader.onloadend = async () => {
        const base64Audio = reader.result;
        
        // Log base64 length for debugging
        if (typeof base64Audio === 'string') {
          setDebugInfo(prev => prev + `\nBase64 length: ${base64Audio.length} characters\n`);
        }
        
        // Send to the API
        try {
          const apiResponse = await fetch('/api/test/deepgram', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              audio: base64Audio,
              mimeType: mimeType,
            }),
          });
          
          // Read response body as text first for debugging
          const responseText = await apiResponse.text();
          console.log('API Response text:', responseText);
          setDebugInfo(prev => prev + `\nAPI response: ${responseText.substring(0, 200)}...\n`);
          
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
        } catch (apiError: any) {
          console.error('API request error:', apiError);
          setDebugInfo(prev => prev + `\nAPI error: ${apiError.message}\n`);
          throw apiError;
        }
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
              disabled={isProcessing || isOptimizing}
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
                ref={audioRef}
                src={audioUrl} 
                controls 
                className={formStyles.audioPlayer} 
                onLoadedMetadata={(e) => {
                  // Fix for "Audio Duration: Infinity" warning
                  const audio = e.target as HTMLAudioElement;
                  if (isNaN(audio.duration)) {
                    audio.currentTime = 0;
                  }
                  console.log('Audio Duration:', (e.target as HTMLAudioElement).duration);
                }}
              />
              
              <button
                onClick={transcribeAudio}
                className={styles.backButton}
                disabled={isProcessing || isOptimizing}
                style={{ marginTop: 0 }}
              >
                {isOptimizing ? 'Optimizing Audio...' : (isProcessing ? 'Processing...' : 'Transcribe Audio')}
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
          
          {isProcessing || isOptimizing ? (
            <div className={formStyles.processingOverlay}>
              <div className={formStyles.loadingSpinner} />
              <p className={formStyles.processingText}>
                {isOptimizing ? 'Optimizing audio...' : 'Processing audio...'}
              </p>
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
          
          {/* Debug information for troubleshooting */}
          {debugInfo && (
            <div className={formStyles.debugInfo}>
              <h3>Debug Information</h3>
              <pre>{debugInfo}</pre>
            </div>
          )}
        </div>
      </main>
    </div>
  );
} 