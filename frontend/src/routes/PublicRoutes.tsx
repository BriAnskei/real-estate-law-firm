import { Navigate, Route, Routes, useLocation } from "react-router";
import SignIn from "../pages/AuthPages/SignIn";
import SignUp from "../pages/AuthPages/SignUp";

export default function PublicRoutes({
  isAuthenticated,
}: {
  isAuthenticated: boolean;
}) {
  const publicPaths = ["/signin", "/signup"];
  const location = useLocation();

  if (!isAuthenticated && !publicPaths.includes(location.pathname)) {
    return <Navigate to="/signin" replace />;
  }

  return (
    <Routes>
      {/* Auth Layout */}
      <Route path="/signin" element={<SignIn />} />
      <Route path="/signup" element={<SignUp />} />
    </Routes>
  );
}
