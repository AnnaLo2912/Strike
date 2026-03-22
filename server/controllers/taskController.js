import Task from '../models/Task.js';

// Get all tasks for logged-in user
export const getTasks = async (req, res) => {
  try {
    const { board, status } = req.query;
    
    let query = { user: req.user.id };
    if (board) query.board = board;
    if (status) query.status = status;
    
    const tasks = await Task.find(query)
      .populate('board', 'name color')
      .sort({ createdAt: -1 });
    
    res.status(200).json({ success: true, data: tasks });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
};

// Get single task
export const getTask = async (req, res) => {
  try {
    const task = await Task.findOne({ _id: req.params.id, user: req.user.id })
      .populate('board', 'name color');
    
    if (!task) {
      return res.status(404).json({ success: false, message: 'Task not found' });
    }
    
    res.status(200).json({ success: true, data: task });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
};

// Create task
export const createTask = async (req, res) => {
  try {
    const { title, description, status, priority, dueDate, board } = req.body;
    
    const task = await Task.create({
      title,
      description,
      status,
      priority,
      dueDate,
      board,
      user: req.user.id
    });
    
    const populatedTask = await Task.findById(task._id).populate('board', 'name color');
    
    res.status(201).json({ success: true, data: populatedTask });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
};

// Update task
export const updateTask = async (req, res) => {
  try {
    const task = await Task.findOneAndUpdate(
      { _id: req.params.id, user: req.user.id },
      req.body,
      { new: true, runValidators: true }
    ).populate('board', 'name color');
    
    if (!task) {
      return res.status(404).json({ success: false, message: 'Task not found' });
    }
    
    res.status(200).json({ success: true, data: task });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
};

// Delete task
export const deleteTask = async (req, res) => {
  try {
    const task = await Task.findOneAndDelete({ _id: req.params.id, user: req.user.id });
    
    if (!task) {
      return res.status(404).json({ success: false, message: 'Task not found' });
    }
    
    res.status(200).json({ success: true, data: {} });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
};

// Get dashboard stats
export const getDashboardStats = async (req, res) => {
  try {
    const totalTasks = await Task.countDocuments({ user: req.user.id });
    const completedTasks = await Task.countDocuments({ user: req.user.id, status: 'completed' });
    const pendingTasks = await Task.countDocuments({ 
      user: req.user.id, 
      status: { $in: ['todo', 'in-progress'] } 
    });
    
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const todayTasks = await Task.find({
      user: req.user.id,
      dueDate: {
        $gte: today,
        $lt: new Date(today.getTime() + 24 * 60 * 60 * 1000)
      }
    }).populate('board', 'name color');
    
    const tasksByStatus = {
      todo: await Task.countDocuments({ user: req.user.id, status: 'todo' }),
      'in-progress': await Task.countDocuments({ user: req.user.id, status: 'in-progress' }),
      completed: await Task.countDocuments({ user: req.user.id, status: 'completed' })
    };
    
    res.status(200).json({
      success: true,
      data: {
        totalTasks,
        completedTasks,
        pendingTasks,
        todayTasks,
        tasksByStatus
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
};