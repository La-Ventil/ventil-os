# ADR-001 — Architecture de Styling et Thèmes par Section  
(Next.js App Router + MUI + Styled + Inner Themes)

## Statut
Accepté

## Date
2026-01-14

## Décideurs
Équipe Frontend (développeurs & intégrateurs) + Design

---

## Contexte

Le projet utilise :
- Next.js (App Router)
- Material UI (MUI)
- Un design system partagé (@repo/ui/theme)
- Des sections fonctionnelles reflétées dans les URLs :
  - /fabLab/...
  - /openBadge/...
  - /event/...
  - /user/...
  - /support/...
  - /admin/...
  - /repair/...

Chaque section doit :
- avoir une identité visuelle claire
- être cohérente sur toute sa sous-arborescence
- se distinguer principalement par la **couleur secondaire**

Contraintes :
- Propagation automatique du thème à tous les composants enfants
- Pas de logique conditionnelle dans les composants UI
- Compatibilité SSR / hydration
- Architecture compréhensible par un humain et applicable par une IA

---

## Décision globale

Nous adoptons une architecture de styling **en couches**, avec des **thèmes imbriqués par section** :

- Le **theme MUI est la source de vérité des tokens**, y compris les couleurs
- Le **CSS global applique uniquement le reset et la structure du DOM**
- Les **sections applicatives utilisent des thèmes imbriqués** (ThemeProvider)
- Les composants consomment les valeurs via le theme (palette, typography, etc.)
- **Préférence : CSS Modules pour le styling local** (pas de `sx` ni `styled` dans les composants partagés, sauf cas ultra-local justifié). Les overrides globaux passent par `theme.components.*`.

Principe fondamental :

- Les breakpoints définissent *quand* quelque chose change
- Les tokens définissent *quoi* change
- La section est déterminée par l’URL
- Le thème de section est appliqué au niveau du layout

---

## Architecture et responsabilités

### 1. Theme (@repo/ui/theme) — Source de vérité

Responsabilités :
- Définir l’ensemble des design tokens :
  - couleurs (primary, secondary, etc.)
  - typography
  - spacing
  - shape
- Définir les breakpoints (valeurs numériques)
- Configurer les composants MUI

Autorisé :
- palette, typography, spacing, shape, breakpoints
- components.*.styleOverrides et components.*.variants

Interdit :
- Styles sur html ou body
- Reset CSS global
- Layout global
- CSS media queries dans la typography

Règles :
- Les valeurs de couleurs sont définies **dans le theme**
- Le theme est la **source de vérité**
- Les breakpoints sont des constantes JS

---

### 2. Breakpoints — Règle critique (anti-bug)

Décision explicite :

- Les breakpoints sont **JS-owned**
- Ils NE DOIVENT PAS utiliser de CSS variables
- Ils NE DOIVENT PAS être dynamiques

Autorisé :
- theme.breakpoints.up('md')
- useMediaQuery(theme.breakpoints.up('lg'))

Interdit :
- var(--bp-md) dans breakpoints
- Définition de règles responsives contradictoires (JS + CSS)

Règle de contrat :
- Les breakpoints définis dans le theme sont la référence unique
- Le CSS global ne définit pas de logique responsive métier

---

### 3. Thèmes par section (inner themes)

Décision :

- Chaque section dispose d’un **thème dérivé** du thème global
- Les thèmes de section permettent d’exprimer l’identité propre de chaque domaine fonctionnel
- La variation principale attendue concerne la **couleur secondaire**

Sections concernées :
- fabLab
- openBadge
- event
- user
- support
- admin
- repair

Règles :
- Les thèmes de section sont créés via createTheme(baseTheme, …)
- Les thèmes sont définis au niveau module (pas dans un render)
- Les thèmes de section restent volontairement proches du thème global
- Toute divergence supplémentaire doit être **intentionnelle et justifiée** (UX / design)

---

### 4. Application des thèmes par section (Next.js App Router)

Décision :

- Le thème de section est appliqué **au niveau du layout**
- La section est déterminée par l’URL
- Le ThemeProvider est utilisé comme “inner theme”

Implémentation retenue :
- Un layout explicite par section :
  - app/fabLab/layout.tsx
  - app/openBadge/layout.tsx
  - app/event/layout.tsx
  - etc.

Règles :
- Pas de sélection de thème dans les composants UI
- Pas de logique runtime basée sur le path dans les composants
- Le layout est l’unique point de décision du thème

---

### 5. CSS Global (app/globals.css)

Responsabilités :
- Reset CSS
- Styles globaux du DOM (html, body)
- Structure minimale (hauteur, marges, font-family de base)

Autorisé :
- reset
- styles globaux non métiers

Interdit :
- Définition de tokens de couleur
- Logique de thème ou de section
- Styles applicatifs
- sx ou styled-components

Règle clé :
- Le CSS global **n’est pas la source de vérité des couleurs**
- Il applique uniquement des règles structurelles

---

### 6. Layouts internes — CSS Modules

Responsabilités :
- Structure de page (flex, grid, wrappers)
- Organisation spatiale locale

Règles :
- Pas de tokens définis ici
- Consommation uniquement via le theme

---

### 7. Composants UI — CSS Modules

Décision :
- Les composants applicatifs DOIVENT être stylés via CSS Modules

Responsabilités :
- Styles locaux uniquement
- Consommation du theme (palette, typography, etc.)
- Responsive layout autorisé via theme.breakpoints

Interdit :
- Styles globaux
- createGlobalStyle
- styled(body) ou styled(html)
- Changement de thème dans les composants

Bonnes pratiques CSS Modules :
- Un fichier `.module.css` par composant, au même niveau que le fichier TSX
- Si le composant devient complexe (sous-composants, tests, assets), passer à un dossier par composant
- Classes nommées par slot (`root`, `label`, `caption`, `group`, etc.) plutôt que par intention visuelle
- Préférer `className` sur les slots aux sélecteurs globaux MUI
- Utiliser `:global(...)` uniquement pour cibler des classes 3rd-party
- Limiter la profondeur des sélecteurs (1 à 2 niveaux max)
- Ordre recommandé : container → children → states/variants

---

### 8. CssBaseline (MUI)

Usage :
- Optionnel
- Normalisation légère des styles MUI

Restriction :
- Ne remplace jamais le CSS global
- Ne définit pas de tokens

---

## Hiérarchie des responsabilités (non négociable)

- Theme : source de vérité des tokens et règles
- Thèmes de section : expression de l’identité de domaine
- CSS global : reset et structure DOM
- Layouts : structure de page
- Composants : UI locale

---

## Anti-patterns (à refuser automatiquement)

- Définir des couleurs de section dans le CSS
- Sélectionner le thème dans un composant UI
- Créer un theme dans un render React
- CSS variables dans breakpoints
- sx pour le layout global
- Duplication de valeurs hors theme

---

## Règle finale (humaine & IA)

- La section est définie par l’URL
- Le thème de section est appliqué au niveau layout
- Le theme est la source de vérité des couleurs
- Les composants utilisent le theme sans logique conditionnelle
- Toute variation par section doit être explicite et assumée

---

## Conclusion

Cette architecture garantit :
- Une identité visuelle claire par section
- Une propagation automatique et fiable du thème
- Une séparation nette design / structure / UI
- Une forte cohérence entre routing, UX et design system
- Des règles strictes mais évolutives, exploitables par une IA
