# Belle Binette

Ce *playground* consomme désormais le système d'avatar partagé.
Le catalogue et les assets propres à l'avatar vivent maintenant dans `packages/avatar-system`.

## Objectif de cette passe

Le but n'était pas de changer la direction artistique de l'avatar, mais il y a bien eu un travail de rationalisation sur sa structure, son vocabulaire et l'organisation de ses assets.
Cette passe visait à rendre le *playground* cohérent en interne afin de pouvoir l'extraire ensuite dans un package réutilisable sans embarquer de dérives de nommage ni de références obsolètes.

## Ce qui a été normalisé

### 1. Le vocabulaire a été aligné

Le *renderer* utilise aujourd'hui les notions suivantes :
- `face`
- `hair`
- `eyes`
- `eyebrows`
- `glasses`
- `nose`
- `mouth`
- `face-details`
- `facial-hair`
- `cheeks`
- `earrings`
- `clothes`

Le JSON de configuration a été réaligné sur ce vocabulaire côté éditeur/configuration.

Note :
- les clés de catégories, les ids d'options et les classes CSS du *renderer* utilisent désormais tous `earrings` de façon cohérente

### 2. Les ids de configuration ont été réalignés sur les ids réellement utilisés dans le *playground*

Les ids suivants sont désormais considérés comme canoniques :
- formes de visage : `face-shape-*`
- détails du visage : `face-details-*`
- boucles d'oreilles : `earrings-*`

### 3. Les options « none » nettoient désormais explicitement la sélection

Pour les parties optionnelles :
- *facial hair*
- *glasses*
- *face details*
- *cheeks*
- *earrings*

les boutons `no` utilisent maintenant `data-value=""`.

Cela évite de dépendre :
- d'un id manquant
- d'une valeur implicite
- d'un faux id technique

Effet attendu :
- cliquer sur `no` retire proprement la classe correspondante

### 4. Des références d'assets éditeur obsolètes ont été corrigées

Certaines icônes d'éditeur pointaient vers des fichiers qui n'existaient pas sous ces noms.
Les références ont été réalignées sur les assets partagés réellement présents dans `packages/avatar-system/src/images/editor/categories/`.

Corrections concrètes :
- `face-shape.svg` -> `face.svg`
- `eyes-style.svg` -> `eyes.svg`
- `nose-style.svg` -> `nose.svg`
- `mouth-style.svg` -> `mouth.svg`

### 5. Quelques visuels de prévisualisation ont été corrigés

Certains boutons de preview ne pointaient pas vers le bon visuel.
Les mappings ont été corrigés pour coller aux vrais noms d'assets.

Avant / après :
- `face-shape-1` -> avant: `b-face-shape-1.svg`, après: `b-face-1.svg`
- `earrings-1` -> avant: `b-earrings-1.svg`, après: `b-earring-1.svg`
- `glasses-3` -> avant: fallback sur l'avatar complet, après: `b-glasses-3.svg`
- `clothes-1` -> avant: fallback sur l'avatar complet, après: `b-clothes-1.svg`

Chemins actuels :
- visage : `packages/avatar-system/src/images/editor/previews/b-face-*.svg`
- cheveux : `packages/avatar-system/src/images/editor/previews/b-hair-*.svg`
- lunettes : `packages/avatar-system/src/images/editor/previews/b-glasses-*.svg`
- boucles d'oreilles : `packages/avatar-system/src/images/editor/previews/b-earring-*.svg`

### 6. Les assets avatar de l'éditeur ont été centralisés

Le package partagé porte maintenant tous les visuels spécifiques à l'avatar :
- les assets du *renderer*
- les icônes de catégories de l'éditeur
- les previews d'options de l'éditeur

Structure actuelle :
- `packages/avatar-system/src/images/renderer/...`
- `packages/avatar-system/src/images/editor/categories/...`
- `packages/avatar-system/src/images/editor/previews/...`

Conséquence :
- `apps/belle-binette` n'est plus la source de vérité des images d'éditeur
- `apps/web` n'embarque plus de copie dédiée de `avatar-previews`
- le *playground* et le hub consomment le même jeu d'assets

### 7. Toutes les catégories du catalogue sont désormais visibles

Le catalogue d'édition est maintenant directement piloté par `packages/avatar-system/src/avatar.json`.
Il n'y a plus de flag `visible` séparé.

Conséquence :
- toute catégorie présente dans `avatar.json` est considérée comme exposée dans l'éditeur
- si une catégorie ne doit pas apparaître, elle doit être retirée du catalogue ou déplacée ailleurs

### 8. Les clés de couleurs ne dépendent plus de l'ordre

Les clés de sélection des couleurs sont maintenant dérivées des ids, pas de la position des groupes dans le JSON.

Exemples :
- `face` + `skin` -> `face-skin-color`
- `hair` + `hair` -> `hair-color`
- `glasses` + `frame` -> `glasses-frame-color`
- `glasses` + `tiles` -> `glasses-tiles-color`

Conséquence :
- réordonner les groupes de couleurs dans `avatar.json` ne change plus le contrat de persistance

## Changements concrets

### Catégories / configuration

