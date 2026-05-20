/** Default marketing blocks for a newly created event. */
export const EMPTY_EVENT_CONTENT = {
  organizers: [] as { name: string; logo: string }[],
  agenda: [] as { time: string; title: string; speaker?: string }[],
  features: [] as { icon: string; title: string; description: string }[],
  audiences: [] as { id: string; title: string; description: string }[],
  steps: [] as { step: number; title: string; description: string }[],
  faqs: [] as { question: string; answer: string }[],
  partners: [] as { id: string; name: string; logo: string }[],
};

export const DEFAULT_HERO_IMAGE = "/images/conference-hero.png";
