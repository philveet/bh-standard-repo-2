import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

export async function GET(req: NextRequest) {
  const url = new URL(req.url);
  const token = url.searchParams.get("token");
  const email = url.searchParams.get("email");

  if (!token || !email) {
    return NextResponse.redirect(new URL("/auth/error?error=MissingTokenOrEmail", req.url));
  }

  try {
    // Find verification token
    const { data: verificationToken, error } = await supabase
      .from("auth.verification_tokens")
      .select("*")
      .eq("identifier", email)
      .eq("token", token)
      .single();

    if (error || !verificationToken) {
      return NextResponse.redirect(new URL("/auth/error?error=InvalidToken", req.url));
    }

    // Check if token has expired
    if (new Date(verificationToken.expires) < new Date()) {
      await supabase
        .from("auth.verification_tokens")
        .delete()
        .eq("identifier", email)
        .eq("token", token);
      
      return NextResponse.redirect(new URL("/auth/error?error=TokenExpired", req.url));
    }

    // Mark email as verified
    await supabase
      .from("auth.users")
      .update({ email_verified: new Date() })
      .eq("email", email);

    // Delete the used token
    await supabase
      .from("auth.verification_tokens")
      .delete()
      .eq("identifier", email)
      .eq("token", token);

    return NextResponse.redirect(new URL("/auth/signin?verified=true", req.url));
  } catch (error) {
    console.error("Verification error:", error);
    return NextResponse.redirect(new URL("/auth/error?error=InternalServerError", req.url));
  }
} 