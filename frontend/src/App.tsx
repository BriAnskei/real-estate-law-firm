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
import { Content } from "./pages/LegalCase/CaseTransaction";
import TaskFormPage from "./pages/LegalCase/TaskFormPage";
import TaskReviewPage from "./pages/LegalCase/TaskReviewPage";
import ViewTaskPage from "./pages/LegalCase/ViewTaskPage";
import HearingsPage from "./pages/LegalCase/CaseHearingPage";
import ProcessServerTaskView from "./pages/ProcessServer/ProcessServerTaskView";
import { NotificationContextProvider } from "./context/NotificationContext";
import { DashboardProvider } from "./context/DashboardContext";

function isCaseTransactionRole(role: Roles): role is CaseTransactionRoles {
  return role !== Roles.processServer;
}

const AppRoutes = () => {
  const { loading } = useSelector((state: RootState) => state.user);
  const { refreshLoading, isAuthenticated } = useSelector(
    (state: RootState) => state.auth
  );

  const user = useSelector(selectCurrentUser);

  if (!user && (refreshLoading || loading || isAuthenticated))
    return <AppInitializationLoader isLoading />;

  return (
    <Routes>
      {/* public Routes */}
      <Route element={<AuthLayout />}>
        <Route path="/signin" element={<SignInForm />} />
        <Route path="/signup" element={<SignUpForm />} />
      </Route>

      {/* Protected routes */}
      <Route element={<AppLayout />}>
        {user?.role &&
          appRoutes[user!.role].map((r) => (
            <Route key={r.path} path={r.path} element={r.element} />
          ))}
      </Route>

      {/* Case transaction - stand alone page for (admin, lawyer, proccess server)*/}
      {user && isCaseTransactionRole(user.role) && (
        <Route
          key={caseTransaction[user.role].path}
          path={caseTransaction[user.role].path}
          element={caseTransaction[user.role].element}
        >
          <Route index element={<Content />} />
          <Route
            path="form/:stageId/:stage/:taskId?"
            element={<TaskFormPage />}
          />
          <Route path=":stage/task/:taskId" element={<ViewTaskPage />} />
          <Route
            path=":stage/task/review/:taskId"
            element={<TaskReviewPage />}
          />

          {/* Hearing table page */}
          <Route path="hearing" element={<HearingsPage />} />
        </Route>
      )}

      {/* proccess server stand alone page for viewing task */}
      {user && user.role === Roles.processServer && (
        <Route
          path="proccess_server/view/task/:taskId"
          element={<ProcessServerTaskView />}
        />
      )}

      <Route
        path="*"
        element={
          isAuthenticated && !user && loading ? (
            <AppInitializationLoader isLoading />
          ) : (
            <NotFound />
          )
        }
      />
    </Routes>
  );
};

export default function App() {
  return (
    <>
      <AuthProvider>
        <NotificationContextProvider>
          <DashboardProvider>
            <AppRoutes />

            <Toaster position="top-left" />
          </DashboardProvider>
        </NotificationContextProvider>
      </AuthProvider>
    </>
  );
}
