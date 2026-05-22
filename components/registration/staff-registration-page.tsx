import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

/** Public staff self-registration is disabled. */
export function StaffRegistrationPage() {
  return (
    <div className="container mx-auto max-w-lg px-4 py-12 md:px-6">
      <Card>
        <CardHeader className="text-center">
          <CardTitle>Staff accounts are by invitation</CardTitle>
          <CardDescription>
            Finance staff are registered by a platform administrator.
            You will receive a staff ID (<span className="font-mono">npsc####</span>
            ), email, and password to sign in.
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-3">
          <Link href="/login">
            <Button className="w-full">Go to staff sign in</Button>
          </Link>
          <Link href="/">
            <Button variant="outline" className="w-full">
              Back to conference site
            </Button>
          </Link>
        </CardContent>
      </Card>
    </div>
  );
}
