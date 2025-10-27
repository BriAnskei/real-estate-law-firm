import { Calendar, Home } from "lucide-react";
import { Route, Routes } from "react-router";
import Blank from "../pages/Blank";
import UserProfiles from "../pages/UserProfiles";
import AppLayout from "../layout/AppLayout";
import { ReactNode } from "react";

interface ProcessAppProp {
  children: ReactNode;
}

export default function ProcessApp({ children }: ProcessAppProp) {
  return (
    <>
      <Routes>
        <Route element={<AppLayout />}>
          <Route index path="/" element={<Home />} />
          {/* Others Page */}
          <Route path="/profile" element={<UserProfiles />} />
          <Route path="/calendar" element={<Calendar />} />
          <Route path="/blank" element={<Blank />} />
        </Route>
        {/* public routes(auth) */}
        {children}
      </Routes>
    </>
  );
}
