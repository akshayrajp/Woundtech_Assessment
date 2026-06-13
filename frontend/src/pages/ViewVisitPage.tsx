import { Link, useParams } from "react-router-dom";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

import { Button } from "@/components/ui/button";

import { useVisit } from "@/features/visits/visit.hooks";

export function ViewVisitPage() {
  const { id } = useParams<{ id: string }>();

  const { data: visit, isLoading } = useVisit(id ?? "");

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (!visit) {
    return <div>Visit not found</div>;
  }

  return (
    <Card className="max-w-2xl mx-auto">
      <CardHeader className="flex flex-row justify-between">
        <CardTitle>Visit Details</CardTitle>

        <Button asChild>
          <Link to={`/visits/${visit.id}/edit`}>Edit</Link>
        </Button>
      </CardHeader>

      <CardContent className="space-y-4">
        <div>
          <strong>Patient:</strong> {visit.patient.givenName}{" "}
          {visit.patient.familyName}
        </div>

        <div>
          <strong>Clinician:</strong> {visit.clinician.givenName}{" "}
          {visit.clinician.familyName}
        </div>

        <div>
          <strong>Visited At:</strong>{" "}
          {new Date(visit.visitedAt).toLocaleString()}
        </div>

        <div>
          <strong>Notes:</strong> {visit.notes ?? "-"}
        </div>
      </CardContent>
    </Card>
  );
}
