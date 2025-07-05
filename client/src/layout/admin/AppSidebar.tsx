import { useCallback, useEffect, useRef, useState } from "react";
import { Link, useLocation } from "react-router";
import { GiMuscularTorso } from "react-icons/gi";
import { IoMdFitness } from "react-icons/io";
import { FaRocketchat } from "react-icons/fa6";
import { GiMeal } from "react-icons/gi";
import { LiaFileInvoiceDollarSolid } from "react-icons/lia";
import { MdPayment } from "react-icons/md";

import {
  CalenderIcon,
  ChevronDownIcon,
  GridIcon,
  GroupIcon,
  HorizontaLDots,
  UserCircleIcon,
} from "../../icons";
import { useSidebar } from "../../context/SidebarContext";
import { useUserRole } from "../../hooks/useUserRole";

type NavItem = {
  name: string;
  icon: React.ReactNode;
  path?: string;
  subItems?: { name: string; path: string; pro?: boolean; new?: boolean }[];
  badgeCount?: number;
};

const navItems: NavItem[] = [
  {
    icon: <MdPayment />,
    name: "Paiement",
    path: "/dashboard/payment",
  },
  {
    icon: <GridIcon />,
    name: "Dashboard",
    subItems: [{ name: "Statistiques", path: "/dashboard/home", pro: false }],
  },
  {
    icon: <CalenderIcon />,
    name: "Calendrier ",
    path: "/dashboard/calendar",
  },
  {
    icon: <UserCircleIcon />,
    name: "Tous les coaches",
    path: "/dashboard/all-coaches",
  },
  {
    icon: <UserCircleIcon />,
    name: "Tous les clients",
    path: "/dashboard/all-clients",
  },
  {
    icon: <GroupIcon />,
    name: "Clients",
    path: "/dashboard/customers",
  },
  {
    name: "Programmes",
    icon: <GiMuscularTorso />,
    path: "/dashboard/programs",
  },
  {
    name: "Exercices",
    icon: <IoMdFitness />,
    path: "/dashboard/exercises",
  },
  {
    name: "Messagerie",
    icon: <FaRocketchat />,
    path: "/dashboard/chat",
  },

  {
    name: "Nutrition & Repas",
    icon: <GiMeal />,
    subItems: [
      { name: "Plans nutritionnels", path: "/dashboard/nutrition" },
      { name: "Repas", path: "/dashboard/meals" },
      { name: "Ingrédients", path: "/dashboard/ingredients" },
    ],
  },
  {
    name: "Factures",
    icon: <LiaFileInvoiceDollarSolid />,
    path: "/dashboard/invoices",
  },
];

