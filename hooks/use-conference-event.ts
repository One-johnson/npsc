"use client";

import { useEffect, useMemo, useState } from "react";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { mockEvent } from "@/lib/mock-event";
import { buildFallbackBundle } from "@/lib/event/fallback-tickets";
import type { PublicEventBundle, TicketTypeOption } from "@/lib/event/types";
import { filterSelfServiceTicketTypes } from "@/lib/ticket-types/public-registration";

function mapConvexToBundle(data: {
  event: {
    _id: string;
    slug: string;
    edition: string;
    title: string;
    titleLine2: string;
    subtitle: string;
    tagline: string;
    date: string;
    dateShort: string;
    time: string;
    venue: string;
    city: string;
    country: string;
    website: string;
    heroImage: string;
    capacity: number;
    registeredCount: number;
    about: string;
  };
  ticketTypes: {
    _id: string;
    kind: string;
    slug: string;
    name: string;
    description: string;
    price: number;
    currency: string;
    capacity: number;
    soldCount: number;
    perks: string[];
    isActive: boolean;
    sortOrder: number;
  }[];
}): PublicEventBundle {
  const { event, ticketTypes } = data;
  return {
    event: {
      slug: event.slug,
      edition: event.edition,
      title: event.title,
      titleLine2: event.titleLine2,
      subtitle: event.subtitle,
      tagline: event.tagline,
      date: event.date,
      dateShort: event.dateShort,
      time: event.time,
      venue: event.venue,
      city: event.city,
      country: event.country,
      website: event.website,
      heroImage: event.heroImage,
      capacity: event.capacity,
      registeredCount: event.registeredCount,
      about: event.about,
    },
    ticketTypes: filterSelfServiceTicketTypes(ticketTypes.filter((t) => t.isActive))
      .sort((a, b) => a.sortOrder - b.sortOrder)
      .map(
        (t): TicketTypeOption => ({
          id: t._id,
          kind: t.kind,
          slug: t.slug,
          name: t.name,
          description: t.description,
          price: t.price,
          currency: t.currency,
          capacity: t.capacity,
          soldCount: t.soldCount,
          perks: t.perks,
          isActive: t.isActive,
          sortOrder: t.sortOrder,
        })
      ),
    isLive: true,
  };
}

export function useConferenceEvent(slug: string = mockEvent.slug): {
  bundle: PublicEventBundle;
  isLoading: boolean;
} {
  const fallback = useMemo(() => buildFallbackBundle(mockEvent), []);
  const convexUrl = process.env.NEXT_PUBLIC_CONVEX_URL;
  const useDefaultSlug = slug === mockEvent.slug;
  const publishedSlug = useQuery(
    api.events.getDefaultPublishedSlug,
    convexUrl && useDefaultSlug ? {} : "skip"
  );
  const resolvedSlug =
    useDefaultSlug && publishedSlug ? publishedSlug : slug;

  const data = useQuery(
    api.events.getBySlug,
    convexUrl ? { slug: resolvedSlug } : "skip"
  );

  const slugQueryReady = !useDefaultSlug || publishedSlug !== undefined;
  const eventQueryReady = data !== undefined;
  const queriesReady = slugQueryReady && eventQueryReady;

  const [hasLoadedOnce, setHasLoadedOnce] = useState(!convexUrl);

  useEffect(() => {
    if (queriesReady) {
      setHasLoadedOnce(true);
    }
  }, [queriesReady]);

  const isLoading = Boolean(convexUrl) && !hasLoadedOnce;

  if (!convexUrl) {
    return { bundle: fallback, isLoading: false };
  }

  if (!queriesReady) {
    return { bundle: fallback, isLoading };
  }

  if (data === null) {
    return { bundle: fallback, isLoading: false };
  }

  const live = mapConvexToBundle(data);
  if (live.ticketTypes.length === 0) {
    return {
      bundle: { ...live, ticketTypes: fallback.ticketTypes, isLive: false },
      isLoading: false,
    };
  }

  return { bundle: live, isLoading: false };
}
