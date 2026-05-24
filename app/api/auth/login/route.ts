import { NextResponse } from 'next/server';
import { verifyPassword, createSession, createSessionCookie } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function POST(request: Request) {
  const body = await request.json();
  const { email, password } = body;

  if (!email || !password) {
    return NextResponse.json({ message: 'Missing fields' }, { status: 400 });
  }

  const user = await prisma.user.findUnique({ where: { email } });
  if (!user || !verifyPassword(password, user.passwordHash)) {
    return NextResponse.json({ message: 'Invalid credentials' }, { status: 401 });
  }

  const session = await createSession(user.id);
  const response = NextResponse.json({ user: { id: user.id, name: user.name, email: user.email } });
  response.cookies.set(createSessionCookie(session.token));
  return response;
}
