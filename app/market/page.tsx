import { marketArticles } from '@/data/content';

export default function MarketPage() {
  return (
    <main className="shell space-y-8 py-14 md:py-20">
      <span className="eyebrow">Marché / intelligence stream</span>
      <h1 className="section-title max-w-4xl">Des cartes éditoriales pour suivre tendances, régions et signaux faibles.</h1>
      <div className="grid gap-5 lg:grid-cols-3">
        {marketArticles.map((article) => (
          <article key={article.title} className="glass-panel p-6">
            <div className="relative z-10 space-y-4">
              <span className="inline-flex rounded-full border border-sky-400/25 bg-sky-400/10 px-3 py-1 text-xs uppercase tracking-[0.2em] text-sky-100">
                {article.region}
              </span>
              <h2 className="text-xl font-medium text-white">{article.title}</h2>
              <p className="text-sm leading-7 text-slate-300">{article.summary}</p>
            </div>
          </article>
        ))}
      </div>
    </main>
  );
}
