import { Link, useParams } from "react-router-dom";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

import { usePatient } from "@/features/patients/patient.hooks";

export function ViewPatientPage() {
  const { id } = useParams<{ id: string }>();

  const { data: patient, isLoading } = usePatient(id ?? "");

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (!patient) {
    return <div>Patient not found</div>;
  }

  return (
    <Card className="max-w-2xl mx-auto">
      <CardHeader className="flex flex-row justify-between">
        <CardTitle>Patient Details</CardTitle>

        <Button asChild>
          <Link to={`/patients/${patient.id}/edit`}>Edit</Link>
        </Button>
      </CardHeader>

      <CardContent className="space-y-4">
        <div>
          <strong>Given Name:</strong> {patient.givenName}
        </div>

        <div>
          <strong>Family Name:</strong> {patient.familyName}
        </div>

        <div>
          <strong>Date of Birth:</strong>{" "}
          {new Date(patient.dateOfBirth).toLocaleDateString()}
        </div>

        <div>
          <strong>Gender:</strong> {patient.gender}
        </div>

        <div>
          <strong>Created At:</strong>{" "}
          {new Date(patient.createdAt).toLocaleString()}
        </div>

        <div>
          <strong>Updated At:</strong>{" "}
          {new Date(patient.updatedAt).toLocaleString()}
        </div>
      </CardContent>
    </Card>
  );
}
