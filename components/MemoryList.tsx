'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import MemoryCard from './MemoryCard';

interface MemoryItem {
  id: string;
  title: string;
  body: string;
  images: { path: string }[];
  createdAt: string;
  favorite: boolean;
}

export default function MemoryList() {
  const [memories, setMemories] = useState<MemoryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const router = useRouter();

  useEffect(() => {
    async function loadMemories() {
      setLoading(true);
      const response = await fetch('/api/memories');

      if (response.status === 401) {
        router.push('/login');
        return;
      }

      if (!response.ok) {
        setError('Unable to load your memories.');
        setLoading(false);
        return;
      }

      const data = await response.json();
      setMemories(data);
      setLoading(false);
    }

    loadMemories();
  }, [router]);

  async function handleLogout() {
    await fetch('/api/auth/logout', { method: 'POST' });
    router.push('/login');
  }

  if (loading) {
    return <p className="text-slate-600">Loading your memories…</p>;
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col items-start justify-between gap-4 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:flex-row sm:items-center">
        <div>
          <h2 className="text-xl font-semibold text-slate-900">Saved memories</h2>
          <p className="mt-1 text-slate-600">Your uploaded photos and notes appear below.</p>
        </div>
        <button
          type="button"
          onClick={handleLogout}
          className="rounded-full border border-slate-300 bg-slate-50 px-5 py-3 text-sm font-medium text-slate-700 transition hover:bg-slate-100"
        >
          Log out
        </button>
      </div>

      {error ? <p className="rounded-2xl bg-rose-50 px-4 py-3 text-sm text-rose-700">{error}</p> : null}

      {memories.length === 0 ? (
        <div className="rounded-3xl border border-dashed border-slate-300 bg-white p-10 text-center text-slate-600 shadow-sm">
          No memories yet. Add one to begin revisiting your favorite moments.
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2">
          {memories.map((memory) => (
            <MemoryCard key={memory.id} {...memory} />
          ))}
        </div>
      )}
    </div>
  );
}
