import { useNavigate, useParams } from "react-router-dom";
import { toast } from "sonner";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

import { VisitForm } from "@/features/visits/components/VisitForm";

import { useVisit, useUpdateVisit } from "@/features/visits/visit.hooks";

export function EditVisitPage() {
  const { id } = useParams<{ id: string }>();

  const navigate = useNavigate();

  const { data: visit, isLoading } = useVisit(id ?? "");

  const updateVisit = useUpdateVisit(id ?? "");

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (!visit) {
    return <div>Visit not found</div>;
  }

  return (
    <Card className="max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>Edit Visit</CardTitle>
      </CardHeader>

      <CardContent>
        <VisitForm
          initialValues={{
            patientId: visit.patient.id!,
            clinicianId: visit.clinician.id!,
            visitedAt: new Date(visit.visitedAt).toISOString().slice(0, 16),
            notes: visit.notes ?? "",
          }}
          isSubmitting={updateVisit.isPending}
          onSubmit={async (values) => {
            await updateVisit.mutateAsync(values);

            toast.success("Visit updated");

            navigate(`/visits/${visit.id}`);
          }}
        />
      </CardContent>
    </Card>
  );
}
