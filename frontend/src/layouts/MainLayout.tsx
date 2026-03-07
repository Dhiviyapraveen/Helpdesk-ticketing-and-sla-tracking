import { Navigate, Outlet } from "react-router-dom";
import AppSidebar from "@/components/AppSidebar";
import Navbar from "@/components/Navbar";
import { useAuth } from "@/hooks/useAuth";

const MainLayout = () => {

  const { user } = useAuth();

  // check user instead of token
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return (
    <div className="flex h-screen w-full overflow-hidden">

      <AppSidebar />

      <div className="flex flex-1 flex-col overflow-hidden">

        <Navbar />

        <main className="flex-1 overflow-y-auto p-4 sm:p-6">
          <Outlet />
        </main>

      </div>

    </div>
  );
};

export default MainLayout;