// src/config/api-registry.ts
export interface ApiDefinition {
  name: string;
  packageName: string;
  packageVersion: string;
  envVar: string;
  description: string;
  category: 'ai' | 'communication' | 'document' | 'payment' | 'information' | 'media';
  defaultEnabled: boolean;
}

// The single source of truth for all API configurations
export const API_REGISTRY: Record<string, ApiDefinition> = {
  replicate: {
    name: 'Replicate',
    packageName: 'replicate',
    packageVersion: '0.18.0',
    envVar: 'REPLICATE_API_KEY',
    description: 'Access to open-source AI models',
    category: 'ai',
    defaultEnabled: true,
  },
  anthropic: {
    name: 'Anthropic',
    packageName: '@anthropic-ai/sdk',
    packageVersion: '0.36.3',
    envVar: 'ANTHROPIC_API_KEY',
    description: 'Claude AI models',
    category: 'ai',
    defaultEnabled: true,
  },
  openai: {
    name: 'OpenAI',
    packageName: 'openai',
    packageVersion: '4.6.0',
    envVar: 'OPENAI_API_KEY',
    description: 'Text generation and completions',
    category: 'ai',
    defaultEnabled: true,
  },
  deepgram: {
    name: 'Deepgram',
    packageName: '@deepgram/sdk',
    packageVersion: '2.4.0',
    envVar: 'DEEPGRAM_API_KEY',
    description: 'Speech-to-text transcription',
    category: 'media',
    defaultEnabled: true,
  },
  resend: {
    name: 'Resend',
    packageName: 'resend',
    packageVersion: '1.1.0',
    envVar: 'RESEND_API_KEY',
    description: 'Email delivery service',
    category: 'communication',
    defaultEnabled: true,
  },
  mediawiki: {
    name: 'MediaWiki',
    packageName: 'wikijs',
    packageVersion: '6.4.1',
    envVar: 'MEDIAWIKI_API_KEY', // Most installations don't need this, but included for consistency
    description: 'Access to Wikipedia and other wiki content',
    category: 'information',
    defaultEnabled: true,
  },
  'react-pdf': {
    name: 'React PDF',
    packageName: '@react-pdf/renderer',
    packageVersion: '3.1.12',
    envVar: 'REACT_PDF_LICENSE_KEY', // Not typically needed but included for consistency
    description: 'PDF generation and rendering',
    category: 'document',
    defaultEnabled: true,
  },
  stripe: {
    name: 'Stripe',
    packageName: 'stripe',
    packageVersion: '13.3.0',
    envVar: 'STRIPE_SECRET_KEY',
    description: 'Payment processing',
    category: 'payment',
    defaultEnabled: true,
  },
  elevenlabs: {
    name: 'ElevenLabs',
    packageName: 'elevenlabs-node',
    packageVersion: '1.1.1',
    envVar: 'ELEVENLABS_API_KEY',
    description: 'Text-to-speech API',
    category: 'media',
    defaultEnabled: true,
  },
};

// Get all API keys as a type
export type ApiName = keyof typeof API_REGISTRY;

// Generate a Record type for the enabled state
export type ApiEnabledState = Record<ApiName, boolean>; 