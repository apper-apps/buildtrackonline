import { useState } from "react";
import { motion } from "framer-motion";
import { toast } from "react-toastify";
import Input from "@/components/atoms/Input";
import Select from "@/components/atoms/Select";
import Button from "@/components/atoms/Button";
import DatePicker from "@/components/molecules/DatePicker";
import Card from "@/components/atoms/Card";
import ApperIcon from "@/components/ApperIcon";

const ProjectForm = ({ 
  project = null, 
  onSubmit, 
  onCancel,
  loading = false 
}) => {
  const [formData, setFormData] = useState({
    name: project?.name || "",
    location: project?.location || "",
    type: project?.type || "",
    clientName: project?.clientName || "",
    clientContact: project?.clientContact || "",
    startDate: project?.startDate || "",
    estimatedEndDate: project?.estimatedEndDate || "",
    estimatedBudget: project?.estimatedBudget || "",
    status: project?.status || "planned"
  });

  const [errors, setErrors] = useState({});

  const projectTypes = [
    { value: "construction", label: "Construction" },
    { value: "repair", label: "Repair" },
    { value: "inspection", label: "Inspection" },
    { value: "maintenance", label: "Maintenance" },
    { value: "renovation", label: "Renovation" },
    { value: "demolition", label: "Demolition" }
  ];

  const statusOptions = [
    { value: "planned", label: "Planned" },
    { value: "in progress", label: "In Progress" },
    { value: "on hold", label: "On Hold" },
    { value: "completed", label: "Completed" }
  ];

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    
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
      newErrors.name = "Project name is required";
    }

    if (!formData.location.trim()) {
      newErrors.location = "Location is required";
    }

    if (!formData.type) {
      newErrors.type = "Project type is required";
    }

    if (!formData.clientName.trim()) {
      newErrors.clientName = "Client name is required";
    }

    if (!formData.startDate) {
      newErrors.startDate = "Start date is required";
    }

    if (!formData.estimatedEndDate) {
      newErrors.estimatedEndDate = "Estimated end date is required";
    }

    if (formData.startDate && formData.estimatedEndDate && 
        new Date(formData.startDate) > new Date(formData.estimatedEndDate)) {
      newErrors.estimatedEndDate = "End date must be after start date";
    }

    if (formData.estimatedBudget && (isNaN(formData.estimatedBudget) || formData.estimatedBudget < 0)) {
      newErrors.estimatedBudget = "Budget must be a positive number";
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

    const projectData = {
      ...formData,
      estimatedBudget: formData.estimatedBudget ? parseFloat(formData.estimatedBudget) : 0,
      actualCost: project?.actualCost || 0
    };

    try {
      await onSubmit(projectData);
      toast.success(project ? "Project updated successfully" : "Project created successfully");
    } catch (error) {
      toast.error("Failed to save project");
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
              <ApperIcon name="Building2" className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-secondary-900">
                {project ? "Edit Project" : "Create New Project"}
              </h2>
              <p className="text-secondary-600">
                {project ? "Update project details" : "Add a new construction project"}
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
              label="Project Name"
              value={formData.name}
              onChange={(e) => handleInputChange("name", e.target.value)}
              error={errors.name}
              required
              placeholder="Enter project name"
            />

            <Input
              label="Location"
              value={formData.location}
              onChange={(e) => handleInputChange("location", e.target.value)}
              error={errors.location}
              required
              placeholder="Project site address"
            />

            <Select
              label="Project Type"
              value={formData.type}
              onChange={(e) => handleInputChange("type", e.target.value)}
              error={errors.type}
              required
            >
              {projectTypes.map(type => (
                <option key={type.value} value={type.value}>
                  {type.label}
                </option>
              ))}
            </Select>

            <Select
              label="Status"
              value={formData.status}
              onChange={(e) => handleInputChange("status", e.target.value)}
              required
            >
              {statusOptions.map(status => (
                <option key={status.value} value={status.value}>
                  {status.label}
                </option>
              ))}
            </Select>

            <Input
              label="Client Name"
              value={formData.clientName}
              onChange={(e) => handleInputChange("clientName", e.target.value)}
              error={errors.clientName}
              required
              placeholder="Client or company name"
            />

            <Input
              label="Client Contact"
              value={formData.clientContact}
              onChange={(e) => handleInputChange("clientContact", e.target.value)}
              placeholder="Phone number or email"
            />

            <DatePicker
              label="Start Date"
              value={formData.startDate}
              onChange={(date) => handleInputChange("startDate", date)}
              error={errors.startDate}
              required
            />

            <DatePicker
              label="Estimated End Date"
              value={formData.estimatedEndDate}
              onChange={(date) => handleInputChange("estimatedEndDate", date)}
              error={errors.estimatedEndDate}
              minDate={formData.startDate}
              required
            />

            <Input
              label="Estimated Budget"
              type="number"
              value={formData.estimatedBudget}
              onChange={(e) => handleInputChange("estimatedBudget", e.target.value)}
              error={errors.estimatedBudget}
              placeholder="0.00"
              min="0"
              step="0.01"
            />
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
              {project ? "Update Project" : "Create Project"}
            </Button>
          </div>
        </form>
      </Card>
    </motion.div>
  );
};

export default ProjectForm;