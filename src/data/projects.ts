import { getCollection, type CollectionEntry } from 'astro:content';

export type Project = CollectionEntry<'projects'>;

/** Tous les projets publiés, triés par ordre puis par année. */
export async function getProjects(): Promise<Project[]> {
  const all = await getCollection('projects', ({ data }) => import.meta.env.DEV || !data.draft);
  return all.sort((a, b) => a.data.order - b.data.order || (b.data.year ?? 0) - (a.data.year ?? 0));
}
