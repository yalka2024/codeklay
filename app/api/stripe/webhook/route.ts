import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, { apiVersion: '2023-08-16' });
const prisma = new PrismaClient();

export async function POST(req: NextRequest) {
  const sig = req.headers.get('stripe-signature');
  let event;
  try {
    const buf = await req.arrayBuffer();
    event = stripe.webhooks.constructEvent(Buffer.from(buf), sig!, process.env.STRIPE_WEBHOOK_SECRET!);
  } catch (err) {
    return NextResponse.json({ error: 'Webhook signature verification failed.' }, { status: 400 });
  }

  try {
    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object as Stripe.Checkout.Session;
        
        // Check if this is for CodeKlay platform (you can add platform-specific metadata)
const platform = session.metadata?.platform || 'codeklay';

if (platform === 'codeklay') {
// Handle CodeKlay-specific logic
          if (session.customer_email && session.metadata?.plan) {
            await prisma.user.update({
              where: { email: session.customer_email },
              data: { role: session.metadata.plan },
            });
          }
        }
        // You can add other platform handling here
        break;
      }
      case 'payment_intent.succeeded': {
        const paymentIntent = event.data.object as Stripe.PaymentIntent;
        
        // Handle payment success for CodeKlay marketplace
if (paymentIntent.metadata?.platform === 'codeklay' || !paymentIntent.metadata?.platform) {
// Process CodeKlay marketplace payment
          if (paymentIntent.metadata?.snippetId && paymentIntent.metadata?.userId) {
            // Grant access to purchased snippet
            await prisma.snippetPurchase.create({
              data: {
                snippetId: paymentIntent.metadata.snippetId,
                userId: paymentIntent.metadata.userId,
                amount: paymentIntent.amount / 100, // Convert from cents
                transactionId: paymentIntent.id,
              },
            });
          }
        }
        break;
      }
      case 'invoice.payment_failed': {
        // Handle failed payments for CodeKlay
const invoice = event.data.object as Stripe.Invoice;
console.log('Payment failed for CodeKlay platform:', invoice.customer_email);
        break;
      }
      // Add more event types as needed
      default:
        break;
    }
    return NextResponse.json({ received: true });
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : 'Unknown error' }, { status: 500 });
  }
} 