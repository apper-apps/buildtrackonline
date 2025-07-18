import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { toast } from "react-toastify";
import Timeline from "@/components/organisms/Timeline";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import Empty from "@/components/ui/Empty";
import projectsService from "@/services/api/projectsService";
import staffService from "@/services/api/staffService";
import assignmentsService from "@/services/api/assignmentsService";

const TimelinePage = () => {
  const [projects, setProjects] = useState([]);
  const [staff, setStaff] = useState([]);
  const [assignments, setAssignments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

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
      toast.error("Failed to load timeline data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleAssignmentCreate = async (newAssignment) => {
    try {
      const createdAssignment = await assignmentsService.create(newAssignment);
      setAssignments(prev => [...prev, createdAssignment]);
      toast.success("Staff member assigned successfully");
    } catch (err) {
      toast.error("Failed to create assignment");
    }
  };

  const handleAssignmentChange = async (updatedAssignment) => {
    try {
      const updated = await assignmentsService.update(updatedAssignment.Id, updatedAssignment);
      setAssignments(prev => 
        prev.map(assignment => 
          assignment.Id === updatedAssignment.Id ? updated : assignment
        )
      );
      toast.success("Assignment updated successfully");
    } catch (err) {
      toast.error("Failed to update assignment");
    }
  };

  const handleAssignmentDelete = async (assignmentId) => {
    try {
      await assignmentsService.delete(assignmentId);
      setAssignments(prev => prev.filter(assignment => assignment.Id !== assignmentId));
      toast.success("Assignment deleted successfully");
    } catch (err) {
      toast.error("Failed to delete assignment");
    }
  };

  if (loading) {
    return <Loading type="timeline" />;
  }

  if (error) {
    return <Error message={error} onRetry={loadData} />;
  }

  if (projects.length === 0 && staff.length === 0) {
    return (
      <Empty 
        type="timeline"
        title="No data available"
        description="Create projects and add staff members to start using the timeline."
        actionLabel="Get Started"
        onAction={() => window.location.href = "/projects"}
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
      <Timeline
        projects={projects}
        staff={staff}
        assignments={assignments}
        onAssignmentCreate={handleAssignmentCreate}
        onAssignmentChange={handleAssignmentChange}
        onAssignmentDelete={handleAssignmentDelete}
      />
    </motion.div>
  );
};

export default TimelinePage;