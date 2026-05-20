export type StaffRole = "admin" | "finance" | "checkin";

export type StaffUser = {
  _id: string;
  email: string;
  name: string;
  role: StaffRole;
  staffId: string | null;
};
