'use client';

import { useState } from 'react';
import Link from 'next/link';

interface MemoryCardProps {
  id: string;
  title: string;
  body: string;
  images: { path: string }[];
  createdAt: string;
  favorite: boolean;
}

export default function MemoryCard({ id, title, body, images, createdAt, favorite: initialFav }: MemoryCardProps) {
  const [favorite, setFavorite] = useState(initialFav);

  async function toggleFavorite() {
    const res = await fetch(`/api/memories/${id}/favorite`, { method: 'POST' });
    if (res.ok) {
      const payload = await res.json();
      setFavorite(Boolean(payload?.favorite));
    }
  }
  return (
    <article className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
      <div className="relative">
        <img src={images[0]?.path ?? '/placeholder.png'} alt={title} className="h-72 w-full object-cover" />
        <button
          onClick={toggleFavorite}
          className={`absolute right-3 top-3 rounded-full px-3 py-2 text-sm font-medium ${favorite ? 'bg-yellow-300' : 'bg-white/70'}`}
        >
          {favorite ? '★' : '☆'}
        </button>
      </div>
      <div className="p-6">
        <div className="flex items-center justify-between text-xs uppercase tracking-[0.2em] text-slate-500">
          <span>Memory</span>
          <span>{new Date(createdAt).toLocaleDateString()}</span>
        </div>
        <h3 className="mt-4 text-2xl font-semibold text-slate-900">
          <Link href={`/memories/${id}`}>{title}</Link>
        </h3>
        <p className="mt-3 text-slate-600">{body}</p>
        {images.length > 1 ? <p className="mt-2 text-xs text-slate-500">{images.length} photos</p> : null}
      </div>
    </article>
  );
}
