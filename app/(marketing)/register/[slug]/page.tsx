import { Suspense } from "react";
import { ResponsiveRegister } from "@/components/registration/responsive-register";

type Props = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({ params }: Props) {
  const { slug } = await params;
  return {
    title: `Register · ${slug}`,
  };
}

export default async function RegisterPage({ params }: Props) {
  const { slug } = await params;

  return (
    <Suspense
      fallback={
        <p className="py-24 text-center text-muted-foreground">Loading…</p>
      }
    >
      <ResponsiveRegister slug={slug} />
    </Suspense>
  );
}
