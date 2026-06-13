import { useNavigate, useParams } from "react-router-dom";
import { toast } from "sonner";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

import { PatientForm } from "@/features/patients/components/PatientForm";
import {
  usePatient,
  useUpdatePatient,
} from "@/features/patients/patient.hooks";

export function EditPatientPage() {
  const { id } = useParams<{ id: string }>();

  const navigate = useNavigate();

  const { data: patient, isLoading } = usePatient(id ?? "");

  const updatePatient = useUpdatePatient(id ?? "");

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (!patient) {
    return <div>Patient not found</div>;
  }

  return (
    <Card className="max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>Edit Patient</CardTitle>
      </CardHeader>

      <CardContent>
        <PatientForm
          initialValues={{
            givenName: patient.givenName,
            familyName: patient.familyName,
            dateOfBirth: patient.dateOfBirth.slice(0, 10),
            gender: patient.gender,
          }}
          isSubmitting={updatePatient.isPending}
          onSubmit={async (values) => {
            await updatePatient.mutateAsync(values);

            toast.success("Patient updated");

            navigate(`/patients/${patient.id}`);
          }}
        />
      </CardContent>
    </Card>
  );
}
