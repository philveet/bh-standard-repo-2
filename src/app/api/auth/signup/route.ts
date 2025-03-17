import { NextRequest, NextResponse } from "next/server";
import { hash } from "bcrypt";
import { supabase } from "@/lib/supabase";
import { sendVerificationEmail } from "@/lib/email";
import crypto from "crypto";

export async function POST(req: NextRequest) {
  try {
    const { name, email, password } = await req.json();

    // Validate input
    if (!email || !password) {
      return NextResponse.json(
        { error: "Email and password are required" },
        { status: 400 }
      );
    }

    // Check if user already exists
    const { data: existingUser } = await supabase
      .from("auth.users")
      .select("*")
      .eq("email", email)
      .single();

    if (existingUser) {
      return NextResponse.json(
        { error: "User with this email already exists" },
        { status: 409 }
      );
    }

    // Hash password
    const hashedPassword = await hash(password, 12);

    // Create user
    const { data: user, error } = await supabase
      .from("auth.users")
      .insert({
        email,
        name,
        password: hashedPassword,
      })
      .select("*")
      .single();

    if (error) {
      console.error("User creation error:", error);
      return NextResponse.json(
        { error: "Failed to create user" },
        { status: 500 }
      );
    }

    // Create verification token
    const token = crypto.randomBytes(32).toString("hex");
    const expires = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours

    await supabase.from("auth.verification_tokens").insert({
      identifier: email,
      token,
      expires,
    });

    // Send verification email
    await sendVerificationEmail(email, token);

    return NextResponse.json(
      { message: "User created. Please check your email to verify your account." },
      { status: 201 }
    );
  } catch (error) {
    console.error("Signup error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
} 