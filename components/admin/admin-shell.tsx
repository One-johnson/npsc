"use client";

import Image from "next/image";
import Link from "next/link";
import { ExternalLink } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { AdminAppSidebar } from "@/components/admin/admin-app-sidebar";
import { mockEvent } from "@/lib/mock-event";
import type { StaffUser } from "@/lib/auth/types";

export function AdminShell({
  user,
  children,
}: {
  user: StaffUser;
  children: React.ReactNode;
}) {
  return (
    <SidebarProvider>
      <AdminAppSidebar user={user} />
      <SidebarInset className="max-h-svh flex-col overflow-hidden">
        <header className="sticky top-0 z-20 flex h-16 shrink-0 items-center gap-3 border-b bg-background/95 px-4 backdrop-blur supports-[backdrop-filter]:bg-background/80">
          <SidebarTrigger className="-ml-1" />
          <Separator orientation="vertical" className="h-5" />
          <Link
            href="/admin/dashboard"
            className="flex min-w-0 shrink-0 items-center gap-2.5 rounded-md outline-none ring-offset-background focus-visible:ring-2 focus-visible:ring-ring"
          >
            <Image
              src="/images/conveners/npsc.png"
              alt="National Procurement and Supply Conference"
              width={120}
              height={40}
              className="h-9 w-auto object-contain"
            />
            <div className="hidden leading-tight sm:block">
              <span className="block text-sm font-semibold tracking-tight">
                NPSC
              </span>
              <span className="block text-xs text-muted-foreground">
                GIPS Ghana
              </span>
            </div>
          </Link>
          <div className="hidden min-w-0 flex-1 flex-col px-2 md:flex">
            <span className="truncate text-sm font-medium">
              {mockEvent.subtitle}
            </span>
            <span className="truncate text-xs text-muted-foreground">
              {mockEvent.dateShort} · {mockEvent.venue}, {mockEvent.city}
            </span>
          </div>
          <div className="ml-auto flex shrink-0 items-center gap-2">
            <Badge
              variant="secondary"
              className="hidden font-medium uppercase tracking-wide sm:inline-flex"
            >
              {mockEvent.edition}
            </Badge>
            <a
              href={`https://${mockEvent.website}`}
              target="_blank"
              rel="noopener noreferrer"
              className="hidden items-center gap-1 text-xs text-muted-foreground transition-colors hover:text-foreground lg:inline-flex"
            >
              {mockEvent.website}
              <ExternalLink className="size-3" />
            </a>
          </div>
        </header>
        <div className="flex-1 overflow-y-auto p-4 md:p-8">{children}</div>
      </SidebarInset>
    </SidebarProvider>
  );
}
