import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

import { ClinicianForm } from "@/features/clinicians/components/ClinicianForm";
import { useCreateClinician } from "@/features/clinicians/clinician.hooks";

export function CreateClinicianPage() {
  const navigate = useNavigate();
  const createClinician = useCreateClinician();

  return (
    <Card className="max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>Create Clinician</CardTitle>
      </CardHeader>

      <CardContent>
        <ClinicianForm
          isSubmitting={createClinician.isPending}
          onSubmit={async (values) => {
            const clinician = await createClinician.mutateAsync(values);

            toast.success("Clinician created");

            navigate(`/clinicians/${clinician.id}`);
          }}
        />
      </CardContent>
    </Card>
  );
}
