'use client';

interface MemoryCardProps {
  title: string;
  body: string;
  imagePath: string;
  createdAt: string;
}

export default function MemoryCard({ title, body, imagePath, createdAt }: MemoryCardProps) {
  return (
    <article className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
      <img src={imagePath} alt={title} className="h-72 w-full object-cover" />
      <div className="p-6">
        <div className="flex items-center justify-between text-xs uppercase tracking-[0.2em] text-slate-500">
          <span>Memory</span>
          <span>{new Date(createdAt).toLocaleDateString()}</span>
        </div>
        <h3 className="mt-4 text-2xl font-semibold text-slate-900">{title}</h3>
        <p className="mt-3 text-slate-600">{body}</p>
      </div>
    </article>
  );
}
