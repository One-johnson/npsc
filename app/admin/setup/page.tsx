import { AuthSplitLayout } from "@/components/auth/auth-split-layout";
import { SetupPanel } from "@/components/admin/setup-panel";

export const metadata = {
  title: "Administrator setup",
};

export default function SetupPage() {
  return (
    <AuthSplitLayout
      title="Platform setup"
      description="Create the first administrator account. You will sign in on the next screen with your staff ID or email."
    >
      <SetupPanel />
    </AuthSplitLayout>
  );
}
