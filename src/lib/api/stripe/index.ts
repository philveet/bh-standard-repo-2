import Stripe from 'stripe';
import { isApiEnabled } from '@/config/api-config';

let stripeClient: Stripe | null = null;

export function getStripeClient() {
  if (!isApiEnabled('stripe')) {
    throw new Error('Stripe API is not enabled in this project');
  }
  
  if (!stripeClient) {
    const apiKey = process.env.STRIPE_SECRET_KEY;
    if (!apiKey) {
      throw new Error('STRIPE_SECRET_KEY is not defined');
    }
    
    stripeClient = new Stripe(apiKey, {
      apiVersion: '2023-08-16',
    });
  }
  
  return stripeClient;
}

export async function createPaymentIntent(amount: number, currency: string = 'usd') {
  const stripe = getStripeClient();
  
  const paymentIntent = await stripe.paymentIntents.create({
    amount,
    currency,
  });
  
  return paymentIntent;
}

export async function getProductList() {
  const stripe = getStripeClient();
  
  const products = await stripe.products.list({
    active: true,
    expand: ['data.default_price'],
  });
  
  return products.data;
} 