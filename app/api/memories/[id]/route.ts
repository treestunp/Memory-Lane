import { NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function GET(request: Request, { params }: { params: { id: string } }) {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });

  const { id } = params;
  const memory = await prisma.memory.findUnique({
    where: { id },
    include: { images: { orderBy: { ord: 'asc' } } },
  });

  if (!memory || memory.userId !== user.id) {
    return NextResponse.json({ message: 'Not found' }, { status: 404 });
  }

  return NextResponse.json(memory);
}
