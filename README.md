# BH Standard Repository

A Next.js template repository with integrated API support and enhanced authentication.

## Features

- Next.js App Router structure
- Centralized API configuration
- Configurable API selection via GitHub workflow
- Enhanced Supabase Authentication system with user roles
- API status display
- Hydration-safe components with two-phase rendering

## Core Technologies

- **Next.js**: 14.2.25 (Updated from 13.4.19)
- **React**: 18.2.0
- **TypeScript**: 5.4.2 (Updated from 5.1.6)
- **TailwindCSS**: 3.4.1 (Updated from 3.3.3)
- **ESLint**: 8.57.0 (Updated from 8.48.0)
- **Prettier**: 3.0.3
- **Supabase**: 2.39.8 (Updated from 2.33.1)
- **Upstash Redis**: 1.22.0 (Caching)
- **NextAuth.js**: 4.24.5 (Updated from 4.23.1)
- **Lucide React**: 0.436.0 (Icon library)
- **tailwind-animate**: Added for enhanced animations

## Project Structure

The codebase follows a logical organization to keep related functionality grouped together:

```
src/
├── app/                  # Next.js App Router structure
├── components/           # Shared React components
├── config/               # Application configuration
├── lib/                  # Library code
│   ├── api/              # API implementation code
│   ├── auth/             # Authentication and authorization
│   ├── clients/          # External service clients
│   │   ├── supabase/     # Supabase client
│   │   └── upstash/      # Upstash Redis client
│   └── utils/            # General utilities
└── types/                # Shared TypeScript type definitions
```

### Key Directories

