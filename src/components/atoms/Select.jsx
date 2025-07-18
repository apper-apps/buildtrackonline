import { forwardRef } from "react";
import { cn } from "@/utils/cn";
import ApperIcon from "@/components/ApperIcon";

const Select = forwardRef(({ 
  className, 
  label,
  error,
  required = false,
  placeholder = "Select an option",
  children,
  ...props 
}, ref) => {
  const baseStyles = "block w-full px-3 py-2 bg-white border border-secondary-300 rounded-lg text-secondary-900 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-200 appearance-none";
  
  const errorStyles = error ? "border-error-500 focus:ring-error-500" : "";

  return (
    <div className="space-y-2">
      {label && (
        <label className="block text-sm font-medium text-secondary-700">
          {label}
          {required && <span className="text-error-500 ml-1">*</span>}
        </label>
      )}
      <div className="relative">
        <select
          ref={ref}
          className={cn(
            baseStyles,
            errorStyles,
            className
          )}
          {...props}
        >
          <option value="">{placeholder}</option>
          {children}
        </select>
        <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
          <ApperIcon name="ChevronDown" className="w-4 h-4 text-secondary-500" />
        </div>
      </div>
      {error && (
        <p className="text-sm text-error-600">{error}</p>
      )}
    </div>
  );
});

Select.displayName = "Select";

export default Select;