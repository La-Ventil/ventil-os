# Ventil O.S. — Présentation et guide d’installation

## 🌀 À propos de La Ventil et du projet Ventil O.S.

**La Ventil** est un tiers-lieu éducatif et collaboratif implanté au sein d’un lycée.  
On y retrouve un fablab, un espace de coworking et des ateliers ouverts favorisant l’expérimentation, la pédagogie active et l’autonomie des élèves, enseignants et intervenants extérieurs.

**Ventil O.S.** est l’application web développée pour soutenir ces activités.  
Elle permet de :
- gérer les utilisateurs (élèves, intervenants, enseignants, visiteurs) ;
- attribuer et suivre des *open badges* ;
- organiser des événements et réserver des machines ;
- collecter des données statistiques pour mesurer les usages du lieu.

Cette première version du logiciel est une PWA (Progressive Web App) basée sur **Next.js**, **Prisma**, **Material UI** et **PostgreSQL**.

--- 

## ⚙️ Prérequis

- Node.js ≥ 20
- PNPM ≥ 9
- Docker (pour la base PostgreSQL)
- Un éditeur compatible TypeScript (VSCode conseillé)

---

## 🧩 Configuration environnement

Créer un fichier `.env` dans `apps/web` :

```env
NEXT_TELEMETRY_DISABLED=1
NEXTAUTH_SECRET=usedToEncryptTheNextAuthJwt
SECRET_PEPPER=ThisIsTheVentilOSSecretPepperToSpiceThingsUpALittleBit
DATABASE_URL="postgresql://ventilos:ventilos@localhost:5433/ventilos?schema=public"
BREVO_API_KEY=xkeysib-xxx
APP_NAME=VentilOS
BASE_URL=http://localhost:3000
UPLOADS_DIR=apps/web/public/uploads
UPLOADS_PUBLIC_PATH=/uploads
PORT=3000
```

Et un fichier `.env` dans `packages/db/` :
```env
DATABASE_URL="postgresql://ventilos:ventilos@localhost:5433/ventilos?schema=public"
SECRET_PEPPER=ThisIsTheVentilOSSecretPepperToSpiceThingsUpALittleBit
```

---

## 🚀 Démarrage rapide 

```bash
# Installer les dépendances
pnpm install

# Démarrer la base de données PostgreSQL
docker compose up

# Appliquer les migrations Prisma
pnpm db:deploy

# Générer le client Prisma
pnpm db:generate

# Lancer le front Next.js
pnpm --filter=web dev
```

