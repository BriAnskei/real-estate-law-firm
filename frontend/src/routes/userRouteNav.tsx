import { Roles } from "../store/Slice/userSlice";
import {
  CalenderIcon,
  AccountReqIcon,
  Notification,
  LegalRecords,
} from "../icons";
import { GridIcon } from "lucide-react";
import { JSX } from "react";
import Home from "../pages/Dashboard/Home";
import ConsultationPage from "../pages/LegalCase/ConsultationPage";
import AccountRequest from "../pages/AdminPages/AccountRequestPage";
import AllAccountPage from "../pages/AdminPages/AllAccountsPage";

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
      name: "All Cases",
      path: "/request",
    },
    {
      name: "Clients",
      path: "/users",
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
      menu: [],
      others: [],
    },
    [Roles.paralegal]: {
      menu: [],
      others: [],
    },
    [Roles.processServer]: {
      menu: [
        {
          icon: <GridIcon />,
          name: "gegege",
          path: "/",
        },

        cases,
        {
          icon: <CalenderIcon />,
          name: "hahaha",
          path: "/calendar",
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
    { path: "/consultation", element: <ConsultationPage /> },
    { path: "/request", element: <AccountRequest /> },
    { path: "/accounts", element: <AllAccountPage /> },
  ],
  [Roles.lawyer]: [],
  [Roles.paralegal]: [],
  [Roles.processServer]: [
    { path: "/", element: <Home /> },
    { path: "/consultation", element: <ConsultationPage /> },
    { path: "/request", element: <AccountRequest /> },
    { path: "/accounts", element: <AllAccountPage /> },
  ],
};

// helper function to help validate allowed routes
export const isRouteValid = (userRole: Roles): string[] => {
  const allowedRoutes: string[] = [];
  const userRoutes = { ...(navRoutes[userRole] || []) };

  // main
  userRoutes.menu.map((route) => {
    if (route.subItems) {
      route.subItems.map((r) => allowedRoutes.push(r.path));
    } else {
      allowedRoutes.push(route.path!);
    }
  });

  //others
  userRoutes.others.map((route) => {
    if (route.subItems) {
      route.subItems.map((r) => allowedRoutes.push(r.path));
    } else {
      allowedRoutes.push(route.path!);
    }
  });

  return allowedRoutes;
};
