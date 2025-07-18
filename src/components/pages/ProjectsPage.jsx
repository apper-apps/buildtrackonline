import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { toast } from "react-toastify";
import ProjectCard from "@/components/molecules/ProjectCard";
import ProjectForm from "@/components/organisms/ProjectForm";
import SearchBar from "@/components/molecules/SearchBar";
import Button from "@/components/atoms/Button";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import Empty from "@/components/ui/Empty";
import ApperIcon from "@/components/ApperIcon";
import projectsService from "@/services/api/projectsService";

const ProjectsPage = () => {
  const [projects, setProjects] = useState([]);
  const [filteredProjects, setFilteredProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [editingProject, setEditingProject] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("");

  const loadProjects = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await projectsService.getAll();
      setProjects(data);
      setFilteredProjects(data);
    } catch (err) {
      setError(err.message);
      toast.error("Failed to load projects");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProjects();
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

  const handleCreateProject = () => {
    setEditingProject(null);
    setShowForm(true);
  };

  const handleEditProject = (project) => {
    setEditingProject(project);
    setShowForm(true);
  };

  const handleDeleteProject = async (project) => {
    if (window.confirm(`Are you sure you want to delete "${project.name}"?`)) {
      try {
        await projectsService.delete(project.Id);
        setProjects(prev => prev.filter(p => p.Id !== project.Id));
        toast.success("Project deleted successfully");
      } catch (err) {
        toast.error("Failed to delete project");
      }
    }
  };

  const handleFormSubmit = async (projectData) => {
    try {
      if (editingProject) {
        const updated = await projectsService.update(editingProject.Id, projectData);
        setProjects(prev => 
          prev.map(p => p.Id === editingProject.Id ? updated : p)
        );
      } else {
        const created = await projectsService.create(projectData);
        setProjects(prev => [...prev, created]);
      }
      setShowForm(false);
      setEditingProject(null);
    } catch (err) {
      throw err;
    }
  };

  const handleFormCancel = () => {
    setShowForm(false);
    setEditingProject(null);
  };

  const handleSearch = (term) => {
    setSearchTerm(term);
  };

  const statusOptions = [
    { value: "planned", label: "Planned" },
    { value: "in progress", label: "In Progress" },
    { value: "on hold", label: "On Hold" },
    { value: "completed", label: "Completed" }
  ];

  if (loading) {
    return <Loading type="cards" />;
  }

  if (error) {
    return <Error message={error} onRetry={loadProjects} />;
  }

  if (showForm) {
    return (
      <ProjectForm
        project={editingProject}
        onSubmit={handleFormSubmit}
        onCancel={handleFormCancel}
      />
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
          <h1 className="text-2xl font-bold text-secondary-900">Projects</h1>
          <p className="text-secondary-600">Manage your construction projects</p>
        </div>
        <Button
          onClick={handleCreateProject}
          className="flex items-center space-x-2"
        >
          <ApperIcon name="Plus" className="w-4 h-4" />
          <span>New Project</span>
        </Button>
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

      {/* Projects Grid */}
      {filteredProjects.length === 0 ? (
        <Empty 
          type="projects"
          onAction={handleCreateProject}
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProjects.map((project) => (
            <ProjectCard
              key={project.Id}
              project={project}
              onEdit={handleEditProject}
              onDelete={handleDeleteProject}
            />
          ))}
        </div>
      )}
    </motion.div>
  );
};

export default ProjectsPage;