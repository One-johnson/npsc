"use client";

import Link from "next/link";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";

export function LoginExtras() {
  const seeded = useQuery(api.seed.isSeeded, {});

  return (
    <p className="mt-5 border-t border-border/60 pt-4 text-center text-sm text-muted-foreground">
      {seeded?.seeded === false ? (
        <>
          First time here?{" "}
          <Link href="/admin/setup" className="text-primary hover:underline">
            Create administrator account
          </Link>
          {" · "}
        </>
      ) : null}
      <Link href="/" className="text-primary hover:underline">
        Public site
      </Link>
    </p>
  );
}
