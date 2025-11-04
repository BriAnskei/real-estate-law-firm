import { Navigate, Route, Routes, useLocation } from "react-router";
import SignIn from "../pages/AuthPages/SignIn";
import SignUp from "../pages/AuthPages/SignUp";

export default function PublicRoutes() {
  const location = useLocation();

  return (
    <Routes>
      <Route path="/signin" element={<SignIn />} />
      <Route path="/signup" element={<SignUp />} />

      {/* Redirect any other path to signin */}
      <Route
        path="*"
        element={<Navigate to="/signin" replace state={{ from: location }} />}
      />
    </Routes>
  );
}
