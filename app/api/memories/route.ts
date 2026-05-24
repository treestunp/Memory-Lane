import { NextResponse } from 'next/server';
import { promises as fs } from 'fs';
import path from 'path';
import { getCurrentUser } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { createWorker } from 'tesseract.js';

const uploadDir = path.join(process.cwd(), 'public', 'uploads');

async function ensureUploadDir() {
  try {
    await fs.mkdir(uploadDir, { recursive: true });
  } catch (error) {
    console.error('Unable to create uploads directory', error);
  }
}

async function runOCR(buffer: Buffer) {
  try {
    const worker = await createWorker({ logger: () => {} });
    await worker.loadLanguage('eng');
    await worker.initialize('eng');
    const { data } = await worker.recognize(buffer);
    await worker.terminate();
    return (data?.text || '').trim();
  } catch (err) {
    return '';
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
    include: { images: { orderBy: { ord: 'asc' } } },
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
  const files = formData.getAll('images');

  if (!title || !body || files.length === 0) {
    return NextResponse.json({ message: 'Title, note, and at least one image are required' }, { status: 400 });
  }

  const savedFiles: { path: string; ord: number; caption?: string }[] = [];
  const albumName = String(formData.get('albumName') ?? '').trim();

  for (let i = 0; i < files.length; i++) {
    const f = files[i];
    if (!(f instanceof File)) continue;
    const fileName = `${Date.now()}-${cryptoRandomString(8)}-${f.name.replace(/\s+/g, '-')}`;
    const filePath = path.join(uploadDir, fileName);
    const fileBytes = Buffer.from(await f.arrayBuffer());
    await fs.writeFile(filePath, fileBytes);
    // attempt OCR on the image to extract captions (best-effort)
    const caption = await runOCR(fileBytes).catch(() => '');
    savedFiles.push({ path: `/uploads/${fileName}`, ord: i, caption: caption || undefined });
  }

  let albumRecord = undefined;
  if (albumName) {
    albumRecord = await prisma.album.findFirst({ where: { name: albumName, userId: user.id } });
    if (!albumRecord) {
      albumRecord = await prisma.album.create({ data: { name: albumName, userId: user.id } });
    }
  }

  const memory = await prisma.memory.create({
    data: {
      title,
      body,
      userId: user.id,
      albumId: albumRecord?.id,
      images: {
        create: savedFiles.map((s) => ({ path: s.path, ord: s.ord, caption: s.caption })),
      },
    },
    include: { images: true },
  });

  return NextResponse.json(memory, { status: 201 });
}

function cryptoRandomString(length: number) {
  return Array.from({ length }, () => Math.floor(Math.random() * 16).toString(16)).join('');
}
