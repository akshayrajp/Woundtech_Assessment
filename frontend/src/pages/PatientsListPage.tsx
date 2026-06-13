import { useState } from "react";
import { Link } from "react-router-dom";

import { usePatients } from "@/features/patients/patient.hooks";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { SortIcon, type SortDirection } from "@/components/SortIcon";

type PatientOrderBy = "givenName" | "familyName" | "dateOfBirth" | "createdAt";

export function PatientsListPage() {
  const [page, setPage] = useState(1);
  const [limit] = useState(10);

  const [search, setSearch] = useState("");

  const [orderBy, setOrderBy] = useState<PatientOrderBy>("createdAt");

  const [sortBy, setSortBy] = useState<SortDirection>("DESC");

  const { data, isLoading } = usePatients({
    page,
    limit,
    search: search || undefined,
    orderBy,
    sortBy,
  });

  const totalPages = data ? Math.ceil(data.total / data.limit) : 0;

  function toggleSort(column: PatientOrderBy) {
    if (column === orderBy) {
      setSortBy((prev) => (prev === "ASC" ? "DESC" : "ASC"));
    } else {
      setOrderBy(column);
      setSortBy("ASC");
    }
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Patients</CardTitle>

        <Button asChild>
          <Link to="/patients/new">Create Patient</Link>
        </Button>
      </CardHeader>

      <CardContent className="space-y-4">
        <Input
          placeholder="Search patients..."
          value={search}
          onChange={(e) => {
            setPage(1);
            setSearch(e.target.value);
          }}
        />

        {isLoading && <div>Loading...</div>}

        {!isLoading && data && (
          <>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>
                    <button
                      className="flex items-center font-medium"
                      onClick={() => toggleSort("givenName")}
                    >
                      Given Name
                      <SortIcon
                        active={orderBy === "givenName"}
                        direction={sortBy}
                      />
                    </button>
                  </TableHead>

                  <TableHead>
                    <button
                      className="flex items-center font-medium"
                      onClick={() => toggleSort("familyName")}
                    >
                      Family Name
                      <SortIcon
                        active={orderBy === "familyName"}
                        direction={sortBy}
                      />
                    </button>
                  </TableHead>

                  <TableHead>
                    <button
                      className="flex items-center font-medium"
                      onClick={() => toggleSort("dateOfBirth")}
                    >
                      DOB
                      <SortIcon
                        active={orderBy === "dateOfBirth"}
                        direction={sortBy}
                      />
                    </button>
                  </TableHead>

                  <TableHead>Gender</TableHead>

                  <TableHead>
                    <button
                      className="flex items-center font-medium"
                      onClick={() => toggleSort("createdAt")}
                    >
                      Created At
                      <SortIcon
                        active={orderBy === "createdAt"}
                        direction={sortBy}
                      />
                    </button>
                  </TableHead>

                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>

              <TableBody>
                {data.data.map((patient) => (
                  <TableRow key={patient.id}>
                    <TableCell>{patient.givenName}</TableCell>

                    <TableCell>{patient.familyName}</TableCell>

                    <TableCell>
                      {new Date(patient.dateOfBirth).toLocaleDateString()}
                    </TableCell>

                    <TableCell>{patient.gender}</TableCell>

                    <TableCell>
                      {new Date(patient.createdAt).toLocaleString()}
                    </TableCell>

                    <TableCell className="space-x-2">
                      <Button variant="outline" size="sm" asChild>
                        <Link to={`/patients/${patient.id}`}>View</Link>
                      </Button>

                      <Button size="sm" asChild>
                        <Link to={`/patients/${patient.id}/edit`}>Edit</Link>
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>

            {data.data.length === 0 && (
              <div className="py-8 text-center text-muted-foreground">
                No patients found.
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
