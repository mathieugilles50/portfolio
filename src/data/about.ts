import type { ImageMetadata } from 'astro';
import portraitMathieu from '../assets/about/portrait-mathieu.png';
import portraitMathieuJaune from '../assets/about/portrait-mathieu-jaune.png';

/**
 * Contenu de la page À propos, repris du CV (public/cv/CV-Mathieu-Gilles.pdf).
 * Rien ici n'est inventé : modifiez ce fichier si votre parcours évolue.
 * Un champ vide (vision, qualités) masque simplement le bloc correspondant.
 */
export const about = {
  /** Portrait du mode simple (fond orange, comme le CV). */
  portrait: portraitMathieu as ImageMetadata | null,
  /** Même photo sur fond jaune, pour le mode immersif. */
  portraitImmersif: portraitMathieuJaune as ImageMetadata | null,
  portraitAlt: 'Mathieu Gilles, appareil photo en main',
  /** Poste recherché, affiché en accroche au-dessus de la présentation. */
  role: 'Monteur vidéo · Motion designer',
  intro:
    "Diplômé d'un BUT MMI et d'un Master Directeur Artistique Digital, je réalise des films de marque, des publicités et des animations, du tournage au montage final. Après deux ans d'alternance en photo et vidéo et un stage en agence audiovisuelle, je recherche un poste en montage vidéo et motion design.",
  /** Ville et langues, affichées sous le portrait. */
  infos: [
    { label: 'Ville', value: 'Guilberville, Normandie' },
    { label: 'Langues', value: 'Français' },
  ],
  vision: '',
  timeline: [
    { year: '2024 – 2026', title: 'Master Directeur Artistique Digital', place: 'MyDigitalSchool (MDS), Caen · en alternance' },
    { year: '2024 – 2026', title: 'Alternance photo et vidéo', place: 'Design Partner, Vire' },
    { year: '2024', title: 'Stage vidéo et animation · 14 semaines', place: 'Nimi Vision, Vendée' },
    { year: '2023', title: 'Stage vidéo et affiches · 10 semaines', place: 'Mairie de Vire' },
    { year: '2021 – 2024', title: "BUT MMI · Métiers du Multimédia et de l'Internet", place: 'IUT de Saint-Lô' },
  ],
  /** Ce que vous faites concrètement en poste (repris du CV). */
  experience: [
    {
      title: 'Design Partner · Photo et vidéo',
      meta: 'Alternance · 2 ans · 2024 – 2026 · Vire',
      points: [
        'Tournage et captation vidéo, en studio et sur le terrain',
        'Montage et post-production de films de marque et de publicités',
        'Motion design : spots et bannières animés',
        'Déclinaison des vidéos en formats 16:9, 1:1 et 9:16',
        'Photographie produit en studio et reportage',
        "Adaptation du ton et de l'image à plusieurs marques",
      ],
      clients: 'Pour Sainte Armure, Tee-Shirts Express, TH4, Insti Duck, TopQuadri, NCM Embroidery',
    },
    {
      title: 'Nimi Vision · Vidéo et animation',
      meta: 'Stage · 14 semaines · 2024 · Vendée',
      points: [
        "Captation d'événements : course, concert",
        "Montage, dont la bande démo de l'agence",
        'Motion design de présentation des services',
        "Réalisation de vidéos pour les clients de l'agence",
      ],
    },
    {
      title: 'Mairie de Vire',
      meta: 'Stage · 10 semaines · 2023 · Vire',
      points: ['Réalisation de vidéos pour la communication de la ville', "Création d'affiches"],
    },
  ] as { title: string; meta: string; points: string[]; clients?: string }[],
  skills: [
    'Montage vidéo',
    'Motion design et animation 2D',
    'Tournage et captation vidéo',
    'Déclinaisons pour les réseaux (16:9, 1:1, 9:16)',
    'Publicités et films de marque',
    'Photographie et affiches',
  ],
  software: ['Premiere Pro', 'After Effects', 'DaVinci Resolve', 'Photoshop', 'Illustrator', 'InDesign', 'Canva', 'Figma'],
  /** Vide = rubrique « Intérêts » masquée. */
  interests: [] as string[],
  qualities: [] as { title: string; text: string }[],
};
