import { Adapter } from "next-auth/adapters";
import { supabase } from "@/lib/supabase";
import { createHash } from "crypto";

interface UserWithSession {
  user: {
    id: string;
    email: string;
    name?: string;
    image?: string;
    email_verified?: Date;
  };
  expires: Date;
  session_token: string;
  user_id: string;
}

export function SupabaseAdapter(): Adapter {
  return {
    async createUser(user) {
      const { data, error } = await supabase
        .from("auth.users")
        .insert({
          email: user.email,
          name: user.name,
          image: user.image,
        })
        .select("*")
        .single();

      if (error) throw error;
      return data;
    },

    async getUser(id) {
      const { data, error } = await supabase
        .from("auth.users")
        .select("*")
        .eq("id", id)
        .single();

      if (error) return null;
      return data;
    },

    async getUserByEmail(email) {
      const { data, error } = await supabase
        .from("auth.users")
        .select("*")
        .eq("email", email)
        .single();

      if (error) return null;
      return data;
    },

    async getUserByAccount({ provider, providerAccountId }) {
      const { data, error } = await supabase
        .from("auth.accounts")
        .select("*")
        .eq("provider", provider)
        .eq("provider_account_id", providerAccountId)
        .single();

      if (error || !data) return null;

      const { data: userData, error: userError } = await supabase
        .from("auth.users")
        .select("*")
        .eq("id", data.user_id)
        .single();

      if (userError) return null;
      return userData;
    },

    async updateUser(user) {
      const { data, error } = await supabase
        .from("auth.users")
        .update({
          name: user.name,
          email: user.email,
          image: user.image,
          email_verified: user.emailVerified,
          updated_at: new Date(),
        })
        .eq("id", user.id)
        .select("*")
        .single();

      if (error) throw error;
      return data;
    },

    async deleteUser(userId) {
      const { error } = await supabase
        .from("auth.users")
        .delete()
        .eq("id", userId);

      if (error) throw error;
    },

    async linkAccount(account) {
      const { data, error } = await supabase
        .from("auth.accounts")
        .insert({
          user_id: account.userId,
          type: account.type,
          provider: account.provider,
          provider_account_id: account.providerAccountId,
          refresh_token: account.refresh_token,
          access_token: account.access_token,
          expires_at: account.expires_at,
          token_type: account.token_type,
          scope: account.scope,
          id_token: account.id_token,
          session_state: account.session_state,
        })
        .select("*")
        .single();

      if (error) throw error;
      return data;
    },

    async unlinkAccount({ provider, providerAccountId }) {
      const { error } = await supabase
        .from("auth.accounts")
        .delete()
        .eq("provider", provider)
        .eq("provider_account_id", providerAccountId);

      if (error) throw error;
    },

    async createSession({ sessionToken, userId, expires }) {
      const { data, error } = await supabase
        .from("auth.sessions")
        .insert({
          user_id: userId,
          expires,
          session_token: sessionToken,
        })
        .select("*")
        .single();

      if (error) throw error;
      return data;
    },

    async getSessionAndUser(sessionToken) {
      const { data, error } = await supabase
        .from("auth.sessions")
        .select("*, user_id")
        .eq("session_token", sessionToken)
        .single();

      if (error || !data || new Date(data.expires) < new Date()) {
        return null;
      }

      const { data: userData, error: userError } = await supabase
        .from("auth.users")
        .select("*")
        .eq("id", data.user_id)
        .single();

      if (userError) return null;

      return {
        user: userData,
        session: {
          sessionToken: data.session_token,
          userId: data.user_id,
          expires: data.expires
        }
      };
    },

    async updateSession({ sessionToken, expires, userId }) {
      const { data, error } = await supabase
        .from("auth.sessions")
        .update({
          expires,
          user_id: userId,
        })
        .eq("session_token", sessionToken)
        .select("*")
        .single();

      if (error) throw error;
      return data;
    },

    async deleteSession(sessionToken) {
      const { error } = await supabase
        .from("auth.sessions")
        .delete()
        .eq("session_token", sessionToken);

      if (error) throw error;
    },

    async createVerificationToken({ identifier, expires, token }) {
      const { data, error } = await supabase
        .from("auth.verification_tokens")
        .insert({
          identifier,
          token,
          expires,
        })
        .select("*")
        .single();

      if (error) throw error;
      return data;
    },

    async useVerificationToken({ identifier, token }) {
      const { data, error } = await supabase
        .from("auth.verification_tokens")
        .select("*")
        .eq("identifier", identifier)
        .eq("token", token)
        .single();

      if (error || !data) return null;

      // Delete the token
      await supabase
        .from("auth.verification_tokens")
        .delete()
        .eq("identifier", identifier)
        .eq("token", token);

      return data;
    },
  };
} 