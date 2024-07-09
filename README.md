🚧 **Statut :** *En attente de financement de la preuve de concept.*

# Ventil O.S.

Logiciel pédagogique de [La-Ventil](https://la-ventil.org/), tiers-lieu d'innovation pédagogique en lycée.

> **Ventil O.S.** est une boîte à outils numérique pédagogique pour soutenir la démarche de nouvel apprentissage testé depuis 
> cinq années d’expérimentations dans le tiers-lieu étudiant de **La-Ventil** au [lycée Louis Aragon Picasso de Givors](https://aragon-picasso.ent.auvergnerhonealpes.fr/).
>
> Fruit de plusieurs ateliers de co-conception avec les élèves, les enseignants et  des professionnels spécialistes 
> de l’ergonomie et du développement, ce logiciel en ligne donne la possibilité à tous les acteurs du lieu, élèves, 
> professionnels, collectivités et enseignants de former, se former, fluidifier l’utilisation du lieu et favoriser l’autonomie en seul outil facile d’emploi.
> 
> **Favoriser les nouvelles approches pédagogiques avec des outils avancée pour open badge :**
> - créer, utiliser des open badges (micro-formations) pour valider les savoir-faire et savoir-être, délivrer ces formations par les enseignants, les professionnels intervenants mais aussi entre élèves eux-mêmes pour une valorisation de la pédagogie active.
>
> **Fluidifier l’accès au lieu et sa sécurité avec un outil de pilotage de l’accès :**
> - Donner accès aux lieux de **La-Ventil**, ses services et ses machines au travers d’open badges spéciaux valorisant l’autonomie des élèves et des intervenants extérieurs.
>
> **Visualiser des données statistiques pour évaluation formative du projet :**
> - Rendre tangible l’échange entre les élèves dans le lieu au travers des évènements pédagogiques et la fréquentation lors de temps non scolaires (fab lab, repair café, design lab, coworking …) sur la formation, utilisation des services et machines, mesure la porosité du lieu avec son territoire (échange avec particuliers, associations collectivités et professionnels pour l’animation du lieu)

### Build

```sh
npm build
```

### Develop

```sh
npm dev
```

## Stack Technique

**Monorepo** géré à l'aide de [Turborepo](https://turbo.build/) et `npm` :

- Une PWA (Progressive web app) en [Next.js](https://nextjs.org/)
  - App Router & server actions
  - Prisma
  - Playwright
  - (*eventuellement [`trpc`](https://trpc.io/) si les besoins d'API deviennent plus important*)
- Une "passerelle SMS": un micro service permettant la réception et l'envoi de SMS à l'aide d'un modem basé sur une module GSM GSM/GPRS SIM800C (ou SIM800L)


Toutes les `apps` et `packages` sont 100% [TypeScript](https://www.typescriptlang.org/).

### Docker

This repo is configured to be built with Docker, and Docker compose. To build all apps in this repo:

```
# Create a network, which allows containers to communicate
# with each other, by using their container name as a hostname
docker network create app_network

# Build prod using new BuildKit engine
COMPOSE_DOCKER_CLI_BUILD=1 DOCKER_BUILDKIT=1 docker-compose -f docker-compose.yml build

# Start prod in detached mode
docker-compose -f docker-compose.yml up -d
```

Open http://localhost:3000.

To shutdown all running containers:

```
# Stop all running containers
docker kill $(docker ps -q) && docker rm $(docker ps -a -q)
```

### Remote Caching

Includes optional remote caching. In the Dockerfiles of the apps, uncomment the build arguments for `TURBO_TEAM` and `TURBO_TOKEN`. Then, pass these build arguments to your Docker build.

You can test this behavior using a command like:

`docker build -f apps/web/Dockerfile . --build-arg TURBO_TEAM=“your-team-name” --build-arg TURBO_TOKEN=“your-token“ --no-cache`

### Utilities

This repo has some additional tools already setup for you:

- [TypeScript](https://www.typescriptlang.org/) for static type checking
- [ESLint](https://eslint.org/) for code linting
- [Jest](https://jestjs.io) test runner for all things JavaScript
- [Prettier](https://prettier.io) for code formatting
