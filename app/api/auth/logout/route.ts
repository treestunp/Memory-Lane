import { NextResponse } from 'next/server';
import { deleteSessionCookie } from '@/lib/auth';

export async function POST() {
  const response = NextResponse.json({ message: 'Logged out' });
  response.cookies.set(deleteSessionCookie());
  return response;
}
