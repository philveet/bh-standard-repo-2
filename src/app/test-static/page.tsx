import styles from './test.module.css'
import Head from 'next/head'

export default function TestPage() {
  return (
    <div className={styles.testContainer}>
      <head>
        <link rel="shortcut icon" href="/favicon.ico" />
      </head>
      <h1>Static Asset Test</h1>
      <p>This page tests if static assets are loading correctly</p>
      <div>
        <p>Next.js SVG (from public directory):</p>
        <img src="/next.svg" alt="Next.js Logo" width={100} height={24} />
      </div>
      <div style={{ marginTop: '20px' }}>
        <p>Favicon should be visible in the browser tab</p>
      </div>
      <div style={{ marginTop: '20px' }}>
        <p>Direct link to favicon: <a href="/favicon.ico" target="_blank">favicon.ico</a></p>
      </div>
    </div>
  )
} 