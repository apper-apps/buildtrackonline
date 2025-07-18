import { motion } from "framer-motion";
import Card from "@/components/atoms/Card";
import Badge from "@/components/atoms/Badge";
import ApperIcon from "@/components/ApperIcon";

const StaffCard = ({ 
  staff, 
  onClick,
  showAvailability = true,
  showRate = true,
  className = "",
  draggable = false
}) => {
  const availabilityStatus = staff.availability?.length > 0 ? "available" : "unavailable";
  const currentAssignments = staff.assignments?.length || 0;

  const handleDragStart = (e) => {
    if (draggable) {
      e.dataTransfer.setData("text/plain", JSON.stringify(staff));
      e.dataTransfer.effectAllowed = "move";
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -4 }}
      transition={{ duration: 0.2 }}
    >
      <Card 
        className={`p-4 cursor-pointer transition-all duration-200 hover:shadow-medium ${className}`}
        onClick={onClick}
        draggable={draggable}
        onDragStart={handleDragStart}
      >
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-br from-primary-500 to-primary-600 rounded-full flex items-center justify-center">
              <ApperIcon name="User" className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="font-semibold text-secondary-900">{staff.name}</h3>
              <p className="text-sm text-secondary-600">{staff.role}</p>
            </div>
          </div>
          
          {showAvailability && (
            <Badge 
              variant={availabilityStatus === "available" ? "success" : "error"}
              className="flex items-center space-x-1"
            >
              <div className={`w-2 h-2 rounded-full ${
                availabilityStatus === "available" ? "bg-success-500" : "bg-error-500"
              }`} />
              <span className="capitalize">{availabilityStatus}</span>
            </Badge>
          )}
        </div>

        <div className="space-y-2">
          {showRate && (
            <div className="flex items-center justify-between text-sm">
              <span className="text-secondary-600">Daily Rate:</span>
              <span className="font-semibold text-secondary-900">
                ${staff.dailyRate?.toLocaleString() || "0"}/day
              </span>
            </div>
          )}
          
          <div className="flex items-center justify-between text-sm">
            <span className="text-secondary-600">Current Projects:</span>
            <span className="font-medium text-secondary-900">{currentAssignments}</span>
          </div>

          {staff.skills && staff.skills.length > 0 && (
            <div className="flex flex-wrap gap-1 mt-2">
              {staff.skills.slice(0, 3).map((skill, index) => (
                <Badge key={index} variant="secondary" className="text-xs">
                  {skill}
                </Badge>
              ))}
              {staff.skills.length > 3 && (
                <Badge variant="secondary" className="text-xs">
                  +{staff.skills.length - 3} more
                </Badge>
              )}
            </div>
          )}
        </div>

        <div className="mt-3 pt-3 border-t border-secondary-100">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2 text-sm text-secondary-600">
              <ApperIcon name="Phone" className="w-4 h-4" />
              <span>{staff.phone || "No phone"}</span>
            </div>
            <div className="flex items-center space-x-2 text-sm text-secondary-600">
              <ApperIcon name="Mail" className="w-4 h-4" />
              <span>{staff.email || "No email"}</span>
            </div>
          </div>
        </div>
      </Card>
    </motion.div>
  );
};

export default StaffCard;