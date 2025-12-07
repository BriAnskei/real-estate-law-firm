import { Roles } from "../store/Slice/userSlice";
import {
  CalenderIcon,
  AccountReqIcon,
  Notification,
  LegalRecords,
} from "../icons";
import { GridIcon, ListTodo } from "lucide-react";
import { JSX } from "react";
import Home from "../pages/Dashboard/Home";
import ConsultationPage from "../pages/LegalCase/ConsultationPage";
import AccountRequest from "../pages/AdminPages/AccountRequestPage";
import AllAccountPage from "../pages/AdminPages/AllAccountsPage";
import ClientPage from "../pages/LegalCase/ClientsPage";
import CasesPage from "../pages/LegalCase/CasePage";
import CaseTransaction from "../pages/LegalCase/CaseTransaction";
import ProccessServerTaskPage from "../pages/LegalCase/ProccessServerTaskPage";

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
          icon: <CalenderIcon />,
          name: "Calendar",
          path: "/calendar",
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
          path: "/notifications",
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
        {
          icon: <CalenderIcon />,
          name: "Calendar",
          path: "/calendar",
        },
      ],
      others: [
        {
          icon: <Notification />,
          name: "Notifications",
          path: "/notifications",
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
          icon: <CalenderIcon />,
          name: "Calendar",
          path: "/calendar",
        },
      ],
      others: [
        {
          icon: <Notification />,
          name: "Notifications",
          path: "/notifications",
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
          name: "Notifications",
          path: "/notifications",
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
    { path: "/", element: <Home /> },

    // cases
    { path: "/consultation", element: <ConsultationPage /> },
    { path: "/case", element: <CasesPage /> },
    { path: "/client", element: <ClientPage /> },

    { path: "/request", element: <AccountRequest /> },
    { path: "/accounts", element: <AllAccountPage /> },
  ],
  [Roles.lawyer]: [
    { path: "/", element: <Home /> },

    // cases
    { path: "/consultation", element: <ConsultationPage /> },
    { path: "/case", element: <CasesPage /> },
    { path: "/client", element: <ClientPage /> },
  ],
  [Roles.paralegal]: [
    { path: "/", element: <Home /> },

    // cases
    { path: "/consultation", element: <ConsultationPage /> },
    { path: "/case", element: <CasesPage /> },
    { path: "/client", element: <ClientPage /> },
  ],
  [Roles.processServer]: [
    { path: "/", element: <ProccessServerTaskPage /> },
    { path: "/tasks", element: <AccountRequest /> },
    { path: "/notification", element: <AllAccountPage /> },
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
