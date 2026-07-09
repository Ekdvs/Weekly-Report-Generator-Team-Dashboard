import { Outlet } from "react-router-dom";
import { Sidebar } from "./Sidebar";


export const AppLayout = () => {
  return (
    <div className="flex min-h-screen bg-surface-sunken">
      <Sidebar />
      <main className="flex-1 overflow-y-auto">
        <Outlet />
      </main>
    </div>
  );
};
