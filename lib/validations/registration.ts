import { z } from "zod";

export const attendeeRegistrationSchema = z.object({
  ticketTypeId: z.string().min(1, "Select a ticket type"),
  fullName: z.string().min(2, "Enter your full name"),
  email: z.string().email("Enter a valid email"),
  phone: z
    .string()
    .min(10, "Enter a valid phone number")
    .regex(/^[\d+\s()-]+$/, "Enter a valid phone number"),
  organization: z
    .string()
    .min(1, "Enter your company or organization"),
  position: z.string().min(1, "Enter your position or job title"),
});

export const staffRegistrationSchema = z.object({
  name: z.string().min(2, "Enter your full name"),
  email: z.string().email("Enter a valid email"),
  password: z.string().min(8, "Password must be at least 8 characters"),
  confirmPassword: z.string().min(8, "Confirm your password"),
  role: z.enum(["admin", "finance"]),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords do not match",
  path: ["confirmPassword"],
});

export const paymentSchema = z.object({
  paymentMethod: z.enum(["momo", "card", "bank"], {
    message: "Select a payment method",
  }),
});

export type AttendeeRegistrationData = z.infer<typeof attendeeRegistrationSchema>;
export type StaffRegistrationData = z.infer<typeof staffRegistrationSchema>;
export type PaymentData = z.infer<typeof paymentSchema>;
