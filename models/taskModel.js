class TaskModel {
  constructor(db) {
    this.collection = db.collection('Tasks');
  }

  async getAllTasks() {
    return this.collection.find({}).sort({ _id: -1 }).toArray();
  }

  capitalizeWords(str) {
    if (!str) return str;
    return str.replace(/\w\S*/g, (w) => w.replace(/^\w/, (c) => c.toUpperCase()));
  }

  async addTask(taskData) {
    // Capitalize each word in task, comments, and projectName
    const formattedTaskData = {
      ...taskData,
      task: this.capitalizeWords(taskData.task),
      comments: this.capitalizeWords(taskData.comments),
      projectName: this.capitalizeWords(taskData.projectName),
    };
    // Add isActive and timestamp fields
    const newTask = {
      ...formattedTaskData,
      isActive: true,
      timestamp: new Date(),
    };
    const result = await this.collection.insertOne(newTask);
    return result.ops ? result.ops[0] : newTask;
  }

  async updateTask(id, updateData) {
    // Allow updating isActive and timestamp if provided
    await this.collection.updateOne(
      { _id: id },
      { $set: { ...updateData } }
    );
    return this.collection.findOne({ _id: id });
  }
}

module.exports = TaskModel;
