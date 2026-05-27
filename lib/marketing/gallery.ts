export type GalleryItem = {
  src: string;
  alt: string;
  caption?: string;
};

/**
 * Gallery images for the landing page.
 *
 * Put the files in `public/images/gallery/` with the matching names.
 */
export const GALLERY_IMAGES: GalleryItem[] = [
  {
    src: "/images/gallery/npsc-students-badges.png",
    alt: "NPSC student badges and lanyards on a table",
    caption: "Student registration badges",
  },
  {
    src: "/images/gallery/npsc-delegates-photo-wall.png",
    alt: "Two delegates posing in front of the NPSC backdrop",
    caption: "Delegates at the photo wall",
  },
  {
    src: "/images/gallery/npsc-main-stage.png",
    alt: "The NPSC main stage and lectern set up at the venue",
    caption: "Main stage setup",
  },
  {
    src: "/images/gallery/npsc-cultural-performance.png",
    alt: "Cultural performance at NPSC with drummers and a dancer",
    caption: "Cultural performance",
  },
  {
    src: "/images/gallery/npsc-keynote-audience.png",
    alt: "Keynote speaker on stage with the audience seated in the hall",
    caption: "Keynote session",
  },
];

