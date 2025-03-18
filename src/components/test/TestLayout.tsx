'use client'

import React, { ReactNode } from 'react'
import Link from 'next/link'
import { ArrowLeft, Home } from 'lucide-react'
import styles from '@/styles/test.module.css'

interface TestLayoutProps {
  children: ReactNode
  title: string
  description?: string
  backLink?: string
}

export function TestLayout({ 
  children, 
  title, 
  description = '', 
  backLink = '/test'
}: TestLayoutProps) {
  return (
    <div className={styles.testContainer}>
      <header className={styles.testHeader}>
        <div className={styles.navLinks}>
          <Link href={backLink} className={styles.backLink}>
            <ArrowLeft size={18} />
            <span>Back</span>
          </Link>
          <Link href="/" className={styles.homeLink}>
            <Home size={18} />
            <span>Home</span>
          </Link>
        </div>
        <h1 className={styles.testTitle}>{title}</h1>
        {description && <p className={styles.testDescription}>{description}</p>}
      </header>
      <main className={styles.testContent}>
        {children}
      </main>
    </div>
  )
} 