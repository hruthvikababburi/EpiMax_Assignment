const express = require('express');
const router = express.Router();
const Task = require('../models/taskModel');
const authenticate = require('../middleware/authenticate')

// Create a task
router.post('/', authenticate, async (req, res) => {
  const { title, description, assignedTo } = req.body;
  const createdBy = req.user._id; // Get the ID of the user creating the task

  try {
    const task = new Task({ title, description, createdBy, assignedTo });
    await task.save();
    res.status(201).json(task);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Assign a task to a user
router.put('/:id/assign', authenticate, async (req, res) => {
  const taskId = req.params.id;
  const { assignedTo } = req.body;
  const createdBy = req.user._id; // Get the ID of the user assigning the task

  try {
    const task = await Task.findById(taskId);
    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }
    if (String(task.createdBy) !== String(createdBy)) {
      return res.status(403).json({ message: 'You are not authorized to assign this task' });
    }

    task.assignedTo = assignedTo;
    await task.save();
    res.json({ message: 'Task assigned successfully' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Update task status
router.put('/:id/status', authenticate, async (req, res) => {
  const taskId = req.params.id;
  const { status } = req.body;
  const userId = req.user._id; // Get the ID of the user updating the task status

  try {
    const task = await Task.findById(taskId);
    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }
    if (String(task.assignedTo) !== String(userId)) {
      return res.status(403).json({ message: 'You are not authorized to update the status of this task' });
    }

    task.status = status;
    await task.save();
    res.json({ message: 'Task status updated successfully' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});


//Delete a task
router.delete('/:id', authenticate, async (req, res) => {
    const taskId = req.params.id;
    const userId = req.user._id;
  
    try {
      const task = await Task.findById(taskId);
      if (!task) {
        return res.status(404).json({ message: 'Task not found' });
      }
      if (String(task.createdBy) !== String(userId)) {
        return res.status(403).json({ message: 'You are not authorized to delete this task' });
      }
  
      await Task.findByIdAndDelete(taskId);
      res.json({ message: 'Task deleted successfully' });
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  });
  
  module.exports = router;

// Get task summary
router.get('/summary', async (req, res) => {
  try {
    const summary = await Task.aggregate([
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 }
        }
      }
    ]);
    res.json(summary);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;