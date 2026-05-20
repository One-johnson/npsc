"use client";

import { useRef } from "react";
import Image from "next/image";
import Autoplay from "embla-carousel-autoplay";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { mockEvent } from "@/lib/mock-event";

const partners = [...mockEvent.partners, ...mockEvent.partners];

export function PartnersCarousel() {
  const autoplay = useRef(
    Autoplay({
      delay: 2800,
      stopOnInteraction: false,
      stopOnMouseEnter: true,
    }),
  );

  return (
    <div className="mt-8">
      <p className="text-center text-xs font-medium uppercase tracking-wider text-muted-foreground">
        Partners
      </p>
      <Carousel
        className="mt-6 w-full px-10"
        opts={{ align: "start", loop: true }}
        plugins={[autoplay.current]}
      >
        <CarouselContent className="-ml-4">
          {partners.map((partner, index) => (
            <CarouselItem
              key={`${partner.id}-${index}`}
              className="basis-1/2 pl-4 sm:basis-1/3 md:basis-2/5 lg:basis-1/3"
            >
              <div className="flex h-24 items-center justify-center rounded-xl border border-border/60 bg-background px-4 py-3 shadow-sm transition-shadow hover:shadow-md sm:h-28">
                <Image
                  src={partner.logo}
                  alt={partner.name}
                  width={200}
                  height={80}
                  className="max-h-14 w-auto object-contain sm:max-h-16"
                />
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious className="left-0 size-8 border-border/60" />
        <CarouselNext className="right-0 size-8 border-border/60" />
      </Carousel>
    </div>
  );
}
