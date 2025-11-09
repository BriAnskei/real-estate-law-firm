import { Route, Routes, useLocation } from "react-router-dom";

import { ScrollToTop } from "./components/common/ScrollToTop";
import { Toaster } from "sonner";

import { AuthProvider } from "./context/AuthContext";
import { useEffect } from "react";
import SignInForm from "./components/auth/SignInForm";
import SignUpForm from "./components/auth/SignUpForm";
import AuthLayout from "./pages/AuthPages/AuthPageLayout";
import { Home } from "lucide-react";
import AppLayout from "./layout/AppLayout";
import AccountRequest from "./pages/AdminPages/AccountRequestPage";
import Blank from "./pages/Blank";
import NotFound from "./pages/OtherPage/NotFound";
import UserProfiles from "./pages/UserProfiles";
import { AllowedUserPaths } from "./routes/userRouteNav";
import { useSelector } from "react-redux";
import { selectCurrentUser } from "./store/selector/user/userSelector";
import Calendar from "./pages/Calendar";

const AppRoutes = () => {
  return (
    <Routes>
      {/* public Routes */}
      <Route element={<AuthLayout />}>
        <Route path="/signin" element={<SignInForm />} />
        <Route path="/signup" element={<SignUpForm />} />
      </Route>
      {/* Protected routes */}
      <Route element={<AppLayout />}>
        <Route index element={<Home />} />
        {/* Others Page */}
        <Route path="/profile" element={<UserProfiles />} />
        <Route path="/calendar" element={<Calendar />} />
        <Route path="/blank" element={<Blank />} />

        <Route path="/request" element={<AccountRequest />} />
      </Route>
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

export default function App() {
  const location = useLocation();
  const user = useSelector(selectCurrentUser);

  if (user && !AllowedUserPaths(user?.role!).includes(location.pathname)) {
    return <NotFound />;
  }

  return (
    <>
      <AuthProvider>
        <ScrollToTop />
        <AppRoutes />
      </AuthProvider>
      <Toaster position="top-left" />
    </>
  );
}
