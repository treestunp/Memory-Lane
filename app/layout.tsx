import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Memory Lane',
  description: 'Upload pictures and save memories to revisit later.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <div className="min-h-screen bg-slate-50 text-slate-900">
          <header className="border-b border-slate-200 bg-white/90 backdrop-blur-sm">
            <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
              <div>
                <a href="/" className="text-xl font-semibold text-brand">Memory Lane</a>
                <p className="text-sm text-slate-600">Keep your photos and stories in one place.</p>
              </div>
              <nav className="flex gap-4 text-sm text-slate-700">
                <a href="/dashboard" className="hover:text-brand">Dashboard</a>
                <a href="/new-memory" className="hover:text-brand">Add memory</a>
                <a href="/login" className="hover:text-brand">Login</a>
              </nav>
            </div>
          </header>
          <main className="mx-auto max-w-6xl px-6 py-10">{children}</main>
        </div>
      </body>
    </html>
  );
}
