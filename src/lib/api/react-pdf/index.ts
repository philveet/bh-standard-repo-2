import { isApiEnabled } from '@/config/api-config';

export function checkPdfEnabled() {
  if (!isApiEnabled('react-pdf')) {
    throw new Error('React-PDF is not enabled in this project');
  }
  
  return true;
}

// This is mostly used client-side, so we just provide a checker function
// Actual PDF components would be created in your React components
export const PdfUtilities = {
  checkEnabled: checkPdfEnabled,
  // Add any server-side utilities here if needed
}; 