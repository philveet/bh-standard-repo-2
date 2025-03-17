// This is a basic setup, you'll need to expand based on your actual auth providers
import { NextAuthOptions } from "next-auth";
import { Session } from 'next-auth';
import { JWT } from 'next-auth/jwt';
import CredentialsProvider from "next-auth/providers/credentials";
import { SupabaseAdapter } from "./supabase-adapter";
import { supabase } from "@/lib/supabase";
import { compare, hash } from "bcrypt";

// Extended Session type with user.id
export interface ExtendedSession extends Session {
  user: {
    id: string;
    name?: string | null;
    email?: string | null;
    image?: string | null;
    role?: string;
  }
}

export const authOptions: NextAuthOptions = {
  adapter: SupabaseAdapter(),
  providers: [
    CredentialsProvider({
      name: "Email",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null;
        }

        // Find user by email
        const { data: user, error } = await supabase
          .from("auth.users")
          .select("*")
          .eq("email", credentials.email)
          .single();

        if (error || !user) {
          return null;
        }

        // Verify password
        const isValidPassword = await compare(credentials.password, user.password);
        
        if (!isValidPassword) {
          return null;
        }

        return {
          id: user.id,
          email: user.email,
          name: user.name,
          image: user.image,
          role: user.role || 'user',
        };
      }
    })
  ],
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  callbacks: {
    async jwt({ token, user }) {
      // Add user id to token when user signs in
      if (user) {
        token.sub = user.id;
        // Include role in the token if available
        const userData = user as any;
        if (userData.role) {
          token.role = userData.role;
        }
      }
      return token;
    },
    async session({ session, token }): Promise<ExtendedSession> {
      // Cast to our extended type
      const extendedSession = session as ExtendedSession;
      
      if (token.sub) {
        extendedSession.user.id = token.sub;
      }
      
      // Include role in the session
      if (token.role) {
        extendedSession.user.role = token.role as string;
      }
      
      return extendedSession;
    }
  },
  pages: {
    signIn: '/auth/signin',
    error: '/auth/error',
    verifyRequest: '/auth/verify-request',
    newUser: '/auth/signup',
  },
  secret: process.env.NEXTAUTH_SECRET,
}; 