import { useState } from "react";
import { useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";
import SearchBar from "@/components/molecules/SearchBar";

const Header = ({ onMenuClick, onSearch }) => {
  const location = useLocation();
  const [searchTerm, setSearchTerm] = useState("");

  const getPageTitle = () => {
    switch (location.pathname) {
      case "/":
        return "Project Timeline";
      case "/projects":
        return "Projects";
      case "/staff":
        return "Staff Management";
      case "/tasks":
        return "Task Board";
      case "/reports":
        return "Reports & Analytics";
      default:
        return "BuildTrack Pro";
    }
  };

  const getPageDescription = () => {
    switch (location.pathname) {
      case "/":
        return "Drag and drop staff assignments across project timelines";
      case "/projects":
        return "Manage construction projects and track progress";
      case "/staff":
        return "Organize your team and track availability";
      case "/tasks":
        return "Break down projects into manageable tasks";
      case "/reports":
        return "Analyze costs, utilization, and project performance";
      default:
        return "Professional construction project management";
    }
  };

  const handleSearch = (term) => {
    setSearchTerm(term);
    onSearch?.(term);
  };

  const showSearch = ["/projects", "/staff", "/tasks"].includes(location.pathname);

  return (
    <motion.header
      className="bg-white border-b border-secondary-200 px-4 py-4 lg:px-6"
      initial={{ y: -10, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          {/* Mobile menu button */}
          <Button
            variant="ghost"
            size="sm"
            onClick={onMenuClick}
            className="lg:hidden"
          >
            <ApperIcon name="Menu" className="w-5 h-5" />
          </Button>

          {/* Page title */}
          <div>
            <h1 className="text-2xl font-bold text-secondary-900">{getPageTitle()}</h1>
            <p className="text-sm text-secondary-600 mt-1">{getPageDescription()}</p>
          </div>
        </div>

        <div className="flex items-center space-x-4">
          {/* Search bar */}
          {showSearch && (
            <div className="hidden sm:block">
              <SearchBar
                placeholder="Search..."
                onSearch={handleSearch}
                className="w-64"
              />
            </div>
          )}

          {/* Action buttons */}
          <div className="flex items-center space-x-2">
            <Button
              variant="ghost"
              size="sm"
              className="hidden sm:flex"
            >
              <ApperIcon name="Bell" className="w-5 h-5" />
            </Button>
            
            <Button
              variant="ghost"
              size="sm"
              className="hidden sm:flex"
            >
              <ApperIcon name="Settings" className="w-5 h-5" />
            </Button>

            <Button
              variant="primary"
              size="sm"
              className="flex items-center space-x-2"
            >
              <ApperIcon name="Plus" className="w-4 h-4" />
              <span className="hidden sm:inline">Quick Add</span>
            </Button>
          </div>
        </div>
      </div>

      {/* Mobile search */}
      {showSearch && (
        <div className="mt-4 sm:hidden">
          <SearchBar
            placeholder="Search..."
            onSearch={handleSearch}
          />
        </div>
      )}
    </motion.header>
  );
};

export default Header;