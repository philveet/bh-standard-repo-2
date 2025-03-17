# BH Standard Repository

A modular Next.js application template with optional API integrations. This template allows you to select which third-party APIs you want to include in your project, making it easy to build applications that use AI, email, payment processing, document generation, and more.

## Core Technologies

- **Next.js**: 13.4.19
- **React**: 18.2.0
- **TypeScript**: 5.1.6
- **TailwindCSS**: 3.3.3
- **ESLint**: 8.48.0
- **Prettier**: 3.0.3
- **Supabase**: 2.33.1 (Database)
- **Upstash Redis**: 1.22.0 (Caching)
- **NextAuth.js**: 4.23.1 (Authentication)
- **Lucide React**: 0.436.0 (Icon library)

## Optional APIs

This template includes several optional API integrations that can be enabled or disabled based on your needs:

### AI & Machine Learning
- **OpenAI**: 4.6.0 - Text generation and completions
- **Anthropic**: 0.36.3 - Claude AI models
- **Replicate**: 0.18.0 - Access to open-source AI models for images, audio, and more
- **ElevenLabs**: 1.1.1 - Text-to-speech API

### Media & Communication
- **Deepgram**: 2.4.0 - Speech-to-text transcription
- **Resend**: 1.1.0 - Email delivery service

### Documentation & Payments
- **React PDF**: 3.1.12 - PDF generation and rendering
- **Stripe**: 13.3.0 - Payment processing

### Information & Data
- **MediaWiki**: 6.4.1 (wikijs) - Access to Wikipedia and other wiki content

## Authentication System

This repository includes a complete email-based authentication system using NextAuth.js, Supabase, and Resend. The system provides:

- Email/password signup and login
- Email verification
- Password reset functionality
- Protected routes
- Session management

### Authentication Setup

Follow these steps to set up the authentication system:

1. **Create a Supabase Database**:
   - Sign up at [Supabase](https://supabase.com/) and create a new project
   - Use the SQL schema in `src/db/schema.sql` to set up the required tables
   - Add the Supabase URL and key to your `.env.local` file:
     ```
     SUPABASE_URL=your-supabase-url
     SUPABASE_KEY=your-supabase-key
     ```

2. **Configure Resend for Email Sending**:
   - Sign up at [Resend](https://resend.com/) and get your API key
   - Add the Resend API key to your `.env.local` file:
     ```
     RESEND_API_KEY=your-resend-api-key
     ```
   - Update the sender email in `src/lib/email/index.ts` to match your verified domain

3. **Set up NextAuth.js**:
   - Generate a secure random string for the NextAuth secret
   - Add the following to your `.env.local` file:
     ```
     NEXTAUTH_SECRET=your-generated-secret
     NEXTAUTH_URL=http://localhost:3000 # Change in production
     ```

### Authentication Routes

The authentication system includes the following routes:

- `/auth/signin` - Sign in page
- `/auth/signup` - Sign up page
- `/auth/verify-request` - Verification email sent page
- `/auth/reset-password` - Password reset page
- `/auth/forgot-password` - Request password reset page
- `/auth/error` - Error page for authentication issues
- `/dashboard` - Example protected route

### Protected Routes

To create a protected route that requires authentication, use the `ProtectedRoute` component:

```tsx
"use client";

import ProtectedRoute from "@/components/auth/ProtectedRoute";

export default function SecurePage() {
  return (
    <ProtectedRoute>
      <div>
        This content is only visible to authenticated users
      </div>
    </ProtectedRoute>
  );
}
```

You can also access the user data in client components using the `useAuth` hook:

```tsx
"use client";

import { useAuth } from "@/lib/auth/session";

export default function UserProfile() {
  const { user, isAuthenticated, isLoading } = useAuth();
  
  if (isLoading) return <div>Loading...</div>;
  if (!isAuthenticated) return <div>Not authenticated</div>;
  
  return <div>Hello, {user.name || user.email}</div>;
}
```

## Getting Started

### Option 1: Use as a Template (Recommended)

1. Click the "Use this template" button at the top of this repository
2. Give your new repository a name
3. Clone your new repository locally:
   ```bash
   git clone https://github.com/yourusername/your-repo-name.git
   cd your-repo-name
   ```

4. Install dependencies:
   ```bash
   npm install
   ```

5. Configure the APIs you want to use:
   ```bash
   # Enable only specific APIs (e.g., OpenAI, Anthropic, and Stripe)
   npm run configure-apis -- openai anthropic stripe
   
   # Or enable all APIs
   npm run configure-apis -- replicate anthropic openai deepgram resend mediawiki react-pdf stripe elevenlabs
   ```

### Option 2: Manual Clone

1. Clone this repository:
   ```bash
   git clone https://github.com/yourusername/bh-standard-repo.git
   cd bh-standard-repo
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Configure the APIs you want to use (see step 5 above)

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

Alternatively, you can connect your GitHub repository to Vercel for automatic deployments.

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