import Task from "../models/Task.js";
import { encrypt, decrypt } from "../utils/encryption.js";

export const createTask = async (req, res, next) => {
  try {
    const { title, description } = req.body;

    const encryptedDesc = encrypt(description);

    const task = await Task.create({
      userId: req.user,
      title,
      description: encryptedDesc
    });

    res.status(201).json(task);
  } catch (error) {
    next(error);
  }
};

export const getTasks = async (req, res, next) => {
  try {
    const { page = 1, limit = 10, status, search } = req.query;

    const query = { userId: req.user };

    if (status) query.status = status;
    if (search) query.title = { $regex: search, $options: "i" };

    const tasks = await Task.find(query)
      .skip((page - 1) * limit)
      .limit(Number(limit))
      .sort({ createdAt: -1 });

    const decryptedTasks = tasks.map(task => ({
      ...task._doc,
      description: decrypt(task.description)
    }));

    res.json(decryptedTasks);
  } catch (error) {
    next(error);
  }
};

export const updateTask = async (req, res, next) => {
  try {
    const task = await Task.findOne({
      _id: req.params.id,
      userId: req.user
    });

    if (!task) {
      res.status(404);
      throw new Error("Task not found");
    }

    task.title = req.body.title || task.title;
    task.status = req.body.status || task.status;

    if (req.body.description) {
      task.description = encrypt(req.body.description);
    }

    const updatedTask = await task.save();
    res.json(updatedTask);

  } catch (error) {
    next(error);
  }
};

export const deleteTask = async (req, res, next) => {
  try {
    const task = await Task.findOne({
      _id: req.params.id,
      userId: req.user
    });

    if (!task) {
      res.status(404);
      throw new Error("Task not found");
    }

    await task.deleteOne();

    res.json({ message: "Task removed" });

  } catch (error) {
    next(error);
  }
};