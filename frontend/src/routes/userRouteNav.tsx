import { Roles } from "../store/Slice/userSlice";
import {
  CalenderIcon,
  AccountReqIcon,
  BoxCubeIcon,
  PlugInIcon,
  Notification,
  LegalRecords,
} from "../icons";
import { GridIcon } from "lucide-react";

export type NavItem = {
  name: string;
  icon: React.ReactNode;
  path?: string;
  subItems?: { name: string; path: string; pro?: boolean; new?: boolean }[];
};

const adminItems: NavItem[] = [
  {
    icon: <GridIcon />,
    name: "Dashboard",
    path: "/",
  },

  {
    icon: <LegalRecords />,
    name: "Legal Records",
    subItems: [
      {
        name: "All Cases",
        path: "/request",
      },
      {
        name: "Clients",
        path: "/users",
      },
    ],
  },
  {
    icon: <CalenderIcon />,
    name: "Calendar",
    path: "/calendar",
  },
];
const adminOtherItems: NavItem[] = [
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
        path: "/users",
      },
    ],
  },
  {
    icon: <Notification />,
    name: "Notifications",
    path: "/df",
  },
];

const navItems: NavItem[] = [
  {
    icon: <GridIcon />,
    name: "Dashboard",
    path: "/",
  },
  {
    icon: <CalenderIcon />,
    name: "Calendar",
    path: "/calendar",
  },
];

const othersItems: NavItem[] = [
  {
    icon: <BoxCubeIcon />,
    name: "UI Elements",
    subItems: [
      { name: "Alerts", path: "/alerts", pro: false },
      { name: "Avatar", path: "/avatars", pro: false },
      { name: "Badge", path: "/badge", pro: false },
      { name: "Buttons", path: "/buttons", pro: false },
      { name: "Images", path: "/images", pro: false },
      { name: "Videos", path: "/videos", pro: false },
    ],
  },
  {
    icon: <PlugInIcon />,
    name: "Authentication",
    subItems: [
      { name: "Sign In", path: "/signin", pro: false },
      { name: "Sign Up", path: "/signup", pro: false },
    ],
  },
];

export default function GetUserRoutesNav(roles: Roles): {
  menu: NavItem[];
  others: NavItem[];
} {
  switch (roles) {
    case Roles.foundingManager:
      return { menu: adminItems, others: adminOtherItems };

    default:
      return { menu: navItems, others: othersItems };
  }
}

export const AllowedUserPaths = (role: Roles) => {
  const navRoutes = GetUserRoutesNav(role);
  const allowedPaths: string[] = [];

  const allRoutes = [...navRoutes.menu, ...navRoutes.others];

  allRoutes.forEach((route) => {
    if (route.path) {
      allowedPaths.push(route.path);
    }

    if (route.subItems) {
      route.subItems.forEach((subRoute) => {
        allowedPaths.push(subRoute.path);
      });
    }
  });

  return allowedPaths;
};
