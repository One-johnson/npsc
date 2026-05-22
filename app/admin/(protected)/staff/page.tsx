import { StaffPanel } from "@/components/admin/staff-panel";

export const metadata = {
  title: "Staff",
};

export default function AdminStaffPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Staff</h1>
        <p className="mt-2 max-w-2xl text-muted-foreground leading-relaxed">
          Manage finance staff. Use Add staff to register new
          accounts with a unique <span className="font-mono text-sm">npsc####</span>{" "}
          ID. Select rows and use Delete to remove staff in bulk (admin accounts
          cannot be deleted).
        </p>
      </div>
      <StaffPanel />
    </div>
  );
}
