import { Link, useParams } from "react-router-dom";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

import { useClinician } from "@/features/clinicians/clinician.hooks";

export function ViewClinicianPage() {
  const { id } = useParams<{ id: string }>();

  const { data: clinician, isLoading } = useClinician(id ?? "");

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (!clinician) {
    return <div>Clinician not found</div>;
  }

  return (
    <Card className="max-w-2xl mx-auto">
      <CardHeader className="flex flex-row justify-between">
        <CardTitle>Clinician Details</CardTitle>

        <Button asChild>
          <Link to={`/clinicians/${clinician.id}/edit`}>Edit</Link>
        </Button>
      </CardHeader>

      <CardContent className="space-y-4">
        <div>
          <strong>Given Name:</strong> {clinician.givenName}
        </div>

        <div>
          <strong>Family Name:</strong> {clinician.familyName}
        </div>

        <div>
          <strong>Date of Birth:</strong>{" "}
          {new Date(clinician.dateOfBirth).toLocaleDateString()}
        </div>

        <div>
          <strong>Gender:</strong> {clinician.gender}
        </div>

        <div>
          <strong>Created At:</strong>{" "}
          {new Date(clinician.createdAt).toLocaleString()}
        </div>

        <div>
          <strong>Updated At:</strong>{" "}
          {new Date(clinician.updatedAt).toLocaleString()}
        </div>
      </CardContent>
    </Card>
  );
}
