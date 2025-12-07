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
import ProcessServerTaskView from "./pages/ProccessServer/ProccessServerTaskView";

function isCaseTransactionRole(role: Roles): role is CaseTransactionRoles {
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

      {/* Case transaction - stand alone page for (admin, lawyer, proccess server)*/}
      {userRole && isCaseTransactionRole(userRole) && (
        <Route
          key={caseTransaction[userRole].path}
          path={caseTransaction[userRole].path}
          element={caseTransaction[userRole].element}
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
      {userRole && userRole === Roles.processServer && (
        <Route
          path="proccess_server/view/task"
          element={<ProcessServerTaskView />}
        />
      )}

      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

export default function App() {
  const { loading } = useSelector((state: RootState) => state.user);
  const { refreshLoading } = useSelector((state: RootState) => state.auth);

  const user = useSelector(selectCurrentUser);

  return (
    <>
      <AuthProvider>
        {!user || refreshLoading || loading ? (
          <AppInitializationLoader
            isLoading={refreshLoading || loading || !user}
          />
        ) : (
          <AppRoutes userRole={user?.role!} />
        )}
        <Toaster position="top-left" />
      </AuthProvider>
    </>
  );
}
