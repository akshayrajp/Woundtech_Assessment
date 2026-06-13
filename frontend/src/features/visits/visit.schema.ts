import { z } from "zod";

export const visitSchema = z.object({
  patientId: z.uuid(),
  clinicianId: z.uuid(),
  visitedAt: z.string().min(1),
  notes: z.string().optional(),
});

export type VisitFormValues = z.infer<typeof visitSchema>;
