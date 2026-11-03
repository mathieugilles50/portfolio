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
    "Portfolio de Mathieu Gilles, créatif multidisciplinaire : vidéo et montage, animation graphique, graphisme, photographie et interfaces web.",
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
  { id: 'motion', label: 'Animation graphique', short: 'Animation', time: '00:12' },
  { id: 'graphic', label: 'Graphisme & identité', short: 'Graphisme', time: '00:24' },
  { id: 'photo', label: 'Photographie & retouche', short: 'Photo', time: '00:36' },
  { id: 'uxui', label: 'Interfaces & sites web', short: 'Web', time: '00:48' },
] as const;

/** Libellés des filtres de la page Réalisations (dans l'ordre du cahier des charges). */
export const categories = {
  video: 'Vidéo',
  motion: 'Animation',
  graphic: 'Graphisme',
  photo: 'Photographie',
  uxui: 'Interfaces web',
} as const;

export type CategoryId = keyof typeof categories;

export const nav = [
  { href: '/realisations/', label: 'Réalisations' },
  { href: '/a-propos/', label: 'À propos' },
];
