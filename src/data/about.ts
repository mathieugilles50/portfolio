import type { ImageMetadata } from 'astro';

/**
 * Contenu de la page À propos.
 * Tout ce qui est entre crochets [ ] est un emplacement à remplacer par vos propres informations.
 * Rien ici n'a été inventé : complétez uniquement avec ce qui est vrai.
 */
export const about = {
  /** Remplacez par import portrait from '../assets/about/votre-photo.jpg' puis portrait: portrait */
  portrait: null as ImageMetadata | null,
  portraitAlt: 'Portrait de Mathieu Gilles (image provisoire)',
  intro: '[Deux ou trois phrases pour vous présenter : qui vous êtes, ce que vous cherchez, et ce qui relie vos cinq disciplines.]',
  vision: '[Votre phrase de vision de la création]',
  timeline: [
    { year: '[Année]', title: '[Formation ou poste]', place: '[Lieu ou structure]' },
    { year: '[Année]', title: '[Formation ou poste]', place: '[Lieu ou structure]' },
    { year: '[Année]', title: '[Formation ou poste]', place: '[Lieu ou structure]' },
  ],
  software: ['[Logiciel]', '[Logiciel]', '[Logiciel]', '[Logiciel]', '[Logiciel]', '[Logiciel]'],
  qualities: [
    { title: '[Qualité 1]', text: '[Un exemple concret qui la montre]' },
    { title: '[Qualité 2]', text: '[Un exemple concret qui la montre]' },
    { title: '[Qualité 3]', text: '[Un exemple concret qui la montre]' },
  ],
};
