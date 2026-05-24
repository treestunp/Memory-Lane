'use client';

import { useState, type ChangeEvent, type FormEvent } from 'react';
import { useRouter } from 'next/navigation';

export default function MemoryForm() {
  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');
  const [imageFiles, setImageFiles] = useState<File[]>([]);
  const [previews, setPreviews] = useState<string[]>([]);
  const [album, setAlbum] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  function handleImageChange(event: ChangeEvent<HTMLInputElement>) {
    setError('');
    const files = Array.from(event.target.files ?? [] as File[]);
    setImageFiles(files);
    setPreviews(files.map((f) => URL.createObjectURL(f)));
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError('');

    if (!title.trim() || !body.trim() || imageFiles.length === 0) {
      setError('Please provide a title, a note, and at least one image.');
      return;
    }

    const formData = new FormData();
    formData.append('title', title);
    formData.append('body', body);
    if (album.trim()) formData.append('albumName', album.trim());
    imageFiles.forEach((f) => formData.append('images', f));

    setIsLoading(true);
    const response = await fetch('/api/memories', {
      method: 'POST',
      body: formData,
    });
    setIsLoading(false);

    if (response.status === 401) {
      router.push('/login');
      return;
    }

    if (!response.ok) {
      const payload = await response.json();
      setError(payload?.message || 'Unable to save your memory.');
      return;
    }

    router.push('/dashboard');
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid gap-6 sm:grid-cols-2">
        <label className="block text-sm font-medium text-slate-700">
          Title
          <input
            value={title}
            onChange={(event) => setTitle(event.target.value)}
            required
            className="mt-2 w-full rounded-2xl border border-slate-300 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none focus:border-brand focus:ring-2 focus:ring-brand/20"
          />
        </label>
        <label className="block text-sm font-medium text-slate-700">
          Images
          <input
            type="file"
            accept="image/*"
            multiple
            onChange={handleImageChange}
            required
            className="mt-2 w-full rounded-2xl border border-slate-300 bg-slate-50 px-3 py-2 text-sm text-slate-900"
          />
        </label>
      </div>

      {previews.length > 0 ? (
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          {previews.map((p, i) => (
            <div key={i} className="overflow-hidden rounded-2xl border border-slate-200">
              <img src={p} alt={`Preview ${i + 1}`} className="h-32 w-full object-cover" />
            </div>
          ))}
        </div>
      ) : null}

      <label className="block text-sm font-medium text-slate-700">
        Album (optional)
        <input
          value={album}
          onChange={(e) => setAlbum(e.target.value)}
          placeholder="Create or enter album name"
          className="mt-2 w-full rounded-2xl border border-slate-300 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none focus:border-brand focus:ring-2 focus:ring-brand/20"
        />
      </label>

      <label className="block text-sm font-medium text-slate-700">
        Note
        <textarea
          value={body}
          onChange={(event) => setBody(event.target.value)}
          required
          rows={6}
          className="mt-2 w-full rounded-3xl border border-slate-300 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none focus:border-brand focus:ring-2 focus:ring-brand/20"
        />
      </label>

      {error ? <p className="rounded-2xl bg-rose-50 px-4 py-3 text-sm text-rose-700">{error}</p> : null}

      <button
        type="submit"
        disabled={isLoading}
        className="inline-flex rounded-full bg-brand px-6 py-3 text-sm font-semibold text-white transition hover:bg-violet-600 disabled:cursor-not-allowed disabled:bg-slate-400"
      >
        {isLoading ? 'Saving…' : 'Save memory'}
      </button>
    </form>
  );
}
