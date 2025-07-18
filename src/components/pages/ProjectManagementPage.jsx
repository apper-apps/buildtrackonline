import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { toast } from "react-toastify";
import Card from "@/components/atoms/Card";
import Button from "@/components/atoms/Button";
import Badge from "@/components/atoms/Badge";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import Empty from "@/components/ui/Empty";
import ApperIcon from "@/components/ApperIcon";
import StatusBadge from "@/components/molecules/StatusBadge";
import SearchBar from "@/components/molecules/SearchBar";
import projectsService from "@/services/api/projectsService";
import tasksService from "@/services/api/tasksService";
import staffService from "@/services/api/staffService";

const ProjectManagementPage = () => {
  const [projects, setProjects] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [staff, setStaff] = useState([]);
  const [filteredProjects, setFilteredProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [selectedProject, setSelectedProject] = useState(null);
  const [showProjectDetails, setShowProjectDetails] = useState(false);

  const loadData = async () => {
    try {
      setLoading(true);
      setError(null);
      const [projectsData, tasksData, staffData] = await Promise.all([
        projectsService.getAll(),
        tasksService.getAll(),
        staffService.getAll()
      ]);
      setProjects(projectsData);
      setTasks(tasksData);
      setStaff(staffData);
      setFilteredProjects(projectsData);
    } catch (err) {
      setError(err.message);
      toast.error("Failed to load project management data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    let filtered = projects;

    if (searchTerm) {
      filtered = filtered.filter(project =>
        project.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        project.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
        project.clientName.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (statusFilter) {
      filtered = filtered.filter(project => project.status === statusFilter);
    }

    setFilteredProjects(filtered);
  }, [projects, searchTerm, statusFilter]);

  const handleSearch = (term) => {
    setSearchTerm(term);
  };

  const handleProjectClick = (project) => {
    setSelectedProject(project);
    setShowProjectDetails(true);
  };

  const handleCloseDetails = () => {
    setShowProjectDetails(false);
    setSelectedProject(null);
  };

  const getProjectMetrics = () => {
    const totalProjects = projects.length;
    const activeProjects = projects.filter(p => p.status === "in progress").length;
    const completedProjects = projects.filter(p => p.status === "completed").length;
    const totalBudget = projects.reduce((sum, p) => sum + (p.estimatedBudget || 0), 0);
    const totalCost = projects.reduce((sum, p) => sum + (p.actualCost || 0), 0);
    const budgetVariance = totalBudget > 0 ? ((totalCost - totalBudget) / totalBudget * 100) : 0;

    return {
      totalProjects,
      activeProjects,
      completedProjects,
      totalBudget,
      totalCost,
      budgetVariance
    };
  };

  const getProjectTasks = (projectId) => {
    return tasks.filter(task => task.projectId === projectId);
  };

  const getProjectStaff = (projectId) => {
    const project = projects.find(p => p.Id === projectId);
    if (!project?.assignedStaff) return [];
    return staff.filter(s => project.assignedStaff.includes(s.Id));
  };

  const getTaskProgress = (projectId) => {
    const projectTasks = getProjectTasks(projectId);
    if (projectTasks.length === 0) return 0;
    const completedTasks = projectTasks.filter(task => task.status === "done").length;
    return Math.round((completedTasks / projectTasks.length) * 100);
  };

  const statusOptions = [
    { value: "planned", label: "Planned" },
    { value: "in progress", label: "In Progress" },
    { value: "on hold", label: "On Hold" },
    { value: "completed", label: "Completed" }
  ];

  const metrics = getProjectMetrics();

  if (loading) {
    return <Loading type="cards" />;
  }

  if (error) {
    return <Error message={error} onRetry={loadData} />;
  }

  if (showProjectDetails && selectedProject) {
    const projectTasks = getProjectTasks(selectedProject.Id);
    const projectStaff = getProjectStaff(selectedProject.Id);
    const progress = getTaskProgress(selectedProject.Id);

    return (
      <motion.div
        className="space-y-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={handleCloseDetails}
              className="flex items-center space-x-2"
            >
              <ApperIcon name="ArrowLeft" className="w-4 h-4" />
              <span>Back to Overview</span>
            </Button>
          </div>
        </div>

        {/* Project Header */}
        <Card className="p-6">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <div className="flex items-center space-x-3 mb-2">
                <div className="w-12 h-12 bg-gradient-to-br from-primary-500 to-primary-600 rounded-lg flex items-center justify-center">
                  <ApperIcon name="Building2" className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-secondary-900">{selectedProject.name}</h1>
                  <p className="text-secondary-600">{selectedProject.location}</p>
                </div>
              </div>
              <div className="flex items-center space-x-4 mb-4">
                <Badge variant="info" className="text-sm">
                  {selectedProject.type}
                </Badge>
                <StatusBadge status={selectedProject.status} type="project" />
                <div className="flex items-center space-x-2 text-sm text-secondary-600">
                  <ApperIcon name="User" className="w-4 h-4" />
                  <span>{selectedProject.clientName}</span>
                </div>
              </div>
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold text-secondary-900">{progress}%</div>
              <div className="text-sm text-secondary-600">Complete</div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-6">
            <div className="bg-secondary-50 rounded-lg p-4">
              <div className="text-sm text-secondary-600">Budget</div>
              <div className="text-lg font-semibold text-secondary-900">
                ${selectedProject.estimatedBudget?.toLocaleString() || "0"}
              </div>
            </div>
            <div className="bg-secondary-50 rounded-lg p-4">
              <div className="text-sm text-secondary-600">Actual Cost</div>
              <div className="text-lg font-semibold text-secondary-900">
                ${selectedProject.actualCost?.toLocaleString() || "0"}
              </div>
            </div>
            <div className="bg-secondary-50 rounded-lg p-4">
              <div className="text-sm text-secondary-600">Tasks</div>
              <div className="text-lg font-semibold text-secondary-900">
                {projectTasks.length}
              </div>
            </div>
            <div className="bg-secondary-50 rounded-lg p-4">
              <div className="text-sm text-secondary-600">Staff</div>
              <div className="text-lg font-semibold text-secondary-900">
                {projectStaff.length}
              </div>
            </div>
          </div>
        </Card>

        {/* Tasks and Staff */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Tasks */}
          <Card className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-secondary-900">Tasks</h2>
              <Badge variant="outline" className="text-sm">
                {projectTasks.length} total
              </Badge>
            </div>
            <div className="space-y-3">
              {projectTasks.length === 0 ? (
                <div className="text-center py-8 text-secondary-500">
                  No tasks assigned to this project
                </div>
              ) : (
                projectTasks.slice(0, 5).map(task => (
                  <div key={task.Id} className="flex items-center justify-between p-3 bg-secondary-50 rounded-lg">
                    <div className="flex-1">
                      <div className="font-medium text-secondary-900">{task.name}</div>
                      <div className="text-sm text-secondary-600">{task.description}</div>
                    </div>
                    <StatusBadge status={task.status} type="task" />
                  </div>
                ))
              )}
              {projectTasks.length > 5 && (
                <div className="text-center py-2">
                  <span className="text-sm text-secondary-500">
                    +{projectTasks.length - 5} more tasks
                  </span>
                </div>
              )}
            </div>
          </Card>

          {/* Staff */}
          <Card className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-secondary-900">Assigned Staff</h2>
              <Badge variant="outline" className="text-sm">
                {projectStaff.length} members
              </Badge>
            </div>
            <div className="space-y-3">
              {projectStaff.length === 0 ? (
                <div className="text-center py-8 text-secondary-500">
                  No staff assigned to this project
                </div>
              ) : (
                projectStaff.map(member => (
                  <div key={member.Id} className="flex items-center space-x-3 p-3 bg-secondary-50 rounded-lg">
                    <div className="w-10 h-10 bg-gradient-to-br from-primary-500 to-primary-600 rounded-full flex items-center justify-center">
                      <ApperIcon name="User" className="w-5 h-5 text-white" />
                    </div>
                    <div className="flex-1">
                      <div className="font-medium text-secondary-900">{member.name}</div>
                      <div className="text-sm text-secondary-600">{member.role}</div>
                    </div>
                    <Badge variant="outline" className="text-xs">
                      {member.status}
                    </Badge>
                  </div>
                ))
              )}
            </div>
          </Card>
        </div>
      </motion.div>
    );
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
          <h1 className="text-2xl font-bold text-secondary-900">Project Management</h1>
          <p className="text-secondary-600">Comprehensive project oversight and management</p>
        </div>
        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={loadData}
            className="flex items-center space-x-2"
          >
            <ApperIcon name="RefreshCw" className="w-4 h-4" />
            <span>Refresh</span>
          </Button>
        </div>
      </div>

      {/* Metrics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-sm text-secondary-600">Total Projects</div>
              <div className="text-2xl font-bold text-secondary-900">{metrics.totalProjects}</div>
            </div>
            <div className="w-12 h-12 bg-gradient-to-br from-primary-500 to-primary-600 rounded-lg flex items-center justify-center">
              <ApperIcon name="Building2" className="w-6 h-6 text-white" />
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-sm text-secondary-600">Active Projects</div>
              <div className="text-2xl font-bold text-secondary-900">{metrics.activeProjects}</div>
            </div>
            <div className="w-12 h-12 bg-gradient-to-br from-accent-500 to-accent-600 rounded-lg flex items-center justify-center">
              <ApperIcon name="Activity" className="w-6 h-6 text-white" />
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-sm text-secondary-600">Completed</div>
              <div className="text-2xl font-bold text-secondary-900">{metrics.completedProjects}</div>
            </div>
            <div className="w-12 h-12 bg-gradient-to-br from-success-500 to-success-600 rounded-lg flex items-center justify-center">
              <ApperIcon name="CheckCircle2" className="w-6 h-6 text-white" />
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-sm text-secondary-600">Budget Variance</div>
              <div className={`text-2xl font-bold ${
                metrics.budgetVariance > 0 ? 'text-error-600' : 'text-success-600'
              }`}>
                {metrics.budgetVariance > 0 ? '+' : ''}{metrics.budgetVariance.toFixed(1)}%
              </div>
            </div>
            <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${
              metrics.budgetVariance > 0 
                ? 'bg-gradient-to-br from-error-500 to-error-600'
                : 'bg-gradient-to-br from-success-500 to-success-600'
            }`}>
              <ApperIcon name="TrendingUp" className="w-6 h-6 text-white" />
            </div>
          </div>
        </Card>
      </div>

      {/* Search and Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1">
          <SearchBar
            placeholder="Search projects..."
            onSearch={handleSearch}
          />
        </div>
        <div className="w-full sm:w-48">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="w-full px-3 py-2 border border-secondary-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
          >
            <option value="">All Status</option>
            {statusOptions.map(option => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Projects Table */}
      {filteredProjects.length === 0 ? (
        <Empty 
          type="projects"
          message="No projects found"
        />
      ) : (
        <Card className="overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-secondary-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-secondary-500 uppercase tracking-wider">
                    Project
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-secondary-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-secondary-500 uppercase tracking-wider">
                    Progress
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-secondary-500 uppercase tracking-wider">
                    Budget
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-secondary-500 uppercase tracking-wider">
                    Tasks
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-secondary-500 uppercase tracking-wider">
                    Staff
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-secondary-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-secondary-200">
                {filteredProjects.map((project) => {
                  const progress = getTaskProgress(project.Id);
                  const projectTasks = getProjectTasks(project.Id);
                  const projectStaff = getProjectStaff(project.Id);
                  
                  return (
                    <tr key={project.Id} className="hover:bg-secondary-50 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="w-10 h-10 bg-gradient-to-br from-primary-500 to-primary-600 rounded-lg flex items-center justify-center mr-3">
                            <ApperIcon name="Building2" className="w-5 h-5 text-white" />
                          </div>
                          <div>
                            <div className="text-sm font-medium text-secondary-900">{project.name}</div>
                            <div className="text-sm text-secondary-500">{project.location}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <StatusBadge status={project.status} type="project" />
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="w-16 bg-secondary-200 rounded-full h-2 mr-2">
                            <div 
                              className="bg-gradient-to-r from-primary-500 to-primary-600 h-2 rounded-full"
                              style={{ width: `${progress}%` }}
                            />
                          </div>
                          <span className="text-sm font-medium text-secondary-900">{progress}%</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-secondary-900">
                          ${project.estimatedBudget?.toLocaleString() || "0"}
                        </div>
                        <div className="text-sm text-secondary-500">
                          Actual: ${project.actualCost?.toLocaleString() || "0"}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center space-x-1">
                          <ApperIcon name="CheckSquare" className="w-4 h-4 text-secondary-500" />
                          <span className="text-sm text-secondary-900">{projectTasks.length}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center space-x-1">
                          <ApperIcon name="Users" className="w-4 h-4 text-secondary-500" />
                          <span className="text-sm text-secondary-900">{projectStaff.length}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleProjectClick(project)}
                          className="text-primary-600 hover:text-primary-900"
                        >
                          <ApperIcon name="Eye" className="w-4 h-4 mr-1" />
                          View
                        </Button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </Card>
      )}
    </motion.div>
  );
};

export default ProjectManagementPage;