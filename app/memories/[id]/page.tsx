'use client';

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

export default function MemoryDetailPage({ params }: { params: { id: string } }) {
  const { id } = params;
  const [memory, setMemory] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [index, setIndex] = useState(0);
  const router = useRouter();

  useEffect(() => {
    async function load() {
      setLoading(true);
      const res = await fetch(`/api/memories/${id}`);
      if (res.status === 401) {
        router.push('/login');
        return;
      }
      if (!res.ok) return;
      const data = await res.json();
      setMemory(data);
      setLoading(false);
    }
    load();
  }, [id, router]);

  if (loading) return <p className="text-slate-600">Loading…</p>;
  if (!memory) return <p className="text-slate-600">Memory not found.</p>;

  const images = memory.images ?? [];

  function prev() {
    setIndex((i) => Math.max(0, i - 1));
  }
  function next() {
    setIndex((i) => Math.min(images.length - 1, i + 1));
  }

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
        <h1 className="text-2xl font-semibold text-slate-900">{memory.title}</h1>
        <p className="mt-2 text-slate-600">{memory.body}</p>
      </div>

      <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
        {images.length > 0 ? (
          <div>
            <div className="mb-4">
              <img src={images[index].path} alt={`Image ${index + 1}`} className="h-96 w-full object-cover rounded-2xl" />
            </div>
            <div className="flex items-center justify-between">
              <button onClick={prev} className="rounded-full border px-4 py-2">Prev</button>
              <div className="text-sm text-slate-600">{index + 1} / {images.length}</div>
              <button onClick={next} className="rounded-full border px-4 py-2">Next</button>
            </div>
          </div>
        ) : (
          <p className="text-slate-600">No images</p>
        )}
      </div>
    </div>
  );
}
