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
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [classroomDeadlines, setClassroomDeadlines] = useState([]);

  // Check if user is authenticated before loading data
  useEffect(() => {
    const token = localStorage.getItem('token');
    const user = localStorage.getItem('user');
    
    if (token && user) {
      setIsAuthenticated(true);
      loadAllData();
    } else {
      setLoading(false);
      // Clear notifications when not authenticated
      setNotifications([]);
      setBoards([]);
      setTasks([]);
      setHabits([]);
      setStats(null);
    }
  }, []);

  // Clear notifications when token is removed (logout)
  useEffect(() => {
    const checkAuth = () => {
      const token = localStorage.getItem('token');
      if (!token) {
        setNotifications([]);
      }
    };
    
    // Listen for storage changes (covers logout)
    window.addEventListener('storage', checkAuth);
    return () => window.removeEventListener('storage', checkAuth);
  }, []);

  const loadAllData = async () => {
    try {
      const results = await Promise.allSettled([
        boardService.getAll(),
        taskService.getAll(),
        habitService.getAll(),
        taskService.getStats()
      ]);

      const boards = results[0].status === 'fulfilled' ? (results[0].value?.data?.data || []) : [];
      const tasks = results[1].status === 'fulfilled' ? (results[1].value?.data?.data || []) : [];
      const habits = results[2].status === 'fulfilled' ? (results[2].value?.data?.data || []) : [];
      const stats = results[3].status === 'fulfilled' ? (results[3].value?.data?.data || null) : null;

      setBoards(boards);
      setTasks(tasks);
      setHabits(habits);
      setStats(stats);

      // Check for deadline notifications (only from tasks now)
      checkDeadlineNotifications(tasks, habits);
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
    }
  };

  // Board actions
  const addBoard = async (boardData) => {
    const response = await boardService.create(boardData);
    const newBoard = response?.data?.data || response?.data || response;
    if (newBoard && newBoard._id) {
      setBoards([newBoard, ...boards]);
    }
    return newBoard;
  };

  const updateBoard = async (id, boardData) => {
    const response = await boardService.update(id, boardData);
    const updatedBoard = response?.data?.data || response?.data || response;
    if (updatedBoard) {
      setBoards(boards.map(b => b._id === id ? updatedBoard : b));
    }
    return updatedBoard;
  };

  const deleteBoard = async (id) => {
    await boardService.delete(id);
    setBoards(boards.filter(b => b._id !== id));
  };

  // Task actions
  const addTask = async (taskData) => {
    const response = await taskService.create(taskData);
    const newTask = response?.data?.data || response?.data || response;
    if (newTask && newTask._id) {
      setTasks([newTask, ...tasks]);
      await refreshStats();
    }
    return newTask;
  };

  const updateTask = async (id, taskData) => {
    const response = await taskService.update(id, taskData);
    const updatedTask = response?.data?.data || response?.data || response;
    if (updatedTask) {
      setTasks(tasks.map(t => t._id === id ? updatedTask : t));
      await refreshStats();
    }
    return updatedTask;
  };

  const deleteTask = async (id) => {
    await taskService.delete(id);
    setTasks(tasks.filter(t => t._id !== id));
    await refreshStats();
  };

  // Habit actions
  const addHabit = async (habitData) => {
    const response = await habitService.create(habitData);
    const newHabit = response?.data?.data || response?.data || response;
    if (newHabit && newHabit._id) {
      setHabits([newHabit, ...habits]);
    }
    return newHabit;
  };

  const markHabitComplete = async (id) => {
    const response = await habitService.markComplete(id);
    const updatedHabit = response?.data?.data || response?.data || response;
    if (updatedHabit) {
      setHabits(habits.map(h => h._id === id ? updatedHabit : h));
    }
    return updatedHabit;
  };

  const deleteHabit = async (id) => {
    await habitService.delete(id);
    setHabits(habits.filter(h => h._id !== id));
  };

  const refreshStats = async () => {
    try {
      const statsRes = await taskService.getStats();
      setStats(statsRes?.data?.data || null);
    } catch (error) {
      console.error('Error refreshing stats:', error);
    }
  };

  const checkDeadlineNotifications = (tasks, habits) => {
    // Only show notifications when authenticated
    const token = localStorage.getItem('token');
    if (!token) {
      setNotifications([]);
      return;
    }

    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    
    const newNotifications = [];

    // Check task deadlines - only due TODAY or overdue
    tasks.forEach(task => {
      if (task.status === 'completed') return;
      if (!task.dueDate) return;
      
      const dueDate = new Date(task.dueDate);
      dueDate.setHours(23, 59, 59, 999); // End of day
      
      // Only show if due today or overdue
      if (dueDate < today) {
        // Overdue
        newNotifications.push({
          id: `task-overdue-${task._id}`,
          type: 'task-overdue',
          title: 'Task Overdue',
          message: `"${task.title}" is past due`,
          urgent: true
        });
      } else if (dueDate <= tomorrow) {
        // Due today
        const hoursLeft = Math.round((dueDate - now) / (1000 * 60 * 60));
        newNotifications.push({
          id: `task-${task._id}`,
          type: 'task',
          title: 'Task Due Today',
          message: hoursLeft <= 0 
            ? `"${task.title}" is due now!` 
            : `"${task.title}" due in ${hoursLeft} hour${hoursLeft !== 1 ? 's' : ''}`,
          urgent: true
        });
      }
    });

    setNotifications(newNotifications);
  };

  const clearNotification = (id) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  const clearAllNotifications = () => {
    setNotifications([]);
  };

  const updateClassroomDeadlines = (deadlines) => {
    setClassroomDeadlines(deadlines);
    // Also check for notifications when deadlines are updated
    checkDeadlineNotificationsWithClassroom(deadlines);
  };

  const checkDeadlineNotificationsWithClassroom = (classroomDeadlines) => {
    const token = localStorage.getItem('token');
    if (!token) return;

    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    
    const newNotifications = [];

    // Check task deadlines
    tasks.forEach(task => {
      if (task.status === 'completed') return;
      if (!task.dueDate) return;
      
      const dueDate = new Date(task.dueDate);
      dueDate.setHours(23, 59, 59, 999);
      
      if (dueDate < today) {
        newNotifications.push({
          id: `task-overdue-${task._id}`,
          type: 'task-overdue',
          title: 'Task Overdue',
          message: `"${task.title}" is past due`,
          urgent: true
        });
      } else if (dueDate <= tomorrow) {
        const hoursLeft = Math.round((dueDate - now) / (1000 * 60 * 60));
        newNotifications.push({
          id: `task-${task._id}`,
          type: 'task',
          title: 'Task Due Today',
          message: hoursLeft <= 0 
            ? `"${task.title}" is due now!` 
            : `"${task.title}" due in ${hoursLeft} hour${hoursLeft !== 1 ? 's' : ''}`,
          urgent: true
        });
      }
    });

    // Check classroom deadlines - only when user is connected
    if (classroomDeadlines && classroomDeadlines.length > 0) {
      classroomDeadlines.forEach(deadline => {
        const dueDate = new Date(deadline.dueDate);
        dueDate.setHours(23, 59, 59, 999);
        
        if (dueDate < today) {
          newNotifications.push({
            id: `classroom-overdue-${deadline.id}`,
            type: 'classroom-overdue',
            title: 'Deadline Overdue',
            message: `${deadline.title} (${deadline.course}) is past due`,
            urgent: true
          });
        } else if (dueDate <= tomorrow) {
          const hoursLeft = Math.round((dueDate - now) / (1000 * 60 * 60));
          newNotifications.push({
            id: `classroom-${deadline.id}`,
            type: 'classroom',
            title: 'Deadline Today',
            message: hoursLeft <= 0 
              ? `${deadline.title} due now!` 
              : `${deadline.title} (${deadline.course}) due in ${hoursLeft} hour${hoursLeft !== 1 ? 's' : ''}`,
            urgent: true
          });
        }
      });
    }

    setNotifications(newNotifications);
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
    refreshStats,
    notifications,
    clearNotification,
    clearAllNotifications,
    classroomDeadlines,
    setClassroomDeadlines,
    updateClassroomDeadlines
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