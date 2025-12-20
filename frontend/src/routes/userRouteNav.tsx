import { Roles } from "../store/Slice/userSlice";
import {
  AccountReqIcon,
  Notification,
  LegalRecords,
  PaymentIcon,
} from "../icons";
import { GridIcon, ListTodo, History } from "lucide-react";
import { JSX } from "react";
import ConsultationPage from "../pages/LegalCase/ConsultationPage";
import AccountRequest from "../pages/AdminPages/AccountRequestPage";
import AllAccountPage from "../pages/AdminPages/AllAccountsPage";
import ClientPage from "../pages/LegalCase/ClientsPage";
import CasesPage from "../pages/LegalCase/CasePage";
import CaseTransaction from "../pages/LegalCase/CaseTransaction";
import ProccessServerTaskPage from "../pages/LegalCase/ProccessServerTaskPage";

import PaymentsPage from "../pages/LegalCase/CasePaymentPage";
import NotificationsPage from "../pages/Notification/NotificationPage";
import AdminDashboard from "../pages/Dashboard/AdminDashboard";
import Dashboard from "../pages/Dashboard/Dashboard";
import SessionLogs from "../pages/AdminPages/SessionLogPage";

export type NavItem = {
  name: string;
  icon: React.ReactNode;
  path?: string;
  subItems?: { name: string; path: string; pro?: boolean; new?: boolean }[];
};

// allowed to admin, attonney, paralegals
const cases: NavItem = {
  icon: <LegalRecords />,
  name: "Legal Records",
  subItems: [
    {
      name: "Consultation",
      path: "/consultation",
    },
    {
      name: "Cases",
      path: "/case",
    },
    {
      name: "Clients",
      path: "/client",
    },
  ],
};

export const navRoutes: Record<Roles, { menu: NavItem[]; others: NavItem[] }> =
  {
    [Roles.foundingManager]: {
      menu: [
        {
          icon: <GridIcon />,
          name: "Dashboard",
          path: "/",
        },

        cases,
        {
          icon: <PaymentIcon />,
          name: "Payments",
          path: "/payments",
        },
      ],
      others: [
        {
          icon: <AccountReqIcon />,
          name: "Account Management",
          subItems: [
            {
              name: "Account Requests",
              path: "/request",
            },
            {
              name: "All Accounts",
              path: "/accounts",
            },
          ],
        },
        {
          icon: <Notification />,
          name: "Notifications",
          path: "/notification",
        },
        {
          icon: <History />,
          name: "Session Logs",
          path: "/session",
        },
      ],
    },
    [Roles.lawyer]: {
      menu: [
        {
          icon: <GridIcon />,
          name: "Dashboard",
          path: "/",
        },

        cases,
      ],
      others: [
        {
          icon: <Notification />,
          name: "Notification",
          path: "/notification",
        },
      ],
    },
    [Roles.paralegal]: {
      menu: [
        {
          icon: <GridIcon />,
          name: "Dashboard",
          path: "/",
        },

        cases,
        {
          icon: <PaymentIcon />,
          name: "Payments",
          path: "/payments",
        },
      ],
      others: [
        {
          icon: <Notification />,
          name: "Notifications",
          path: "/notification",
        },
      ],
    },
    [Roles.processServer]: {
      menu: [
        {
          icon: <ListTodo />,
          name: "Tasks",
          path: "/",
        },
        {
          icon: <Notification />,
          name: "Notification",
          path: "/notification",
        },
      ],
      others: [],
    },
  };

type AppRoutes = {
  path: string;
  element: JSX.Element;
};

export const appRoutes: Record<Roles, AppRoutes[]> = {
  [Roles.foundingManager]: [
    { path: "/", element: <AdminDashboard /> },

    // cases
    { path: "/consultation", element: <ConsultationPage /> },
    { path: "/case", element: <CasesPage /> },
    { path: "/client", element: <ClientPage /> },

    { path: "/payments", element: <PaymentsPage /> },

    { path: "/request", element: <AccountRequest /> },
    { path: "/accounts", element: <AllAccountPage /> },

    { path: "/notification", element: <NotificationsPage /> },
    { path: "/session", element: <SessionLogs /> },
  ],
  [Roles.lawyer]: [
    { path: "/", element: <Dashboard /> },

    // cases
    { path: "/consultation", element: <ConsultationPage /> },
    { path: "/case", element: <CasesPage /> },
    { path: "/client", element: <ClientPage /> },

    { path: "/notification", element: <NotificationsPage /> },
  ],
  [Roles.paralegal]: [
    { path: "/", element: <Dashboard /> },

    // cases
    { path: "/consultation", element: <ConsultationPage /> },
    { path: "/case", element: <CasesPage /> },
    { path: "/client", element: <ClientPage /> },

    { path: "/payments", element: <PaymentsPage /> },

    { path: "/notification", element: <NotificationsPage /> },
  ],
  [Roles.processServer]: [
    { path: "/", element: <ProccessServerTaskPage /> },
    { path: "/tasks", element: <AccountRequest /> },
    { path: "/notification", element: <NotificationsPage /> },
  ],
};

// case transaction, process-server should not access it
export type CaseTransactionRoles = Exclude<Roles, Roles.processServer>;
const caseTransactionPath: AppRoutes = {
  path: "/case/transaction/:id/*",
  element: <CaseTransaction />,
};
export const caseTransaction: Record<CaseTransactionRoles, AppRoutes> = {
  [Roles.foundingManager]: caseTransactionPath,
  [Roles.lawyer]: caseTransactionPath,
  [Roles.paralegal]: caseTransactionPath,
};

export function userUserRoute(userRoles?: Roles): AppRoutes[] | undefined {
  if (!userRoles) return undefined;

  return appRoutes[userRoles];
}
