import { useState } from "react";
import { format } from "date-fns";
import ApperIcon from "@/components/ApperIcon";
import Input from "@/components/atoms/Input";
import Button from "@/components/atoms/Button";
import { cn } from "@/utils/cn";

const DatePicker = ({ 
  label,
  value,
  onChange,
  required = false,
  error,
  className,
  placeholder = "Select date",
  minDate,
  maxDate
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState(value || "");

  const handleDateChange = (e) => {
    const newDate = e.target.value;
    setSelectedDate(newDate);
    onChange?.(newDate);
  };

  const formatDisplayDate = (dateString) => {
    if (!dateString) return "";
    try {
      return format(new Date(dateString), "MMM dd, yyyy");
    } catch {
      return dateString;
    }
  };

  const today = new Date().toISOString().split("T")[0];

  return (
    <div className={cn("relative", className)}>
      {label && (
        <label className="block text-sm font-medium text-secondary-700 mb-2">
          {label}
          {required && <span className="text-error-500 ml-1">*</span>}
        </label>
      )}
      
      <div className="relative">
        <input
          type="date"
          value={selectedDate}
          onChange={handleDateChange}
          min={minDate || today}
          max={maxDate}
          className="block w-full px-3 py-2 bg-white border border-secondary-300 rounded-lg text-secondary-900 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-200"
        />
        <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
          <ApperIcon name="Calendar" className="w-4 h-4 text-secondary-500" />
        </div>
      </div>
      
      {error && (
        <p className="text-sm text-error-600 mt-1">{error}</p>
      )}
    </div>
  );
};

export default DatePicker;