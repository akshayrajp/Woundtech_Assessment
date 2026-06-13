import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

import { VisitForm } from "@/features/visits/components/VisitForm";
import { useCreateVisit } from "@/features/visits/visit.hooks";

export function CreateVisitPage() {
  const navigate = useNavigate();

  const createVisit = useCreateVisit();

  return (
    <Card className="max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>Create Visit</CardTitle>
      </CardHeader>

      <CardContent>
        <VisitForm
          isSubmitting={createVisit.isPending}
          onSubmit={async (values) => {
            const visit = await createVisit.mutateAsync(values);

            toast.success("Visit created");

            navigate(`/visits/${visit.id}`);
          }}
        />
      </CardContent>
    </Card>
  );
}
