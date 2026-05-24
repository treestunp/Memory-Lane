import Link from 'next/link';
import { getCurrentUser } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export default async function CollectionsPage() {
  const user = await getCurrentUser();
  if (!user) return <p className="text-slate-600">Unauthorized</p>;

  const albums = await prisma.album.findMany({
    where: { userId: user.id },
    include: { _count: { select: { memories: true } } },
    orderBy: { createdAt: 'desc' },
  });

  return (
    <div className="space-y-6">
      <section className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
        <h1 className="text-2xl font-semibold text-slate-900">Collections</h1>
        <p className="mt-2 text-slate-600">Your albums and collections.</p>
      </section>

      <div className="grid gap-6 md:grid-cols-2">
        {albums.map((a: any) => (
          <div key={a.id} className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
            <h3 className="text-lg font-semibold text-slate-900">{a.name}</h3>
            <p className="mt-2 text-sm text-slate-600">{a._count?.memories ?? 0} memories</p>
            <Link href={`/collections/${a.id}`} className="mt-4 inline-block rounded-full border px-4 py-2 text-sm">Open</Link>
          </div>
        ))}
      </div>
    </div>
  );
}
