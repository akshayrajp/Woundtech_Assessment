import { useNavigate, useParams } from "react-router-dom";
import { toast } from "sonner";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

import { ClinicianForm } from "@/features/clinicians/components/ClinicianForm";
import {
  useClinician,
  useUpdateClinician,
} from "@/features/clinicians/clinician.hooks";

export function EditClinicianPage() {
  const { id } = useParams<{ id: string }>();

  const navigate = useNavigate();

  const { data: clinician, isLoading } = useClinician(id ?? "");

  const updateClinician = useUpdateClinician(id ?? "");

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (!clinician) {
    return <div>Clinician not found</div>;
  }

  return (
    <Card className="max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>Edit Clinician</CardTitle>
      </CardHeader>

      <CardContent>
        <ClinicianForm
          initialValues={{
            givenName: clinician.givenName,
            familyName: clinician.familyName,
            dateOfBirth: clinician.dateOfBirth.slice(0, 10),
            gender: clinician.gender,
          }}
          isSubmitting={updateClinician.isPending}
          onSubmit={async (values) => {
            await updateClinician.mutateAsync(values);

            toast.success("Clinician updated");

            navigate(`/clinicians/${clinician.id}`);
          }}
        />
      </CardContent>
    </Card>
  );
}
