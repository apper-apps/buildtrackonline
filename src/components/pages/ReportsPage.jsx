import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { toast } from "react-toastify";
import { format, startOfMonth, endOfMonth, eachDayOfInterval } from "date-fns";
import Card from "@/components/atoms/Card";
import Button from "@/components/atoms/Button";
import Badge from "@/components/atoms/Badge";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import ApperIcon from "@/components/ApperIcon";
import projectsService from "@/services/api/projectsService";
import staffService from "@/services/api/staffService";
import assignmentsService from "@/services/api/assignmentsService";

const ReportsPage = () => {
  const [projects, setProjects] = useState([]);
  const [staff, setStaff] = useState([]);
  const [assignments, setAssignments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedMonth, setSelectedMonth] = useState(new Date());

  const loadData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const [projectsData, staffData, assignmentsData] = await Promise.all([
        projectsService.getAll(),
        staffService.getAll(),
        assignmentsService.getAll()
      ]);
      
      setProjects(projectsData);
      setStaff(staffData);
      setAssignments(assignmentsData);
    } catch (err) {
      setError(err.message);
      toast.error("Failed to load reports data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  // Calculate metrics
  const totalProjects = projects.length;
  const activeProjects = projects.filter(p => p.status === "in progress").length;
  const completedProjects = projects.filter(p => p.status === "completed").length;
  const totalStaff = staff.length;

  const totalBudget = projects.reduce((sum, p) => sum + (p.estimatedBudget || 0), 0);
  const actualCosts = projects.reduce((sum, p) => sum + (p.actualCost || 0), 0);
  const budgetUtilization = totalBudget > 0 ? (actualCosts / totalBudget) * 100 : 0;

  const getProjectCosts = () => {
    return projects.map(project => {
      const projectAssignments = assignments.filter(a => a.projectId === project.Id);
      const laborCost = projectAssignments.reduce((sum, assignment) => {
        const staffMember = staff.find(s => s.Id === assignment.staffId);
        return sum + (staffMember?.dailyRate || 0);
      }, 0);
      
      return {
        ...project,
        laborCost,
        budgetVariance: (project.estimatedBudget || 0) - laborCost
      };
    });
  };

  const getStaffUtilization = () => {
    return staff.map(member => {
      const memberAssignments = assignments.filter(a => a.staffId === member.Id);
      const totalDays = memberAssignments.length;
      const totalRevenue = totalDays * (member.dailyRate || 0);
      
      return {
        ...member,
        assignedDays: totalDays,
        totalRevenue,
        utilizationRate: totalDays > 0 ? (totalDays / 30) * 100 : 0 // Assuming 30 days max
      };
    });
  };

  const projectCosts = getProjectCosts();
  const staffUtilization = getStaffUtilization();

  const topProjects = projectCosts
    .sort((a, b) => b.laborCost - a.laborCost)
    .slice(0, 5);

  const topStaff = staffUtilization
    .sort((a, b) => b.totalRevenue - a.totalRevenue)
    .slice(0, 5);

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
          <h1 className="text-2xl font-bold text-secondary-900">Reports & Analytics</h1>
          <p className="text-secondary-600">Track performance and analyze costs</p>
        </div>
        <Button
          className="flex items-center space-x-2"
          onClick={() => toast.info("Export functionality coming soon!")}
        >
          <ApperIcon name="Download" className="w-4 h-4" />
          <span>Export Report</span>
        </Button>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-secondary-600">Total Projects</p>
              <p className="text-3xl font-bold text-secondary-900">{totalProjects}</p>
            </div>
            <div className="w-12 h-12 bg-gradient-to-br from-primary-500 to-primary-600 rounded-full flex items-center justify-center">
              <ApperIcon name="Building2" className="w-6 h-6 text-white" />
            </div>
          </div>
          <div className="mt-4 flex items-center">
            <Badge variant="success" className="text-xs">
              {activeProjects} Active
            </Badge>
            <span className="text-xs text-secondary-500 ml-2">
              {completedProjects} Completed
            </span>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-secondary-600">Total Staff</p>
              <p className="text-3xl font-bold text-secondary-900">{totalStaff}</p>
            </div>
            <div className="w-12 h-12 bg-gradient-to-br from-success-500 to-success-600 rounded-full flex items-center justify-center">
              <ApperIcon name="Users" className="w-6 h-6 text-white" />
            </div>
          </div>
          <div className="mt-4">
            <div className="text-xs text-secondary-500">
              {assignments.length} Active Assignments
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-secondary-600">Total Budget</p>
              <p className="text-3xl font-bold text-secondary-900">
                ${totalBudget.toLocaleString()}
              </p>
            </div>
            <div className="w-12 h-12 bg-gradient-to-br from-accent-500 to-accent-600 rounded-full flex items-center justify-center">
              <ApperIcon name="DollarSign" className="w-6 h-6 text-white" />
            </div>
          </div>
          <div className="mt-4">
            <div className="text-xs text-secondary-500">
              ${actualCosts.toLocaleString()} Actual Costs
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-secondary-600">Budget Utilization</p>
              <p className="text-3xl font-bold text-secondary-900">
                {budgetUtilization.toFixed(1)}%
              </p>
            </div>
            <div className="w-12 h-12 bg-gradient-to-br from-info-500 to-info-600 rounded-full flex items-center justify-center">
              <ApperIcon name="TrendingUp" className="w-6 h-6 text-white" />
            </div>
          </div>
          <div className="mt-4">
            <Badge 
              variant={budgetUtilization > 100 ? "error" : budgetUtilization > 80 ? "warning" : "success"}
              className="text-xs"
            >
              {budgetUtilization > 100 ? "Over Budget" : budgetUtilization > 80 ? "Near Limit" : "On Track"}
            </Badge>
          </div>
        </Card>
      </div>

      {/* Charts and Analysis */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top Projects by Cost */}
        <Card className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-secondary-900">Top Projects by Cost</h3>
            <ApperIcon name="BarChart3" className="w-5 h-5 text-secondary-500" />
          </div>
          <div className="space-y-4">
            {topProjects.map((project, index) => (
              <div key={project.Id} className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-gradient-to-br from-primary-500 to-primary-600 rounded-full flex items-center justify-center text-white text-sm font-bold">
                    {index + 1}
                  </div>
                  <div>
                    <p className="font-medium text-secondary-900">{project.name}</p>
                    <p className="text-xs text-secondary-600">{project.location}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-bold text-secondary-900">
                    ${project.laborCost.toLocaleString()}
                  </p>
                  <p className={`text-xs ${
                    project.budgetVariance >= 0 ? "text-success-600" : "text-error-600"
                  }`}>
                    {project.budgetVariance >= 0 ? "+" : ""}
                    ${project.budgetVariance.toLocaleString()}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* Top Staff by Revenue */}
        <Card className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-secondary-900">Top Staff by Revenue</h3>
            <ApperIcon name="Users" className="w-5 h-5 text-secondary-500" />
          </div>
          <div className="space-y-4">
            {topStaff.map((member, index) => (
              <div key={member.Id} className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-gradient-to-br from-success-500 to-success-600 rounded-full flex items-center justify-center text-white text-sm font-bold">
                    {index + 1}
                  </div>
                  <div>
                    <p className="font-medium text-secondary-900">{member.name}</p>
                    <p className="text-xs text-secondary-600">{member.role}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-bold text-secondary-900">
                    ${member.totalRevenue.toLocaleString()}
                  </p>
                  <p className="text-xs text-secondary-600">
                    {member.assignedDays} days assigned
                  </p>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* Project Status Overview */}
      <Card className="p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-secondary-900">Project Status Overview</h3>
          <ApperIcon name="PieChart" className="w-5 h-5 text-secondary-500" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {["planned", "in progress", "on hold", "completed"].map((status) => {
            const count = projects.filter(p => p.status === status).length;
            const percentage = totalProjects > 0 ? (count / totalProjects) * 100 : 0;
            
            return (
              <div key={status} className="text-center">
                <div className="relative w-16 h-16 mx-auto mb-2">
                  <div className="w-full h-full bg-secondary-200 rounded-full"></div>
                  <div 
                    className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-primary-500 to-primary-600 rounded-full"
                    style={{ 
                      clipPath: `polygon(50% 50%, 50% 0%, ${50 + percentage * 0.5}% 0%, ${50 + percentage * 0.5}% 100%, 50% 100%)` 
                    }}
                  ></div>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-sm font-bold text-secondary-900">{count}</span>
                  </div>
                </div>
                <p className="text-sm font-medium text-secondary-900 capitalize">{status}</p>
                <p className="text-xs text-secondary-600">{percentage.toFixed(1)}%</p>
              </div>
            );
          })}
        </div>
      </Card>
    </motion.div>
  );
};

export default ReportsPage;