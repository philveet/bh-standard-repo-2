import { useSession } from "next-auth/react";
import { ExtendedSession } from "./index";

export function useAuth() {
  const { data: session, status } = useSession();
  const extendedSession = session as ExtendedSession | null;
  
  return {
    session: extendedSession,
    isAuthenticated: status === "authenticated",
    isLoading: status === "loading",
    userId: extendedSession?.user.id,
    user: extendedSession?.user,
  };
} 