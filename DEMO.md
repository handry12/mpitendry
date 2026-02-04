# Guide de démonstration — Mpitendry Malagasy

Ce guide permet de faire une démo complète de l’application en quelques minutes.

## Prérequis

- Node.js installé
- Deux terminaux (ou un terminal + une tâche en arrière-plan)

## 1. Démarrer l’application

**Terminal 1 — API (SQLite)**  
```bash
cd c:\work2026\mpitendry
npm run server
```
Attendre le message : `Serveur API SQLite sur http://localhost:3001`  
Si la base est vide, vous verrez : `6 membres de démo insérés.`

**Terminal 2 — Interface**  
```bash
cd c:\work2026\mpitendry
npm run dev
```
Ouvrir l’URL indiquée (souvent `http://localhost:5173`).

---

## 2. Parcours de démo

### Étape A — Page d’accueil
- Lire le titre : « Valoriser le Patrimoine Musical Malagasy ».
- Vérifier les **3 cartes** : nombre de membres (ex. 6 mpitendry), CIN, nombre de professeurs (ex. 4 manabe).
- Lire la **zone Demo** en bas : mot de passe admin = `admin`.
- Cliquer sur **L’Annuaire**.

### Étape B — Annuaire public
- Voir la liste des **6 musiciens de démo** (noms, instruments, expérience, enseignement).
- Utiliser la **recherche** : taper « Valiha » ou « Rakoto » pour filtrer.
- Vérifier le badge **CIN Verified / Privé** sur chaque carte (données CIN non affichées).

### Étape C — Inscription
- Cliquer **S’inscrire** (navbar ou bouton accueil).
- Remplir les **3 étapes** du formulaire (ex. nom, prénom, date de naissance ; CIN ; instruments, expérience, enseignement).
- Envoyer : un toast de succès s’affiche et le formulaire se réinitialise.
- Retourner à **L’Annuaire** : le nouveau membre apparaît (sans CIN).

### Étape D — Espace Admin
- Cliquer **Admin** dans la barre de navigation.
- Saisir le mot de passe : **admin** → Connexion.
- Voir la **liste complète** des membres avec **toutes les données** (y compris CIN, dates, lieux).
- Tester **Supprimer** : cliquer sur la poubelle, confirmer avec « Eny (Oui) ».
- (Option) Cliquer **Réinitialiser la démo** : les 6 membres exemples sont rechargés.

### Étape E — Déconnexion
- Cliquer **Mivoaka (Déconnexion)**.
- Vous revenez à l’accueil ; pour réaccéder à l’admin, il faut se reconnecter.

---

## 3. Données de démo (exemples)

| Nom | Prénoms | Instruments | Enseigne |
|-----|---------|-------------|----------|
| Rakoto | Jean François | Valiha, kabosy | Oui |
| Randriamampionona | Marie Claudine | Piano, chant | Oui |
| Rasolondraibe | Andry | Guitare, basse, sodina | Non |
| Razafindrakoto | Lalao | Valiha, lokanga, chant | Oui |
| Andriamanantena | Hery | Marovany, accordéon | Oui |
| Rajaonarison | Solo | Batterie, percussion malagasy | Non |

Les CIN et données administratives sont **uniquement visibles dans l’espace Admin**.

---

## 4. Réinitialiser la démo complètement

- **Depuis l’interface** : Admin → **Réinitialiser la démo** (recharge les 6 membres exemples, efface les autres).
- **Depuis le serveur** : supprimer le fichier `server/mpitendry.db`, puis redémarrer `npm run server` : la base sera recréée et les 6 membres de démo réinsérés.

---

## 5. Comptes et sécurité

- **Admin** : mot de passe par défaut `admin`. En production, définir la variable d’environnement `ADMIN_PASSWORD`.
- **Public** : pas de compte ; l’inscription enregistre uniquement les données du formulaire (CIN jamais affiché dans l’annuaire).
