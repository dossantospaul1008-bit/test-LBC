# Observatoire FPF

Interface Next.js + Tailwind pour un laboratoire digital futuriste centré sur l'analyse de phénotypes, de profils terpéniques et de tendances marché.

## Concept UI/UX

- **Atmosphère** : laboratoire confidentiel, interface d'observation premium, dark mode futuriste.
- **Principes** : lisibilité forte, hiérarchie nette, effets subtils (glow, verre, scanlines) uniquement quand ils renforcent la compréhension.
- **Parcours** : homepage manifeste + sections dédiées `Observatoire`, `Apprendre`, `Marché`, `Accès privé`.

## Design tokens

Les tokens principaux sont définis dans `app/globals.css` et reliés à Tailwind dans `tailwind.config.ts`.

- **Couleurs**
  - `--color-base`: fond principal très sombre
  - `--color-panel`: panneaux glassmorphism
  - `--color-accent-purple`: accent néon violet
  - `--color-accent-blue`: accent bleu électrique
  - `--color-accent-pink`: surbrillance rose subtile
- **Typographie**
  - `Inter` avec hiérarchie dense et tracking technique sur les labels système
- **Espacement**
  - `--space-section`: rythme vertical responsive des sections
  - `--radius-panel`: rayon principal des panneaux

## Structure projet

```text
app/
  education/page.tsx
  market/page.tsx
  observatoire/page.tsx
  private/page.tsx
  globals.css
  layout.tsx
  page.tsx
components/
  footer.tsx
  header.tsx
  homepage.tsx
data/
  content.ts
```

## Démarrage

```bash
npm install
npm run dev
```

Puis ouvrir `http://localhost:3000`.
