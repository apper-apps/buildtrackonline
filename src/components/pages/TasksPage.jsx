import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { toast } from "react-toastify";
import { format } from "date-fns";
import Card from "@/components/atoms/Card";
import Button from "@/components/atoms/Button";
import Badge from "@/components/atoms/Badge";
import StatusBadge from "@/components/molecules/StatusBadge";
import SearchBar from "@/components/molecules/SearchBar";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import Empty from "@/components/ui/Empty";
import ApperIcon from "@/components/ApperIcon";
import tasksService from "@/services/api/tasksService";
import projectsService from "@/services/api/projectsService";
import staffService from "@/services/api/staffService";

const TasksPage = () => {
  const [tasks, setTasks] = useState([]);
  const [projects, setProjects] = useState([]);
  const [staff, setStaff] = useState([]);
  const [filteredTasks, setFilteredTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [projectFilter, setProjectFilter] = useState("");

  const loadData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const [tasksData, projectsData, staffData] = await Promise.all([
        tasksService.getAll(),
        projectsService.getAll(),
        staffService.getAll()
      ]);
      
      setTasks(tasksData);
      setProjects(projectsData);
      setStaff(staffData);
      setFilteredTasks(tasksData);
    } catch (err) {
      setError(err.message);
      toast.error("Failed to load tasks");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    let filtered = tasks;

    if (searchTerm) {
      filtered = filtered.filter(task =>
        task.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        task.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (statusFilter) {
      filtered = filtered.filter(task => task.status === statusFilter);
    }

    if (projectFilter) {
      filtered = filtered.filter(task => task.projectId === projectFilter);
    }

    setFilteredTasks(filtered);
  }, [tasks, searchTerm, statusFilter, projectFilter]);

  const handleSearch = (term) => {
    setSearchTerm(term);
  };

  const handleStatusChange = async (taskId, newStatus) => {
    try {
      const task = tasks.find(t => t.Id === taskId);
      const updatedTask = { ...task, status: newStatus };
      
      if (newStatus === "done") {
        updatedTask.completedDate = new Date().toISOString().split("T")[0];
      }
      
      const updated = await tasksService.update(taskId, updatedTask);
      setTasks(prev => prev.map(t => t.Id === taskId ? updated : t));
      toast.success(`Task marked as ${newStatus}`);
    } catch (err) {
      toast.error("Failed to update task status");
    }
  };

  const getProjectName = (projectId) => {
    const project = projects.find(p => p.Id === projectId);
    return project?.name || "Unknown Project";
  };

  const getStaffNames = (staffIds) => {
    if (!staffIds || staffIds.length === 0) return "Unassigned";
    const names = staffIds.map(id => {
      const member = staff.find(s => s.Id === id);
      return member?.name || "Unknown";
    });
    return names.join(", ");
  };

  const getPriorityColor = (priority) => {
    switch (priority?.toLowerCase()) {
      case "high":
        return "error";
      case "medium":
        return "warning";
      case "low":
        return "success";
      default:
        return "secondary";
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return "Not set";
    try {
      return format(new Date(dateString), "MMM dd, yyyy");
    } catch {
      return "Invalid date";
    }
  };

  const statusOptions = [
    { value: "to do", label: "To Do" },
    { value: "in progress", label: "In Progress" },
    { value: "blocked", label: "Blocked" },
    { value: "done", label: "Done" }
  ];

  const tasksByStatus = {
    "to do": filteredTasks.filter(task => task.status === "to do"),
    "in progress": filteredTasks.filter(task => task.status === "in progress"),
    "blocked": filteredTasks.filter(task => task.status === "blocked"),
    "done": filteredTasks.filter(task => task.status === "done")
  };

  if (loading) {
    return <Loading type="cards" />;
  }

  if (error) {
    return <Error message={error} onRetry={loadData} />;
  }

  return (
    <motion.div
      className="space-y-6"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-secondary-900">Task Board</h1>
          <p className="text-secondary-600">Track and manage project tasks</p>
        </div>
        <Button
          className="flex items-center space-x-2"
          onClick={() => toast.info("Task creation coming soon!")}
        >
          <ApperIcon name="Plus" className="w-4 h-4" />
          <span>New Task</span>
        </Button>
      </div>

      {/* Search and Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1">
          <SearchBar
            placeholder="Search tasks..."
            onSearch={handleSearch}
          />
        </div>
        <div className="flex gap-2">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-2 border border-secondary-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
          >
            <option value="">All Status</option>
            {statusOptions.map(option => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
          <select
            value={projectFilter}
            onChange={(e) => setProjectFilter(e.target.value)}
            className="px-3 py-2 border border-secondary-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
          >
            <option value="">All Projects</option>
            {projects.map(project => (
              <option key={project.Id} value={project.Id}>
                {project.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Kanban Board */}
      {filteredTasks.length === 0 ? (
        <Empty 
          type="tasks"
          onAction={() => toast.info("Task creation coming soon!")}
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {Object.entries(tasksByStatus).map(([status, statusTasks]) => (
            <div key={status} className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-semibold text-secondary-900 capitalize">
                  {status}
                </h3>
                <Badge variant="secondary" className="text-xs">
                  {statusTasks.length}
                </Badge>
              </div>
              
              <div className="space-y-4">
                {statusTasks.map((task) => (
                  <motion.div
                    key={task.Id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <Card className="p-4 hover:shadow-medium transition-shadow duration-200">
                      <div className="space-y-3">
                        <div className="flex items-start justify-between">
                          <h4 className="font-medium text-secondary-900 line-clamp-2">
                            {task.name}
                          </h4>
                          <Badge variant={getPriorityColor(task.priority)} className="text-xs">
                            {task.priority || "Medium"}
                          </Badge>
                        </div>

                        <p className="text-sm text-secondary-600 line-clamp-3">
                          {task.description}
                        </p>

                        <div className="text-xs text-secondary-500">
                          <div className="font-medium">{getProjectName(task.projectId)}</div>
                          <div className="mt-1">Due: {formatDate(task.dueDate)}</div>
                        </div>

                        <div className="flex items-center justify-between">
                          <div className="text-xs text-secondary-600">
                            {getStaffNames(task.assignedStaff)}
                          </div>
                          <StatusBadge status={task.status} type="task" />
                        </div>

                        <div className="flex justify-between items-center pt-2 border-t border-secondary-100">
                          <div className="flex -space-x-1">
                            {task.assignedStaff?.slice(0, 3).map((staffId, index) => (
                              <div
                                key={staffId}
                                className="w-6 h-6 bg-gradient-to-br from-primary-500 to-primary-600 rounded-full flex items-center justify-center text-white text-xs border-2 border-white"
                              >
                                {staff.find(s => s.Id === staffId)?.name?.[0] || "?"}
                              </div>
                            ))}
                            {task.assignedStaff?.length > 3 && (
                              <div className="w-6 h-6 bg-secondary-300 rounded-full flex items-center justify-center text-white text-xs border-2 border-white">
                                +{task.assignedStaff.length - 3}
                              </div>
                            )}
                          </div>

                          <div className="flex space-x-1">
                            {task.status !== "done" && (
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleStatusChange(task.Id, "done")}
                                className="text-success-600 hover:text-success-700"
                              >
                                <ApperIcon name="Check" className="w-3 h-3" />
                              </Button>
                            )}
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => toast.info("Task editing coming soon!")}
                            >
                              <ApperIcon name="Edit2" className="w-3 h-3" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    </Card>
                  </motion.div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </motion.div>
  );
};

export default TasksPage;