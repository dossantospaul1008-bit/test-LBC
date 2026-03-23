import Link from 'next/link';
import {
  detailSections,
  educationCards,
  marketArticles,
  observatoryCards,
  privateModules,
} from '@/data/content';

const metrics = [
  { label: 'Phénotypes monitorés', value: '128' },
  { label: 'Profils terpéniques actifs', value: '42' },
  { label: 'Alertes marché', value: '09' },
];

const privatePreview = [
  'Signal feed verrouillé',
  'Comparatifs détaillés',
  'Notes analystes',
];

export function Homepage() {
  return (
    <main>
      <section className="relative overflow-hidden">
        <div className="shell grid min-h-[calc(100vh-81px)] items-center gap-16 py-14 lg:grid-cols-[1.15fr_0.85fr] lg:py-20">
          <div className="relative z-10 space-y-8">
            <span className="eyebrow">
              <span className="h-2 w-2 rounded-full bg-emerald-400 shadow-[0_0_16px_rgba(74,222,128,0.9)]" />
              Secure node online
            </span>

            <div className="space-y-6">
              <p className="text-sm uppercase tracking-[0.35em] text-slate-400">Signal analysis — phenotypes & terpene profiles</p>
              <h1 className="max-w-4xl text-5xl font-semibold tracking-[-0.04em] text-white sm:text-6xl lg:text-7xl">
                OBSERVATOIRE <span className="text-sky-300">FPF</span>
              </h1>
              <p className="max-w-2xl text-lg leading-8 text-slate-300">
                Une interface premium pensée comme un laboratoire confidentiel pour lire les signaux phénotypiques,
                comparer les profils terpéniques et détecter les mouvements du marché avec précision.
              </p>
            </div>

            <div className="flex flex-wrap gap-4">
              <a href="#observatoire" className="tech-button">
                Explorer l&apos;observatoire
              </a>
              <a href="#private" className="tech-button-secondary">
                Demander un accès privé
              </a>
            </div>

            <dl className="grid gap-4 sm:grid-cols-3">
              {metrics.map((metric) => (
                <div key={metric.label} className="glass-panel rounded-2xl px-5 py-4">
                  <dt className="text-xs uppercase tracking-[0.24em] text-slate-400">{metric.label}</dt>
                  <dd className="mt-3 text-2xl font-semibold text-white">{metric.value}</dd>
                </div>
              ))}
            </dl>
          </div>

          <div className="relative">
            <div className="glass-panel animate-float p-6">
              <div className="absolute inset-x-[-30%] top-10 h-px animate-sweep bg-gradient-to-r from-transparent via-sky-300/70 to-transparent" />
              <div className="relative space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs uppercase tracking-[0.24em] text-slate-400">Live phenotyping</p>
                    <p className="mt-2 text-xl font-semibold text-white">Signal deck / cycle 04</p>
                  </div>
                  <span className="rounded-full border border-sky-400/30 bg-sky-400/10 px-3 py-1 text-xs text-sky-200">
                    98.2% integrity
                  </span>
                </div>

                <div className="grid gap-4 rounded-[1.75rem] border border-white/10 bg-slate-950/60 p-5">
                  <div className="flex items-end justify-between">
                    <div>
                      <p className="text-xs uppercase tracking-[0.28em] text-slate-500">Current focus</p>
                      <p className="mt-2 text-3xl font-semibold text-white">RP#36</p>
                    </div>
                    <div className="text-right">
                      <p className="text-xs uppercase tracking-[0.28em] text-slate-500">FPF index</p>
                      <p className="mt-2 text-3xl font-semibold text-fuchsia-200">92.4</p>
                    </div>
                  </div>

                  <div className="h-32 rounded-[1.5rem] border border-white/10 bg-[radial-gradient(circle_at_center,_rgba(56,189,248,0.22),_transparent_58%),linear-gradient(180deg,_rgba(15,23,42,0.94),_rgba(8,47,73,0.65))] p-4">
                    <div className="flex h-full items-end justify-between gap-2">
                      {[38, 52, 65, 57, 84, 78, 96, 88].map((height, index) => (
                        <span
                          key={height}
                          className="flex-1 rounded-full bg-gradient-to-t from-fuchsia-400 via-sky-300 to-cyan-200 shadow-[0_0_18px_rgba(56,189,248,0.5)]"
                          style={{ height: `${height}%`, opacity: 0.45 + index * 0.06 }}
                        />
                      ))}
                    </div>
                  </div>

                  <div className="grid gap-3 sm:grid-cols-3">
                    {['Terpinolène', 'Limonène', 'Linalol'].map((item) => (
                      <div key={item} className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-slate-200">
                        {item}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="observatoire" className="shell space-y-8 py-[var(--space-section)]">
        <div className="space-y-4">
          <span className="eyebrow">Observatoire / active phenotypes</span>
          <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
            <div className="space-y-3">
              <h2 className="section-title">Une grille de panels pour lire les signatures les plus prometteuses.</h2>
              <p className="section-copy">
                Chaque carte agit comme une fiche signalétique premium : code interne, terpènes majeurs, score FPF et
                micro-note de lecture pour une décision rapide.
              </p>
            </div>
            <Link href="/observatoire" className="tech-button-secondary">
              Ouvrir le détail
            </Link>
          </div>
        </div>

        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
          {observatoryCards.map((card) => (
            <article
              key={card.code}
              className="group glass-panel min-h-[260px] p-6 transition duration-300 hover:-translate-y-1 hover:border-sky-300/30 hover:shadow-glow"
            >
              <div className="relative z-10 flex h-full flex-col justify-between gap-5">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="rounded-full border border-fuchsia-400/20 bg-fuchsia-400/10 px-3 py-1 text-xs uppercase tracking-[0.22em] text-fuchsia-100">
                      {card.code}
                    </span>
                    <span className="text-xs uppercase tracking-[0.22em] text-slate-500">Phenotype</span>
                  </div>
                  <p className="text-lg font-medium text-white">{card.profile}</p>
                  <p className="text-sm leading-7 text-slate-300">{card.note}</p>
                </div>

                <div className="rounded-[1.25rem] border border-white/10 bg-black/20 p-4">
                  <p className="text-xs uppercase tracking-[0.26em] text-slate-500">FPF index</p>
                  <p className="mt-3 text-3xl font-semibold text-sky-200 transition group-hover:text-white">{card.index}</p>
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section id="education" className="shell py-[calc(var(--space-section)-1rem)]">
        <div className="glass-panel p-8 md:p-10">
          <div className="relative z-10 grid gap-8 lg:grid-cols-[0.9fr_1.1fr]">
            <div className="space-y-4">
              <span className="eyebrow">Apprendre / research literacy</span>
              <h2 className="section-title">Un espace pédagogique lisible, conçu pour rendre la science actionnable.</h2>
              <p className="section-copy">
                Les contenus privilégient la clarté visuelle, la hiérarchie de l&apos;information et des supports compatibles
                avec des infographies ou matrices d&apos;analyse.
              </p>
            </div>

            <div className="grid gap-4 md:grid-cols-3">
              {educationCards.map((card) => (
                <article key={card.title} className="rounded-[1.5rem] border border-white/10 bg-slate-950/55 p-5">
                  <div className="mb-5 h-10 w-10 rounded-2xl bg-gradient-to-br from-fuchsia-400/30 to-sky-400/30" />
                  <h3 className="text-lg font-medium text-white">{card.title}</h3>
                  <p className="mt-3 text-sm leading-7 text-slate-300">{card.description}</p>
                </article>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section id="market" className="shell space-y-8 py-[var(--space-section)]">
        <div className="space-y-3">
          <span className="eyebrow">Marché / regional intelligence</span>
          <h2 className="section-title">Veille marché avec lecture éditoriale et tags régionaux.</h2>
          <p className="section-copy">
            Une surface éditoriale pensée pour les tendances : chaque carte met en avant le territoire, l’angle et la
            synthèse utile à la décision.
          </p>
        </div>

        <div className="grid gap-5 lg:grid-cols-3">
          {marketArticles.map((article) => (
            <article key={article.title} className="glass-panel p-6 transition duration-300 hover:-translate-y-1 hover:border-fuchsia-300/30">
              <div className="relative z-10 space-y-5">
                <span className="inline-flex rounded-full border border-sky-400/25 bg-sky-400/10 px-3 py-1 text-xs uppercase tracking-[0.2em] text-sky-100">
                  {article.region}
                </span>
                <h3 className="text-xl font-medium text-white">{article.title}</h3>
                <p className="text-sm leading-7 text-slate-300">{article.summary}</p>
                <div className="flex items-center gap-2 text-sm text-slate-400">
                  <span className="h-2 w-2 rounded-full bg-emerald-400 shadow-[0_0_12px_rgba(74,222,128,0.8)]" />
                  Trend signal validated
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section id="private" className="shell py-[calc(var(--space-section)-1rem)]">
        <div className="grid gap-6 lg:grid-cols-[1fr_0.92fr]">
          <div className="glass-panel p-8 md:p-10">
            <div className="relative z-10 space-y-5">
              <span className="eyebrow">Accès privé / restricted area</span>
              <h2 className="section-title">Une zone verrouillée qui évoque immédiatement la confidentialité.</h2>
              <p className="section-copy">
                Contenus floutés, modules restreints et signalétique d&apos;accès pour faire ressentir la valeur exclusive du
                système sans nuire à la lisibilité de l&apos;interface.
              </p>
              <div className="grid gap-3 sm:grid-cols-2">
                {privateModules.map((module) => (
                  <div key={module} className="rounded-[1.25rem] border border-white/10 bg-black/25 px-4 py-4 text-sm text-slate-200">
                    {module}
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="glass-panel relative p-8 md:p-10">
            <div className="absolute inset-0 backdrop-blur-md" />
            <div className="absolute inset-x-0 top-0 h-24 bg-gradient-to-b from-fuchsia-400/12 to-transparent" />
            <div className="relative z-10 space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs uppercase tracking-[0.24em] text-slate-400">Restricted preview</p>
                  <p className="mt-2 text-xl font-semibold text-white">Vault interface</p>
                </div>
                <span className="rounded-full border border-red-400/20 bg-red-400/10 px-3 py-1 text-xs uppercase tracking-[0.22em] text-red-100">
                  Locked
                </span>
              </div>

              <div className="space-y-3 rounded-[1.5rem] border border-white/10 bg-slate-950/75 p-5">
                {privatePreview.map((item) => (
                  <div key={item} className="flex items-center justify-between rounded-2xl border border-white/10 bg-white/5 px-4 py-4">
                    <span className="text-sm text-slate-200 blur-[2px]">{item}</span>
                    <span className="h-2.5 w-2.5 rounded-full bg-red-400 shadow-[0_0_14px_rgba(248,113,113,0.9)]" />
                  </div>
                ))}
              </div>

              <p className="text-sm leading-7 text-slate-400">
                Accès réservé aux partenaires de recherche, analystes validés et opérateurs sous NDA.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="shell pb-20">
        <div className="grid gap-5 lg:grid-cols-4">
          {detailSections.map((section) => (
            <article key={section.title} className="rounded-[1.5rem] border border-white/10 bg-white/[0.03] p-6">
              <p className="text-xs uppercase tracking-[0.22em] text-slate-500">{section.title}</p>
              <p className="mt-4 text-sm leading-7 text-slate-300">{section.copy}</p>
            </article>
          ))}
        </div>
      </section>
    </main>
  );
}
