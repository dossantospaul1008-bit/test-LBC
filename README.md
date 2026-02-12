# La Bonne Seed — Mini marketplace (Supabase + PayPal)

Ce projet est un front-end HTML/CSS/JS prêt pour GitHub Pages avec :

- Authentification Supabase (inscription / connexion / déconnexion)
- Publication et affichage d'annonces
- Messagerie entre utilisateurs
- Bouton PayPal côté client (démo)

## 1) Configuration locale

1. Créez un projet Supabase
2. Exécutez `supabase/schema.sql` dans l'éditeur SQL Supabase
3. Copiez `config.example.js` en `config.js`
4. Remplissez vos clés Supabase + PayPal dans `config.js`

> `config.js` est ignoré par git pour ne pas publier vos clés.

## 2) Lancer en local

```bash
python3 -m http.server 4173 --bind 0.0.0.0
```

Puis ouvrez `http://127.0.0.1:4173`.

## 3) Déployer sur GitHub Pages

1. Push sur votre repo GitHub
2. `Settings > Pages`
3. Source: `Deploy from a branch`
4. Branche: `main` (ou votre branche de déploiement), dossier `/ (root)`
5. Vérifiez que `config.js` existe bien dans votre branche de déploiement

## 4) Requêtes SQL utiles

Des requêtes prêtes à l'emploi sont fournies dans `supabase/queries.sql`.
