import { Redis } from '@upstash/redis';

let redisClient: Redis | null = null;

export function getRedisClient() {
  if (!redisClient) {
    const url = process.env.UPSTASH_REDIS_URL;
    const token = process.env.UPSTASH_REDIS_TOKEN;
    
    if (!url) {
      throw new Error('UPSTASH_REDIS_URL is not defined');
    }
    
    if (!token) {
      throw new Error('UPSTASH_REDIS_TOKEN is not defined');
    }
    
    redisClient = new Redis({
      url,
      token,
    });
  }
  
  return redisClient;
} 