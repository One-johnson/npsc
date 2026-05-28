"use client";

import { useCallback, useMemo, useState } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { Images } from "lucide-react";
import Lightbox from "yet-another-react-lightbox";
import Captions from "yet-another-react-lightbox/plugins/captions";
import Slideshow from "yet-another-react-lightbox/plugins/slideshow";
import Thumbnails from "yet-another-react-lightbox/plugins/thumbnails";
import "yet-another-react-lightbox/styles.css";
import "yet-another-react-lightbox/plugins/captions.css";
import "yet-another-react-lightbox/plugins/thumbnails.css";
import Zoom from "yet-another-react-lightbox/plugins/zoom";
import { SectionHeading } from "@/components/marketing/section-heading";
import { cn } from "@/lib/utils";
import { fadeUp, staggerContainer } from "@/components/motion";
import { GALLERY_IMAGES } from "@/lib/marketing/gallery";

export function Gallery() {
  const images = useMemo(() => GALLERY_IMAGES, []);
  const previewImages = useMemo(() => images.slice(0, 12), [images]);
  const slides = useMemo(
    () =>
      images.map((img) => ({
        src: img.src,
        alt: img.alt,
        title: img.caption ?? img.alt,
      })),
    [images]
  );
  const [open, setOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);

  const openAt = useCallback((idx: number) => {
    setActiveIndex(idx);
    setOpen(true);
  }, []);

  return (
    <section className="py-16 md:py-24">
      <div className="container mx-auto max-w-6xl px-4 md:px-6">
        <SectionHeading
          eyebrow="Gallery"
          title="Moments from NPSC"
          description="A quick look at the energy—keynotes, delegates, and the full conference experience."
        />

        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-80px" }}
          className="mt-10 grid gap-4 md:grid-cols-4"
        >
          {previewImages.map((img, idx) => {
            const tileClass =
              idx === 0
                ? "md:col-span-2 md:row-span-2"
                : idx === 2
                  ? "md:col-span-2"
                  : "md:col-span-1";

            return (
              <motion.button
                key={img.src}
                type="button"
                variants={fadeUp}
                onClick={() => openAt(idx)}
                className={cn(
                  "group relative overflow-hidden rounded-2xl border border-border bg-muted/30 text-left ring-1 ring-transparent transition-all duration-200 hover:-translate-y-0.5 hover:bg-muted/50 hover:shadow-xl hover:shadow-foreground/5 hover:ring-primary/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary",
                  tileClass
                )}
              >
                <div
                  className={cn(
                    "relative w-full",
                    idx === 0 ? "aspect-[4/3]" : "aspect-[4/3] md:aspect-[3/2]"
                  )}
                >
                  <Image
                    src={img.src}
                    alt={img.alt}
                    fill
                    sizes={
                      idx === 0
                        ? "(min-width: 768px) 50vw, 100vw"
                        : "(min-width: 768px) 25vw, 50vw"
                    }
                    className="object-cover object-top transition-transform duration-300 group-hover:scale-[1.03]"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-black/10 to-transparent opacity-0 transition-opacity duration-200 group-hover:opacity-100" />
                </div>

                <div className="pointer-events-none absolute inset-x-0 bottom-0 p-4 opacity-0 transition-opacity duration-200 group-hover:opacity-100">
                  <div className="flex items-center gap-2 text-sm font-semibold text-white">
                    <Images className="size-4" />
                    View photo
                  </div>
                  {img.caption ? (
                    <p className="mt-1 text-xs text-white/85 line-clamp-1">
                      {img.caption}
                    </p>
                  ) : null}
                </div>
              </motion.button>
            );
          })}
        </motion.div>

        <Lightbox
          open={open}
          close={() => setOpen(false)}
          index={activeIndex}
          slides={slides}
          plugins={[Captions, Thumbnails, Zoom, Slideshow]}
          captions={{ showToggle: true }}
          slideshow={{ autoplay: true, delay: 4500 }}
          thumbnails={{
            position: "bottom",
            showToggle: true,
            vignette: true,
          }}
          on={{
            view: ({ index }) => setActiveIndex(index),
          }}
        />
      </div>
    </section>
  );
}

