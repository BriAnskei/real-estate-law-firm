import { Route, Routes, useLocation, useNavigate } from "react-router-dom";
import { Toaster } from "sonner";
import { AuthProvider } from "./context/AuthContext";
import SignInForm from "./components/auth/SignInForm";
import SignUpForm from "./components/auth/SignUpForm";
import AuthLayout from "./pages/AuthPages/AuthPageLayout";
import AppLayout from "./layout/AppLayout";
import NotFound from "./pages/OtherPage/NotFound";
import { appRoutes } from "./routes/userRouteNav";
import { useSelector } from "react-redux";
import { selectCurrentUser } from "./store/selector/user/userSelector";
import { Roles } from "./store/Slice/userSlice";

const AppRoutes = ({ userRole }: { userRole: Roles }) => {
  return (
    <Routes>
      {/* public Routes */}
      <Route element={<AuthLayout />}>
        <Route path="/signin" element={<SignInForm />} />
        <Route path="/signup" element={<SignUpForm />} />
      </Route>

      {/* Protected routes */}
      <Route element={<AppLayout />}>
        {userRole &&
          appRoutes[userRole].map((r) => (
            <Route key={r.path} path={r.path} element={r.element} />
          ))}
      </Route>

      {/* Catch all - must be last */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

export default function App() {
  const user = useSelector(selectCurrentUser);

  return (
    <>
      <AuthProvider>
        <AppRoutes userRole={user?.role!} />
        <Toaster position="top-left" />
      </AuthProvider>
    </>
  );
}
