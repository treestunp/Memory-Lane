'use client';

import MemoryForm from '@/components/MemoryForm';

export default function NewMemoryPage() {
  return (
    <div className="mx-auto max-w-3xl rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
      <h1 className="text-3xl font-semibold text-slate-900">Add a new memory</h1>
      <p className="mt-2 text-slate-600">Upload a photo and write a short note to save this moment.</p>
      <div className="mt-8">
        <MemoryForm />
      </div>
    </div>
  );
}
