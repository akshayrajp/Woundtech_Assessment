import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

import { PatientForm } from "@/features/patients/components/PatientForm";
import { useCreatePatient } from "@/features/patients/patient.hooks";

export function CreatePatientPage() {
  const navigate = useNavigate();
  const createPatient = useCreatePatient();

  return (
    <Card className="max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>Create Patient</CardTitle>
      </CardHeader>

      <CardContent>
        <PatientForm
          isSubmitting={createPatient.isPending}
          onSubmit={async (values) => {
            const patient = await createPatient.mutateAsync(values);

            toast.success("Patient created");

            navigate(`/patients/${patient.id}`);
          }}
        />
      </CardContent>
    </Card>
  );
}
