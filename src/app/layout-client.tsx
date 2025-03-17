'use client'

import { AuthProvider } from '../lib/auth/AuthContext';

export function AuthProviderWrapper({ children }: { children: React.ReactNode }) {
  return <AuthProvider>{children}</AuthProvider>
} 