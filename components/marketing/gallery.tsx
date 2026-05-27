"use client";

import { useCallback, useMemo, useState } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { ChevronLeft, ChevronRight, Images } from "lucide-react";
import { SectionHeading } from "@/components/marketing/section-heading";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { cn } from "@/lib/utils";
import { fadeUp, staggerContainer } from "@/components/motion";
import { GALLERY_IMAGES } from "@/lib/marketing/gallery";

export function Gallery() {
  const images = useMemo(() => GALLERY_IMAGES, []);
  const [open, setOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);

  const openAt = useCallback((idx: number) => {
    setActiveIndex(idx);
    setOpen(true);
  }, []);

  const prev = useCallback(() => {
    setActiveIndex((i) => (i - 1 + images.length) % images.length);
  }, [images.length]);

  const next = useCallback(() => {
    setActiveIndex((i) => (i + 1) % images.length);
  }, [images.length]);

  const active = images[activeIndex];

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
          {images.map((img, idx) => {
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

        <Dialog open={open} onOpenChange={setOpen}>
          <DialogContent
            showCloseButton
            className="w-[calc(100vw-2rem)] max-w-[72rem] sm:max-w-[min(100vw-2rem,72rem)] p-0 h-[calc(100svh-2rem)] overflow-hidden"
          >
            <div className="grid h-full gap-0 lg:grid-cols-[1fr_auto]">
              <div className="flex h-full min-h-0 flex-col bg-black">
                <div className="relative flex flex-1 items-center justify-center">
                  {active ? (
                    <Image
                      src={active.src}
                      alt={active.alt}
                      fill
                      sizes="(min-width: 1024px) 900px, 100vw"
                      className="object-contain object-center"
                    />
                  ) : null}
                </div>

                {/* Mobile thumbnail strip */}
                <div className="border-t border-white/10 bg-black/95 p-3 lg:hidden">
                  <div className="flex items-center justify-between">
                    <p className="text-xs font-semibold text-white/80">
                      {activeIndex + 1} / {images.length}
                    </p>
                  </div>
                  <div className="mt-2 flex gap-2 overflow-x-auto pb-1 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
                    {images.map((img, idx) => (
                      <button
                        key={img.src}
                        type="button"
                        onClick={() => setActiveIndex(idx)}
                        className={cn(
                          "shrink-0 overflow-hidden rounded-md border transition",
                          idx === activeIndex
                            ? "border-white ring-2 ring-white/25"
                            : "border-white/20 opacity-80 hover:opacity-100"
                        )}
                        aria-label={`Open photo ${idx + 1}`}
                      >
                        <div className="relative h-14 w-24">
                          <Image
                            src={img.src}
                            alt={img.alt}
                            fill
                            sizes="96px"
                            className="object-cover object-top"
                          />
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <div className="hidden h-full w-56 border-l border-border bg-background p-3 lg:flex lg:min-h-0 lg:flex-col">
                <p className="text-xs font-semibold text-muted-foreground">
                  {activeIndex + 1} / {images.length}
                </p>
                {active?.caption ? (
                  <p className="mt-1 line-clamp-2 text-sm font-semibold text-foreground">
                    {active.caption}
                  </p>
                ) : null}
                <div className="mt-3 min-h-0 flex-1 overflow-y-auto pr-1">
                  <div className="grid gap-2">
                  {images.map((img, idx) => (
                    <button
                      key={img.src}
                      type="button"
                      onClick={() => setActiveIndex(idx)}
                      className={cn(
                        "group relative overflow-hidden rounded-lg border transition",
                        idx === activeIndex
                          ? "border-primary ring-2 ring-primary/20"
                          : "border-border hover:border-primary/40"
                      )}
                      aria-label={`Open photo ${idx + 1}`}
                    >
                      <div className="relative aspect-[16/10]">
                        <Image
                          src={img.src}
                          alt={img.alt}
                          fill
                          sizes="224px"
                          className="object-cover object-top transition-transform duration-200 group-hover:scale-[1.02]"
                        />
                      </div>
                    </button>
                  ))}
                  </div>
                </div>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </section>
  );
}

