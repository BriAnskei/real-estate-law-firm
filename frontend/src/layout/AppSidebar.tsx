import { ChevronDownIcon } from "lucide-react";
import { useState, useRef, useCallback, useEffect } from "react";
import { useLocation, Link, useNavigate } from "react-router";
import { useSidebar } from "../context/SidebarContext";

import { useSelector } from "react-redux";
import { selectCurrentUser } from "../store/selector/user/userSelector";
import GetUserRoutesNav, { NavItem } from "../routes/userRouteNav";
import { HorizontaLDots, Signout } from "../icons";
import { Logo } from "./Logo";
import { useDispatch } from "react-redux";
import { AppDispatch } from "../store/store";
import { signOut } from "../store/Slice/authSlice";

const AppSidebar: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const user = useSelector(selectCurrentUser);
  const { isExpanded, isMobileOpen, isHovered, setIsHovered } = useSidebar();
  const location = useLocation();

  const [openSubmenu, setOpenSubmenu] = useState<{
    type: "main" | "others";
    index: number;
  } | null>(null);
  const [subMenuHeight, setSubMenuHeight] = useState<Record<string, number>>(
    {}
  );
  const subMenuRefs = useRef<Record<string, HTMLDivElement | null>>({});

  const isActive = useCallback(
    (path: string) => location.pathname === path,
    [location.pathname]
  );

  const getRoleSpecificItems = (): { menu: NavItem[]; others: NavItem[] } => {
    return GetUserRoutesNav(user?.role!);
  };

  useEffect(() => {
    let submenuMatched = false;
    ["main", "others"].forEach((menuType) => {
      const items =
        menuType === "main"
          ? getRoleSpecificItems().menu
          : getRoleSpecificItems().others;
      items.forEach((nav, index) => {
        if (nav.subItems) {
          nav.subItems.forEach((subItem) => {
            if (isActive(subItem.path)) {
              setOpenSubmenu({
                type: menuType as "main" | "others",
                index,
              });
              submenuMatched = true;
            }
          });
        }
      });
    });

    if (!submenuMatched) {
      setOpenSubmenu(null);
    }
  }, [location, isActive]);

  useEffect(() => {
    if (openSubmenu !== null) {
      const key = `${openSubmenu.type}-${openSubmenu.index}`;
      if (subMenuRefs.current[key]) {
        setSubMenuHeight((prevHeights) => ({
          ...prevHeights,
          [key]: subMenuRefs.current[key]?.scrollHeight || 0,
        }));
      }
    }
  }, [openSubmenu]);

  const handleSubmenuToggle = (index: number, menuType: "main" | "others") => {
    setOpenSubmenu((prevOpenSubmenu) => {
      if (
        prevOpenSubmenu &&
        prevOpenSubmenu.type === menuType &&
        prevOpenSubmenu.index === index
      ) {
        return null;
      }
      return { type: menuType, index };
    });
  };

  const handleSignout = async () => {
    await dispatch(signOut());
    navigate("/signin");
  };

  const renderMenuItems = (items: NavItem[], menuType: "main" | "others") => (
    <ul className="flex flex-col gap-4">
      {items.map((nav, index) => (
        <li key={nav.name}>
          {nav.subItems ? (
            <button
              onClick={() => handleSubmenuToggle(index, menuType)}
              className={`menu-item group relative transition-all duration-300 ${
                openSubmenu?.type === menuType && openSubmenu?.index === index
                  ? "text-[#D4AF37] dark:text-[#D4AF37] bg-[#D4AF37]/10 dark:bg-[#D4AF37]/10 border-l-4 border-[#D4AF37]"
                  : "text-gray-700 dark:text-gray-400 hover:text-[#D4AF37] dark:hover:text-[#D4AF37] hover:bg-[#D4AF37]/10 dark:hover:bg-[#D4AF37]/10 border-l-4 border-transparent"
              } cursor-pointer ${
                !isExpanded && !isHovered
                  ? "lg:justify-center"
                  : "lg:justify-start"
              }`}
            >
              <span
                className={`menu-item-icon-size transition-colors duration-300 text-[#D4AF37]`}
              >
                {nav.icon}
              </span>
              {(isExpanded || isHovered || isMobileOpen) && (
                <span className="menu-item-text">{nav.name}</span>
              )}
              {(isExpanded || isHovered || isMobileOpen) && (
                <ChevronDownIcon
                  className={`ml-auto w-5 h-5 transition-transform duration-200 ${
                    openSubmenu?.type === menuType &&
                    openSubmenu?.index === index
                      ? "rotate-180 text-[#D4AF37]"
                      : ""
                  }`}
                />
              )}
            </button>
          ) : (
            nav.path && (
              <Link
                to={nav.path}
                className={`menu-item group relative transition-all duration-300 ${
                  isActive(nav.path)
                    ? "text-[#D4AF37] dark:text-[#D4AF37] bg-[#D4AF37]/10 dark:bg-[#D4AF37]/10 border-l-4 border-[#D4AF37]"
                    : "text-gray-700 dark:text-gray-400 hover:text-[#D4AF37] dark:hover:text-[#D4AF37] hover:bg-[#D4AF37]/10 dark:hover:bg-[#D4AF37]/10 border-l-4 border-transparent"
                }`}
              >
                <span
                  className={`menu-item-icon-size transition-colors duration-300 text-[#D4AF37]`}
                >
                  {nav.icon}
                </span>
                {(isExpanded || isHovered || isMobileOpen) && (
                  <span className="menu-item-text">{nav.name}</span>
                )}
              </Link>
            )
          )}
          {nav.subItems && (isExpanded || isHovered || isMobileOpen) && (
            <div
              ref={(el) => {
                subMenuRefs.current[`${menuType}-${index}`] = el;
              }}
              className="overflow-hidden transition-all duration-300"
              style={{
                height:
                  openSubmenu?.type === menuType && openSubmenu?.index === index
                    ? `${subMenuHeight[`${menuType}-${index}`]}px`
                    : "0px",
              }}
            >
              <ul className="mt-2 space-y-1 ml-9">
                {nav.subItems.map((subItem) => (
                  <li key={subItem.name}>
                    <Link
                      to={subItem.path}
                      className={`menu-dropdown-item group transition-all duration-300 ${
                        isActive(subItem.path)
                          ? "text-[#D4AF37] dark:text-[#D4AF37] bg-[#D4AF37]/5 dark:bg-[#D4AF37]/5 font-medium"
                          : "text-gray-600 dark:text-gray-400 hover:text-[#D4AF37] dark:hover:text-[#D4AF37] hover:bg-[#D4AF37]/5 dark:hover:bg-[#D4AF37]/5"
                      }`}
                    >
                      {subItem.name}
                      <span className="flex items-center gap-1 ml-auto">
                        {subItem.new && (
                          <span
                            className={`ml-auto transition-all duration-300 ${
                              isActive(subItem.path)
                                ? "bg-[#D4AF37] text-white"
                                : "bg-gray-200 text-gray-700 dark:bg-gray-700 dark:text-gray-300 group-hover:bg-[#D4AF37] group-hover:text-white"
                            } menu-dropdown-badge`}
                          >
                            new
                          </span>
                        )}
                        {subItem.pro && (
                          <span
                            className={`ml-auto transition-all duration-300 ${
                              isActive(subItem.path)
                                ? "bg-[#D4AF37] text-white"
                                : "bg-gray-200 text-gray-700 dark:bg-gray-700 dark:text-gray-300 group-hover:bg-[#D4AF37] group-hover:text-white"
                            } menu-dropdown-badge`}
                          >
                            pro
                          </span>
                        )}
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </li>
      ))}
    </ul>
  );

  return (
    <aside
      className={`fixed mt-16 flex flex-col lg:mt-0 top-0 px-5 left-0 bg-white dark:bg-gray-900 dark:border-gray-800 text-gray-900 h-screen transition-all duration-300 ease-in-out z-50 border-r border-gray-200 
        ${
          isExpanded || isMobileOpen
            ? "w-[290px]"
            : isHovered
            ? "w-[290px]"
            : "w-[90px]"
        }
        ${isMobileOpen ? "translate-x-0" : "-translate-x-full"}
        lg:translate-x-0`}
      onMouseEnter={() => !isExpanded && setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div
        className={`py-8 flex ${
          !isExpanded && !isHovered ? "lg:justify-center" : "justify-start"
        }`}
      >
        <Link to="/">
          {isExpanded || isHovered || isMobileOpen ? (
            <Logo variant="full" />
          ) : (
            <Logo variant="icon" />
          )}
        </Link>
      </div>
      <div className="flex flex-col overflow-y-auto duration-300 ease-linear no-scrollbar">
        <nav className="mb-6">
          <div className="flex flex-col gap-4">
            <div>
              <h2
                className={`mb-4 text-xs uppercase flex leading-[20px] text-[#D4AF37] dark:text-[#D4AF37] font-semibold ${
                  !isExpanded && !isHovered
                    ? "lg:justify-center"
                    : "justify-start"
                }`}
              >
                {isExpanded || isHovered || isMobileOpen ? (
                  "Menu"
                ) : (
                  <HorizontaLDots className="size-6 text-[#D4AF37]" />
                )}
              </h2>
              {user && renderMenuItems(getRoleSpecificItems().menu, "main")}
            </div>
            <div className="">
              <h2
                className={`mb-4 text-xs uppercase flex leading-[20px] text-[#D4AF37] dark:text-[#D4AF37] font-semibold ${
                  !isExpanded && !isHovered
                    ? "lg:justify-center"
                    : "justify-start"
                }`}
              >
                {isExpanded || isHovered || isMobileOpen ? (
                  "Others"
                ) : (
                  <HorizontaLDots className="text-[#D4AF37]" />
                )}
              </h2>
              {user && renderMenuItems(getRoleSpecificItems().others, "others")}
              <button
                className={`menu-item group relative mt-3 transition-all duration-300 text-gray-700 dark:text-gray-400 hover:text-[#D4AF37] dark:hover:text-[#D4AF37] hover:bg-[#D4AF37]/10 dark:hover:bg-[#D4AF37]/10 border-l-4 border-transparent ${
                  !isExpanded && !isHovered
                    ? "lg:justify-center"
                    : "lg:justify-start"
                }`}
                onClick={handleSignout}
              >
                <span className="menu-item-icon-size text-[#D4AF37]">
                  <Signout />
                </span>
                {(isExpanded || isHovered || isMobileOpen) && (
                  <span className="menu-item-text">Sign Out</span>
                )}
              </button>
            </div>
          </div>
        </nav>
      </div>
    </aside>
  );
};

export default AppSidebar;