➡️ Application : [http://localhost:3000](http://localhost:3000)  
➡️ Base de données : `localhost:5433` (`ventilos / ventilos`)

---

## 📁 Structure du monorepo

```
apps/
  web/        → application principale Next.js (App Router)
  docs/       → documentation interne (Next.js)
  sms/        → service Node.js (hors périmètre front)
  storybook/  → catalogage UI (Storybook)

packages/
  ui/         → bibliothèque de composants React (MUI, CSS Modules)
  form/       → helpers + hooks de formulaires partagés
  domain/     → modèles métier (types, enums, règles pures)
  view-models/→ DTOs orientés UI
  application/→ use-cases + schemas de formulaires + mappers
  crypto/     → utilitaires de chiffrement/hachage
  db/         → Prisma (schéma, migrations, seed)
  logger/     → utilitaires de logs
  jest-presets/→ presets Jest partagés
  eslint-config/, typescript-config/ → configurations partagées
```

💡 Pour l’intégration front :  
se concentrer sur `apps/web` (pages, layouts) et `packages/ui` (thème + composants).

---

## 🧭 Couches & data flow

**Couches**
- **Domain** : types métier stables, pas de dépendance DB/UI.
- **Application** : use-cases, validation (schemas), mappers vers view-models.
  - Use-cases suivent l’intention “user story” et sont suffixés `*.command.ts` / `*.query.ts`.
- **DB** : accès données (Prisma, repositories).
- **UI** : composants + pages Next.js.

**Flux recommandé**
UI → application → db → application (mappers) → view-models → UI

📌 Voir ADR‑006 pour les règles d’architecture détaillées.

---

## 🧱 Structure du front (Next.js 15 + App Router)

```
apps/web/app/
 ├── (public)/              → pages publiques (connexion, inscription, mot de passe)
 ├── hub/                   → espace utilisateur connecté
 │    ├── profile/                  → fiche utilisateur
 │    ├── settings/                 → paramètres
 │    ├── events/                   → événements
 │    ├── support/                  → support
 │    └── layout.tsx
 ├── layout.tsx              → layout global
 ├── api/                    → routes internes (auth, i18n, etc.)
 ├── i18n/                   → configuration next-intl
 └── messages/               → fichiers de traduction (.json)
```

---

## 🎨 Intégration UI (Material UI + CSS Modules)

### Technologies

- [Material UI (MUI)](https://mui.com/)
- [React Hook Form](https://react-hook-form.com/) + [Zod](https://github.com/colinhacks/zod)

### Règles de styling (ADR‑001)

- **CSS Modules preferred** pour les composants partagés.
- **Pas de `styled` / `sx`** dans la UI partagée (sauf exceptions explicites).
- Le **thème MUI** reste la source de vérité (tokens, couleurs).

### Thème global

Défini dans :
```
packages/ui/src/theme.ts
```

Contient :
- Palette (`primary`, `secondary`, `background`, etc.)
- Typographies
- Overrides de composants (ex: `MuiButton`, `MuiInputBase`)

### Styles globaux

Les styles globaux doivent passer par :
```
apps/web/app/globals.css
```

### Modifier ou ajouter un composant

- `packages/ui/src/components/` → composants réutilisables (`button.tsx`, `checkbox.tsx`, etc.)
- `packages/ui/src/components/forms/` → formulaires standards (`inscription.form.tsx`, `profil.form.tsx`, etc.)

📚 Références utiles :
- [Theming MUI](https://mui.com/material-ui/customization/theming/)

---

## 🌐 Traductions i18n (`next-intl`)

### Fichiers de messages

```
apps/web/messages/
  ├── fr.json
  └── en.json
```

### Structure imbriquée (clé hiérarchique)

Exemple :

```json
{
  "pages": {
    "public": {
      "home": {
        "messageBienvenue": "Bienvenue sur l’application de La-Ventil.",
        "messageOnboarding": "Pour commencer l’aventure, merci de saisir les informations ci-dessous."
      }
    }
  },
  "common": {
    "actions": {
      "back": "Retour",
      "retry": "Réessayer"
    },
    "errors": {
      "invalid": "Veuillez vérifier les champs du formulaire."
    }
  },
  "validation": {
    "signup": {
      "firstNameRequired": "Veuillez renseigner votre prénom."
    }
  }
}
```

### Utilisation dans un composant

```tsx
import { useTranslations } from "next-intl";

export default function HomePage() {
  const t = useTranslations("pages.public.home");
  return (
    <>
      <p>{t("messageBienvenue")}</p>
      <p>{t("messageOnboarding")}</p>
    </>
  );
}
```

🧠 Clé complète → `"pages.public.home.messageBienvenue"`  
Les fichiers JSON sont compatibles avec [Weblate](https://docs.weblate.org/en/latest/formats.html#json).

---

## 🧰 Commandes utiles

| Commande                          | Description |
|-----------------------------------|-------------|
| `pnpm install`                    | Installe toutes les dépendances |
| `pnpm dev --filter web`           | Lance l’application web |
| `pnpm db:deploy` | Applique les migrations |
| `pnpm deploy:seed`                | Applique les migrations et exécute le seed (déploiement) |
| `pnpm lint --filter web`          | Vérifie la qualité du code |
| `pnpm lint:dev`                   | Lint du monorepo (peut prendre ~2–3 min) |
| `pnpm -C apps/web lint:dev`       | Lint ciblé (ex: uniquement web) |
| `pnpm check-types --filter web`   | Vérifie les types TypeScript |
| `pnpm test --filter web`          | Lance les tests Playwright |
| `docker compose up -d`            | Lance la base de données |
| `docker compose down`             | Stoppe les conteneurs |

---

## ☁️ Déploiement Clever Cloud (web)

### Variables d’environnement (app web)

Voir `apps/web/.env.production.example` pour la liste complète des variables utilisées.

### Dossier d’application (monorepo)

Configurer l’app pour exécuter `apps/web` :

- `CC_APP_FOLDER=apps/web`, ou
- `CC_RUN_COMMAND=pnpm --filter web start`

### Seed au 1er déploiement

Exécuter une seule fois :

```bash
pnpm deploy:seed
```

---

## 🧪 Tests E2E

Les tests sont situés dans :
```
apps/web/e2e/
apps/web/playwright.config.ts
```

Lancer les tests :
```bash
pnpm test --filter web
```

Rapport HTML : `apps/web/playwright-report/index.html`

---

## 🤝 Contribution

- Les PR sont bienvenues (front, accessibilité, i18n, UI).  
- Le code suit les standards **TypeScript + MUI + Next.js**.  
- Merci de respecter la structure des fichiers de traduction (`fr.json` / `en.json`).  

Avant toute contribution :
```bash
pnpm lint
pnpm --filter web check-types
```

Astuce (timeout) :
```bash
timeout 5m pnpm lint:dev
```

---

## 🪶 Licence

@todo
