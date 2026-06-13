import { NavLink, Outlet } from "react-router-dom";

export function AppLayout() {
  const navClass = ({ isActive }: { isActive: boolean }) =>
    `px-4 py-2 rounded-md ${
      isActive ? "bg-primary text-primary-foreground" : ""
    }`;

  return (
    <div className="min-h-screen">
      <header className="border-b">
        <div className="container mx-auto flex items-center gap-4 p-4">
          <h1 className="text-xl font-bold">Woundtech</h1>

          <NavLink to="/patients" className={navClass}>
            Patients
          </NavLink>

          <NavLink to="/clinicians" className={navClass}>
            Clinicians
          </NavLink>

          <NavLink to="/visits" className={navClass}>
            Visits
          </NavLink>
        </div>
      </header>

      <main className="container mx-auto p-6">
        <Outlet />
      </main>
    </div>
  );
}
