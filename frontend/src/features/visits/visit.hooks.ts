import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import {
  visitsControllerCreate,
  visitsControllerFindAll,
  visitsControllerFindOne,
  visitsControllerRemove,
  visitsControllerUpdate,
} from "@/api/sdk.gen";

import type { VisitFormValues } from "./visit.schema";

type VisitOrderBy = "visitedAt";

export function useVisits(query: {
  page: number;
  limit: number;
  search?: string;
  sortBy?: "ASC" | "DESC";
  orderBy?: VisitOrderBy;
  patientIds?: string[];
  clinicianIds?: string[];
}) {
  return useQuery({
    queryKey: ["visits", query],
    queryFn: async () => {
      const res = await visitsControllerFindAll({
        query,
      });

      return res.data;
    },
    placeholderData: (previousData) => previousData,
  });
}

export function useVisit(id: string) {
  return useQuery({
    queryKey: ["visit", id],
    queryFn: async () => {
      const res = await visitsControllerFindOne({
        path: { id },
      });

      return res.data;
    },
    enabled: !!id,
  });
}

export function useCreateVisit() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (body: VisitFormValues) => {
      const res = await visitsControllerCreate({
        body,
      });

      return res.data;
    },

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["visits"],
      });
    },
  });
}

export function useUpdateVisit(id: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (body: Partial<VisitFormValues>) => {
      const res = await visitsControllerUpdate({
        path: { id },
        body,
      });

      return res.data;
    },

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["visits"],
      });

      queryClient.invalidateQueries({
        queryKey: ["visit", id],
      });
    },
  });
}

export function useDeleteVisit() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const res = await visitsControllerRemove({
        path: { id },
      });

      return res.data;
    },

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["visits"],
      });
    },
  });
}
