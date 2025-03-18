'use client'

import React from 'react'
import Link from 'next/link'
import { TestLayout } from '@/components/test/TestLayout'
import styles from '@/styles/test.module.css'

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
      <div className={styles.testGrid}>
        {apiTests.map((test) => (
          <Link href={test.path} key={test.path} className={styles.testCard}>
            <h3 className={styles.testCardTitle}>{test.name}</h3>
            <p className={styles.testCardDescription}>{test.description}</p>
            <span className={styles.testCardCta}>Test &rarr;</span>
          </Link>
        ))}
      </div>
    </TestLayout>
  )
} 