Dans `avatar.json` :
- `facial-details` -> `face-details`
- `earring` -> `earrings`
- le label de `glasses` a été corrigé (`eyebrows` -> `glasses`)
- le label de `cheeks` a été corrigé (`clothes` -> `cheeks`)

### Ids de visage

Dans `avatar.json` :
- `face-1`, `face-2`, `face-3`, `face-4`

ont été remplacés par les ids réellement utilisés dans le *playground* :
- `face-shape-1`
- `face-shape-2`
- `face-shape-5`
- `face-shape-6`

### Ids de détails du visage

Dans `avatar.json` :
- `facial-details-*`

ont été remplacés par :
- `face-details-*`

### Boucles d'oreilles

Le vocabulaire est maintenant aligné partout :
- catégorie : `earrings`
- ids d'options : `earrings-*`
- classe CSS *renderer* : `.earrings`
- dossier d'assets : `images/renderer/earrings/`

## Options retirées de la configuration

Ces entrées existaient dans le JSON mais n'étaient pas exposées proprement par le *playground* actuel :
- `hair-102`
- `hair-202`
- `eyes-15`
- `earrings-8`
- anciennes couleurs obsolètes non exposées

Cela ne veut pas dire qu'elles sont interdites.
Cela signifie simplement qu'elles ne font pas partie du contrat propre et cohérent du *playground* à ce stade.

Si on souhaite les remettre, il faudra les réintroduire volontairement dans :
- la configuration
- les assets
- les contrôles UI
- le CSS du *renderer*

## Options rajoutées dans la configuration car elles existent réellement dans le *playground*

Ces options existaient bien dans l'UI et les assets mais étaient absentes du JSON normalisé :
- `hair-210`
- `hair-218`
- `hair-403`

Elles ont été réintégrées pour que la configuration corresponde enfin au *playground* réel.

## Ce qui n'a pas changé

Cette passe n'avait pas pour but de modifier la direction artistique, mais elle a bien touché à la structure technique du système :
- pas de changement de style ou d'intention graphique
- pas de changement du layering du *renderer*
- pas de modification du dessin des SVG
- réorganisation des noms et des dossiers d'assets
- pas de refonte profonde de l'éditeur

## Règles recommandées pour la suite

## Règle de nommage

Utiliser un seul nom canonique en kebab-case pour chaque feature d'avatar, puis réutiliser exactement ce même nom partout : clés de configuration, ids de l'éditeur, valeurs `data-type`, classes CSS du *renderer* et dossiers d'assets.

Règle simple :
- choisir un seul nom de feature
- le garder en kebab-case
- ne pas mélanger singulier et pluriel
- ne pas conserver une version camelCase en parallèle d'une version kebab-case
- réutiliser le même nom dans le code, le HTML, le CSS et les dossiers

Exemples :
- `face-details` partout
- `facial-hair` partout
- `earrings` partout

### Pourquoi ces choix

#### Pourquoi `face-details` et pas `facial-details`
- `*face details*` est plus naturel dans un contexte produit/éditeur
- `*facial details*` sonne plus technique et moins idiomatique
- l'objectif est d'utiliser l'expression anglaise la plus claire, pas de forcer une symétrie artificielle

#### Pourquoi `facial-hair` et pas `face-hair`
- `*facial hair*` est l'expression anglaise standard
- `*face hair*` sonne faux en anglais courant

#### Pourquoi `earrings`
- cette feature est traitée comme une famille d'options
- le pluriel est plus naturel ici et s'accorde mieux avec le reste du vocabulaire du *playground*
- une fois ce nom choisi, il faut l'utiliser partout au lieu de garder `earring` et `earrings` côte à côte

#### Pourquoi `editor/previews` et pas `buttons`
- ces assets sont avant tout des visuels de prévisualisation affichés dans les contrôles d'options
- `*buttons*` décrit surtout un usage UI
- `*previews*` décrit mieux leur rôle réel

#### Pourquoi `editor/categories` et pas `interface`
- `interface` est trop vague
- ces fichiers servent précisément d'icônes de catégories/onglets dans l'éditeur

#### Pourquoi `renderer/` et `editor/` dans le même package
- `*renderer*/` contient les assets nécessaires à la composition de l'avatar
- `editor/` contient les assets propres à l'édition de l'avatar
- les deux sont spécifiques à l'avatar, donc ils vivent maintenant dans le même package partagé
- cela supprime les duplications entre le *playground* et le hub

Quand une nouvelle option est ajoutée, il faut garder exactement les mêmes noms entre :
- le JSON
- les contrôles de l'éditeur
- les classes CSS
- les dossiers d'assets

Et pour les options facultatives :
- utiliser une valeur vide explicite
- ne pas compter sur des ids implicites ou bidons

## Répartition actuelle

La répartition actuelle est :
- `packages/avatar-system`
  - configuration avatar
  - *renderer*
  - assets du *renderer*
  - assets d'éditeur
- `apps/belle-binette`
  - application *playground* qui consomme le package partagé

## Build lisible

Pour générer un build local lisible :

```bash
pnpm --filter belle-binette build
```

Le résultat est écrit dans :
- `apps/belle-binette/dist/`

Ce build est configuré pour rester lisible :
- pas de hash dans les noms de fichiers
- pas de minification
- source maps activées
- assets avatar rangés dans `dist/assets/images/...`
