import Habit from '../models/Habit.js';

// Get all habits
export const getHabits = async (req, res) => {
  try {
    const habits = await Habit.find({ user: req.user.id }).sort({ createdAt: -1 });
    res.status(200).json({ success: true, data: habits });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
};

// Create habit
export const createHabit = async (req, res) => {
  try {
    const { name, description, frequency } = req.body;
    
    const habitData = {
      name,
      description: description || undefined,
      frequency: frequency || 'daily',
      user: req.user.id
    };
    
    const habit = await Habit.create(habitData);
    
    res.status(201).json({ success: true, data: habit });
  } catch (error) {
    console.error('Error creating habit:', error);
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
};

// Mark habit as completed for today
export const markHabitComplete = async (req, res) => {
  try {
    const habit = await Habit.findOne({ _id: req.params.id, user: req.user.id });
    
    if (!habit) {
      return res.status(404).json({ success: false, message: 'Habit not found' });
    }
    
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    // Check if already completed today
    const alreadyCompleted = habit.completedDates.some(date => {
      const completedDate = new Date(date);
      completedDate.setHours(0, 0, 0, 0);
      return completedDate.getTime() === today.getTime();
    });
    
    if (!alreadyCompleted) {
      habit.completedDates.push(today);
      await habit.save();
    }
    
    res.status(200).json({ success: true, data: habit });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
};

// Delete habit
export const deleteHabit = async (req, res) => {
  try {
    const habit = await Habit.findOneAndDelete({ _id: req.params.id, user: req.user.id });
    
    if (!habit) {
      return res.status(404).json({ success: false, message: 'Habit not found' });
    }
    
    res.status(200).json({ success: true, data: {} });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
};