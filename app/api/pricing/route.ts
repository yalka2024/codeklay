import { NextRequest, NextResponse } from 'next/server';

const plans = [
  { name: 'Community', price: 0, features: ['50 AI requests/month', 'Basic collaboration', 'Up to 2 plugins'] },
  { name: 'Pro', price: 25, features: ['1,000 AI requests/month', 'Advanced collaboration', 'Up to 10 plugins', 'Email support'] },
  { name: 'Team', price: 750, features: ['10,000 AI requests/month', 'Advanced collaboration', 'Up to 50 plugins', 'Priority support'] },
];

export async function GET() {
  return NextResponse.json({ plans });
} 