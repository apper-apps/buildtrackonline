import { motion } from "framer-motion";
import { format } from "date-fns";
import Card from "@/components/atoms/Card";
import Badge from "@/components/atoms/Badge";
import Button from "@/components/atoms/Button";
import ApperIcon from "@/components/ApperIcon";
import StatusBadge from "@/components/molecules/StatusBadge";

const ProjectCard = ({ 
  project, 
  onClick,
  onEdit,
  onDelete,
  showActions = true,
  className = ""
}) => {
  const formatDate = (dateString) => {
    if (!dateString) return "Not set";
    try {
      return format(new Date(dateString), "MMM dd, yyyy");
    } catch {
      return "Invalid date";
    }
  };

  const getProgressPercentage = () => {
    if (!project.tasks || project.tasks.length === 0) return 0;
    const completedTasks = project.tasks.filter(task => task.status === "done").length;
    return Math.round((completedTasks / project.tasks.length) * 100);
  };

  const getBudgetStatus = () => {
    if (!project.estimatedBudget || !project.actualCost) return "on-track";
    const percentage = (project.actualCost / project.estimatedBudget) * 100;
    if (percentage > 110) return "over";
    if (percentage > 90) return "warning";
    return "on-track";
  };

  const progress = getProgressPercentage();
  const budgetStatus = getBudgetStatus();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -4 }}
      transition={{ duration: 0.2 }}
    >
      <Card 
        className={`p-6 cursor-pointer transition-all duration-200 hover:shadow-medium ${className}`}
        onClick={onClick}
      >
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1">
            <h3 className="font-bold text-lg text-secondary-900 mb-1">{project.name}</h3>
            <p className="text-secondary-600 text-sm mb-2">{project.location}</p>
            <div className="flex items-center space-x-2">
              <Badge variant="info" className="text-xs">
                {project.type}
              </Badge>
              <StatusBadge status={project.status} type="project" />
            </div>
          </div>
          
          {showActions && (
            <div className="flex items-center space-x-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={(e) => {
                  e.stopPropagation();
                  onEdit?.(project);
                }}
              >
                <ApperIcon name="Edit2" className="w-4 h-4" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={(e) => {
                  e.stopPropagation();
                  onDelete?.(project);
                }}
              >
                <ApperIcon name="Trash2" className="w-4 h-4" />
              </Button>
            </div>
          )}
        </div>

        <div className="space-y-3">
          <div className="flex items-center justify-between text-sm">
            <span className="text-secondary-600">Client:</span>
            <span className="font-medium text-secondary-900">{project.clientName}</span>
          </div>
          
          <div className="flex items-center justify-between text-sm">
            <span className="text-secondary-600">Start Date:</span>
            <span className="font-medium text-secondary-900">{formatDate(project.startDate)}</span>
          </div>
          
          <div className="flex items-center justify-between text-sm">
            <span className="text-secondary-600">End Date:</span>
            <span className="font-medium text-secondary-900">{formatDate(project.estimatedEndDate)}</span>
          </div>
        </div>

        <div className="mt-4 pt-4 border-t border-secondary-100">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-secondary-700">Progress</span>
            <span className="text-sm font-bold text-secondary-900">{progress}%</span>
          </div>
          <div className="w-full bg-secondary-200 rounded-full h-2">
            <div 
              className="bg-gradient-to-r from-primary-500 to-primary-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        <div className="mt-4 pt-4 border-t border-secondary-100">
          <div className="flex items-center justify-between">
            <div className="text-sm">
              <span className="text-secondary-600">Budget:</span>
              <span className="font-semibold text-secondary-900 ml-1">
                ${project.estimatedBudget?.toLocaleString() || "0"}
              </span>
            </div>
            <div className="text-sm">
              <span className="text-secondary-600">Actual:</span>
              <span className={`font-semibold ml-1 ${
                budgetStatus === "over" ? "text-error-600" : 
                budgetStatus === "warning" ? "text-warning-600" : 
                "text-success-600"
              }`}>
                ${project.actualCost?.toLocaleString() || "0"}
              </span>
            </div>
          </div>
        </div>

        <div className="mt-4 flex items-center space-x-4 text-xs text-secondary-500">
          <div className="flex items-center space-x-1">
            <ApperIcon name="Users" className="w-3 h-3" />
            <span>{project.assignedStaff?.length || 0} staff</span>
          </div>
          <div className="flex items-center space-x-1">
            <ApperIcon name="CheckSquare" className="w-3 h-3" />
            <span>{project.tasks?.length || 0} tasks</span>
          </div>
          <div className="flex items-center space-x-1">
            <ApperIcon name="Calendar" className="w-3 h-3" />
            <span>{project.duration || "N/A"} days</span>
          </div>
        </div>
      </Card>
    </motion.div>
  );
};

export default ProjectCard;