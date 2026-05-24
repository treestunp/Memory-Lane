import Link from 'next/link';

export default function HomePage() {
  return (
    <div className="space-y-8">
      <section className="rounded-3xl border border-slate-200 bg-white p-10 shadow-sm">
        <div className="max-w-3xl">
          <p className="text-sm uppercase tracking-[0.4em] text-brand">Memory Lane</p>
          <h1 className="mt-4 text-4xl font-semibold text-slate-900 sm:text-5xl">Save your favorite moments.</h1>
          <p className="mt-6 text-lg leading-8 text-slate-700">
            Upload photos, add notes, and revisit your memories later from any device. A cozy place to store personal stories and snapshots.
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Link href="/register" className="inline-flex items-center justify-center rounded-full bg-brand px-6 py-3 text-sm font-medium text-white transition hover:bg-violet-600">
              Start saving memories
            </Link>
            <Link href="/login" className="inline-flex items-center justify-center rounded-full border border-slate-300 bg-white px-6 py-3 text-sm font-medium text-slate-700 transition hover:bg-slate-100">
              Log in
            </Link>
          </div>
        </div>
      </section>

      <section className="grid gap-6 md:grid-cols-3">
        <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
          <h2 className="text-xl font-semibold text-slate-900">Upload photos</h2>
          <p className="mt-3 text-slate-600">Keep the moments that matter in a safe place with every image attached to a memory.</p>
        </div>
        <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
          <h2 className="text-xl font-semibold text-slate-900">Write notes</h2>
          <p className="mt-3 text-slate-600">Add context to your pictures so you can remember the story behind every photo.</p>
        </div>
        <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
          <h2 className="text-xl font-semibold text-slate-900">Visit later</h2>
          <p className="mt-3 text-slate-600">Open your dashboard later and relive your past with ease.</p>
        </div>
      </section>
    </div>
  );
}
