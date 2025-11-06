import { BrowserRouter as Router, Navigate } from "react-router-dom";
import { Route, Routes } from "react-router-dom";
import { ScrollToTop } from "./components/common/ScrollToTop";
import PublicRoutes from "./routes/PublicRoutes";
import AdminRoutes from "./routes/AdminRoutes";
import AttorneyRoutes from "./routes/AttorneyRoutes";
import ParalegalRoutes from "./routes/ParalegalRoutes";
import ProcessServerRoutes from "./routes/processServerRoutes";
import { Toaster } from "sonner";
import { useSelector } from "react-redux";
import { RootState } from "./store/store";
import { useUsers } from "./hooks/state/user/useUsers";
import { Roles } from "./store/Slice/userSlice";
import { AuthProvider } from "./context/AuthContext";
import { JSX } from "react";

function AppContent() {
  const { loading, role } = useUsers();

  if (loading) return <div>Loading...</div>;

  const appRoutes: Record<Roles, JSX.Element> = {
    "founding-manager/admin": <AdminRoutes />,
    lawyer: <AttorneyRoutes />,
    paralegal: <ParalegalRoutes />,
    "process-server": <ProcessServerRoutes />,
  };

  return appRoutes[role as Roles] || <Navigate to="/signin" replace />;
}

export default function App() {
  const { isAuthenticated, loading } = useSelector(
    (state: RootState) => state.auth
  );

  return (
    <>
      <Router>
        <AuthProvider>
          <ScrollToTop />
          {!isAuthenticated || loading ? <PublicRoutes /> : <AppContent />}
        </AuthProvider>
      </Router>
      <Toaster position="top-left" />
    </>
  );
}
