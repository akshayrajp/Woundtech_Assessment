import { useState } from "react";
import { Link } from "react-router-dom";

import { useVisits } from "@/features/visits/visit.hooks";

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

type SortDirection = "ASC" | "DESC";

export function VisitsListPage() {
  const [page, setPage] = useState(1);

  const [search, setSearch] = useState("");

  const [sortBy, setSortBy] = useState<SortDirection>("DESC");

  const { data, isLoading } = useVisits({
    page,
    limit: 10,
    search: search || undefined,
    orderBy: "visitedAt",
    sortBy,
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
        <Input
          placeholder="Search notes..."
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
                  <TableHead>Patient</TableHead>
                  <TableHead>Clinician</TableHead>
                  <TableHead>
                    <button
                      onClick={() =>
                        setSortBy((prev) => (prev === "ASC" ? "DESC" : "ASC"))
                      }
                    >
                      Visited At
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

            <div className="flex items-center justify-between">
              <Button
                variant="outline"
                disabled={page === 1}
                onClick={() => setPage((p) => p - 1)}
              >
                Previous
              </Button>

              <span>
                Page {page} of {totalPages}
              </span>

              <Button
                variant="outline"
                disabled={page >= totalPages}
                onClick={() => setPage((p) => p + 1)}
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
