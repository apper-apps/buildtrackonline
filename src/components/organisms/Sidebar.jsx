import { useState } from "react";
import { NavLink, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";
import { cn } from "@/utils/cn";

const Sidebar = ({ isOpen, onClose }) => {
  const location = useLocation();
  const [expandedSections, setExpandedSections] = useState({});

  const navigation = [
    {
      name: "Timeline",
      href: "/",
      icon: "Calendar",
      description: "Project timeline and staff scheduling"
    },
{
      name: "Projects",
      href: "/projects",
      icon: "Building2",
      description: "Manage construction projects"
    },
    {
      name: "Project Management",
      href: "/project-management",
      icon: "FolderKanban",
      description: "Comprehensive project oversight"
    },
    {
      name: "Staff",
      href: "/staff",
      icon: "Users",
      description: "Team member management"
    },
    {
      name: "Tasks",
      href: "/tasks",
      icon: "CheckSquare",
      description: "Project task tracking"
    },
    {
      name: "Reports",
      href: "/reports",
      icon: "BarChart3",
      description: "Cost analysis and reports"
    }
  ];

  const toggleSection = (section) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  const sidebarVariants = {
    open: {
      x: 0,
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 30
      }
    },
    closed: {
      x: "-100%",
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 30
      }
    }
  };

  return (
    <>
      {/* Desktop Sidebar */}
      <div className="hidden lg:block lg:w-64 lg:bg-white lg:border-r lg:border-secondary-200 lg:flex-shrink-0">
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="flex items-center px-6 py-4 border-b border-secondary-200">
            <div className="w-8 h-8 bg-gradient-to-br from-primary-500 to-accent-500 rounded-lg flex items-center justify-center mr-3">
              <ApperIcon name="Building2" className="w-5 h-5 text-white" />
            </div>
            <h1 className="text-xl font-bold gradient-text">BuildTrack Pro</h1>
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-4 py-6 space-y-2">
            {navigation.map((item) => (
              <NavLink
                key={item.name}
                to={item.href}
                className={({ isActive }) =>
                  cn(
                    "group flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-all duration-200",
                    isActive
                      ? "bg-gradient-to-r from-primary-500 to-primary-600 text-white shadow-soft"
                      : "text-secondary-700 hover:bg-secondary-50 hover:text-secondary-900"
                  )
                }
              >
                {({ isActive }) => (
                  <>
                    <ApperIcon 
                      name={item.icon} 
                      className={cn(
                        "w-5 h-5 mr-3 transition-colors",
                        isActive ? "text-white" : "text-secondary-500 group-hover:text-secondary-700"
                      )}
                    />
                    <div className="flex-1">
                      <div className={cn("font-medium", isActive ? "text-white" : "text-secondary-900")}>
                        {item.name}
                      </div>
                      <div className={cn("text-xs", isActive ? "text-primary-100" : "text-secondary-500")}>
                        {item.description}
                      </div>
                    </div>
                  </>
                )}
              </NavLink>
            ))}
          </nav>

          {/* Footer */}
          <div className="px-6 py-4 border-t border-secondary-200">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-gradient-to-br from-accent-500 to-accent-600 rounded-full flex items-center justify-center">
                <ApperIcon name="HardHat" className="w-4 h-4 text-white" />
              </div>
              <div>
                <div className="text-sm font-medium text-secondary-900">Construction Mode</div>
                <div className="text-xs text-secondary-500">Professional Edition</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Sidebar Overlay */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              className="lg:hidden fixed inset-0 bg-black bg-opacity-50 z-40"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={onClose}
            />

            {/* Mobile Sidebar */}
            <motion.div
              className="lg:hidden fixed inset-y-0 left-0 w-64 bg-white border-r border-secondary-200 z-50"
              variants={sidebarVariants}
              initial="closed"
              animate="open"
              exit="closed"
            >
              <div className="flex flex-col h-full">
                {/* Header */}
                <div className="flex items-center justify-between px-6 py-4 border-b border-secondary-200">
                  <div className="flex items-center">
                    <div className="w-8 h-8 bg-gradient-to-br from-primary-500 to-accent-500 rounded-lg flex items-center justify-center mr-3">
                      <ApperIcon name="Building2" className="w-5 h-5 text-white" />
                    </div>
                    <h1 className="text-xl font-bold gradient-text">BuildTrack Pro</h1>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={onClose}
                  >
                    <ApperIcon name="X" className="w-5 h-5" />
                  </Button>
                </div>

                {/* Navigation */}
                <nav className="flex-1 px-4 py-6 space-y-2">
                  {navigation.map((item) => (
                    <NavLink
                      key={item.name}
                      to={item.href}
                      onClick={onClose}
                      className={({ isActive }) =>
                        cn(
                          "group flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-all duration-200",
                          isActive
                            ? "bg-gradient-to-r from-primary-500 to-primary-600 text-white shadow-soft"
                            : "text-secondary-700 hover:bg-secondary-50 hover:text-secondary-900"
                        )
                      }
                    >
                      {({ isActive }) => (
                        <>
                          <ApperIcon 
                            name={item.icon} 
                            className={cn(
                              "w-5 h-5 mr-3 transition-colors",
                              isActive ? "text-white" : "text-secondary-500 group-hover:text-secondary-700"
                            )}
                          />
                          <div className="flex-1">
                            <div className={cn("font-medium", isActive ? "text-white" : "text-secondary-900")}>
                              {item.name}
                            </div>
                            <div className={cn("text-xs", isActive ? "text-primary-100" : "text-secondary-500")}>
                              {item.description}
                            </div>
                          </div>
                        </>
                      )}
                    </NavLink>
                  ))}
                </nav>

                {/* Footer */}
                <div className="px-6 py-4 border-t border-secondary-200">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-gradient-to-br from-accent-500 to-accent-600 rounded-full flex items-center justify-center">
                      <ApperIcon name="HardHat" className="w-4 h-4 text-white" />
                    </div>
                    <div>
                      <div className="text-sm font-medium text-secondary-900">Construction Mode</div>
                      <div className="text-xs text-secondary-500">Professional Edition</div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
};

export default Sidebar;