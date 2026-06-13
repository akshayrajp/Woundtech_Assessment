import { Navigate } from "react-router-dom";
import { createBrowserRouter } from "react-router-dom";

import { AppLayout } from "@/components/AppLayout";

import { PatientsListPage } from "@/pages/PatientsListPage";
import { CreatePatientPage } from "@/pages/CreatePatientPage";
import { ViewPatientPage } from "@/pages/ViewPatientPage";
import { EditPatientPage } from "@/pages/EditPatientPage";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <AppLayout />,
    children: [
      {
        index: true,
        element: <Navigate to="/patients" replace />,
      },

      {
        path: "patients",
        element: <PatientsListPage />,
      },

      {
        path: "patients/new",
        element: <CreatePatientPage />,
      },

      {
        path: "patients/:id",
        element: <ViewPatientPage />,
      },

      {
        path: "patients/:id/edit",
        element: <EditPatientPage />,
      },
    ],
  },
]);
