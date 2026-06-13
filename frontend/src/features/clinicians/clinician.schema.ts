import { z } from "zod";

export const clinicianSchema = z.object({
  givenName: z.string().min(1).max(100),
  familyName: z.string().min(1).max(100),
  dateOfBirth: z.string().min(1),
  gender: z.enum(["male", "female", "other", "unknown"]),
});

export type ClinicianFormValues = z.infer<typeof clinicianSchema>;
