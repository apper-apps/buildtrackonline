import { useState } from "react";
import ApperIcon from "@/components/ApperIcon";
import Input from "@/components/atoms/Input";
import Button from "@/components/atoms/Button";
import { cn } from "@/utils/cn";

const SearchBar = ({ 
  placeholder = "Search...", 
  onSearch, 
  className,
  showFilters = false,
  filters = [],
  onFilterChange
}) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [showFilterMenu, setShowFilterMenu] = useState(false);

  const handleSearch = (e) => {
    e.preventDefault();
    onSearch?.(searchTerm);
  };

  const handleInputChange = (e) => {
    setSearchTerm(e.target.value);
    onSearch?.(e.target.value);
  };

  return (
    <div className={cn("relative", className)}>
      <form onSubmit={handleSearch} className="flex items-center space-x-2">
        <div className="relative flex-1">
          <ApperIcon 
            name="Search" 
            className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-secondary-500" 
          />
          <Input
            type="text"
            placeholder={placeholder}
            value={searchTerm}
            onChange={handleInputChange}
            className="pl-10 pr-4"
          />
        </div>
        
        {showFilters && (
          <Button
            type="button"
            variant="outline"
            size="md"
            onClick={() => setShowFilterMenu(!showFilterMenu)}
            className="flex items-center space-x-2"
          >
            <ApperIcon name="Filter" className="w-4 h-4" />
            <span>Filter</span>
          </Button>
        )}
      </form>

      {showFilterMenu && filters.length > 0 && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-secondary-200 rounded-lg shadow-medium z-50 p-4">
          <div className="space-y-3">
            {filters.map((filter, index) => (
              <div key={index} className="flex items-center justify-between">
                <label className="text-sm font-medium text-secondary-700">
                  {filter.label}
                </label>
                <select
                  value={filter.value}
                  onChange={(e) => onFilterChange?.(filter.key, e.target.value)}
                  className="px-3 py-1 border border-secondary-300 rounded-md text-sm"
                >
                  <option value="">All</option>
                  {filter.options.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default SearchBar;