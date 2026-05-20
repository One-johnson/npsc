import {
  Card,
  CardContent,
  CardHeader,
} from "@/components/ui/card";
import { AuthBrand } from "@/components/auth/auth-brand";

type Props = {
  title: string;
  description?: string;
  children: React.ReactNode;
};

export function AuthPageShell({ title, description, children }: Props) {
  return (
    <div className="flex min-h-screen items-center justify-center bg-muted/30 px-4 py-10">
      <Card className="w-full max-w-md border-border/80 shadow-lg">
        <CardHeader className="space-y-0 pb-2">
          <AuthBrand title={title} description={description} />
        </CardHeader>
        <CardContent className="pt-4">{children}</CardContent>
      </Card>
    </div>
  );
}
