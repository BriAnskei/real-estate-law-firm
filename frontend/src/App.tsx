import { Route, Routes } from "react-router-dom";
import { Toaster } from "sonner";
import { AuthProvider } from "./context/AuthContext";
import SignInForm from "./components/auth/SignInForm";
import SignUpForm from "./components/auth/SignUpForm";
import AuthLayout from "./pages/AuthPages/AuthPageLayout";
import AppLayout from "./layout/AppLayout";
import NotFound from "./pages/OtherPage/NotFound";
import {
  appRoutes,
  caseTransaction,
  CaseTransactionRoles,
} from "./routes/userRouteNav";
import { useSelector } from "react-redux";
import { selectCurrentUser } from "./store/selector/user/userSelector";
import { Roles } from "./store/Slice/userSlice";
import { RootState } from "./store/store";
import AppInitializationLoader from "./components/ui/loading/AppInitializationLoader";

function useCaseTransactionRole(role: Roles): role is CaseTransactionRoles {
  return role !== Roles.processServer;
}

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

      {/* Case transaction - whole page */}
      {useCaseTransactionRole(userRole) && (
        <Route
          key={caseTransaction[userRole].path}
          path={caseTransaction[userRole].path}
          element={caseTransaction[userRole].element}
        />
      )}
      {/* Catch all - must be last */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

export default function App() {
  const { loading } = useSelector((state: RootState) => state.user);
  const user = useSelector(selectCurrentUser);

  return (
    <>
      <AuthProvider>
        {loading ? (
          <AppInitializationLoader isLoading={loading} />
        ) : (
          <AppRoutes userRole={user?.role!} />
        )}
        <Toaster position="top-left" />
      </AuthProvider>
    </>
  );
}
