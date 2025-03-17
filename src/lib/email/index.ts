import { getResendClient } from "@/lib/api/resend";

export async function sendVerificationEmail(email: string, token: string) {
  const resend = getResendClient();
  const baseUrl = process.env.NEXTAUTH_URL || "http://localhost:3000";
  const verificationUrl = `${baseUrl}/api/auth/verify?token=${token}&email=${encodeURIComponent(email)}`;

  await resend.emails.send({
    from: "no-reply@yourdomain.com",
    to: email,
    subject: "Verify your email address",
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h1 style="color: #333; font-size: 24px;">Email Verification</h1>
        <p style="color: #555; font-size: 16px; line-height: 1.5;">
          Thank you for signing up! Please verify your email address by clicking the link below:
        </p>
        <p style="margin: 25px 0;">
          <a href="${verificationUrl}" style="background-color: #4F46E5; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; font-weight: bold;">
            Verify Email
          </a>
        </p>
        <p style="color: #777; font-size: 14px;">This link will expire in 24 hours.</p>
        <p style="color: #777; font-size: 14px;">If you didn't sign up for an account, please ignore this email.</p>
      </div>
    `,
  });
}

export async function sendPasswordResetEmail(email: string, token: string) {
  const resend = getResendClient();
  const baseUrl = process.env.NEXTAUTH_URL || "http://localhost:3000";
  const resetUrl = `${baseUrl}/auth/reset-password?token=${token}&email=${encodeURIComponent(email)}`;

  await resend.emails.send({
    from: "no-reply@yourdomain.com",
    to: email,
    subject: "Reset your password",
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h1 style="color: #333; font-size: 24px;">Password Reset</h1>
        <p style="color: #555; font-size: 16px; line-height: 1.5;">
          A password reset has been requested for your account. Click the link below to set a new password:
        </p>
        <p style="margin: 25px 0;">
          <a href="${resetUrl}" style="background-color: #4F46E5; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; font-weight: bold;">
            Reset Password
          </a>
        </p>
        <p style="color: #777; font-size: 14px;">This link will expire in 1 hour.</p>
        <p style="color: #777; font-size: 14px;">If you didn't request a password reset, please ignore this email.</p>
      </div>
    `,
  });
} 