- **api/**: Contains API implementations for each supported service (OpenAI, Anthropic, etc.)
- **auth/**: Authentication system built with Supabase
- **clients/**: External service client configurations (Supabase, Upstash)
- **utils/**: General utility functions
- **types/**: Shared TypeScript type definitions

## Recent Updates

- Updated Next.js to 14.2.25 with improved bundling and performance
- Fixed hydration issues using a two-phase rendering approach
- Implemented browser-safe API clients with proper client/server detection
- Updated all major dependencies to their latest versions
- Added webpack polyfills for cross-environment compatibility
- Enhanced error handling in API wrapper modules
- Reorganized project structure for better maintainability

## Optional APIs

This template includes several optional API integrations that can be enabled or disabled based on your needs:

### AI & Machine Learning
- **OpenAI**: 4.28.4 (Updated from 4.6.0) - Text generation and completions
- **Anthropic**: 0.36.3 - Claude AI models
- **Replicate**: 0.25.2 (Updated from 0.18.0) - Access to open-source AI models for images, audio, and more
- **ElevenLabs**: 1.1.0 - Text-to-speech API

### Media & Communication
- **Deepgram**: 3.11.2 (Updated from 2.4.0) - Speech-to-text transcription
- **Resend**: 2.0.0 (Updated from 1.1.0) - Email delivery service

### Documentation & Payments
- **React PDF**: 3.1.12 - PDF generation and rendering
- **Stripe**: 13.3.0 - Payment processing

### Information & Data
- **MediaWiki**: 6.4.1 (wikijs) - Access to Wikipedia and other wiki content

## Authentication System

This repository includes a complete authentication system built with Supabase Auth:

- Email/password signup and login
- User role management (regular users vs admin users)
- Session handling throughout the app
- Role-based access control components
- Testing interface for auth functionality

### Authentication Architecture

The authentication system is built with Next.js App Router best practices:

- **Client/Server Separation**: Authentication components properly separate client and server code
- **Lazy Loading**: Supabase client is lazily initialized to prevent hydration issues
- **Performance Optimized**: Components use React hooks like `useMemo` and `useCallback` to prevent unnecessary re-renders
- **Session Management**: Automatic token refresh and secure session handling
- **Role-based Access Control**: `RoleGuard` component for protecting routes based on user roles

### Setup Authentication

1. Create a Supabase project at [https://app.supabase.io/](https://app.supabase.io/)
2. Add your Supabase credentials to the environment variables (see `.env.example`)
3. Set up the database schema by running the SQL script in `src/app/api/supabase-migrations/profiles.sql`

For detailed instructions, see [Supabase Auth Documentation](./docs/supabase-auth.md)

### Using Authentication Components

#### Role-Based Access Control

```jsx
import { RoleGuard } from '@/lib/auth/RoleGuard';

// Protect content based on user role
function AdminPage() {
  return (
    <RoleGuard 
      allowedRoles={['admin']}
      redirectTo="/login"
    >
      <h1>Admin Content</h1>
      <p>Only admin users can see this</p>
    </RoleGuard>
  );
}
```

#### Authenticated API Requests

```jsx
import { authenticatedFetch } from '@/lib/auth/api-client';

async function fetchProtectedData() {
  const response = await authenticatedFetch('/api/protected-data');
  return response.json();
}
```

## API Support

This template includes support for multiple APIs that can be enabled/disabled as needed:

- OpenAI
- Anthropic
- Replicate
- Stripe
- Resend
- Deepgram
- Wiki.js
- React PDF
- Supabase

### Adding API Keys

Create a `.env.local` file in the root directory and add your API keys. See the `.env.example` file for all required environment variables.

### Configuring APIs

You can enable/disable APIs by editing the API configuration file at `src/config/api-config.ts`.

Alternatively, you can use the GitHub Actions workflow to configure APIs:

1. Go to the Actions tab in your GitHub repository
2. Select the "Configure APIs" workflow
3. Click "Run workflow"
4. Select the APIs you want to enable
5. Run the workflow

## Getting Started

1. Clone this repository
2. Install dependencies with `npm install`
3. Copy `.env.example` to `.env.local` and add your environment variables
4. Configure the desired APIs
5. Set up Supabase Auth (see instructions above)
6. Run the development server with `npm run dev`

## Documentation

Detailed documentation for various parts of the system:

- [Supabase Auth System](./docs/supabase-auth.md)
- [API Registry](./docs/api-registry.md) (TBD)
- [GitHub Workflow](./docs/github-workflow.md) (TBD)

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## Development

1. Create a `.env.local` file with your environment variables (see the Environment Variables section below)

2. Start the development server:
   ```bash
   npm run dev
   ```

3. Open [http://localhost:3000](http://localhost:3000) in your browser

## Environment Variables

Create a `.env.local` file in the root of your project with the variables for the APIs you're using:

### Core Services
```
# NextAuth
NEXTAUTH_SECRET=your-nextauth-secret
NEXTAUTH_URL=http://localhost:3000

# Supabase
SUPABASE_URL=your-supabase-url
SUPABASE_KEY=your-supabase-key

# Upstash Redis
UPSTASH_REDIS_URL=your-upstash-redis-url
UPSTASH_REDIS_TOKEN=your-upstash-redis-token
```

### OpenAI
```
OPENAI_API_KEY=your-openai-api-key
```

### Anthropic
```
ANTHROPIC_API_KEY=your-anthropic-api-key
```

### Replicate
```
REPLICATE_API_KEY=your-replicate-api-key
```

### Deepgram
```
DEEPGRAM_API_KEY=your-deepgram-api-key
```

### Resend
```
RESEND_API_KEY=your-resend-api-key
```

### ElevenLabs
```
ELEVENLABS_API_KEY=your-elevenlabs-api-key
```

### Stripe
```
STRIPE_SECRET_KEY=your-stripe-secret-key
STRIPE_PUBLISHABLE_KEY=your-stripe-publishable-key
STRIPE_WEBHOOK_SECRET=your-stripe-webhook-secret
```

## Deployment

The easiest way to deploy this application is with [Vercel](https://vercel.com), the platform created by the creators of Next.js.

### Deploying to Vercel

1. Create an account on [Vercel](https://vercel.com/signup)
2. Install the Vercel CLI:
   ```bash
   npm install -g vercel
   ```
3. Run the deployment command from your project directory:
   ```bash
   vercel
   ```
4. Follow the prompts to set up and deploy your project
5. Set up environment variables in the Vercel dashboard

Alternatively, you can connect your GitHub repository to Vercel for automatic deployments:

1. Push your code to GitHub
2. Import your repository on Vercel
3. Vercel will automatically detect that you're using Next.js
4. Configure your environment variables in the Vercel dashboard
5. Deploy your application

### Optimizing for Vercel Deployment

This project includes Vercel-specific optimizations:

- `vercel.json` configuration file for deployment settings
- Proper dynamic route handling with `export const dynamic = 'force-dynamic'` for API routes that use cookies or URL information
- Next.js Image component for optimized image loading
- Appropriate `next.config.js` settings for Vercel deployment with `output: 'standalone'`
- External packages configuration for server components
- Security headers and region configuration
- `.env.production` file template for production environment variables

### Setting Environment Variables on Vercel

When deploying to Vercel, you need to set up all required environment variables from `.env.example` in the Vercel dashboard:

1. Go to your project settings in Vercel
2. Navigate to the "Environment Variables" tab
3. Add all required environment variables
4. For sensitive API keys, use Vercel's encrypted environment variables

### Troubleshooting Vercel Deployment

If you encounter issues with your Vercel deployment:

1. Ensure all dynamic API routes are marked with `export const dynamic = 'force-dynamic'`
2. Check that all required environment variables are properly set in the Vercel dashboard
3. Verify your `next.config.js` includes necessary server component external packages
4. Review Vercel build logs for specific error messages

## License

This project is licensed under the MIT License - see below for details:

```
MIT License

Copyright (c) 2025

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.