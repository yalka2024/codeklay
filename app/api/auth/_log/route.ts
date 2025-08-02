import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  // Optionally log the request body for debugging
  // const body = await req.json();
  // console.log('Auth log:', body);
  return NextResponse.json({ status: 'ok' });
} 