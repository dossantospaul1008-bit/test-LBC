import { educationCards } from '@/data/content';

export default function EducationPage() {
  return (
    <main className="shell space-y-8 py-14 md:py-20">
      <span className="eyebrow">Apprendre / education hub</span>
      <h1 className="section-title max-w-4xl">Un hub pédagogique propre, lisible et prêt pour des contenus experts.</h1>
      <div className="grid gap-5 lg:grid-cols-3">
        {educationCards.map((card) => (
          <article key={card.title} className="glass-panel p-6">
            <div className="relative z-10">
              <h2 className="text-xl font-medium text-white">{card.title}</h2>
              <p className="mt-3 text-sm leading-7 text-slate-300">{card.description}</p>
            </div>
          </article>
        ))}
      </div>
    </main>
  );
}
