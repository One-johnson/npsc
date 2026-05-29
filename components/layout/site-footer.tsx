import Link from "next/link";
import { FooterRegisterLink } from "@/components/layout/footer-register-link";
import { mockEvent } from "@/lib/mock-event";

export function SiteFooter() {
  return (
    <footer className="border-t border-border bg-muted/30">
      <div className="container mx-auto max-w-6xl px-4 py-12 md:px-6">
        <div className="grid gap-8 md:grid-cols-3">
          <div>
            <p className="font-semibold">NPSC · GIPS Ghana</p>
            <p className="mt-2 text-sm text-muted-foreground">
              {mockEvent.titleLine2}
            </p>
            <p className="mt-1 text-sm text-muted-foreground">
              {mockEvent.date} · {mockEvent.venue}
            </p>
          </div>
          <div>
            <p className="text-sm font-medium">Quick links</p>
            <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
              <li>
                <Link
                  href={`/events/${mockEvent.slug}`}
                  className="hover:text-foreground"
                >
                  Programme & details
                </Link>
              </li>
              <li>
                <FooterRegisterLink />
              </li>
              <li>
                <a href="#faq" className="hover:text-foreground">
                  FAQ
                </a>
              </li>
            </ul>
          </div>
          <div>
            <p className="text-sm font-medium">Contact</p>
            <p className="mt-3 text-sm text-muted-foreground">
              <a
                href={`https://${mockEvent.website}`}
                className="hover:text-foreground"
              >
                {mockEvent.website}
              </a>
            </p>
            <p className="mt-1 text-sm text-muted-foreground">
              <a
                href="mailto:info@gipsghana.com"
                className="hover:text-foreground"
              >
                info@gipsghana.com
              </a>
            </p>
            <p className="mt-1 text-sm text-muted-foreground">
              Office of the Vice President, GIPS —{" "}
              <a
                href="tel:+233545305678"
                className="hover:text-foreground"
              >
                0545305678
              </a>
            </p>
          </div>
        </div>
        <p className="mt-10 border-t border-border pt-6 text-center text-xs text-muted-foreground">
          © {new Date().getFullYear()} Ghana Institute of Procurement and Supply.
          All rights reserved.
        </p>
      </div>
    </footer>
  );
}
