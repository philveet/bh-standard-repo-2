'use client'

import React, { useState } from 'react'
import { TestLayout } from '@/components/test/TestLayout'
import { ApiTestCard } from '@/components/test/ApiTestCard'
import styles from '@/styles/test.module.css'

type WikiResult = {
  title: string
  snippet: string
  pageid: number
}

export default function MediaWikiTestPage() {
  const [query, setQuery] = useState('')
  const [results, setResults] = useState<WikiResult[] | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function handleSearch(e: React.FormEvent) {
    e.preventDefault()
    if (!query.trim()) {
      setError('Please enter a search term')
      return
    }

    setIsLoading(true)
    setError(null)
    
    try {
      const response = await fetch(`/api/mediawiki/search?query=${encodeURIComponent(query)}`)
      
      if (!response.ok) {
        throw new Error(`Error: ${response.status} ${response.statusText}`)
      }
      
      const data = await response.json()
      setResults(data.results || [])
    } catch (err) {
      setError(`Failed to search: ${err instanceof Error ? err.message : String(err)}`)
      setResults(null)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <TestLayout 
      title="MediaWiki API Test" 
      description="Search for Wikipedia articles and view their content"
      backLink="/test"
    >
      <ApiTestCard
        title="Search Wikipedia"
        description="Enter a search term to find related Wikipedia articles"
        onSubmit={handleSearch}
        isLoading={isLoading}
        error={error}
        results={
          results && results.length > 0 ? (
            <div>
              <h3 className={styles.apiTestResultsTitle}>Search Results</h3>
              {results.map((result) => (
                <div key={result.pageid} className={styles.resultItem}>
                  <h4 className={styles.resultTitle}>{result.title}</h4>
                  <p className={styles.resultContent} 
                     dangerouslySetInnerHTML={{ __html: result.snippet }}
                  />
                  <a 
                    href={`https://en.wikipedia.org/wiki/${encodeURIComponent(result.title)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={styles.resultLink}
                  >
                    Read more
                  </a>
                </div>
              ))}
            </div>
          ) : results && results.length === 0 ? (
            <p>No results found for "{query}"</p>
          ) : null
        }
      >
        <div className={styles.inputGroup}>
          <label htmlFor="search-query" className={styles.inputLabel}>
            Search Term
          </label>
          <input
            id="search-query"
            type="text"
            className={styles.textInput}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="e.g., Quantum computing, Solar system, Next.js"
          />
        </div>
        <button 
          type="submit" 
          className={styles.submitButton}
          disabled={isLoading || !query.trim()}
        >
          {isLoading ? 'Searching...' : 'Search'}
        </button>
      </ApiTestCard>
    </TestLayout>
  )
} 