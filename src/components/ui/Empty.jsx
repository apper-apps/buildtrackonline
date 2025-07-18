import { motion } from "framer-motion";
import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";

const Empty = ({ 
  title = "No items found",
  description = "Get started by creating your first item.",
  actionLabel = "Create New",
  onAction,
  icon = "Package",
  type = "general"
}) => {
  const getEmptyContent = () => {
    switch (type) {
      case "projects":
        return {
          icon: "Building2",
          title: "No projects yet",
          description: "Start by creating your first construction project to track timelines and assign staff.",
          actionLabel: "Create Project"
        };
      case "staff":
        return {
          icon: "Users",
          title: "No staff members",
          description: "Add your team members to start assigning them to projects and tracking their time.",
          actionLabel: "Add Staff"
        };
      case "tasks":
        return {
          icon: "CheckSquare",
          title: "No tasks created",
          description: "Break down your projects into manageable tasks and assign them to your team.",
          actionLabel: "Create Task"
        };
      case "timeline":
        return {
          icon: "Calendar",
          title: "No assignments on timeline",
          description: "Drag and drop staff members onto the timeline to create project assignments.",
          actionLabel: "View Projects"
        };
      case "search":
        return {
          icon: "Search",
          title: "No results found",
          description: "Try adjusting your search criteria or browse all available items.",
          actionLabel: "Clear Search"
        };
      default:
        return { icon, title, description, actionLabel };
    }
  };

  const content = getEmptyContent();

  return (
    <motion.div
      className="flex flex-col items-center justify-center py-16 px-6 text-center"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <motion.div
        className="w-24 h-24 bg-gradient-to-br from-secondary-100 via-secondary-50 to-primary-50 rounded-full flex items-center justify-center mb-6"
        initial={{ scale: 0, rotate: -180 }}
        animate={{ scale: 1, rotate: 0 }}
        transition={{ 
          delay: 0.2, 
          type: "spring", 
          stiffness: 200,
          damping: 15
        }}
      >
        <ApperIcon 
          name={content.icon} 
          className="w-12 h-12 text-secondary-400" 
        />
      </motion.div>

      <motion.h3
        className="text-2xl font-bold text-secondary-900 mb-3"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
      >
        {content.title}
      </motion.h3>

      <motion.p
        className="text-secondary-600 mb-8 max-w-md leading-relaxed"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4 }}
      >
        {content.description}
      </motion.p>

      {onAction && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <Button
            onClick={onAction}
            className="bg-gradient-to-r from-primary-500 to-primary-600 hover:from-primary-600 hover:to-primary-700 text-white px-8 py-4 rounded-xl font-semibold transition-all duration-200 flex items-center space-x-3 shadow-medium hover:shadow-strong transform hover:scale-105"
          >
            <ApperIcon name="Plus" className="w-5 h-5" />
            <span>{content.actionLabel}</span>
          </Button>
        </motion.div>
      )}

      <motion.div
        className="mt-12 flex items-center space-x-6 text-sm text-secondary-400"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.7 }}
      >
        <div className="flex items-center space-x-2">
          <ApperIcon name="Zap" className="w-4 h-4" />
          <span>Fast Setup</span>
        </div>
        <div className="flex items-center space-x-2">
          <ApperIcon name="Shield" className="w-4 h-4" />
          <span>Secure</span>
        </div>
        <div className="flex items-center space-x-2">
          <ApperIcon name="Smartphone" className="w-4 h-4" />
          <span>Mobile Ready</span>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default Empty;