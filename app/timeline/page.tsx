'use client';

import { useEffect, useState } from 'react';
import MemoryCard from '@/components/MemoryCard';

export default function TimelinePage() {
  const [groups, setGroups] = useState<Record<string, any[]>>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      setLoading(true);
      const res = await fetch('/api/memories');
      if (!res.ok) return;
      const data = await res.json();
      const byDate: Record<string, any[]> = {};
      for (const m of data) {
        const d = new Date(m.createdAt).toDateString();
        (byDate[d] ||= []).push(m);
      }
      setGroups(byDate);
      setLoading(false);
    }
    load();
  }, []);

  if (loading) return <p className="text-slate-600">Loading timeline…</p>;

  const dates = Object.keys(groups).sort((a, b) => +new Date(b) - +new Date(a));

  return (
    <div className="space-y-8">
      <h1 className="text-2xl font-semibold text-slate-900">Timeline</h1>
      {dates.map((date) => (
        <section key={date} className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-slate-900">{date}</h2>
          <div className="mt-4 grid gap-6 md:grid-cols-2">
            {groups[date].map((m) => (
              <MemoryCard key={m.id} {...m} />
            ))}
          </div>
        </section>
      ))}
    </div>
  );
}
