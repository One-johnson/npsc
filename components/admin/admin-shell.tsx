"use client";

import { Separator } from "@/components/ui/separator";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { AdminAppSidebar } from "@/components/admin/admin-app-sidebar";
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
        <header className="sticky top-0 z-20 flex h-14 shrink-0 items-center gap-2 border-b bg-background px-4">
          <SidebarTrigger className="-ml-1" />
          <Separator orientation="vertical" className="mr-2 h-4" />
          <span className="text-sm font-medium text-muted-foreground md:hidden">
            NPSC Admin
          </span>
        </header>
        <div className="flex-1 overflow-y-auto p-4 md:p-8">{children}</div>
      </SidebarInset>
    </SidebarProvider>
  );
}
