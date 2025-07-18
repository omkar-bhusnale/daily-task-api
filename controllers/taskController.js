const TaskModel = require('../models/taskModel');

let taskModel;

function setDB(db) {
  taskModel = new TaskModel(db);
}

const getAllTasks = async (req, res, next) => {
  try {
    const tasks = await taskModel.getAllTasks();
    res.json(tasks);
  } catch (err) {
    next(err);
  }
};

const addTask = async (req, res, next) => {
  try {
    const { userName, projectName, task, status, comments, date } = req.body;
    const newTask = { userName, projectName, task, status, comments, date };
    const result = await taskModel.addTask(newTask);
    res.json(result);
  } catch (err) {
    next(err);
  }
};

const updateTask = async (req, res, next) => {
  try {
    const id = req.params.id;
    const { userName, projectName, task, status, comments, date } = req.body;
    const updateData = { userName, projectName, task, status, comments, date };
    const updatedTask = await taskModel.updateTask(id, updateData);
    res.json(updatedTask);
  } catch (err) {
    next(err);
  }
};

module.exports = { setDB, getAllTasks, addTask, updateTask };
