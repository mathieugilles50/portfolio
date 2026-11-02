# Portfolio — Mathieu Gilles

Site portfolio statique construit avec [Astro](https://astro.build), animé avec GSAP, déployé sur Cloudflare Pages.

Deux habillages dans un seul site :
- **Mouvement** (par défaut) : sombre, jaune électrique, galerie horizontale, animations.
- **Mode simple** (bouton dans l'en-tête) : clair, sobre, grille classique, presque sans animation. Le choix est mémorisé. Les visiteurs qui ont activé « réduire les animations » sur leur appareil arrivent directement en mode simple.

## Démarrer en local

```bash
npm install
npm run dev        # http://localhost:4321
npm run build      # génère le site dans dist/
npm run preview    # sert dist/ en local
```

Node 22 ou plus récent (voir `.nvmrc`).

## Où modifier quoi

| Je veux changer… | Fichier |
|---|---|
| Nom, titre, accroche, email, LinkedIn, CV, disponibilité | `src/data/site.ts` |
| Spécialités et noms des catégories | `src/data/site.ts` |
| Page À propos (texte, parcours, logiciels, qualités, portrait) | `src/data/about.ts` |
| Projets | `src/content/projects/*.md` (voir `AJOUTER-UN-PROJET.md`) |
| Couleurs, polices, mise en page | `src/styles/global.css` (variables en haut du fichier) |
| Animations et interactions | `src/scripts/main.ts` |
| Formulaire de contact (envoi d'email) | `functions/api/contact.ts` |
| Nom de domaine | variable `SITE_URL` (voir `DEPLOIEMENT.md`) |

## Avant la mise en ligne

1. Remplacer les **8 projets d'exemple** (fichiers `exemple-*.md`, marqués « Exemple » sur le site) par de vrais projets.
2. Compléter `src/data/about.ts` : tout ce qui est entre crochets `[...]` est à remplacer.
3. Ajouter le portrait et le CV (PDF dans `public/`, puis `cv: '/cv-mathieu-gilles.pdf'` dans `src/data/site.ts`). Tant que `cv` vaut `null`, les boutons « Télécharger le CV » sont masqués.
4. Configurer le domaine et l'envoi d'emails : `DEPLOIEMENT.md`.

## Structure

```
src/
  assets/           images optimisées automatiquement (WebP/AVIF, tailles multiples)
  components/       Header, Footer, ProjectCard, ContactBand
  content/projects/ un fichier .md par projet
  data/             infos du site, page À propos
  layouts/          BaseLayout (SEO, Open Graph, mode)
  pages/            index, work, work/[slug], about, contact, 404, robots.txt
  scripts/main.ts   GSAP, filtres, galerie, formulaire
  styles/global.css
functions/api/contact.ts   fonction Cloudflare qui envoie les messages du formulaire
public/             fichiers servis tels quels (favicon, image de partage, CV)
```
