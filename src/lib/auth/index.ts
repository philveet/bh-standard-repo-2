// This is a basic setup, you'll need to expand based on your actual auth providers
import { Session } from 'next-auth';
import { JWT } from 'next-auth/jwt';

// Extended Session type with user.id
interface ExtendedSession extends Session {
  user: {
    name?: string | null;
    email?: string | null;
    image?: string | null;
    id?: string;
  }
}

export const authOptions = {
  providers: [
    // Add your providers here
  ],
  session: {
    strategy: "jwt",
  },
  callbacks: {
    async session({ session, token }: { session: Session; token: JWT }): Promise<ExtendedSession> {
      // Cast to our extended type
      const extendedSession = session as ExtendedSession;
      
      if (token.sub) {
        extendedSession.user.id = token.sub;
      }
      
      return extendedSession;
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
}; 