import Link from 'next/link';
import { navItems } from '@/data/content';

export function Header() {
  return (
    <header className="sticky top-0 z-40 border-b border-white/10 bg-slate-950/70 backdrop-blur-xl">
      <div className="shell flex items-center justify-between gap-6 py-4">
        <Link href="/" className="flex items-center gap-3">
          <span className="flex h-11 w-11 items-center justify-center rounded-2xl border border-fuchsia-400/30 bg-fuchsia-400/10 text-xs font-semibold tracking-techno text-fuchsia-100">
            FPF
          </span>
          <div>
            <p className="text-sm font-semibold text-white">Observatoire FPF</p>
            <p className="text-xs uppercase tracking-[0.22em] text-slate-400">Research interface</p>
          </div>
        </Link>

        <nav className="hidden items-center gap-2 md:flex">
          {navItems.map((item) => (
            <a
              key={item.label}
              href={item.href}
              className="rounded-full border border-transparent px-4 py-2 text-sm text-slate-300 transition hover:border-white/10 hover:bg-white/5 hover:text-white"
            >
              {item.label}
            </a>
          ))}
        </nav>
      </div>
    </header>
  );
}
