import { NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function GET() {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });

  const albums = await prisma.album.findMany({ where: { userId: user.id }, orderBy: { createdAt: 'desc' }, include: { _count: { select: { memories: true } } } });
  return NextResponse.json(albums);
}

export async function POST(request: Request) {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });

  const body = await request.json();
  const { name } = body;
  if (!name) return NextResponse.json({ message: 'Missing name' }, { status: 400 });

  const album = await prisma.album.create({ data: { name, userId: user.id } });
  return NextResponse.json(album, { status: 201 });
}
