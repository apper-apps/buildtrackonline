import mockAssignments from "@/services/mockData/assignments.json";

// Simulate API delay
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

const assignmentsService = {
  async getAll() {
    await delay(300);
    return [...mockAssignments];
  },

  async getById(id) {
    await delay(200);
    const assignment = mockAssignments.find(a => a.Id === id);
    if (!assignment) {
      throw new Error("Assignment not found");
    }
    return { ...assignment };
  },

  async create(assignmentData) {
    await delay(500);
    const newAssignment = {
      ...assignmentData,
      Id: Math.max(...mockAssignments.map(a => a.Id), 0) + 1
    };
    mockAssignments.push(newAssignment);
    return { ...newAssignment };
  },

  async update(id, assignmentData) {
    await delay(400);
    const index = mockAssignments.findIndex(a => a.Id === id);
    if (index === -1) {
      throw new Error("Assignment not found");
    }
    
    const updatedAssignment = {
      ...mockAssignments[index],
      ...assignmentData,
      Id: id
    };
    
    mockAssignments[index] = updatedAssignment;
    return { ...updatedAssignment };
  },

  async delete(id) {
    await delay(300);
    const index = mockAssignments.findIndex(a => a.Id === id);
    if (index === -1) {
      throw new Error("Assignment not found");
    }
    
    mockAssignments.splice(index, 1);
    return true;
  }
};

export default assignmentsService;