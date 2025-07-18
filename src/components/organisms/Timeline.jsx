import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { format, addDays, startOfWeek, endOfWeek, eachDayOfInterval } from "date-fns";
import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";
import Badge from "@/components/atoms/Badge";
import Card from "@/components/atoms/Card";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import Empty from "@/components/ui/Empty";
import { cn } from "@/utils/cn";

const Timeline = ({ 
  projects = [], 
  staff = [], 
  assignments = [], 
  onAssignmentChange,
  onAssignmentCreate,
  onAssignmentDelete,
  loading = false,
  error = null 
}) => {
  const [currentWeek, setCurrentWeek] = useState(new Date());
  const [draggedStaff, setDraggedStaff] = useState(null);
  const [draggedAssignment, setDraggedAssignment] = useState(null);
  const [dragPosition, setDragPosition] = useState({ x: 0, y: 0 });
  const [hoveredCell, setHoveredCell] = useState(null);
  const [selectedAssignment, setSelectedAssignment] = useState(null);
  const [zoom, setZoom] = useState(1);
  const timelineRef = useRef(null);

  // Calculate week boundaries
  const weekStart = startOfWeek(currentWeek, { weekStartsOn: 1 });
  const weekEnd = endOfWeek(currentWeek, { weekStartsOn: 1 });
  const weekDays = eachDayOfInterval({ start: weekStart, end: weekEnd });

  // Navigate weeks
  const goToPreviousWeek = () => {
    setCurrentWeek(prev => addDays(prev, -7));
  };

  const goToNextWeek = () => {
    setCurrentWeek(prev => addDays(prev, 7));
  };

  const goToToday = () => {
    setCurrentWeek(new Date());
  };

  // Handle drag and drop
  const handleDragStart = (e, item, type) => {
    if (type === "staff") {
      setDraggedStaff(item);
      e.dataTransfer.effectAllowed = "move";
    } else if (type === "assignment") {
      setDraggedAssignment(item);
      e.dataTransfer.effectAllowed = "move";
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
  };

  const handleDrop = (e, projectId, date) => {
    e.preventDefault();
    
    if (draggedStaff) {
      // Create new assignment
      const newAssignment = {
        Id: Math.max(...assignments.map(a => a.Id), 0) + 1,
        staffId: draggedStaff.Id,
        projectId: projectId,
        startDate: format(date, "yyyy-MM-dd"),
        endDate: format(date, "yyyy-MM-dd"),
        hoursPerDay: 8,
        totalCost: draggedStaff.dailyRate * 1
      };
      
      onAssignmentCreate?.(newAssignment);
      setDraggedStaff(null);
    } else if (draggedAssignment) {
      // Update existing assignment
      const updatedAssignment = {
        ...draggedAssignment,
        projectId: projectId,
        startDate: format(date, "yyyy-MM-dd"),
        endDate: format(date, "yyyy-MM-dd")
      };
      
      onAssignmentChange?.(updatedAssignment);
      setDraggedAssignment(null);
    }
    
    setHoveredCell(null);
  };

  const handleCellEnter = (projectId, date) => {
    if (draggedStaff || draggedAssignment) {
      setHoveredCell({ projectId, date: format(date, "yyyy-MM-dd") });
    }
  };

  const handleCellLeave = () => {
    setHoveredCell(null);
  };

  // Get assignments for a specific project and date
  const getAssignmentsForCell = (projectId, date) => {
    const dateStr = format(date, "yyyy-MM-dd");
    return assignments.filter(assignment => 
      assignment.projectId === projectId && 
      assignment.startDate <= dateStr && 
      assignment.endDate >= dateStr
    );
  };

  // Get staff member by ID
  const getStaffById = (staffId) => {
    return staff.find(s => s.Id === staffId);
  };

  // Get project by ID
  const getProjectById = (projectId) => {
    return projects.find(p => p.Id === projectId);
  };

  // Calculate total cost for a day
  const getDayCost = (projectId, date) => {
    const cellAssignments = getAssignmentsForCell(projectId, date);
    return cellAssignments.reduce((total, assignment) => {
      const staffMember = getStaffById(assignment.staffId);
      return total + (staffMember?.dailyRate || 0);
    }, 0);
  };

  if (loading) {
    return <Loading type="timeline" />;
  }

  if (error) {
    return <Error message={error} />;
  }

  if (projects.length === 0) {
    return <Empty type="timeline" />;
  }

  return (
    <div className="bg-white rounded-xl shadow-soft border border-secondary-100 overflow-hidden">
      {/* Timeline Header */}
      <div className="bg-gradient-to-r from-primary-500 to-primary-600 px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <h2 className="text-xl font-bold text-white">Project Timeline</h2>
            <Badge variant="secondary" className="bg-white/20 text-white border-white/30">
              Week of {format(weekStart, "MMM dd, yyyy")}
            </Badge>
          </div>
          
          <div className="flex items-center space-x-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={goToPreviousWeek}
              className="text-white hover:bg-white/20"
            >
              <ApperIcon name="ChevronLeft" className="w-4 h-4" />
            </Button>
            
            <Button
              variant="ghost"
              size="sm"
              onClick={goToToday}
              className="text-white hover:bg-white/20 px-4"
            >
              Today
            </Button>
            
            <Button
              variant="ghost"
              size="sm"
              onClick={goToNextWeek}
              className="text-white hover:bg-white/20"
            >
              <ApperIcon name="ChevronRight" className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* Timeline Grid */}
      <div className="overflow-x-auto" ref={timelineRef}>
        <div className="min-w-[800px]">
          {/* Header Row */}
          <div className="grid grid-cols-8 border-b border-secondary-200 bg-secondary-50">
            <div className="p-4 font-semibold text-secondary-900 border-r border-secondary-200">
              Project
            </div>
            {weekDays.map((day, index) => (
              <div 
                key={index}
                className="p-4 text-center border-r border-secondary-200 last:border-r-0"
              >
                <div className="font-semibold text-secondary-900">
                  {format(day, "EEE")}
                </div>
                <div className="text-xs text-secondary-600">
                  {format(day, "MMM dd")}
                </div>
              </div>
            ))}
          </div>

          {/* Project Rows */}
          <div className="divide-y divide-secondary-200">
            {projects.map((project) => (
              <div key={project.Id} className="grid grid-cols-8 min-h-[80px] timeline-row">
                {/* Project Info */}
                <div className="p-4 border-r border-secondary-200 flex items-center">
                  <div className="flex-1">
                    <div className="font-semibold text-secondary-900 mb-1">
                      {project.name}
                    </div>
                    <div className="text-xs text-secondary-600">
                      {project.location}
                    </div>
                    <Badge variant="info" className="mt-1 text-xs">
                      {project.type}
                    </Badge>
                  </div>
                </div>

                {/* Timeline Cells */}
                {weekDays.map((day, dayIndex) => {
                  const cellAssignments = getAssignmentsForCell(project.Id, day);
                  const dayCost = getDayCost(project.Id, day);
                  const isHovered = hoveredCell?.projectId === project.Id && 
                                   hoveredCell?.date === format(day, "yyyy-MM-dd");
                  const isToday = format(day, "yyyy-MM-dd") === format(new Date(), "yyyy-MM-dd");

                  return (
                    <div
                      key={dayIndex}
                      className={cn(
                        "border-r border-secondary-200 last:border-r-0 p-2 min-h-[80px] relative",
                        isToday && "bg-primary-50",
                        isHovered && "bg-accent-50 border-accent-300",
                        "transition-colors duration-200"
                      )}
                      onDragOver={handleDragOver}
                      onDrop={(e) => handleDrop(e, project.Id, day)}
                      onDragEnter={() => handleCellEnter(project.Id, day)}
                      onDragLeave={handleCellLeave}
                    >
                      {/* Assignments */}
                      <div className="space-y-1">
                        {cellAssignments.map((assignment) => {
                          const staffMember = getStaffById(assignment.staffId);
                          return (
                            <motion.div
                              key={assignment.Id}
                              className="timeline-assignment text-white text-xs p-1 rounded cursor-pointer"
                              draggable
                              onDragStart={(e) => handleDragStart(e, assignment, "assignment")}
                              onClick={() => setSelectedAssignment(assignment)}
                              whileHover={{ scale: 1.02 }}
                              whileTap={{ scale: 0.98 }}
                            >
                              <div className="font-medium">{staffMember?.name || "Unknown"}</div>
                              <div className="text-xs opacity-90">{staffMember?.role || "Role"}</div>
                            </motion.div>
                          );
                        })}
                      </div>

                      {/* Cost Display */}
                      {dayCost > 0 && (
                        <div className="absolute bottom-1 right-1 text-xs font-bold text-accent-600">
                          ${dayCost.toLocaleString()}
                        </div>
                      )}

                      {/* Drop Zone Indicator */}
                      {isHovered && (
                        <motion.div
                          className="absolute inset-0 border-2 border-dashed border-accent-400 rounded bg-accent-50/50 flex items-center justify-center"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                        >
                          <ApperIcon name="Plus" className="w-6 h-6 text-accent-600" />
                        </motion.div>
                      )}
                    </div>
                  );
                })}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Staff Panel */}
      <div className="border-t border-secondary-200 bg-secondary-50 p-4">
        <h3 className="font-semibold text-secondary-900 mb-3">Available Staff</h3>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-2">
          {staff.map((staffMember) => (
            <motion.div
              key={staffMember.Id}
              className="bg-white rounded-lg p-3 border border-secondary-200 cursor-move hover:shadow-medium transition-all duration-200"
              draggable
              onDragStart={(e) => handleDragStart(e, staffMember, "staff")}
              whileHover={{ scale: 1.02 }}
              whileDrag={{ scale: 1.05, rotate: 5 }}
            >
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-gradient-to-br from-primary-500 to-primary-600 rounded-full flex items-center justify-center">
                  <ApperIcon name="User" className="w-4 h-4 text-white" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="font-medium text-sm text-secondary-900 truncate">
                    {staffMember.name}
                  </div>
                  <div className="text-xs text-secondary-600 truncate">
                    {staffMember.role}
                  </div>
                </div>
              </div>
              <div className="mt-2 text-xs font-semibold text-accent-600">
                ${staffMember.dailyRate}/day
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Assignment Details Modal */}
      <AnimatePresence>
        {selectedAssignment && (
          <motion.div
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelectedAssignment(null)}
          >
            <motion.div
              className="bg-white rounded-xl p-6 max-w-md w-full mx-4"
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-bold text-secondary-900">Assignment Details</h3>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setSelectedAssignment(null)}
                >
                  <ApperIcon name="X" className="w-4 h-4" />
                </Button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-secondary-700">Staff Member</label>
                  <div className="mt-1 text-secondary-900">
                    {getStaffById(selectedAssignment.staffId)?.name || "Unknown"}
                  </div>
                </div>

                <div>
                  <label className="text-sm font-medium text-secondary-700">Project</label>
                  <div className="mt-1 text-secondary-900">
                    {getProjectById(selectedAssignment.projectId)?.name || "Unknown"}
                  </div>
                </div>

                <div>
                  <label className="text-sm font-medium text-secondary-700">Date</label>
                  <div className="mt-1 text-secondary-900">
                    {format(new Date(selectedAssignment.startDate), "MMM dd, yyyy")}
                  </div>
                </div>

                <div>
                  <label className="text-sm font-medium text-secondary-700">Hours</label>
                  <div className="mt-1 text-secondary-900">
                    {selectedAssignment.hoursPerDay} hours
                  </div>
                </div>

                <div>
                  <label className="text-sm font-medium text-secondary-700">Cost</label>
                  <div className="mt-1 text-lg font-bold text-accent-600">
                    ${selectedAssignment.totalCost?.toLocaleString()}
                  </div>
                </div>
              </div>

              <div className="flex justify-end space-x-3 mt-6">
                <Button
                  variant="outline"
                  onClick={() => setSelectedAssignment(null)}
                >
                  Close
                </Button>
                <Button
                  variant="danger"
                  onClick={() => {
                    onAssignmentDelete?.(selectedAssignment.Id);
                    setSelectedAssignment(null);
                  }}
                >
                  Delete Assignment
                </Button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Timeline;