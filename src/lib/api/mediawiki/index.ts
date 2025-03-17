import wiki from 'wikijs';
import { isApiEnabled } from '@/config/api-config';

export function getWikiClient() {
  if (!isApiEnabled('mediawiki')) {
    throw new Error('MediaWiki API is not enabled in this project');
  }
  
  return wiki();
}

export async function searchWikipedia(query: string, limit: number = 5) {
  const client = getWikiClient();
  const searchResults = await client.search(query, limit);
  return searchResults;
}

export async function getPageContent(title: string) {
  const client = getWikiClient();
  const page = await client.page(title);
  
  const [content, summary, images, categories] = await Promise.all([
    page.content(),
    page.summary(),
    page.images(),
    page.categories()
  ]);
  
  return {
    title,
    content,
    summary,
    images,
    categories
  };
} 