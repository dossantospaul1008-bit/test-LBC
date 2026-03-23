import { detailSections, observatoryCards } from '@/data/content';

export default function ObservatoirePage() {
  return (
    <main className="shell space-y-10 py-14 md:py-20">
      <div className="space-y-4">
        <span className="eyebrow">Observatoire / phenotype details</span>
        <h1 className="section-title max-w-4xl">Lecture détaillée d&apos;un panel phénotypique dans un layout clair et scientifique.</h1>
        <p className="section-copy">
          Cette structure sert de base production-ready pour chaque fiche : génétique, terpènes, effets et notes
          d&apos;analyse sont hiérarchisés dans des modules immédiatement lisibles.
        </p>
      </div>

      <section className="grid gap-6 lg:grid-cols-[1.05fr_0.95fr]">
        <article className="glass-panel p-8 md:p-10">
          <div className="relative z-10 space-y-6">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <span className="rounded-full border border-fuchsia-400/20 bg-fuchsia-400/10 px-4 py-2 text-xs uppercase tracking-[0.22em] text-fuchsia-100">
                {observatoryCards[0].code}
              </span>
              <span className="rounded-full border border-sky-400/20 bg-sky-400/10 px-4 py-2 text-xs uppercase tracking-[0.22em] text-sky-100">
                FPF index {observatoryCards[0].index}
              </span>
            </div>
            <h2 className="text-3xl font-semibold text-white">{observatoryCards[0].profile}</h2>
            <p className="text-sm leading-7 text-slate-300">{observatoryCards[0].note}</p>
            <div className="grid gap-4 sm:grid-cols-2">
              {detailSections.map((section) => (
                <div key={section.title} className="rounded-[1.5rem] border border-white/10 bg-slate-950/65 p-5">
                  <p className="text-xs uppercase tracking-[0.24em] text-slate-500">{section.title}</p>
                  <p className="mt-3 text-sm leading-7 text-slate-300">{section.copy}</p>
                </div>
              ))}
            </div>
          </div>
        </article>

        <aside className="glass-panel p-8 md:p-10">
          <div className="relative z-10 space-y-4">
            <p className="text-xs uppercase tracking-[0.24em] text-slate-400">Secondary signals</p>
            {observatoryCards.slice(1).map((card) => (
              <div key={card.code} className="rounded-[1.25rem] border border-white/10 bg-white/5 p-5">
                <div className="flex items-center justify-between gap-4">
                  <p className="text-lg font-medium text-white">{card.code}</p>
                  <p className="text-sm text-sky-200">{card.index}</p>
                </div>
                <p className="mt-3 text-sm text-slate-300">{card.profile}</p>
              </div>
            ))}
          </div>
        </aside>
      </section>
    </main>
  );
}
