"use client";

import Link from "next/link";
import Image from "next/image";
import { Menu, X } from "lucide-react";
import { useState } from "react";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import { RegisterButton } from "@/components/registration/register-button";
import { mockEvent } from "@/lib/mock-event";
import { cn } from "@/lib/utils";
import { useIsMobile } from "@/hooks/use-mobile";

const navLinks = [
  { href: "#about", label: "About" },
  { href: "#schedule", label: "Programme" },
  { href: "#gallery", label: "Gallery" },
  { href: "#register", label: "Register" },
  { href: "#faq", label: "FAQ" },
];

export function SiteHeader() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const isMobile = useIsMobile();

  const eventSlug = (() => {
    const mRegister = pathname.match(/^\/register\/([^/]+)/);
    if (mRegister?.[1]) return decodeURIComponent(mRegister[1]);
    const mEvent = pathname.match(/^\/events\/([^/]+)/);
    if (mEvent?.[1]) return decodeURIComponent(mEvent[1]);
    return mockEvent.slug;
  })();

  const mobileRegisterHref = `/register/${encodeURIComponent(eventSlug)}`;
  return (
    <header className="sticky top-0 z-50 border-b border-border/60 bg-background/95 backdrop-blur-md">
      <div className="container mx-auto flex h-16 max-w-6xl items-center justify-between px-4 md:px-6">
        <Link
          href="/"
          className="flex items-center gap-2 font-semibold tracking-tight"
        >
          <Image
            src="/images/conveners/npsc.png"
            alt="NPSC logo"
            width={120}
            height={40}
            priority
            className="h-9 w-auto object-contain sm:h-10"
          />
          <span className="hidden text-sm leading-tight sm:inline">
            NPSC
            <span className="block text-xs font-normal text-muted-foreground">
              GIPS Ghana
            </span>
          </span>
        </Link>

        <nav className="hidden items-center gap-8 md:flex">
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="text-sm text-muted-foreground transition-colors hover:text-foreground"
            >
              {link.label}
            </a>
          ))}
        </nav>

        <div className="hidden items-center gap-3 md:flex">
          <a
            href={`https://${mockEvent.website}`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm text-muted-foreground hover:text-foreground"
          >
            {mockEvent.website}
          </a>
          <RegisterButton size="sm" />
        </div>

        <div className="flex items-center gap-2 md:hidden">
          {isMobile ? (
            <Button
              size="sm"
              nativeButton={false}
              render={<Link href={mobileRegisterHref} />}
              onClick={() => setOpen(false)}
            >
              Register
            </Button>
          ) : null}
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setOpen(!open)}
            aria-label={open ? "Close menu" : "Open menu"}
          >
            {open ? <X className="size-5" /> : <Menu className="size-5" />}
          </Button>
        </div>
      </div>

      <div
        className={cn(
          "border-t border-border/60 bg-background md:hidden",
          open ? "block" : "hidden"
        )}
      >
        <nav className="container mx-auto flex max-w-6xl flex-col gap-1 px-4 py-4">
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              onClick={() => setOpen(false)}
              className="rounded-lg px-3 py-2 text-sm text-muted-foreground hover:bg-muted hover:text-foreground"
            >
              {link.label}
            </a>
          ))}
          <div className="mt-2" onClick={() => setOpen(false)}>
            <RegisterButton className="w-full" />
          </div>
        </nav>
      </div>
    </header>
  );
}
