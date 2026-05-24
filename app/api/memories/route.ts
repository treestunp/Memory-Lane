import { NextResponse } from 'next/server';
import { promises as fs } from 'fs';
import path from 'path';
import { getCurrentUser } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

const uploadDir = path.join(process.cwd(), 'public', 'uploads');

async function ensureUploadDir() {
  try {
    await fs.mkdir(uploadDir, { recursive: true });
  } catch (error) {
    console.error('Unable to create uploads directory', error);
  }
}

export async function GET() {
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }

  const memories = await prisma.memory.findMany({
    where: { userId: user.id },
    orderBy: { createdAt: 'desc' },
  });

  return NextResponse.json(memories);
}

export async function POST(request: Request) {
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }

  await ensureUploadDir();
  const formData = await request.formData();
  const title = String(formData.get('title') ?? '').trim();
  const body = String(formData.get('body') ?? '').trim();
  const file = formData.get('image');

  if (!title || !body || !file || !(file instanceof File)) {
    return NextResponse.json({ message: 'Title, note, and image are required' }, { status: 400 });
  }

  const fileName = `${Date.now()}-${cryptoRandomString(8)}-${file.name.replace(/\s+/g, '-')}`;
  const filePath = path.join(uploadDir, fileName);
  const fileBytes = Buffer.from(await file.arrayBuffer());

  await fs.writeFile(filePath, fileBytes);

  const memory = await prisma.memory.create({
    data: {
      title,
      body,
      imagePath: `/uploads/${fileName}`,
      userId: user.id,
    },
  });

  return NextResponse.json(memory, { status: 201 });
}

function cryptoRandomString(length: number) {
  return Array.from({ length }, () => Math.floor(Math.random() * 16).toString(16)).join('');
}
