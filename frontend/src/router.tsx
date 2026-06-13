import { Navigate } from "react-router-dom";
import { createBrowserRouter } from "react-router-dom";

import { AppLayout } from "@/components/AppLayout";

import { PatientsListPage } from "@/pages/PatientsListPage";
import { CreatePatientPage } from "@/pages/CreatePatientPage";
import { ViewPatientPage } from "@/pages/ViewPatientPage";
import { EditPatientPage } from "@/pages/EditPatientPage";
import { CliniciansListPage } from "./pages/CliniciansListPage";
import { CreateClinicianPage } from "./pages/CreateClinicianPage";
import { ViewClinicianPage } from "./pages/ViewClinicianPage";
import { EditClinicianPage } from "./pages/EditClinicianPage";
import { VisitsListPage } from "./pages/VisitsListPage";
import { CreateVisitPage } from "./pages/CreateVisitPage";
import { ViewVisitPage } from "./pages/ViewVisitPage";
import { EditVisitPage } from "./pages/EditVisitPage";

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
      {
        path: "clinicians",
        element: <CliniciansListPage />,
      },

      {
        path: "clinicians/new",
        element: <CreateClinicianPage />,
      },

      {
        path: "clinicians/:id",
        element: <ViewClinicianPage />,
      },

      {
        path: "clinicians/:id/edit",
        element: <EditClinicianPage />,
      },

      {
        path: "visits",
        element: <VisitsListPage />,
      },
      {
        path: "visits/new",
        element: <CreateVisitPage />,
      },
      {
        path: "visits/:id",
        element: <ViewVisitPage />,
      },
      {
        path: "visits/:id/edit",
        element: <EditVisitPage />,
      },
    ],
  },
]);
