import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import {
  cliniciansControllerCreate,
  cliniciansControllerFindAll,
  cliniciansControllerFindOne,
  cliniciansControllerUpdate,
} from "@/api/sdk.gen";

import type { ClinicianFormValues } from "./clinician.schema";

export function useClinicians(query: {
  page: number;
  limit: number;
  search?: string;
  sortBy?: "ASC" | "DESC";
  orderBy?: "givenName" | "familyName" | "dateOfBirth" | "createdAt";
}) {
  return useQuery({
    queryKey: ["clinicians", query],
    queryFn: async () => {
      const res = await cliniciansControllerFindAll({
        query,
      });

      return res.data;
    },
    placeholderData: (previousData) => previousData,
  });
}

export function useClinician(id: string) {
  return useQuery({
    queryKey: ["clinician", id],
    queryFn: async () => {
      const res = await cliniciansControllerFindOne({
        path: { id },
      });

      return res.data;
    },
    enabled: !!id,
  });
}

export function useCreateClinician() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (body: ClinicianFormValues) => {
      const res = await cliniciansControllerCreate({
        body,
      });

      return res.data;
    },

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["clinicians"],
      });
    },
  });
}

export function useUpdateClinician(id: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (body: Partial<ClinicianFormValues>) => {
      const res = await cliniciansControllerUpdate({
        path: { id },
        body,
      });

      return res.data;
    },

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["clinicians"],
      });

      queryClient.invalidateQueries({
        queryKey: ["clinician", id],
      });
    },
  });
}
