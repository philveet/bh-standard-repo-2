import { NextRequest, NextResponse } from 'next/server'
import { getWikiClient } from '@/lib/api/mediawiki'

// Define types for Wiki summary response
type WikiSummary = {
  pageid: number
  extract?: string
  title: string
}

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const query = searchParams.get('query')

  if (!query) {
    return NextResponse.json(
      { error: 'Search query is required' },
      { status: 400 }
    )
  }

  try {
    const client = getWikiClient()
    
    // Search Wikipedia for the query
    const searchResults = await client.search(query, 10)
    
    // Get snippets for the search results
    const results = await Promise.all(
      searchResults.results.map(async (title: string) => {
        try {
          const page = await client.page(title)
          // Use any type since we don't have the exact type from the wiki.js library
          const summary: any = await page.summary()
          
          return {
            title,
            snippet: summary.extract ? summary.extract.substring(0, 150) + '...' : 'No description available',
            pageid: summary.pageid || Date.now()
          }
        } catch (error) {
          console.error(`Error fetching details for ${title}:`, error)
          return {
            title,
            snippet: 'Could not load summary for this page.',
            pageid: Date.now() // Fallback ID for React keys
          }
        }
      })
    )

    return NextResponse.json({ results })
  } catch (error) {
    console.error('Error searching Wikipedia:', error)
    return NextResponse.json(
      { error: 'Failed to search Wikipedia' },
      { status: 500 }
    )
  }
} 