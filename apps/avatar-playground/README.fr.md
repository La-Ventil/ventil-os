# Handoff Designer — Avatar Playground

Ce *playground* sert de base de travail pour le futur système d'avatar partagé.

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

### 4. Des références d'assets obsolètes ont été corrigées dans l'UI du *playground*

Certaines icônes d'interface pointaient vers des fichiers qui n'existaient pas sous ces noms.
Les références ont été réalignées sur les assets réellement présents dans `images/ui/categories/`.

Corrections concrètes :
- `images/ui/categories/face-shape.svg` -> `images/ui/categories/face.svg`
- `images/ui/categories/eyes-style.svg` -> `images/ui/categories/eyes.svg`
- `images/ui/categories/nose-style.svg` -> `images/ui/categories/nose.svg`
- `images/ui/categories/mouth-style.svg` -> `images/ui/categories/mouth.svg`

### 5. Quelques visuels de prévisualisation de coiffures ont été corrigées

Certains boutons de preview ne pointaient pas vers le bon visuel.
Les mappings ont été corrigés pour coller aux vrais noms d'assets.

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

#### Pourquoi `ui/previews` et pas `buttons`
- ces assets sont avant tout des visuels de prévisualisation affichés dans les contrôles d'options
- `*buttons*` décrit surtout l'usage HTML actuel
- `*previews*` décrit mieux leur rôle réel et restera plus pertinent lors de l'extraction du package

#### Pourquoi `ui/categories` et pas `interface`
- `interface` est trop vague
- ces fichiers servent précisément d'icônes de catégories/onglets dans l'éditeur

#### Pourquoi `renderer/` et `ui/`
- `*renderer*/` contient les assets nécessaires à la composition de l'avatar
- `ui/` contient les assets propres à l'interface du *playground*/éditeur
- cette séparation préparera mieux l'extraction future vers un package partagé

Quand une nouvelle option est ajoutée, il faut garder exactement les mêmes noms entre :
- le JSON
- les contrôles de l'éditeur
- les classes CSS
- les dossiers d'assets

Et pour les options facultatives :
- utiliser une valeur vide explicite
- ne pas compter sur des ids implicites ou bidons

## Étape suivante

Le *playground* est maintenant suffisamment cohérent pour être découpé en :
- un package partagé de *renderer*/*editor* d'avatar
- une application *playground* qui consomme ce package
