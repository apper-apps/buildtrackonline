import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { toast } from "react-toastify";
import StaffCard from "@/components/molecules/StaffCard";
import StaffForm from "@/components/organisms/StaffForm";
import SearchBar from "@/components/molecules/SearchBar";
import Button from "@/components/atoms/Button";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import Empty from "@/components/ui/Empty";
import ApperIcon from "@/components/ApperIcon";
import staffService from "@/services/api/staffService";

const StaffPage = () => {
  const [staff, setStaff] = useState([]);
  const [filteredStaff, setFilteredStaff] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [editingStaff, setEditingStaff] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [roleFilter, setRoleFilter] = useState("");

  const loadStaff = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await staffService.getAll();
      setStaff(data);
      setFilteredStaff(data);
    } catch (err) {
      setError(err.message);
      toast.error("Failed to load staff");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadStaff();
  }, []);

  useEffect(() => {
    let filtered = staff;

    if (searchTerm) {
      filtered = filtered.filter(member =>
        member.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        member.role.toLowerCase().includes(searchTerm.toLowerCase()) ||
        member.skills?.some(skill => skill.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }

    if (roleFilter) {
      filtered = filtered.filter(member => member.role === roleFilter);
    }

    setFilteredStaff(filtered);
  }, [staff, searchTerm, roleFilter]);

  const handleCreateStaff = () => {
    setEditingStaff(null);
    setShowForm(true);
  };

  const handleEditStaff = (staffMember) => {
    setEditingStaff(staffMember);
    setShowForm(true);
  };

  const handleDeleteStaff = async (staffMember) => {
    if (window.confirm(`Are you sure you want to remove "${staffMember.name}"?`)) {
      try {
        await staffService.delete(staffMember.Id);
        setStaff(prev => prev.filter(s => s.Id !== staffMember.Id));
        toast.success("Staff member removed successfully");
      } catch (err) {
        toast.error("Failed to remove staff member");
      }
    }
  };

  const handleFormSubmit = async (staffData) => {
    try {
      if (editingStaff) {
        const updated = await staffService.update(editingStaff.Id, staffData);
        setStaff(prev => 
          prev.map(s => s.Id === editingStaff.Id ? updated : s)
        );
      } else {
        const created = await staffService.create(staffData);
        setStaff(prev => [...prev, created]);
      }
      setShowForm(false);
      setEditingStaff(null);
    } catch (err) {
      throw err;
    }
  };

  const handleFormCancel = () => {
    setShowForm(false);
    setEditingStaff(null);
  };

  const handleSearch = (term) => {
    setSearchTerm(term);
  };

  const roleOptions = [
    { value: "foreman", label: "Foreman" },
    { value: "electrician", label: "Electrician" },
    { value: "plumber", label: "Plumber" },
    { value: "carpenter", label: "Carpenter" },
    { value: "mason", label: "Mason" },
    { value: "painter", label: "Painter" },
    { value: "roofer", label: "Roofer" },
    { value: "laborer", label: "General Laborer" },
    { value: "operator", label: "Equipment Operator" },
    { value: "supervisor", label: "Site Supervisor" }
  ];

  if (loading) {
    return <Loading type="cards" />;
  }

  if (error) {
    return <Error message={error} onRetry={loadStaff} />;
  }

  if (showForm) {
    return (
      <StaffForm
        staff={editingStaff}
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
          <h1 className="text-2xl font-bold text-secondary-900">Staff Management</h1>
          <p className="text-secondary-600">Manage your team members and track availability</p>
        </div>
        <Button
          onClick={handleCreateStaff}
          className="flex items-center space-x-2"
        >
          <ApperIcon name="Plus" className="w-4 h-4" />
          <span>Add Staff</span>
        </Button>
      </div>

      {/* Search and Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1">
          <SearchBar
            placeholder="Search staff..."
            onSearch={handleSearch}
          />
        </div>
        <div className="w-full sm:w-48">
          <select
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
            className="w-full px-3 py-2 border border-secondary-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
          >
            <option value="">All Roles</option>
            {roleOptions.map(option => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Staff Grid */}
      {filteredStaff.length === 0 ? (
        <Empty 
          type="staff"
          onAction={handleCreateStaff}
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredStaff.map((staffMember) => (
            <StaffCard
              key={staffMember.Id}
              staff={staffMember}
              onClick={() => handleEditStaff(staffMember)}
            />
          ))}
        </div>
      )}
    </motion.div>
  );
};

export default StaffPage;