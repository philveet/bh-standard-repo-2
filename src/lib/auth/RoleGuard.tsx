'use client'

import { ReactNode, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';
import { useRouter } from 'next/navigation';

interface RoleGuardProps {
  children: ReactNode;
  allowedRoles: string[];
  fallback?: ReactNode;
  redirectTo?: string;
}

/**
 * Component that restricts access based on user role
 * 
 * @param children Content to render if user has permission
 * @param allowedRoles Array of roles that are allowed to access the content
 * @param fallback Optional content to show if user doesn't have permission
 * @param redirectTo Optional path to redirect to if user doesn't have permission
 */
export function RoleGuard({ 
  children, 
  allowedRoles,
  fallback = <div>Access denied. You don't have permission to view this content.</div>,
  redirectTo
}: RoleGuardProps) {
  const { userRole, loading, user } = useAuth();
  const router = useRouter();
  const [hasAccess, setHasAccess] = useState<boolean | null>(null);
  
  useEffect(() => {
    // If still loading auth state, wait
    if (loading) return;
    
    // If not authenticated, no access
    if (!user) {
      setHasAccess(false);
      if (redirectTo) {
        router.push(redirectTo);
      }
      return;
    }
    
    // Check if user has one of the allowed roles
    const hasRole = userRole && allowedRoles.includes(userRole);
    setHasAccess(!!hasRole);
    
    // Redirect if specified and no access
    if (!hasRole && redirectTo) {
      router.push(redirectTo);
    }
  }, [loading, user, userRole, allowedRoles, redirectTo, router]);
  
  // Show loading state while checking permissions
  if (loading || hasAccess === null) {
    return <div>Checking permissions...</div>;
  }
  
  // Show children if has access, otherwise show fallback
  return hasAccess ? <>{children}</> : <>{fallback}</>;
} 