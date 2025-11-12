import { Outlet } from "react-router";
import { Roles } from "../../store/Slice/userSlice";
import NotFound from "../../pages/OtherPage/NotFound";

interface ProtectedRoutesProp {
  allowedRoles: Roles[];
  userRole: Roles;
}

export default function ProtectedRoute({
  allowedRoles,
  userRole,
}: ProtectedRoutesProp) {
  console.log("user Role: ", userRole);

  return allowedRoles.includes(userRole) ? <Outlet /> : <NotFound />;
}
