import mockProjects from "@/services/mockData/projects.json";

// Simulate API delay
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

const projectsService = {
  async getAll() {
    await delay(300);
    return [...mockProjects];
  },

  async getById(id) {
    await delay(200);
    const project = mockProjects.find(p => p.Id === id);
    if (!project) {
      throw new Error("Project not found");
    }
    return { ...project };
  },

  async create(projectData) {
    await delay(500);
    const newProject = {
      ...projectData,
      Id: Math.max(...mockProjects.map(p => p.Id), 0) + 1,
      actualCost: 0,
      tasks: [],
      assignedStaff: []
    };
    mockProjects.push(newProject);
    return { ...newProject };
  },

  async update(id, projectData) {
    await delay(400);
    const index = mockProjects.findIndex(p => p.Id === id);
    if (index === -1) {
      throw new Error("Project not found");
    }
    
    const updatedProject = {
      ...mockProjects[index],
      ...projectData,
      Id: id
    };
    
    mockProjects[index] = updatedProject;
    return { ...updatedProject };
  },

  async delete(id) {
    await delay(300);
    const index = mockProjects.findIndex(p => p.Id === id);
    if (index === -1) {
      throw new Error("Project not found");
    }
    
    mockProjects.splice(index, 1);
    return true;
  }
};

export default projectsService;