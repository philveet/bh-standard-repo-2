const fs = require('fs');
const path = require('path');

// Since we can't directly import TypeScript, we'll manually extract the API registry data
// This should mirror the structure in src/config/api-registry.ts
const API_REGISTRY = {
  replicate: {
    name: 'Replicate',
    packageName: 'replicate',
    packageVersion: '0.18.0',
  },
  anthropic: {
    name: 'Anthropic',
    packageName: '@anthropic-ai/sdk',
    packageVersion: '0.36.3',
  },
  openai: {
    name: 'OpenAI',
    packageName: 'openai',
    packageVersion: '4.6.0',
  },
  deepgram: {
    name: 'Deepgram',
    packageName: '@deepgram/sdk',
    packageVersion: '2.4.0',
  },
  resend: {
    name: 'Resend',
    packageName: 'resend',
    packageVersion: '1.1.0',
  },
  mediawiki: {
    name: 'MediaWiki',
    packageName: 'wikijs',
    packageVersion: '6.4.1',
  },
  'react-pdf': {
    name: 'React PDF',
    packageName: '@react-pdf/renderer',
    packageVersion: '3.1.12',
  },
  stripe: {
    name: 'Stripe',
    packageName: 'stripe',
    packageVersion: '13.3.0',
  },
  elevenlabs: {
    name: 'ElevenLabs',
    packageName: 'elevenlabs-node',
    packageVersion: '1.1.1',
  },
};

// Create the workflow YAML content
const workflowTemplate = `name: Configure APIs

on:
  workflow_dispatch:
    inputs:
${Object.entries(API_REGISTRY).map(([key, api]) => `      ${key}:
        description: 'Include ${api.name} API'
        type: boolean
        default: false`).join('\n')}
      remove_unused:
        description: 'Remove unused API code'
        type: boolean
        default: true

jobs:
  configure:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout repository
        uses: actions/checkout@v3
      
      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'
      
      - name: Prepare API list
        id: prepare
        run: |
          APIs=""
${Object.keys(API_REGISTRY).map(key => `          if [ "\${{ github.event.inputs.${key} }}" == "true" ]; then
            APIs="$APIs ${key}"
          fi`).join('\n')}
          echo "apis=$APIs" >> \$GITHUB_OUTPUT
      
      - name: Configure APIs
        run: |
          node scripts/configure-apis.js \${{ steps.prepare.outputs.apis }}
      
      - name: Update package.json with fixed versions
        run: |
${Object.entries(API_REGISTRY).map(([key, api]) => `          if [ "\${{ github.event.inputs.${key} }}" == "true" ]; then
            npm install ${api.packageName}@${api.packageVersion}
          fi`).join('\n')}
      
      - name: Commit changes
        run: |
          git config --local user.email "action@github.com"
          git config --local user.name "GitHub Action"
          git add .
          git commit -m "Configure with selected APIs: \${{ steps.prepare.outputs.apis }}"
          git push
`;

// Ensure the workflows directory exists
const workflowsDir = path.join(__dirname, '..', '.github', 'workflows');
if (!fs.existsSync(workflowsDir)) {
  fs.mkdirSync(workflowsDir, { recursive: true });
}

// Write the workflow file
fs.writeFileSync(
  path.join(workflowsDir, 'configure-apis.yml'),
  workflowTemplate
);

console.log('GitHub workflow file generated successfully!'); 