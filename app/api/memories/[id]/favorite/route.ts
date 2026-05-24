import { NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function POST(request: Request, { params }: { params: { id: string } }) {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });

  const { id } = params;
  const memory = await prisma.memory.findUnique({ where: { id } });
  if (!memory || memory.userId !== user.id) {
    return NextResponse.json({ message: 'Not found' }, { status: 404 });
  }

  const toggled = await prisma.memory.update({
    where: { id },
    data: { favorite: !memory.favorite },
  });

  return NextResponse.json({ favorite: toggled.favorite });
}
