import { OpenAI } from 'openai';
import { isApiEnabled } from '@/config/api-config';

let openaiClient: OpenAI | null = null;

export function getOpenAIClient() {
  if (!isApiEnabled('openai')) {
    throw new Error('OpenAI API is not enabled in this project');
  }
  
  if (!openaiClient) {
    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) {
      throw new Error('OPENAI_API_KEY is not defined');
    }
    
    openaiClient = new OpenAI({
      apiKey: apiKey
    });
  }
  
  return openaiClient;
}

export async function generateCompletion(prompt: string, options: { maxTokens?: number; temperature?: number } = {}) {
  const client = getOpenAIClient();
  
  const completion = await client.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [{ role: "user", content: prompt }],
    max_tokens: options.maxTokens || 500,
    temperature: options.temperature || 0.7,
  });
  
  return completion.choices[0].message.content;
} 