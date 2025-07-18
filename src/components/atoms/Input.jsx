import { forwardRef } from "react";
import { cn } from "@/utils/cn";

const Input = forwardRef(({ 
  className, 
  type = "text", 
  label,
  error,
  required = false,
  ...props 
}, ref) => {
  const baseStyles = "block w-full px-3 py-2 bg-white border border-secondary-300 rounded-lg text-secondary-900 placeholder-secondary-500 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-200";
  
  const errorStyles = error ? "border-error-500 focus:ring-error-500" : "";

  return (
    <div className="space-y-2">
      {label && (
        <label className="block text-sm font-medium text-secondary-700">
          {label}
          {required && <span className="text-error-500 ml-1">*</span>}
        </label>
      )}
      <input
        ref={ref}
        type={type}
        className={cn(
          baseStyles,
          errorStyles,
          className
        )}
        {...props}
      />
      {error && (
        <p className="text-sm text-error-600">{error}</p>
      )}
    </div>
  );
});

Input.displayName = "Input";

export default Input;