import { useState } from "react";
import { Link } from "react-router-dom";

import { useVisits } from "@/features/visits/visit.hooks";
import { usePatients } from "@/features/patients/patient.hooks";
import { useClinicians } from "@/features/clinicians/clinician.hooks";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { SortIcon } from "@/components/SortIcon";
import { useDebounce } from "use-debounce";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

type SortDirection = "ASC" | "DESC";

export function VisitsListPage() {
  const [page, setPage] = useState(1);

  const [search, setSearch] = useState("");
  const [debouncedSearch] = useDebounce(search, 300);

  const [sortBy, setSortBy] = useState<SortDirection>("DESC");

  const [patientIds, setPatientIds] = useState<string[]>([]);

  const [clinicianIds, setClinicianIds] = useState<string[]>([]);

  const { data: patients } = usePatients({
    page: 1,
    limit: 100,
  });

  const { data: clinicians } = useClinicians({
    page: 1,
    limit: 100,
  });

  const { data, isLoading } = useVisits({
    page,
    limit: 10,
    search: debouncedSearch || undefined,
    orderBy: "visitedAt",
    sortBy,
    patientIds: patientIds.length > 0 ? patientIds : undefined,
    clinicianIds: clinicianIds.length > 0 ? clinicianIds : undefined,
  });

  const totalPages = data ? Math.ceil(data.total / data.limit) : 0;

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Visits</CardTitle>

        <Button asChild>
          <Link to="/visits/new">Create Visit</Link>
        </Button>
      </CardHeader>

      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
          <Input
            placeholder="Search notes..."
            value={search}
            onChange={(e) => {
              setPage(1);
              setSearch(e.target.value);
            }}
          />

          <select
            className="flex h-9 w-full rounded-md border bg-transparent px-3 py-1 text-sm shadow-sm"
            value={patientIds[0] ?? ""}
            onChange={(e) => {
              setPage(1);
              setPatientIds(e.target.value ? [e.target.value] : []);
            }}
          >
            <option value="">All Patients</option>

            {patients?.data.map((patient) => (
              <option key={patient.id} value={patient.id}>
                {patient.givenName} {patient.familyName}
              </option>
            ))}
          </select>

          <select
            className="flex h-9 w-full rounded-md border bg-transparent px-3 py-1 text-sm shadow-sm"
            value={clinicianIds[0] ?? ""}
            onChange={(e) => {
              setPage(1);
              setClinicianIds(e.target.value ? [e.target.value] : []);
            }}
          >
            <option value="">All Clinicians</option>

            {clinicians?.data.map((clinician) => (
              <option key={clinician.id} value={clinician.id}>
                {clinician.givenName} {clinician.familyName}
              </option>
            ))}
          </select>

          <Button
            variant="outline"
            onClick={() => {
              setSearch("");
              setPatientIds([]);
              setClinicianIds([]);
              setPage(1);
            }}
          >
            Clear Filters
          </Button>
        </div>

        {isLoading && <div>Loading...</div>}

        {!isLoading && data && (
          <>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Patient</TableHead>

                  <TableHead>Clinician</TableHead>

                  <TableHead>
                    <button
                      className="flex items-center font-medium"
                      onClick={() =>
                        setSortBy((prev) => (prev === "ASC" ? "DESC" : "ASC"))
                      }
                    >
                      Visited At
                      <SortIcon active direction={sortBy} />
                    </button>
                  </TableHead>

                  <TableHead>Notes</TableHead>

                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>

              <TableBody>
                {data.data.map((visit) => (
                  <TableRow key={visit.id}>
                    <TableCell>
                      {visit.patient.givenName} {visit.patient.familyName}
                    </TableCell>

                    <TableCell>
                      {visit.clinician.givenName} {visit.clinician.familyName}
                    </TableCell>

                    <TableCell>
                      {new Date(visit.visitedAt).toLocaleString()}
                    </TableCell>

                    <TableCell>{visit.notes ?? "-"}</TableCell>

                    <TableCell className="space-x-2">
                      <Button variant="outline" size="sm" asChild>
                        <Link to={`/visits/${visit.id}`}>View</Link>
                      </Button>

                      <Button size="sm" asChild>
                        <Link to={`/visits/${visit.id}/edit`}>Edit</Link>
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>

            {data.data.length === 0 && (
              <div className="py-8 text-center text-muted-foreground">
                No visits found.
              </div>
            )}

            <div className="flex items-center justify-between">
              <Button
                variant="outline"
                disabled={page === 1}
                onClick={() => setPage((prev) => prev - 1)}
              >
                Previous
              </Button>

              <span>
                Page {page} of {totalPages}
              </span>

              <Button
                variant="outline"
                disabled={page >= totalPages}
                onClick={() => setPage((prev) => prev + 1)}
              >
                Next
              </Button>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
}
