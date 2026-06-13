import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

import { patientSchema, type PatientFormValues } from "../patient.schema";

type PatientFormProps = {
  initialValues?: PatientFormValues;
  onSubmit: (values: PatientFormValues) => void | Promise<void>;
  isSubmitting?: boolean;
};

export function PatientForm({
  initialValues,
  onSubmit,
  isSubmitting = false,
}: PatientFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<PatientFormValues>({
    resolver: zodResolver(patientSchema),
    defaultValues: initialValues ?? {
      givenName: "",
      familyName: "",
      dateOfBirth: "",
      gender: "unknown",
    },
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="space-y-2">
        <label htmlFor="givenName" className="text-sm font-medium">
          Given Name
        </label>

        <Input id="givenName" {...register("givenName")} placeholder="John" />

        {errors.givenName && (
          <p className="text-sm text-red-500">{errors.givenName.message}</p>
        )}
      </div>

      <div className="space-y-2">
        <label htmlFor="familyName" className="text-sm font-medium">
          Family Name
        </label>

        <Input id="familyName" {...register("familyName")} placeholder="Doe" />

        {errors.familyName && (
          <p className="text-sm text-red-500">{errors.familyName.message}</p>
        )}
      </div>

      <div className="space-y-2">
        <label htmlFor="dateOfBirth" className="text-sm font-medium">
          Date of Birth
        </label>

        <Input id="dateOfBirth" type="date" {...register("dateOfBirth")} />

        {errors.dateOfBirth && (
          <p className="text-sm text-red-500">{errors.dateOfBirth.message}</p>
        )}
      </div>

      <div className="space-y-2">
        <label htmlFor="gender" className="text-sm font-medium">
          Gender
        </label>

        <select
          id="gender"
          {...register("gender")}
          className="flex h-9 w-full rounded-md border bg-transparent px-3 py-1 text-sm shadow-sm"
        >
          <option value="male">Male</option>
          <option value="female">Female</option>
          <option value="other">Other</option>
          <option value="unknown">Unknown</option>
        </select>

        {errors.gender && (
          <p className="text-sm text-red-500">{errors.gender.message}</p>
        )}
      </div>

      <Button type="submit" disabled={isSubmitting}>
        Save Patient
      </Button>
    </form>
  );
}
