import { AuthBannerPanel } from "@/components/auth/auth-banner-panel";
import { AuthBrand } from "@/components/auth/auth-brand";

type Props = {
  title: string;
  description?: string;
  children: React.ReactNode;
};

export function AuthSplitLayout({ title, description, children }: Props) {
  return (
    <div className="min-h-screen lg:grid lg:grid-cols-2">
      <AuthBannerPanel />

      <div className="flex min-h-0 flex-col justify-center bg-background px-6 py-10 sm:px-10 lg:px-12 lg:py-12">
        <div className="mx-auto w-full max-w-md">
          <AuthBrand
            title={title}
            description={description}
            align="left"
            showLogo={false}
          />
          <div className="mt-8">{children}</div>
        </div>
      </div>
    </div>
  );
}
