'use client'

import React, { ReactNode, useState } from 'react'
import styles from '@/styles/test.module.css'

interface ApiTestCardProps {
  title: string
  description?: string
  children: ReactNode
  onSubmit?: (e: React.FormEvent) => void | Promise<void>
  isLoading?: boolean
  error?: string | null
  results?: ReactNode
}

export function ApiTestCard({
  title,
  description,
  children,
  onSubmit,
  isLoading = false,
  error = null,
  results = null
}: ApiTestCardProps) {
  return (
    <div className={styles.apiTestCard}>
      <div className={styles.apiTestCardHeader}>
        <h2 className={styles.apiTestCardTitle}>{title}</h2>
        {description && <p className={styles.apiTestCardDescription}>{description}</p>}
      </div>
      
      <form 
        className={styles.apiTestForm} 
        onSubmit={(e) => {
          e.preventDefault()
          if (onSubmit) onSubmit(e)
        }}
      >
        <div className={styles.apiTestInputs}>
          {children}
        </div>
        
        {error && (
          <div className={styles.apiTestError}>
            <p>{error}</p>
          </div>
        )}
        
        {isLoading && (
          <div className={styles.apiTestLoading}>
            <div className={styles.spinner}></div>
            <p>Processing request...</p>
          </div>
        )}
        
        {results && !isLoading && (
          <div className={styles.apiTestResults}>
            {results}
          </div>
        )}
      </form>
    </div>
  )
} 