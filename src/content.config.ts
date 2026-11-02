import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

/**
 * Un projet = un fichier Markdown dans src/content/projects/.
 * Les images vont dans src/assets/projects/ et sont référencées en chemin relatif.
 * Voir AJOUTER-UN-PROJET.md pour la marche à suivre.
 */
const projects = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/projects' }),
  schema: ({ image }) =>
    z.object({
      title: z.string(),
      category: z.enum(['video', 'motion', 'graphic', 'photo', 'uxui']),
      year: z.number().int().optional(),
      description: z.string().max(220),
      cover: image(),
      coverAlt: z.string(),
      gallery: z.array(z.object({ src: image(), alt: z.string(), caption: z.string().optional() })).default([]),
      /** Vidéo principale : fichier dans /public (ex. /videos/projet.mp4) ou lien Vimeo/YouTube. */
      video: z.string().optional(),
      /** Courte boucle muette jouée au survol de la carte sur ordinateur (fichier dans /public). */
      preview: z.string().optional(),
      role: z.string().optional(),
      tools: z.array(z.string()).default([]),
      format: z.string().optional(),
      context: z.string().optional(),
      brief: z.string().optional(),
      objectives: z.array(z.string()).default([]),
      process: z.array(z.object({ title: z.string(), text: z.string() })).default([]),
      results: z.string().optional(),
      conclusion: z.string().optional(),
      featured: z.boolean().default(false),
      order: z.number().default(100),
      /** true = projet de démonstration. Il est signalé comme tel sur le site. Supprimez le fichier quand vous ajoutez vos vrais projets. */
      demo: z.boolean().default(false),
      draft: z.boolean().default(false),
    }),
});

export const collections = { projects };
