declare module 'elevenlabs-node' {
  export class Elevenlabs {
    constructor(config: { apiKey: string });
    
    textToSpeech(params: {
      text: string;
      voice_id: string;
      model_id: string;
    }): Promise<Buffer>;
  }
} 