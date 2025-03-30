import { motion, AnimatePresence } from "framer-motion";
import { LucideIcon } from "lucide-react";
import * as Icons from "lucide-react";
import { useState, useEffect } from "react";

type Tab = {
  id: string;
  label: string;
  icon: keyof typeof Icons;
};

type VerticalNavProps = {
  tabs: Tab[];
  activeTab: string;
  setActiveTab: (tab: string) => void;
};

export default function VerticalNav({
  tabs,
  activeTab,
  setActiveTab,
}: VerticalNavProps) {
  const [isNavOpen, setIsNavOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [windowWidth, setWindowWidth] = useState(
    typeof window !== "undefined" ? window.innerWidth : 0
  );

  // Update screen size states
  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
      setIsMobile(window.innerWidth < 768);
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const toggleNav = () => setIsNavOpen((prev) => !prev);

  // Component icons
  const MenuIcon = Icons["Menu"] as LucideIcon;
  const XIcon = Icons["X"] as LucideIcon;

  // Define nav widths for various breakpoints
  const navWidths = {
    mobile: "16rem",
    md: "14rem",
    lg: "16rem",
    xl: "18rem",
    "2xl": "20rem",
  };

  // Get the nav width based on screen size and state
  const getNavWidth = () => {
    if (isMobile) return isNavOpen ? navWidths.mobile : "0rem";
    if (windowWidth >= 1536) return navWidths["2xl"];
    if (windowWidth >= 1280) return navWidths.xl;
    if (windowWidth >= 1024) return navWidths.lg;
    return navWidths.md;
  };

  // Calculate content margin to offset the nav
  const getContentMargin = () => {
    if (isMobile) return "ml-0";
    if (windowWidth >= 1536) return "ml-0";
    if (windowWidth >= 1280) return "ml-0";
    if (windowWidth >= 1024) return "ml-64";
    return "ml-56";
  };

  // Framer Motion variants for the nav container
  const navVariants = {
    open: {
      width: getNavWidth(),
      opacity: 1,
      transition: { type: "spring", stiffness: 300, damping: 30 },
    },
    closed: {
      width: isMobile ? "0rem" : getNavWidth(),
      opacity: isMobile ? 0 : 1,
      transition: { type: "spring", stiffness: 300, damping: 30 },
    },
  };

  return (
    <div className="flex h-full relative">
      {/* Mobile toggle button */}
      <button
        className="md:hidden fixed top-3 left-4 z-50 p-2 bg-white dark:bg-gray-800 rounded-full shadow-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
        onClick={toggleNav}
        aria-label={isNavOpen ? "Close menu" : "Open menu"}
      >
        {isNavOpen ? (
          <XIcon className="w-6 h-6 text-emerald-500" />
        ) : (
          <MenuIcon className="w-6 h-6 text-emerald-500" />
        )}
      </button>

      {/* Mobile overlay */}
      <AnimatePresence>
        {isMobile && isNavOpen && (
          <motion.div
            className="fixed inset-0 bg-black bg-opacity-50 z-40"
            onClick={toggleNav}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
          />
        )}
      </AnimatePresence>

      {/* Navigation menu */}
      <motion.nav
        className="fixed md:sticky top-0 left-0 h-full z-40 bg-white dark:bg-gray-800 shadow-lg overflow-hidden"
        animate={isMobile ? (isNavOpen ? "open" : "closed") : "open"}
        variants={navVariants}
      >
        <div className={`p-4 ${isMobile ? "mt-16" : "mt-2"} h-full flex flex-col`}>
          <div className="flex-1 overflow-y-auto space-y-2">
            {tabs.map((tab) => {
              const IconComponent = Icons[tab.icon] as LucideIcon;
              return (
                <motion.button
                  key={tab.id}
                  onClick={() => {
                    setActiveTab(tab.id);
                    if (isMobile) setIsNavOpen(false);
                  }}
                  className={`relative flex items-center w-full p-3 rounded-lg text-left transition-colors z-10 ${
                    activeTab === tab.id
                      ? "text-white font-semibold"
                      : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                  }`}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  {activeTab === tab.id && (
                    <motion.div
                      className="absolute inset-0 rounded-lg bg-gradient-to-r from-emerald-500 to-emerald-700"
                      layoutId="activeTabBackground"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ type: "spring", stiffness: 300, damping: 30 }}
                    />
                  )}
                  {activeTab === tab.id && (
                    <motion.div
                      className="absolute left-0 top-0 bottom-0 w-1 rounded-r-full bg-gradient-to-b from-emerald-400 to-emerald-600"
                      layoutId="activeTabLine"
                      initial={{ height: 0 }}
                      animate={{ height: "100%" }}
                      exit={{ height: 0 }}
                      transition={{ type: "spring", stiffness: 300, damping: 30 }}
                    />
                  )}
                  <IconComponent className="w-5 h-5 mr-3 relative z-10" />
                  <span className="relative z-10 whitespace-nowrap">{tab.label}</span>
                </motion.button>
              );
            })}
          </div>
        </div>
      </motion.nav>

      {/* Main content area */}
      <div className={`flex-1 transition-all duration-300 ${getContentMargin()} ${isMobile ? "pt-16" : ""}`}>
        {/* Your main content goes here */}
      </div>
    </div>
  );
}
