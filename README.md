# Mpitendry Malagasy — Annuaire des Musiciens Malagasy

Application React (SPA) : annuaire des musiciens malgaches, avec inscription multi-étapes et annuaire public. Thème culturel et professionnel.

## Stack

- **React** (Vite) — composants fonctionnels et Hooks
- **Tailwind CSS** — design system (primary `#1e3a5f`, accent `#c6a87c`, background `#fdfbf7`)
- **Lucide React** — icônes
- **SQLite** — base de données (serveur Express, fichier `server/mpitendry.db`)

## Démarrage

1. **Installation**
   ```bash
   npm install
   ```

2. **Lancer le serveur API (SQLite)**  
   Dans un premier terminal :
   ```bash
   npm run server
   ```
   Le serveur écoute sur `http://localhost:3001`. La base SQLite est créée automatiquement dans `server/mpitendry.db`.

3. **Lancer l’application en développement**  
   Dans un second terminal :
   ```bash
   npm run dev
   ```
   Vite redirige les appels `/api` vers le serveur (proxy).

4. **Build production**
   ```bash
   npm run build
   npm run preview
   ```
   En production, le serveur Express sert à la fois l’API et les fichiers statiques (`dist`).

### Déploiement Plesk

1. **Build** : `npm run build` (ou **Run script** `deploy` = install + build)
2. **Node.js** (Plesk) : activer, mode Production, fichier de démarrage `server/index.js`
3. **NPM Install** puis **Run script** `build` (pour créer `dist/`)
4. Variables : `ADMIN_PASSWORD`, `NODE_ENV=production`
5. **Important** : Ne pas utiliser « Run script » avec `start` — Plesk démarre l’app automatiquement via le fichier de démarrage

**Démo** : au premier lancement, si la base est vide, **6 membres exemples** sont insérés automatiquement (Valiha, piano, guitare, etc.). Voir [DEMO.md](DEMO.md) pour un parcours de démonstration pas à pas.

## Fonctionnalités

- **Accueil** : hero « Valoriser le Patrimoine Musical Malagasy », 3 cartes (Communauté, Sécurité CIN, Visibilité), boutons S'inscrire / L'Annuaire.
- **Inscription** : formulaire en 3 étapes (Identité, Données confidentielles CIN, Profil musical), indicateur de progression, enregistrement en SQLite.
- **Annuaire** : liste des musiciens (nom, instruments, expérience, statut enseignant), recherche par nom ou instrument, badge « CIN Verified / Privé » (données CIN jamais renvoyées par l’API).
- **Admin** : espace protégé par mot de passe (lien « Admin » dans la barre de navigation). Connexion avec le mot de passe configuré côté serveur ; accès à la liste complète des membres (y compris CIN et données administratives) et suppression d’un membre. Déconnexion et confirmation de suppression dans l’interface (pas d’alertes navigateur).

## Accès admin

- Par défaut, le mot de passe admin est `admin`. En production, définir la variable d’environnement **`ADMIN_PASSWORD`** :
  ```bash
  set ADMIN_PASSWORD=votre_mot_de_passe_secret
  npm run server
  ```
- La session admin expire après 24 h ; il faut se reconnecter.

## Cohérence & qualité

- **Backend** : validation des champs requis et des longueurs sur `POST /api/members` ; réponses d’erreur au format `{ error: "message" }` ; trim des chaînes avant enregistrement.
- **UI/UX** : design system (classes `input-base`, `btn-primary`, `btn-accent`, `btn-outline`, `card`) ; composants partagés `LoadingSpinner`, `EmptyState` ; états chargement / erreur / vide gérés sur Annuaire et Admin ; focus visible pour l’accessibilité.
- **Navigation** : libellé unique « Hisoratra anarana » pour l’inscription (navbar + page) ; lien « Aller au contenu » (skip link) pour la navigation au clavier.

## Langue

Interface bilingue : texte principal en malagasy, sous-titres / indications en français entre parenthèses.

## Logo

La barre de navigation affiche le texte **MPITENDRY**. Pour utiliser une image de logo, placer le fichier dans `public/logo.png` et l’afficher dans `src/components/Navbar.jsx` si besoin.
