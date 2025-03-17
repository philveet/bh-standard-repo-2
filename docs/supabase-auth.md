# Enhanced Supabase Authentication System

This document provides detailed instructions for managing the Supabase Authentication system integrated into this project.

## Enhanced Implementation Features

Our authentication system provides several advanced features beyond basic Supabase Auth:

1. **Optimized for Next.js App Router**: Properly separates client and server components
2. **Lazy Loading**: Uses lazy initialization of the Supabase client to prevent hydration issues
3. **Performance Optimized**: Implements React's `useMemo` and `useCallback` for efficient re-rendering
4. **Role-Based Access Control**: Includes a `RoleGuard` component for protecting routes by user role
5. **Session Management**: Automatic token refresh and secure handling of auth state
6. **API Integration**: Utilities for making authenticated API requests

## Setup and Configuration

### Project Configuration

1. **Create a Supabase project**:
   - Go to [Supabase](https://app.supabase.io/)
   - Sign up or log in
   - Create a new project

2. **Get API keys**:
   - In your project dashboard, go to Project Settings > API
   - Copy the `URL` and `anon` public key
   - Add these to your environment variables:
     ```
     NEXT_PUBLIC_SUPABASE_URL=your-project-url
     NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
     ```

3. **Create database schema**:
   - Go to the SQL Editor in your Supabase dashboard
   - Execute the SQL script found in `src/app/api/supabase-migrations/profiles.sql`
   - This creates the profiles table with roles and sets up Row Level Security

## Key Components

### 1. Supabase Client (`src/lib/supabase/client.ts`)

- Uses lazy initialization pattern to prevent hydration issues
- Implements a singleton pattern for the Supabase client
- Provides proper error handling for missing credentials

```typescript
import { getSupabaseClient } from '@/lib/supabase/client';

// Get the singleton instance
const supabase = getSupabaseClient();
```

### 2. Auth Context (`src/lib/auth/AuthContext.tsx`)

- Implements React Context API for app-wide auth state
- Uses optimized hooks for performance
- Handles session management and user roles
- Includes automatic token refresh

```typescript
import { useAuth } from '@/lib/auth/AuthContext';

function MyComponent() {
  const { user, userRole, signIn, signOut } = useAuth();
  // Use auth state and functions
}
```

### 3. Role Guard (`src/lib/auth/RoleGuard.tsx`)

- Protects content based on user roles
- Supports redirection for unauthorized access
- Customizable fallback content

```typescript
import { RoleGuard } from '@/lib/auth/RoleGuard';

function AdminPage() {
  return (
    <RoleGuard allowedRoles={['admin']} redirectTo="/login">
      <h1>Admin Dashboard</h1>
      {/* Admin content */}
    </RoleGuard>
  );
}
```

### 4. API Client (`src/lib/auth/api-client.ts`)

- Utilities for making authenticated API requests
- Session validation helpers
- Role checking functions

```typescript
import { authenticatedFetch, hasRole } from '@/lib/auth/api-client';

async function fetchAdminData() {
  // Check if user is admin
  const isAdmin = await hasRole('admin');
  if (!isAdmin) return null;
  
  // Make authenticated request
  const response = await authenticatedFetch('/api/admin/data');
  return response.json();
}
```

### 5. Auth API Routes

- `/api/auth/session` - Get current session information
- `/api/auth/callback` - Handle OAuth and email confirmation redirects

## Authentication Settings

### Email Authentication

1. **Configure email provider**:
   - Go to Authentication > Email Templates
   - If using a custom SMTP server:
     - Go to Authentication > Email Settings
     - Configure your SMTP settings

2. **Email confirmation settings**:
   - Go to Authentication > Providers > Email
   - Enable/disable "Confirm email" based on your needs
   - Enable/disable "Double confirm email" for additional security

### Password Reset

1. **Enable password resets**:
   - Go to Authentication > URL Configuration
   - Set the Site URL (should match your deployed app URL)
   - Set redirect URLs for password resets

2. **Customize password reset email**:
   - Go to Authentication > Email Templates
   - Edit the "Reset Password" template

## User Management

### Creating and Managing Users

1. **View all users**:
   - Go to Authentication > Users
   - Here you can see all registered users
   - Click on any user to see details, reset their password, or delete their account

2. **Creating admin users**:
   - First, create a regular user through the app's sign-up process
   - Go to Table Editor > profiles
   - Find the user by email
   - Change their `role` from `user` to `admin`
   - Click Save

3. **Bulk user management**:
   - For advanced operations, you can use Supabase Management API
   - See [Supabase Auth Admin API](https://supabase.com/docs/reference/javascript/auth-admin-listusers)

## Row Level Security (RLS)

The project uses Row Level Security to protect user data:

- Users can only view and edit their own profiles
- Users cannot change their role to admin
- Admin users can view and edit all profiles

To modify these policies:
1. Go to Database > Tables > profiles
2. Select the "Policies" tab
3. Edit existing policies or create new ones

## Email Templates

Customize email templates for:
- Email confirmations
- Password resets
- Magic link login (if enabled)

Go to Authentication > Email Templates to edit these.

## Testing

The application includes a testing panel at the bottom of the home page where you can:
- Sign up new users
- Login with existing accounts
- View authentication status
- See user roles

## Troubleshooting

Common issues:

1. **Hydration errors**:
   - Check that you're using `'use client'` directive in components that use authentication
   - Ensure the Auth Provider is correctly set up in your app layout

2. **Email delivery problems**:
   - Check spam folders
   - Verify SMTP settings
   - Test emails in Supabase dashboard

3. **Role changes not reflecting**:
   - Log out and log back in to refresh session
   - Clear the browser cache
   - Check for errors in the browser console

4. **Unauthorized errors**:
   - Ensure RLS policies are properly set up
   - Check that users have the correct roles
   - Verify that tokens are being properly passed in API requests 