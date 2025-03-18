'use client'

import React from 'react'
import Link from 'next/link'
import { TestLayout } from '@/components/test/TestLayout'

// List of available API tests
const apiTests = [
  { 
    name: 'MediaWiki', 
    path: '/test/mediawiki', 
    description: 'Search for Wikipedia articles and view their content' 
  },
  // More API tests will be added here as they are implemented
  // { 
  //   name: 'OpenAI', 
  //   path: '/test/openai', 
  //   description: 'Test text generation and completions' 
  // },
  // { 
  //   name: 'Anthropic', 
  //   path: '/test/anthropic', 
  //   description: 'Test Claude AI models for text generation' 
  // },
]

export default function TestHubPage() {
  return (
    <TestLayout 
      title="API Testing Hub" 
      description="Test and explore the configured APIs in this project"
      backLink="/"
    >
      <div className="test-grid">
        {apiTests.map((test) => (
          <Link href={test.path} key={test.path} className="test-card">
            <h3 className="test-card-title">{test.name}</h3>
            <p className="test-card-description">{test.description}</p>
            <span className="test-card-cta">Test &rarr;</span>
          </Link>
        ))}
      </div>
    </TestLayout>
  )
} 