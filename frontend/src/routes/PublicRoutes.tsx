import { Navigate, Route, Routes, useLocation } from "react-router-dom";
import SignIn from "../pages/AuthPages/SignIn";
import SignUp from "../pages/AuthPages/SignUp";

export default function PublicRoutes() {
  const location = useLocation();

  return (
    <Routes>
      <Route path="/signup" element={<SignUp />} />
      <Route path="/signin" element={<SignIn />} />
      <Route path="*" element={<Navigate to="/signin" replace />} />
    </Routes>
  );
}
