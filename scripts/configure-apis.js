const fs = require('fs');
const path = require('path');

// Get APIs from command line arguments
const enabledApis = process.argv.slice(2);
console.log(`Enabling APIs: ${enabledApis.join(', ')}`);

// All available APIs
const allApis = [
  'replicate', 
  'anthropic', 
  'openai', 
  'deepgram', 
  'resend', 
  'mediawiki', 
  'react-pdf', 
  'stripe'
];

// Generate config file
const configContent = `// Auto-generated API configuration
export type ApiName = 
  | 'replicate' 
  | 'anthropic' 
  | 'openai' 
  | 'deepgram' 
  | 'resend' 
  | 'mediawiki' 
  | 'react-pdf' 
  | 'stripe';

export const ENABLED_APIS: Record<ApiName, boolean> = {
  replicate: ${enabledApis.includes('replicate')},
  anthropic: ${enabledApis.includes('anthropic')},
  openai: ${enabledApis.includes('openai')},
  deepgram: ${enabledApis.includes('deepgram')},
  resend: ${enabledApis.includes('resend')},
  mediawiki: ${enabledApis.includes('mediawiki')},
  'react-pdf': ${enabledApis.includes('react-pdf')},
  stripe: ${enabledApis.includes('stripe')}
};

export function isApiEnabled(api: ApiName): boolean {
  return ENABLED_APIS[api];
}
`;

// Write config file
fs.writeFileSync(
  path.join(__dirname, '..', 'src', 'config', 'api-config.ts'),
  configContent
);

// Optionally remove API code (uncomment if desired)
/*
allApis.forEach(api => {
  if (!enabledApis.includes(api)) {
    const apiPath = path.join(__dirname, '..', 'src', 'lib', 'api', api);
    if (fs.existsSync(apiPath)) {
      console.log(`Removing API: ${api}`);
      fs.rmSync(apiPath, { recursive: true, force: true });
    }
  }
});
*/

// Update package.json to remove unused dependencies
const packageJsonPath = path.join(__dirname, '..', 'package.json');
const packageJson = require(packageJsonPath);

// Map of APIs to their npm package names with versions
const apiPackages = {
  replicate: ['replicate'],
  anthropic: ['@anthropic-ai/sdk'],
  openai: ['openai'],
  deepgram: ['@deepgram/sdk'],
  resend: ['resend'],
  mediawiki: ['wikijs'],
  'react-pdf': ['@react-pdf/renderer'],
  stripe: ['stripe']
};

// Remove disabled API packages
const dependencies = packageJson.dependencies;
allApis.forEach(api => {
  if (!enabledApis.includes(api)) {
    apiPackages[api].forEach(pkg => {
      if (dependencies[pkg]) {
        console.log(`Removing package: ${pkg}`);
        delete dependencies[pkg];
      }
    });
  }
});

// Write updated package.json
fs.writeFileSync(
  packageJsonPath,
  JSON.stringify(packageJson, null, 2)
);

console.log('API configuration complete!'); 