const AppSidebar: React.FC = () => {
  const { isExpanded, isMobileOpen, isHovered, setIsHovered } = useSidebar();
  const location = useLocation();
  const {
    hasActiveSubscription,
    isLoading: isUserLoading,
    isCoach,
    pendingRequestsCount,
  } = useUserRole();

  // Adapter les éléments de navigation selon le rôle
  const adaptedNavItems = navItems
    .filter((item) => {
      // Masquer "Paiement" pour les clients
      if (item.name === "Paiement" && !isCoach) {
        return false;
      }
      return true;
    })
    .map((item) => {
      // Adapter l'onglet "Clients/Coach" selon le rôle
      if (item.name === "Clients") {
        return {
          ...item,
          name: isCoach ? "Clients" : "Coach",
          path: isCoach ? "/dashboard/customers" : "/dashboard/coaches",
          // Ajouter le nombre de demandes en attente pour les coachs
          badgeCount: isCoach ? pendingRequestsCount : undefined,
        };
      }
      return item;
    });

  const [openSubmenu, setOpenSubmenu] = useState<{
    type: "main";
    index: number;
  } | null>(null);
  const [subMenuHeight, setSubMenuHeight] = useState<Record<string, number>>(
    {}
  );
  const subMenuRefs = useRef<Record<string, HTMLDivElement | null>>({});

  // const isActive = (path: string) => location.pathname === path;
  const isActive = useCallback(
    (path: string) => location.pathname === path,
    [location.pathname]
  );

  useEffect(() => {
    let submenuMatched = false;
    ["main"].forEach(() => {
      const items = adaptedNavItems;
      items.forEach((nav, index) => {
        if (nav.subItems) {
          nav.subItems.forEach((subItem) => {
            if (isActive(subItem.path)) {
              setOpenSubmenu({
                type: "main",
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

  // Fonction pour vérifier si un élément est désactivé
  const isItemDisabled = (itemName: string) => {
    // Les clients ont toujours accès, seuls les coachs doivent payer
    if (!isCoach) return false;

    // Pour les coachs, vérifier l'abonnement (sauf pour la page de paiement)
    return !hasActiveSubscription && itemName !== "Paiement";
  };

  const handleSubmenuToggle = (index: number, menuType: "main") => {
    // Empêcher l'ouverture du submenu si l'élément est désactivé
    const item = adaptedNavItems[index];
    if (isItemDisabled(item.name)) {
      return;
    }

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

  const renderMenuItems = (items: NavItem[], menuType: "main") => (
    <ul className="flex flex-col gap-4">
      {items.map((nav, index) => {
        const isDisabled = isItemDisabled(nav.name);

        return (
          <li key={nav.name} className={isDisabled ? "relative" : ""}>
            {/* Badge "PREMIUM" pour les éléments désactivés */}
            {isDisabled && (isExpanded || isHovered || isMobileOpen) && (
              <div className="absolute -top-1 -right-1 z-10 bg-orange-500 text-white text-xs px-1.5 py-0.5 rounded-full text-[10px] font-medium">
                PRO
              </div>
            )}

            {nav.subItems ? (
              <button
                onClick={() => handleSubmenuToggle(index, menuType)}
                disabled={isDisabled}
                title={
                  isDisabled
                    ? "Débloquez cette fonctionnalité avec un abonnement PRO"
                    : ""
                }
                className={`menu-item group ${
                  openSubmenu?.type === menuType && openSubmenu?.index === index
                    ? "menu-item-active"
                    : "menu-item-inactive"
                } ${
                  isDisabled
                    ? "opacity-50 cursor-not-allowed"
                    : "cursor-pointer"
                } ${
                  !isExpanded && !isHovered
                    ? "lg:justify-center"
                    : "lg:justify-start"
                }`}
              >
                <span
                  className={`menu-item-icon-size  ${
                    openSubmenu?.type === menuType &&
                    openSubmenu?.index === index
                      ? "menu-item-icon-active"
                      : "menu-item-icon-inactive"
                  }`}
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
                        ? "rotate-180 text-orange-500 dark:text-brand-400"
                        : ""
                    }`}
                  />
                )}
              </button>
            ) : (
              nav.path &&
              (isDisabled ? (
                <div
                  title="Débloquez cette fonctionnalité avec un abonnement PRO"
                  className={`menu-item group menu-item-inactive opacity-50 cursor-not-allowed ${
                    !isExpanded && !isHovered
                      ? "lg:justify-center"
                      : "lg:justify-start"
                  }`}
                >
                  <span className="menu-item-icon-size menu-item-icon-inactive">
                    {nav.icon}
                  </span>
                  {(isExpanded || isHovered || isMobileOpen) && (
                    <span className="menu-item-text">{nav.name}</span>
                  )}
                </div>
              ) : (
                <Link
                  to={nav.path}
                  className={`menu-item group ${
                    isActive(nav.path)
                      ? "menu-item-active"
                      : "menu-item-inactive"
                  }`}
                >
                  <span
                    className={`menu-item-icon-size relative ${
                      isActive(nav.path)
                        ? "menu-item-icon-active"
                        : "menu-item-icon-inactive"
                    }`}
                  >
                    {nav.icon}
                    {nav.badgeCount && nav.badgeCount > 0 && (
                      <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-semibold">
                        {nav.badgeCount > 99 ? "99+" : nav.badgeCount}
                      </span>
                    )}
                  </span>
                  {(isExpanded || isHovered || isMobileOpen) && (
                    <div className="flex items-center justify-between w-full">
                      <span className="menu-item-text">{nav.name}</span>
                      {nav.badgeCount && nav.badgeCount > 0 && (
                        <span className="bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-semibold ml-2">
                          {nav.badgeCount > 99 ? "99+" : nav.badgeCount}
                        </span>
                      )}
                    </div>
                  )}
                </Link>
              ))
            )}
            {nav.subItems && (isExpanded || isHovered || isMobileOpen) && (
              <div
                ref={(el) => {
                  subMenuRefs.current[`${menuType}-${index}`] = el;
                }}
                className="overflow-hidden transition-all duration-300"
                style={{
                  height:
                    openSubmenu?.type === menuType &&
                    openSubmenu?.index === index
                      ? `${subMenuHeight[`${menuType}-${index}`]}px`
                      : "0px",
                }}
              >
                <ul className="mt-2 space-y-1 ml-9">
                  {nav.subItems.map((subItem) => (
                    <li key={subItem.name}>
                      {isDisabled ? (
                        <div
                          title="Débloquez cette fonctionnalité avec un abonnement PRO"
                          className="menu-dropdown-item menu-dropdown-item-inactive opacity-50 cursor-not-allowed"
                        >
                          {subItem.name}
                          <span className="flex items-center gap-1 ml-auto">
                            <span className="ml-auto menu-dropdown-badge-inactive menu-dropdown-badge">
                              PRO
                            </span>
                          </span>
                        </div>
                      ) : (
                        <Link
                          to={subItem.path}
                          className={`menu-dropdown-item ${
                            isActive(subItem.path)
                              ? "menu-dropdown-item-active"
                              : "menu-dropdown-item-inactive"
                          }`}
                        >
                          {subItem.name}
                          <span className="flex items-center gap-1 ml-auto">
                            {subItem.new && (
                              <span
                                className={`ml-auto ${
                                  isActive(subItem.path)
                                    ? "menu-dropdown-badge-active"
                                    : "menu-dropdown-badge-inactive"
                                } menu-dropdown-badge`}
                              >
                                new
                              </span>
                            )}
                            {subItem.pro && (
                              <span
                                className={`ml-auto ${
                                  isActive(subItem.path)
                                    ? "menu-dropdown-badge-active"
                                    : "menu-dropdown-badge-inactive"
                                } menu-dropdown-badge`}
                              >
                                pro
                              </span>
                            )}
                          </span>
                        </Link>
                      )}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </li>
        );
      })}
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
            <>
              <img
                className="dark:hidden"
                src="/images/logo/logo.png"
                alt="Logo"
                width={250}
                height={40}
              />
              <img
                className="hidden dark:block"
                src="/images/logo/logo-dark.png"
                alt="Logo"
                width={250}
                height={40}
              />
            </>
          ) : (
            <img
              src="/images/logo/logo-icon.png"
              alt="Logo"
              width={50}
              height={50}
            />
          )}
        </Link>
      </div>
      <div className="flex flex-col overflow-y-auto duration-300 ease-linear no-scrollbar">
        <nav className="mb-6">
          <div className="flex flex-col gap-4">
            <div>
              <h2
                className={`mb-4 text-xs uppercase flex leading-[20px] text-gray-400 ${
                  !isExpanded && !isHovered
                    ? "lg:justify-center"
                    : "justify-start"
                }`}
              >
                {isExpanded || isHovered || isMobileOpen ? (
                  "Menu"
                ) : (
                  <HorizontaLDots className="size-6" />
                )}
              </h2>
              {renderMenuItems(adaptedNavItems, "main")}
            </div>
          </div>
        </nav>
      </div>
    </aside>
  );
};

export default AppSidebar;
