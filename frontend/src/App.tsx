import { BrowserRouter as Router, Navigate } from "react-router";
import { ScrollToTop } from "./components/common/ScrollToTop";
import PublicRoutes from "./routes/PublicRoutes";
import AdminRoutes from "./routes/AdminRoutes";
import AttorneyRoutes from "./routes/AttorneyRoutes";
import { Toaster } from "sonner";
import { useSelector } from "react-redux";
import { RootState } from "./store/store";
import { useUsers } from "./hooks/state/user/useUsers";
import { JSX } from "react";
import ParalegalRoutes from "./routes/ParalegalRoutes";
import ProcessServerRoutes from "./routes/processServerRoutes";
import { Roles } from "./store/Slice/userSlice";

function AppContent() {
  const { loading, role } = useUsers();

  if (loading) return <>Loading</>;

  const appRoutes: Record<Roles, JSX.Element> = {
    "founding-manager/admin": <AdminRoutes />,
    lawyer: <AttorneyRoutes />,
    paralegal: <ParalegalRoutes />,
    "process-server": <ProcessServerRoutes />,
  };

  return appRoutes[role as Roles];
}

export default function App() {
  const { isAuthenticated } = useSelector((state: RootState) => state.auth);

  return (
    <>
      <Router>
        <ScrollToTop />

        {!isAuthenticated ? (
          <PublicRoutes isAuthenticated={isAuthenticated} />
        ) : (
          <AppContent />
        )}
      </Router>
      <Toaster position="top-left" />
    </>
  );
}
