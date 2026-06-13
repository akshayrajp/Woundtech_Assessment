import { useState } from "react";
import { Link } from "react-router-dom";

import { useClinicians } from "@/features/clinicians/clinician.hooks";

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

type ClinicianOrderBy =
  | "givenName"
  | "familyName"
  | "dateOfBirth"
  | "createdAt";

type SortDirection = "ASC" | "DESC";

export function CliniciansListPage() {
  const [page, setPage] = useState(1);
  const [limit] = useState(10);

  const [search, setSearch] = useState("");

  const [orderBy, setOrderBy] = useState<ClinicianOrderBy>("createdAt");

  const [sortBy, setSortBy] = useState<SortDirection>("DESC");

  const { data, isLoading } = useClinicians({
    page,
    limit,
    search: search || undefined,
    orderBy,
    sortBy,
  });

  const totalPages = data ? Math.ceil(data.total / data.limit) : 0;

  function toggleSort(column: ClinicianOrderBy) {
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
        <CardTitle>Clinicians</CardTitle>

        <Button asChild>
          <Link to="/clinicians/new">Create Clinician</Link>
        </Button>
      </CardHeader>

      <CardContent className="space-y-4">
        <Input
          placeholder="Search clinicians..."
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
                    <button onClick={() => toggleSort("givenName")}>
                      Given Name
                    </button>
                  </TableHead>

                  <TableHead>
                    <button onClick={() => toggleSort("familyName")}>
                      Family Name
                    </button>
                  </TableHead>

                  <TableHead>
                    <button onClick={() => toggleSort("dateOfBirth")}>
                      DOB
                    </button>
                  </TableHead>

                  <TableHead>Gender</TableHead>

                  <TableHead>
                    <button onClick={() => toggleSort("createdAt")}>
                      Created At
                    </button>
                  </TableHead>

                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>

              <TableBody>
                {data.data.map((clinician) => (
                  <TableRow key={clinician.id}>
                    <TableCell>{clinician.givenName}</TableCell>

                    <TableCell>{clinician.familyName}</TableCell>

                    <TableCell>
                      {new Date(clinician.dateOfBirth).toLocaleDateString()}
                    </TableCell>

                    <TableCell>{clinician.gender}</TableCell>

                    <TableCell>
                      {new Date(clinician.createdAt).toLocaleString()}
                    </TableCell>

                    <TableCell className="space-x-2">
                      <Button variant="outline" size="sm" asChild>
                        <Link to={`/clinicians/${clinician.id}`}>View</Link>
                      </Button>

                      <Button size="sm" asChild>
                        <Link to={`/clinicians/${clinician.id}/edit`}>
                          Edit
                        </Link>
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>

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
