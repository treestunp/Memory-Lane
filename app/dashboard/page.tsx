import MemoryList from '@/components/MemoryList';

export default function DashboardPage() {
  return (
    <div className="space-y-8">
      <section className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-3xl font-semibold text-slate-900">Your Memory Lane</h1>
            <p className="mt-2 text-slate-600">Browse photos and revisit your memory notes.</p>
          </div>
          <a
            href="/new-memory"
            className="inline-flex items-center justify-center rounded-full bg-brand px-6 py-3 text-sm font-semibold text-white transition hover:bg-violet-600"
          >
            Add a new memory
          </a>
        </div>
      </section>

      <MemoryList />
    </div>
  );
}
