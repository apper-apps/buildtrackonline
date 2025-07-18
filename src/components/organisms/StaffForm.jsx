import { useState } from "react";
import { motion } from "framer-motion";
import { toast } from "react-toastify";
import Input from "@/components/atoms/Input";
import Select from "@/components/atoms/Select";
import Button from "@/components/atoms/Button";
import Card from "@/components/atoms/Card";
import ApperIcon from "@/components/ApperIcon";

const StaffForm = ({ 
  staff = null, 
  onSubmit, 
  onCancel,
  loading = false 
}) => {
  const [formData, setFormData] = useState({
    name: staff?.name || "",
    role: staff?.role || "",
    hourlyRate: staff?.hourlyRate || "",
    dailyRate: staff?.dailyRate || "",
    phone: staff?.phone || "",
    email: staff?.email || "",
    skills: staff?.skills?.join(", ") || ""
  });

  const [errors, setErrors] = useState({});

  const roles = [
    { value: "foreman", label: "Foreman" },
    { value: "electrician", label: "Electrician" },
    { value: "plumber", label: "Plumber" },
    { value: "carpenter", label: "Carpenter" },
    { value: "mason", label: "Mason" },
    { value: "painter", label: "Painter" },
    { value: "roofer", label: "Roofer" },
    { value: "laborer", label: "General Laborer" },
    { value: "operator", label: "Equipment Operator" },
    { value: "supervisor", label: "Site Supervisor" }
  ];

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    
    // Auto-calculate daily rate from hourly rate
    if (field === "hourlyRate" && value) {
      const hourly = parseFloat(value);
      if (!isNaN(hourly)) {
        setFormData(prev => ({
          ...prev,
          dailyRate: (hourly * 8).toFixed(2)
        }));
      }
    }
    
    // Auto-calculate hourly rate from daily rate
    if (field === "dailyRate" && value) {
      const daily = parseFloat(value);
      if (!isNaN(daily)) {
        setFormData(prev => ({
          ...prev,
          hourlyRate: (daily / 8).toFixed(2)
        }));
      }
    }
    
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: null
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = "Staff name is required";
    }

    if (!formData.role) {
      newErrors.role = "Role is required";
    }

    if (!formData.hourlyRate || isNaN(formData.hourlyRate) || formData.hourlyRate <= 0) {
      newErrors.hourlyRate = "Valid hourly rate is required";
    }

    if (!formData.dailyRate || isNaN(formData.dailyRate) || formData.dailyRate <= 0) {
      newErrors.dailyRate = "Valid daily rate is required";
    }

if (formData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Invalid email format";
    }

    if (formData.phone && !/^[\d\s\-+()]+$/.test(formData.phone)) {
      newErrors.phone = "Invalid phone number format";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      toast.error("Please fix the errors below");
      return;
    }

    const staffData = {
      ...formData,
      hourlyRate: parseFloat(formData.hourlyRate),
      dailyRate: parseFloat(formData.dailyRate),
      skills: formData.skills ? formData.skills.split(",").map(skill => skill.trim()).filter(Boolean) : [],
      availability: staff?.availability || []
    };

    try {
      await onSubmit(staffData);
      toast.success(staff ? "Staff member updated successfully" : "Staff member added successfully");
    } catch (error) {
      toast.error("Failed to save staff member");
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <Card className="p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-br from-primary-500 to-primary-600 rounded-full flex items-center justify-center">
              <ApperIcon name="User" className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-secondary-900">
                {staff ? "Edit Staff Member" : "Add New Staff Member"}
              </h2>
              <p className="text-secondary-600">
                {staff ? "Update staff member details" : "Add a new team member"}
              </p>
            </div>
          </div>
          
          <Button
            variant="ghost"
            size="sm"
            onClick={onCancel}
          >
            <ApperIcon name="X" className="w-5 h-5" />
          </Button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Input
              label="Full Name"
              value={formData.name}
              onChange={(e) => handleInputChange("name", e.target.value)}
              error={errors.name}
              required
              placeholder="Enter staff member name"
            />

            <Select
              label="Role"
              value={formData.role}
              onChange={(e) => handleInputChange("role", e.target.value)}
              error={errors.role}
              required
            >
              {roles.map(role => (
                <option key={role.value} value={role.value}>
                  {role.label}
                </option>
              ))}
            </Select>

            <Input
              label="Hourly Rate"
              type="number"
              value={formData.hourlyRate}
              onChange={(e) => handleInputChange("hourlyRate", e.target.value)}
              error={errors.hourlyRate}
              required
              placeholder="0.00"
              min="0"
              step="0.01"
            />

            <Input
              label="Daily Rate"
              type="number"
              value={formData.dailyRate}
              onChange={(e) => handleInputChange("dailyRate", e.target.value)}
              error={errors.dailyRate}
              required
              placeholder="0.00"
              min="0"
              step="0.01"
            />

            <Input
              label="Phone Number"
              value={formData.phone}
              onChange={(e) => handleInputChange("phone", e.target.value)}
              error={errors.phone}
              placeholder="(555) 123-4567"
            />

            <Input
              label="Email Address"
              type="email"
              value={formData.email}
              onChange={(e) => handleInputChange("email", e.target.value)}
              error={errors.email}
              placeholder="email@example.com"
            />

            <div className="md:col-span-2">
              <Input
                label="Skills"
                value={formData.skills}
                onChange={(e) => handleInputChange("skills", e.target.value)}
                placeholder="Welding, Concrete, Electrical (separate with commas)"
              />
              <p className="text-xs text-secondary-500 mt-1">
                Enter skills separated by commas
              </p>
            </div>
          </div>

          <div className="flex justify-end space-x-4 pt-6 border-t border-secondary-200">
            <Button
              type="button"
              variant="outline"
              onClick={onCancel}
              disabled={loading}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              loading={loading}
              disabled={loading}
            >
              {staff ? "Update Staff Member" : "Add Staff Member"}
            </Button>
          </div>
        </form>
      </Card>
    </motion.div>
  );
};

export default StaffForm;