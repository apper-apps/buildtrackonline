import mockStaff from "@/services/mockData/staff.json";

// Simulate API delay
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

const staffService = {
  async getAll() {
    await delay(300);
    return [...mockStaff];
  },

  async getById(id) {
    await delay(200);
    const member = mockStaff.find(s => s.Id === id);
    if (!member) {
      throw new Error("Staff member not found");
    }
    return { ...member };
  },

  async create(staffData) {
    await delay(500);
    const newStaff = {
      ...staffData,
      Id: Math.max(...mockStaff.map(s => s.Id), 0) + 1,
      availability: [],
      assignments: []
    };
    mockStaff.push(newStaff);
    return { ...newStaff };
  },

  async update(id, staffData) {
    await delay(400);
    const index = mockStaff.findIndex(s => s.Id === id);
    if (index === -1) {
      throw new Error("Staff member not found");
    }
    
    const updatedStaff = {
      ...mockStaff[index],
      ...staffData,
      Id: id
    };
    
    mockStaff[index] = updatedStaff;
    return { ...updatedStaff };
  },

  async delete(id) {
    await delay(300);
    const index = mockStaff.findIndex(s => s.Id === id);
    if (index === -1) {
      throw new Error("Staff member not found");
    }
    
    mockStaff.splice(index, 1);
    return true;
  }
};

export default staffService;