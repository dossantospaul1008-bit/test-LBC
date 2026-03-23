import { privateModules } from '@/data/content';

export default function PrivatePage() {
  return (
    <main className="shell space-y-8 py-14 md:py-20">
      <span className="eyebrow">Accès privé / restricted zone</span>
      <h1 className="section-title max-w-4xl">Une expérience verrouillée avec preview floutée et perception premium.</h1>
      <div className="glass-panel p-8 md:p-10">
        <div className="absolute inset-0 backdrop-blur-md" />
        <div className="relative z-10 grid gap-4 md:grid-cols-2">
          {privateModules.map((module) => (
            <div key={module} className="rounded-[1.25rem] border border-white/10 bg-white/5 p-5 text-slate-200 blur-[2px]">
              {module}
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
