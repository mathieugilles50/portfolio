/**
 * Informations générales du site.
 * Modifiez ce fichier pour changer le nom, le titre, les liens ou l'accroche.
 */
export const site = {
  name: 'Mathieu Gilles',
  shortName: 'M. Gilles',
  role: 'Créatif multidisciplinaire',
  hook: 'Je transforme les idées en expériences visuelles.',
  description:
    "Portfolio de Mathieu Gilles, créatif multidisciplinaire : vidéo et montage, motion design, graphisme, photographie et UX/UI design.",
  email: 'mathieu.gilles50@gmail.com',
  linkedin: 'https://www.linkedin.com/in/mathieugilles50/',
  /** Chemin du CV dans /public (ex. '/cv/cv-mathieu-gilles.pdf'). Laissez null tant qu'il n'est pas ajouté : les boutons CV sont alors masqués. */
  cv: null as string | null,
  openToWork: true,
  availability: 'Ouvert aux opportunités · emploi, collaborations',
  locale: 'fr_FR',
};

export const specialties = [
  { id: 'video', label: 'Vidéo & montage', short: 'Vidéo', time: '00:00' },
  { id: 'motion', label: 'Motion design', short: 'Motion', time: '00:12' },
  { id: 'graphic', label: 'Graphisme & identité', short: 'Graphisme', time: '00:24' },
  { id: 'photo', label: 'Photographie & retouche', short: 'Photo', time: '00:36' },
  { id: 'uxui', label: 'UX/UI & webdesign', short: 'UX/UI', time: '00:48' },
] as const;

/** Libellés des filtres de la page Work (dans l'ordre du cahier des charges). */
export const categories = {
  video: 'Video',
  motion: 'Motion Design',
  graphic: 'Graphic Design',
  photo: 'Photography',
  uxui: 'UX/UI Design',
} as const;

export type CategoryId = keyof typeof categories;

export const nav = [
  { href: '/work/', label: 'Work' },
  { href: '/about/', label: 'About' },
];
