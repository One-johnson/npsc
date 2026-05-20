import Image from "next/image";
import { mockEvent } from "@/lib/mock-event";

export function AuthBannerPanel() {
  return (
    <aside
      className="relative min-h-[220px] overflow-hidden bg-muted lg:min-h-screen"
      aria-hidden
    >
      <Image
        src={mockEvent.heroImage}
        alt="National Procurement and Supply Conference"
        fill
        priority
        className="object-cover object-center"
        sizes="(max-width: 1024px) 100vw, 50vw"
      />
    </aside>
  );
}
