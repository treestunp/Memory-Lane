'use client';

import { useState, type ChangeEvent, type FormEvent } from 'react';
import { useRouter } from 'next/navigation';

export default function MemoryForm() {
  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [preview, setPreview] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  function handleImageChange(event: ChangeEvent<HTMLInputElement>) {
    setError('');
    const file = event.target.files?.[0] ?? null;
    setImageFile(file);
    setPreview(file ? URL.createObjectURL(file) : '');
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError('');

    if (!title.trim() || !body.trim() || !imageFile) {
      setError('Please provide a title, a note, and an image.');
      return;
    }

    const formData = new FormData();
    formData.append('title', title);
    formData.append('body', body);
    formData.append('image', imageFile);

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
          Image
          <input
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            required
            className="mt-2 w-full rounded-2xl border border-slate-300 bg-slate-50 px-3 py-2 text-sm text-slate-900"
          />
        </label>
      </div>

      {preview ? (
        <div className="rounded-3xl overflow-hidden border border-slate-200">
          <img src={preview} alt="Memory preview" className="h-64 w-full object-cover" />
        </div>
      ) : null}

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
