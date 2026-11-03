# Ajouter un projet

Chaque projet est un fichier Markdown dans `src/content/projects/`. Le nom du fichier devient l'adresse de la page : `mon-projet.md` → `/realisations/mon-projet/`.

## 1. Les images

Placez les images dans `src/assets/projects/` (JPG, PNG ou WebP, environ 2000 px de large suffit). Astro les convertit en WebP/AVIF et génère plusieurs tailles automatiquement.

Pour une vidéo hébergée sur le site (aperçu au survol, ou vidéo courte), placez le fichier `.mp4` dans `public/videos/`. Pour une vidéo longue, utilisez plutôt un lien YouTube ou Vimeo.

## 2. Le fichier

Le plus simple : dupliquez un fichier `exemple-*.md` de la même discipline, renommez-le, puis remplissez-le.

```yaml
---
title: "Nom du projet"
category: video            # video | motion | graphic | photo | uxui
year: 2025
description: "Une ou deux phrases affichées sur la carte (220 caractères max)."
cover: ../../assets/projects/mon-projet-cover.jpg
coverAlt: "Description de l'image pour les lecteurs d'écran"

# Facultatif : vidéo principale (fichier ou lien YouTube / Vimeo)
video: https://vimeo.com/123456789
# Facultatif : petite boucle muette jouée au survol de la carte
preview: /videos/mon-projet-loop.mp4

role: "Montage, étalonnage"
tools: ["Premiere Pro", "DaVinci Resolve"]
format: "Film de 3 min"

context: "Pour qui, dans quel cadre."
brief: "La demande de départ."
objectives:
  - "Objectif 1"
process:
  - title: Recherche
    text: "…"
results: "Ce qui a été livré."
conclusion: "Ce que le projet vous a apporté."

gallery:
  - src: ../../assets/projects/mon-projet-1.jpg
    alt: "Description"
    caption: "Légende facultative"

featured: true    # true = affiché dans la sélection de l'accueil (3 max conseillé)
order: 1          # ordre d'affichage, du plus petit au plus grand
demo: false       # true = badge « Exemple »
draft: false      # true = masqué du site publié
---
```

Toutes les sections (contexte, brief, objectifs, rôle, logiciels, processus, rendus, conclusion) sont facultatives : une section vide n'est simplement pas affichée. Adaptez selon la discipline : une série photo peut se limiter à un contexte et une galerie, un projet UX/UI détaillera le processus.

## 3. Retirer un projet d'exemple

Supprimez le fichier `exemple-….md` et ses images dans `src/assets/projects/`. Les filtres de la page Réalisations se mettent à jour seuls (un filtre sans projet est grisé).

## 4. Vérifier

```bash
npm run build
```

Une erreur indique précisément le champ manquant ou mal écrit. Ensuite, un `git push` suffit : Cloudflare Pages republie le site en une ou deux minutes.
