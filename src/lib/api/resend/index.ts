import { Resend } from 'resend';
import { isApiEnabled } from '@/config/api-config';

let resendClient: Resend | null = null;

export function getResendClient() {
  if (!isApiEnabled('resend')) {
    throw new Error('Resend API is not enabled in this project');
  }
  
  if (!resendClient) {
    const apiKey = process.env.RESEND_API_KEY;
    if (!apiKey) {
      throw new Error('RESEND_API_KEY is not defined');
    }
    
    resendClient = new Resend(apiKey);
  }
  
  return resendClient;
}

type SendEmailParams = {
  to: string | string[];
  from: string;
  subject: string;
  text?: string;
  html?: string;
};

/**
 * Send an email using Resend
 * Note: This is a simplified implementation. For more advanced use cases like
 * React templates, CC, BCC, attachments, etc., you'll need to extend this function.
 */
export async function sendEmail({
  to,
  from,
  subject,
  text,
  html,
}: SendEmailParams) {
  const client = getResendClient();
  
  // At least one of text or html must be provided
  if (!text && !html) {
    throw new Error('Either text or html content must be provided');
  }
  
  try {
    // @ts-ignore - Working around type issues with Resend's SDK
    const response = await client.emails.send({
      from,
      to,
      subject,
      text,
      html,
    });
    
    return response;
  } catch (error) {
    console.error('Error sending email:', error);
    throw error;
  }
} 