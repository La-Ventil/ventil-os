# Ventil O.S. — Présentation et guide d’installation

## À propos

Ventil O.S. est l’application web de La Ventil, un tiers-lieu éducatif et collaboratif.

Le produit couvre principalement :

- gestion des utilisateurs
- attribution et suivi des open badges
- réservation de machines
- organisation d’événements
- statistiques d’usage

Stack principale :

- Next.js
- React
- Prisma
- PostgreSQL
- Material UI

## Prérequis

- Node.js `>= 20.19.0`
- PNPM
- Docker

## Configuration

Créer un fichier `.env` dans `apps/web` :

```env
NEXT_TELEMETRY_DISABLED=1
NEXTAUTH_SECRET=usedToEncryptTheNextAuthJwt
SECRET_PEPPER=ThisIsTheVentilOSSecretPepperToSpiceThingsUpALittleBit
DATABASE_URL="postgresql://ventilos:ventilos@localhost:5433/ventilos?schema=public"
BREVO_API_KEY=xkeysib-xxx
APP_NAME=VentilOS
BASE_URL=http://localhost:3000
UPLOADS_DIR=apps/web/uploads
UPLOADS_PUBLIC_PATH=/uploads
PORT=3000
```

Créer un fichier `.env` dans `packages/db/` :

```env
DATABASE_URL="postgresql://ventilos:ventilos@localhost:5433/ventilos?schema=public"
SECRET_PEPPER=ThisIsTheVentilOSSecretPepperToSpiceThingsUpALittleBit
```

## Démarrage rapide

```bash
pnpm install
docker compose up
pnpm db:deploy
pnpm db:generate
pnpm --filter web dev
```

Application :

- `http://localhost:3000`

Base de données :

- `localhost:5433`

## Structure du monorepo

```text
docs/        documentation canonique
apps/web     application principale Next.js
apps/docs    site de documentation
apps/sms     service Node.js
apps/storybook
apps/belle-binette

packages/domain
packages/application
packages/db
packages/ui
packages/form
packages/avatar-system
packages/storage
packages/crypto
packages/logger
packages/eslint-config
packages/typescript-config
packages/jest-presets
```

## Commandes utiles

Depuis la racine du repo :

- `pnpm dev`
- `pnpm build`
- `pnpm lint`
- `pnpm check-types`
- `pnpm test`
- `pnpm db:deploy`
- `pnpm db:generate`
- `pnpm db:seed`

Commandes ciblées :

- `pnpm --filter web dev`
- `pnpm --filter web build`
- `pnpm --filter web check-types`
- `pnpm --filter belle-binette dev`
- `pnpm --filter belle-binette build`
- `pnpm --filter belle-binette serve`

## Documentation

Documentation canonique :

- contributeurs : `docs/contributor/`
- utilisateurs : `docs/user/`
- ADRs : `docs/contributor/adr/`
- stratégie de test : `docs/contributor/testing/README.md`
- guide de contribution : `docs/contributor/contributing.md`

Règle :

- `docs/` est la source de vérité de la documentation
- `apps/docs` est une couche de présentation uniquement
- les conventions propres à un package vivent dans son `README.md`
- les règles transverses vivent dans les ADRs

Points d’entrée utiles :

- `packages/form/README.md`
- `packages/avatar-system/README.md`
- `apps/belle-binette/README.md`

## Déploiement

Voir :

- `docs/contributor/adr/ADR-013-release-process.md`
- `scripts/release.sh`

Commande de release :

```
pnpm release:prod
```

## Tests

Voir :

- `docs/contributor/testing/README.md`
- `docs/contributor/adr/ADR-015-validation-strategy-and-playwright-scope.md`

Commandes utiles :

- `pnpm test`
- `pnpm --filter web test:e2e`
- `pnpm --filter web test:e2e:journeys`
- `pnpm --filter web test:e2e:a11y`

## Contribution

Guide canonique :

- `docs/contributor/contributing.md`
- `docs/contributor/README.md`
