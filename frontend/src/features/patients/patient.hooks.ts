import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import {
  patientsControllerCreate,
  patientsControllerFindAll,
  patientsControllerFindOne,
  patientsControllerUpdate,
} from "@/api/sdk.gen";

import type { PatientFormValues } from "./patient.schema";

export function usePatients(query: {
  page: number;
  limit: number;
  search?: string;
  sortBy?: "ASC" | "DESC";
  orderBy?: "givenName" | "familyName" | "dateOfBirth" | "createdAt";
}) {
  return useQuery({
    queryKey: ["patients", query],
    queryFn: async () => {
      const res = await patientsControllerFindAll({
        query,
      });

      return res.data;
    },
    placeholderData: (previousData) => previousData,
  });
}

export function usePatient(id: string) {
  return useQuery({
    queryKey: ["patient", id],
    queryFn: async () => {
      const res = await patientsControllerFindOne({
        path: { id },
      });

      return res.data;
    },
    enabled: !!id,
  });
}

export function useCreatePatient() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (body: PatientFormValues) => {
      const res = await patientsControllerCreate({
        body,
      });

      return res.data;
    },

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["patients"],
      });
    },
  });
}

export function useUpdatePatient(id: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (body: Partial<PatientFormValues>) => {
      const res = await patientsControllerUpdate({
        path: { id },
        body,
      });

      return res.data;
    },

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["patients"],
      });

      queryClient.invalidateQueries({
        queryKey: ["patient", id],
      });
    },
  });
}
