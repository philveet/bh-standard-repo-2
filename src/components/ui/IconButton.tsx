import React from 'react';
import { LucideProps } from '@/lib/icons';

interface IconButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  icon: React.FC<LucideProps>;
  iconPosition?: 'left' | 'right';
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  children?: React.ReactNode;
}

/**
 * IconButton component that includes a Lucide icon
 * 
 * @example
 * import { IconButton } from '@/components/ui/IconButton';
 * import { Search } from '@/lib/icons';
 * 
 * <IconButton icon={Search} variant="primary">Search</IconButton>
 */
export const IconButton: React.FC<IconButtonProps> = ({
  icon: Icon,
  iconPosition = 'left',
  variant = 'primary',
  size = 'md',
  children,
  className = '',
  ...props
}) => {
  // Base styles
  const baseStyles = 'inline-flex items-center justify-center font-medium rounded-md transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500';
  
  // Variant styles
  const variantStyles = {
    primary: 'bg-blue-600 text-white hover:bg-blue-700',
    secondary: 'bg-gray-200 text-gray-900 hover:bg-gray-300 dark:bg-gray-700 dark:text-gray-100 dark:hover:bg-gray-600',
    outline: 'border border-gray-300 text-gray-700 hover:bg-gray-50 dark:border-gray-600 dark:text-gray-200 dark:hover:bg-gray-800',
    ghost: 'text-gray-700 hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-gray-800',
  };
  
  // Size styles
  const sizeStyles = {
    sm: 'text-xs px-2.5 py-1.5 gap-1',
    md: 'text-sm px-4 py-2 gap-2',
    lg: 'text-base px-6 py-3 gap-3',
  };
  
  // Icon sizes
  const iconSizes = {
    sm: { width: 14, height: 14 },
    md: { width: 16, height: 16 },
    lg: { width: 20, height: 20 },
  };
  
  return (
    <button
      className={`${baseStyles} ${variantStyles[variant]} ${sizeStyles[size]} ${className}`}
      {...props}
    >
      {iconPosition === 'left' && (
        <Icon {...iconSizes[size]} />
      )}
      {children}
      {iconPosition === 'right' && (
        <Icon {...iconSizes[size]} />
      )}
    </button>
  );
}; 