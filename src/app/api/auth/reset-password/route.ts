import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import { sendPasswordResetEmail } from "@/lib/email";
import crypto from "crypto";
import { hash } from "bcrypt";

export async function POST(req: NextRequest) {
  try {
    const { email } = await req.json();

    if (!email) {
      return NextResponse.json(
        { error: "Email is required" },
        { status: 400 }
      );
    }

    // Check if user exists
    const { data: user, error } = await supabase
      .from("auth.users")
      .select("*")
      .eq("email", email)
      .single();

    if (error || !user) {
      // Don't reveal if user exists for security reasons
      return NextResponse.json(
        { message: "If an account with that email exists, we've sent a password reset link" },
        { status: 200 }
      );
    }

    // Create reset token
    const token = crypto.randomBytes(32).toString("hex");
    const expires = new Date(Date.now() + 1 * 60 * 60 * 1000); // 1 hour

    await supabase.from("auth.verification_tokens").insert({
      identifier: email,
      token,
      expires,
    });

    // Send password reset email
    await sendPasswordResetEmail(email, token);

    return NextResponse.json(
      { message: "Password reset link sent to your email" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Reset password request error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function PUT(req: NextRequest) {
  try {
    const { email, token, password } = await req.json();

    if (!email || !token || !password) {
      return NextResponse.json(
        { error: "Email, token, and password are required" },
        { status: 400 }
      );
    }

    // Verify token
    const { data: verificationToken, error } = await supabase
      .from("auth.verification_tokens")
      .select("*")
      .eq("identifier", email)
      .eq("token", token)
      .single();

    if (error || !verificationToken) {
      return NextResponse.json(
        { error: "Invalid or expired token" },
        { status: 400 }
      );
    }

    // Check if token has expired
    if (new Date(verificationToken.expires) < new Date()) {
      await supabase
        .from("auth.verification_tokens")
        .delete()
        .eq("identifier", email)
        .eq("token", token);
      
      return NextResponse.json(
        { error: "Token has expired" },
        { status: 400 }
      );
    }

    // Update password
    const hashedPassword = await hash(password, 12);
    
    await supabase
      .from("auth.users")
      .update({ password: hashedPassword })
      .eq("email", email);

    // Delete the used token
    await supabase
      .from("auth.verification_tokens")
      .delete()
      .eq("identifier", email)
      .eq("token", token);

    return NextResponse.json(
      { message: "Password has been reset successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Reset password error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
} 