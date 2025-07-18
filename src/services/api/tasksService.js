import mockTasks from "@/services/mockData/tasks.json";

// Simulate API delay
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

const tasksService = {
  async getAll() {
    await delay(300);
    return [...mockTasks];
  },

  async getById(id) {
    await delay(200);
    const task = mockTasks.find(t => t.Id === id);
    if (!task) {
      throw new Error("Task not found");
    }
    return { ...task };
  },

  async create(taskData) {
    await delay(500);
    const newTask = {
      ...taskData,
      Id: Math.max(...mockTasks.map(t => t.Id), 0) + 1,
      createdDate: new Date().toISOString().split("T")[0]
    };
    mockTasks.push(newTask);
    return { ...newTask };
  },

  async update(id, taskData) {
    await delay(400);
    const index = mockTasks.findIndex(t => t.Id === id);
    if (index === -1) {
      throw new Error("Task not found");
    }
    
    const updatedTask = {
      ...mockTasks[index],
      ...taskData,
      Id: id
    };
    
    mockTasks[index] = updatedTask;
    return { ...updatedTask };
  },

  async delete(id) {
    await delay(300);
    const index = mockTasks.findIndex(t => t.Id === id);
    if (index === -1) {
      throw new Error("Task not found");
    }
    
    mockTasks.splice(index, 1);
    return true;
  }
};

export default tasksService;