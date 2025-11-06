import { Calendar, Home } from "lucide-react";
import { Route, Routes } from "react-router-dom";
import Blank from "../pages/Blank";
import UserProfiles from "../pages/UserProfiles";

import NotFound from "../pages/OtherPage/NotFound";
import AccountRequest from "../pages/AdminPages/AccountRequestPage";
import AdminAppLayout from "../layout/AdminSide/AdminAppLayout";

export default function AdminRoutes() {
  return (
    <>
      <Routes>
        <Route element={<AdminAppLayout />}>
          <Route index element={<Home />} />
          {/* Others Page */}
          <Route path="/profile" element={<UserProfiles />} />
          <Route path="/calendar" element={<Calendar />} />
          <Route path="/blank" element={<Blank />} />

          <Route path="/request" element={<AccountRequest />} />
        </Route>
        <Route path="*" element={<NotFound />} />
      </Routes>
    </>
  );
}
