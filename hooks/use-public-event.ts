"use client";

import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { mockEvent, type MockEvent } from "@/lib/mock-event";
import { mapConvexEventToMockShape } from "@/lib/event/map-public-event";

export function usePublicEvent(slug: string): {
  event: MockEvent;
  isFromConvex: boolean;
  isLoading: boolean;
} {
  const convexUrl = process.env.NEXT_PUBLIC_CONVEX_URL;
  const data = useQuery(
    api.events.getBySlug,
    convexUrl ? { slug } : "skip"
  );

  if (!convexUrl) {
    return { event: mockEvent, isFromConvex: false, isLoading: false };
  }

  if (data === undefined) {
    return { event: mockEvent, isFromConvex: false, isLoading: true };
  }

  if (data === null) {
    return { event: mockEvent, isFromConvex: false, isLoading: false };
  }

  return {
    event: mapConvexEventToMockShape(data),
    isFromConvex: true,
    isLoading: false,
  };
}
