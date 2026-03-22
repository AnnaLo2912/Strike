import { createContext, useState, useContext, useEffect } from 'react';
import boardService from '../services/boardService';
import taskService from '../services/taskService';
import habitService from '../services/habitService';

const AppContext = createContext();

export const AppProvider = ({ children }) => {
  const [boards, setBoards] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [habits, setHabits] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  // Load initial data
  useEffect(() => {
    loadAllData();
  }, []);

  const loadAllData = async () => {
    try {
      const [boardsData, tasksData, habitsData, statsData] = await Promise.all([
        boardService.getAll(),
        taskService.getAll(),
        habitService.getAll(),
        taskService.getStats()
      ]);

      setBoards(boardsData.data);
      setTasks(tasksData.data);
      setHabits(habitsData.data);
      setStats(statsData.data);
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
    }
  };

  // Board actions
  const addBoard = async (boardData) => {
    const response = await boardService.create(boardData);
    setBoards([response.data, ...boards]);
    return response.data;
  };

  const updateBoard = async (id, boardData) => {
    const response = await boardService.update(id, boardData);
    setBoards(boards.map(b => b._id === id ? response.data : b));
    return response.data;
  };

  const deleteBoard = async (id) => {
    await boardService.delete(id);
    setBoards(boards.filter(b => b._id !== id));
  };

  // Task actions
  const addTask = async (taskData) => {
    const response = await taskService.create(taskData);
    setTasks([response.data, ...tasks]);
    await refreshStats();
    return response.data;
  };

  const updateTask = async (id, taskData) => {
    const response = await taskService.update(id, taskData);
    setTasks(tasks.map(t => t._id === id ? response.data : t));
    await refreshStats();
    return response.data;
  };

  const deleteTask = async (id) => {
    await taskService.delete(id);
    setTasks(tasks.filter(t => t._id !== id));
    await refreshStats();
  };

  // Habit actions
  const addHabit = async (habitData) => {
    const response = await habitService.create(habitData);
    setHabits([response.data, ...habits]);
    return response.data;
  };

  const markHabitComplete = async (id) => {
    const response = await habitService.markComplete(id);
    setHabits(habits.map(h => h._id === id ? response.data : h));
    return response.data;
  };

  const deleteHabit = async (id) => {
    await habitService.delete(id);
    setHabits(habits.filter(h => h._id !== id));
  };

  const refreshStats = async () => {
    const statsData = await taskService.getStats();
    setStats(statsData.data);
  };

  const value = {
    boards,
    tasks,
    habits,
    stats,
    loading,
    addBoard,
    updateBoard,
    deleteBoard,
    addTask,
    updateTask,
    deleteTask,
    addHabit,
    markHabitComplete,
    deleteHabit,
    refreshStats
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within AppProvider');
  }
  return context;
};

export default AppContext;