import Anthropic from '@anthropic-ai/sdk';
import { isApiEnabled } from '@/config/api-config';

let anthropicClient: Anthropic | null = null;

export function getAnthropicClient() {
  if (!isApiEnabled('anthropic')) {
    throw new Error('Anthropic API is not enabled in this project');
  }
  
  if (!anthropicClient) {
    const apiKey = process.env.ANTHROPIC_API_KEY;
    if (!apiKey) {
      throw new Error('ANTHROPIC_API_KEY is not defined');
    }
    
    anthropicClient = new Anthropic({
      apiKey: apiKey
    });
  }
  
  return anthropicClient;
}

export async function generateCompletion(prompt: string, options: { maxTokens?: number; temperature?: number } = {}) {
  const client = getAnthropicClient();
  
  const message = await client.messages.create({
    model: "claude-3-haiku-20240307",
    max_tokens: options.maxTokens || 500,
    temperature: options.temperature || 0.7,
    messages: [{ role: "user", content: prompt }]
  });
  
  // Handle different content block types from Anthropic
  if (message.content[0].type === 'text') {
    return message.content[0].text;
  } else {
    // In case it's a different type of content block
    return JSON.stringify(message.content[0]);
  }
} 