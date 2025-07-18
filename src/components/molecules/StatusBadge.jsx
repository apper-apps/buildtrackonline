import Badge from "@/components/atoms/Badge";
import ApperIcon from "@/components/ApperIcon";

const StatusBadge = ({ status, type = "project" }) => {
  const getStatusConfig = () => {
    if (type === "project") {
      switch (status?.toLowerCase()) {
        case "planned":
          return { variant: "info", icon: "Calendar", label: "Planned" };
        case "in progress":
          return { variant: "warning", icon: "Clock", label: "In Progress" };
        case "on hold":
          return { variant: "secondary", icon: "Pause", label: "On Hold" };
        case "completed":
          return { variant: "success", icon: "CheckCircle", label: "Completed" };
        default:
          return { variant: "default", icon: "Circle", label: status || "Unknown" };
      }
    }
    
    if (type === "task") {
      switch (status?.toLowerCase()) {
        case "to do":
          return { variant: "secondary", icon: "Circle", label: "To Do" };
        case "in progress":
          return { variant: "warning", icon: "Clock", label: "In Progress" };
        case "blocked":
          return { variant: "error", icon: "AlertCircle", label: "Blocked" };
        case "done":
          return { variant: "success", icon: "CheckCircle", label: "Done" };
        default:
          return { variant: "default", icon: "Circle", label: status || "Unknown" };
      }
    }

    return { variant: "default", icon: "Circle", label: status || "Unknown" };
  };

  const config = getStatusConfig();

  return (
    <Badge variant={config.variant} className="flex items-center space-x-1">
      <ApperIcon name={config.icon} className="w-3 h-3" />
      <span>{config.label}</span>
    </Badge>
  );
};

export default StatusBadge;