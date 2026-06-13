import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

import { visitSchema, type VisitFormValues } from "../visit.schema";

import { usePatients } from "@/features/patients/patient.hooks";
import { useClinicians } from "@/features/clinicians/clinician.hooks";

type VisitFormProps = {
  initialValues?: VisitFormValues;
  onSubmit: (values: VisitFormValues) => void | Promise<void>;
  isSubmitting?: boolean;
};

export function VisitForm({
  initialValues,
  onSubmit,
  isSubmitting = false,
}: VisitFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<VisitFormValues>({
    resolver: zodResolver(visitSchema),
    defaultValues: initialValues ?? {
      patientId: "",
      clinicianId: "",
      visitedAt: "",
      notes: "",
    },
  });

  const { data: patients } = usePatients({
    page: 1,
    limit: 100,
  });

  const { data: clinicians } = useClinicians({
    page: 1,
    limit: 100,
  });

  async function handleFormSubmit(values: VisitFormValues) {
    await onSubmit({
      ...values,
      visitedAt: new Date(values.visitedAt).toISOString(),
    });
  }

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
      <div className="space-y-2">
        <label htmlFor="patientId" className="text-sm font-medium">
          Patient
        </label>

        <select
          id="patientId"
          {...register("patientId")}
          className="flex h-9 w-full rounded-md border bg-transparent px-3 py-1 text-sm shadow-sm"
        >
          <option value="">Select a patient</option>

          {patients?.data.map((patient) => (
            <option key={patient.id} value={patient.id}>
              {patient.givenName} {patient.familyName}
            </option>
          ))}
        </select>

        {errors.patientId && (
          <p className="text-sm text-red-500">{errors.patientId.message}</p>
        )}
      </div>

      <div className="space-y-2">
        <label htmlFor="clinicianId" className="text-sm font-medium">
          Clinician
        </label>

        <select
          id="clinicianId"
          {...register("clinicianId")}
          className="flex h-9 w-full rounded-md border bg-transparent px-3 py-1 text-sm shadow-sm"
        >
          <option value="">Select a clinician</option>

          {clinicians?.data.map((clinician) => (
            <option key={clinician.id} value={clinician.id}>
              {clinician.givenName} {clinician.familyName}
            </option>
          ))}
        </select>

        {errors.clinicianId && (
          <p className="text-sm text-red-500">{errors.clinicianId.message}</p>
        )}
      </div>

      <div className="space-y-2">
        <label htmlFor="visitedAt" className="text-sm font-medium">
          Visit Time
        </label>

        <Input
          id="visitedAt"
          type="datetime-local"
          {...register("visitedAt")}
        />

        {errors.visitedAt && (
          <p className="text-sm text-red-500">{errors.visitedAt.message}</p>
        )}
      </div>

      <div className="space-y-2">
        <label htmlFor="notes" className="text-sm font-medium">
          Notes
        </label>

        <Textarea
          id="notes"
          {...register("notes")}
          placeholder="Visit notes..."
        />

        {errors.notes && (
          <p className="text-sm text-red-500">{errors.notes.message}</p>
        )}
      </div>

      <Button type="submit" disabled={isSubmitting}>
        Save Visit
      </Button>
    </form>
  );
}
