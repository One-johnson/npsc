import { AuthSplitLayout } from "@/components/auth/auth-split-layout";
import { SetupPanel } from "@/components/admin/setup-panel";

export const metadata = {
  title: "Administrator setup",
};

export default function SetupPage() {
  return (
    <AuthSplitLayout
      title="Platform setup"
      description="Create an administrator account for the operations dashboard. You can add more administrators here or from Admin → Staff after signing in."
    >
      <SetupPanel />
    </AuthSplitLayout>
  );
}
