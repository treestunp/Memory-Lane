import { NextResponse } from 'next/server';
import { createSession, createSessionCookie, hashPassword } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function POST(request: Request) {
  const body = await request.json();
  const { name, email, password } = body;

  if (!name || !email || !password) {
    return NextResponse.json({ message: 'Missing fields' }, { status: 400 });
  }

  const existingUser = await prisma.user.findUnique({ where: { email } });
  if (existingUser) {
    return NextResponse.json({ message: 'Email already in use' }, { status: 409 });
  }

  const user = await prisma.user.create({
    data: {
      name,
      email,
      passwordHash: hashPassword(password),
    },
  });

  const session = await createSession(user.id);
  const response = NextResponse.json({ user: { id: user.id, name: user.name, email: user.email } }, { status: 201 });
  response.cookies.set(createSessionCookie(session.token));
  return response;
}
