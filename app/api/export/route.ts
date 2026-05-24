import { NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import path from 'path';
import fs from 'fs';
import archiver from 'archiver';

export async function GET() {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });

  const memories = await prisma.memory.findMany({ where: { userId: user.id }, include: { images: true } });

  const zipName = `memory-lane-export-${user.id}.zip`;
  const archive = archiver('zip', { zlib: { level: 9 } });

  const tmpPath = path.join(process.cwd(), 'tmp');
  if (!fs.existsSync(tmpPath)) fs.mkdirSync(tmpPath, { recursive: true });

  const tempFile = path.join(tmpPath, zipName);
  const output = fs.createWriteStream(tempFile);

  archive.pipe(output);

  // add JSON manifest
  archive.append(JSON.stringify(memories, null, 2), { name: 'memories.json' });

  // add image files
  for (const m of memories) {
    for (const img of m.images) {
      const filePath = path.join(process.cwd(), 'public', img.path.replace(/^[\\/]+/, ''));
      if (fs.existsSync(filePath)) {
        archive.file(filePath, { name: `images/${path.basename(filePath)}` });
      }
    }
  }

  await archive.finalize();

  return NextResponse.json({ message: 'Export created', download: `/tmp/${zipName}` });
}
