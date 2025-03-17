import React from 'react';
import { IconButton } from '@/components/ui/IconButton';
import { Search, Download, Plus, ArrowRight } from '@/lib/icons';

/**
 * Example component demonstrating the usage of IconButton with Lucide icons
 */
export const IconButtonExample: React.FC = () => {
  return (
    <div className="p-6 bg-white dark:bg-gray-800 rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-6">Icon Button Examples</h2>
      
      <div className="space-y-6">
        <div className="space-y-2">
          <h3 className="text-lg font-medium">Variants</h3>
          <div className="flex flex-wrap gap-3">
            <IconButton icon={Search} variant="primary">Search</IconButton>
            <IconButton icon={Download} variant="secondary">Download</IconButton>
            <IconButton icon={Plus} variant="outline">Add New</IconButton>
            <IconButton icon={ArrowRight} variant="ghost">Next</IconButton>
          </div>
        </div>
        
        <div className="space-y-2">
          <h3 className="text-lg font-medium">Sizes</h3>
          <div className="flex flex-wrap gap-3 items-center">
            <IconButton icon={Search} size="sm">Small</IconButton>
            <IconButton icon={Search} size="md">Medium</IconButton>
            <IconButton icon={Search} size="lg">Large</IconButton>
          </div>
        </div>
        
        <div className="space-y-2">
          <h3 className="text-lg font-medium">Icon Positions</h3>
          <div className="flex flex-wrap gap-3">
            <IconButton icon={ArrowRight} iconPosition="left">Left Icon</IconButton>
            <IconButton icon={ArrowRight} iconPosition="right">Right Icon</IconButton>
          </div>
        </div>
        
        <div className="space-y-2">
          <h3 className="text-lg font-medium">Icon Only</h3>
          <div className="flex flex-wrap gap-3">
            <IconButton 
              icon={Search} 
              aria-label="Search" 
              className="rounded-full w-10 h-10 p-0"
            />
            <IconButton 
              icon={Plus} 
              variant="secondary" 
              aria-label="Add" 
              className="rounded-full w-10 h-10 p-0"
            />
            <IconButton 
              icon={Download} 
              variant="outline" 
              aria-label="Download" 
              className="rounded-full w-10 h-10 p-0"
            />
          </div>
        </div>
      </div>
    </div>
  );
}; 