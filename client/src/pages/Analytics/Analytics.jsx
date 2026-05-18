import { useState, useEffect } from 'react';
import Sidebar from '../../components/Layout/Sidebar';
import { useApp } from '../../context/AppContext';
import { useTheme } from '../../components/theme-provider';
import { 
  BarChart3,
  Calendar,
  Target,
  Clock,
  Zap,
  Activity,
  Flame,
  CheckCircle,
  AlertCircle,
  TrendingUp
} from 'lucide-react';

const AnalyticsCard = ({ title, value, icon: Icon, gradient }) => (
  <div className={`p-6 bg-[var(--bg-secondary)] border border-[var(--border-color)] ${gradient || ''}`}>
    <div className="flex items-center justify-between mb-4">
      <div className="w-10 h-10 bg-gradient-strike flex items-center justify-center">
        <Icon className="w-5 h-5 text-white" />
      </div>
    </div>
    <div className="text-sm text-[var(--text-tertiary)] mb-1">{title}</div>
    <div className="text-3xl font-display font-black">{value}</div>
  </div>
);

const ProgressBar = ({ label, value, max, color }) => {
  const percentage = max > 0 ? (value / max) * 100 : 0;
  return (
    <div className="mb-4">
      <div className="flex justify-between text-sm mb-1">
        <span className="text-[var(--text-secondary)]">{label}</span>
        <span className="font-bold text-[var(--text-primary)]">{value} / {max}</span>
      </div>
      <div className="h-2 bg-[var(--bg-tertiary)]">
        <div 
          className={`h-full ${color}`} 
          style={{ width: `${Math.min(percentage, 100)}%` }}
        />
      </div>
    </div>
  );
};

const MiniChart = ({ data, color }) => {
  const maxVal = Math.max(...data, 1);
  return (
    <div className="flex items-end gap-1 h-16">
      {data.map((val, i) => (
        <div 
          key={i} 
          className={`flex-1 ${color}`}
          style={{ height: `${(val / maxVal) * 100}%` }}
        />
      ))}
    </div>
  );
};

const Analytics = () => {
  const { tasks, boards, habits, stats, loading: appLoading } = useApp();
  const { theme } = useTheme();
  const [timeRange, setTimeRange] = useState('week');

  // Safe fallback for undefined data
  const safeTasks = Array.isArray(tasks) ? tasks : [];
  const safeBoards = Array.isArray(boards) ? boards : [];
  const safeHabits = Array.isArray(habits) ? habits : [];

  // Calculate analytics - safe with empty arrays
  const totalTasks = safeTasks.length;
  const completedTasks = safeTasks.filter(t => t.status === 'completed').length;
  const inProgressTasks = safeTasks.filter(t => t.status === 'in-progress').length;
  const todoTasks = safeTasks.filter(t => t.status === 'todo').length;
  
  const completionRate = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;
  
  // Priority breakdown
  const highPriority = safeTasks.filter(t => t.priority === 'high').length;
  const mediumPriority = safeTasks.filter(t => t.priority === 'medium').length;
  const lowPriority = safeTasks.filter(t => t.priority === 'low').length;

  // Overdue tasks
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const overdueTasks = safeTasks.filter(t => {
    if (!t.dueDate || t.status === 'completed') return false;
    return new Date(t.dueDate) < today;
  });

  // Board distribution
  const tasksByBoard = safeBoards.map(board => ({
    name: board.name,
    count: safeTasks.filter(t => t.board?._id === board._id || t.board === board._id).length,
    color: board.color
  }));

  // Weekly/Monthly/Yearly completion data - calculate from actual tasks based on timeRange
  const [completionData, setCompletionData] = useState([0, 0, 0, 0, 0, 0, 0]);
  const [dataLabels, setDataLabels] = useState(['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']);

  useEffect(() => {
    try {
      if (!safeTasks || safeTasks.length === 0) {
        if (timeRange === 'week') {
          setCompletionData([0, 0, 0, 0, 0, 0, 0]);
          setDataLabels(['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']);
        } else if (timeRange === 'month') {
          setCompletionData([0, 0, 0, 0]);
          setDataLabels(['Week 1', 'Week 2', 'Week 3', 'Week 4']);
        } else {
          setCompletionData([0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]);
          setDataLabels(['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']);
        }
        return;
      }
      
      if (timeRange === 'week') {
        const last7Days = [];
        const labels = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
        for (let i = 6; i >= 0; i--) {
          const date = new Date();
          date.setDate(date.getDate() - i);
          date.setHours(0, 0, 0, 0);
          
          const dayTasks = safeTasks.filter(t => {
            if (!t.completedAt) return false;
            try {
              const completedDate = new Date(t.completedAt);
              completedDate.setHours(0, 0, 0, 0);
              return completedDate.getTime() === date.getTime();
            } catch (e) {
              return false;
            }
          });
          
          last7Days.push(dayTasks.length);
        }
        setCompletionData(last7Days);
        setDataLabels(labels);
      } else if (timeRange === 'month') {
        const weeks = [0, 0, 0, 0];
        const labels = ['Week 1', 'Week 2', 'Week 3', 'Week 4'];
        for (let i = 0; i < 4; i++) {
          const weekStart = new Date();
          weekStart.setDate(weekStart.getDate() - (i * 7 + 7));
          const weekEnd = new Date();
          weekEnd.setDate(weekEnd.getDate() - (i * 7));
          
          const weekTasks = safeTasks.filter(t => {
            if (!t.completedAt) return false;
            try {
              const completedDate = new Date(t.completedAt);
              return completedDate >= weekStart && completedDate < weekEnd;
            } catch (e) {
              return false;
            }
          });
          
          weeks[3 - i] = weekTasks.length;
        }
        setCompletionData(weeks);
        setDataLabels(labels);
      } else {
        const months = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
        const labels = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
        const currentMonth = new Date().getMonth();
        
        for (let i = 0; i < 12; i++) {
          const monthStart = new Date();
          monthStart.setMonth(currentMonth - (11 - i));
          monthStart.setDate(1);
          monthStart.setHours(0, 0, 0, 0);
          
          const monthEnd = new Date(monthStart);
          monthEnd.setMonth(monthEnd.getMonth() + 1);
          
          const monthTasks = safeTasks.filter(t => {
            if (!t.completedAt) return false;
            try {
              const completedDate = new Date(t.completedAt);
              return completedDate >= monthStart && completedDate < monthEnd;
            } catch (e) {
              return false;
            }
          });
          
          months[i] = monthTasks.length;
        }
        setCompletionData(months);
        setDataLabels(labels);
      }
    } catch (error) {
      console.error('Error calculating completion data:', error);
      setCompletionData([0, 0, 0, 0, 0, 0, 0]);
      setDataLabels(['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']);
    }
  }, [safeTasks, timeRange]);

  // Workload by priority
  const workloadData = [
    { label: 'High', value: highPriority, max: Math.max(highPriority, 1), color: 'bg-rose' },
    { label: 'Medium', value: mediumPriority, max: Math.max(mediumPriority, 1), color: 'bg-amber' },
    { label: 'Low', value: lowPriority, max: Math.max(lowPriority, 1), color: 'bg-emerald' },
  ];

  // Habit streaks - calculate actual streak from completedDates
  const calculateStreak = (completedDates) => {
    if (!completedDates || completedDates.length === 0) return 0;
    const sortedDates = completedDates.map(d => new Date(d).getTime()).sort((a, b) => b - a);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    let streak = 0;
    for (let i = 0; i < sortedDates.length; i++) {
      const checkDate = new Date(today);
      checkDate.setDate(checkDate.getDate() - i);
      if (sortedDates.includes(checkDate.getTime())) {
        streak++;
      } else if (i > 0) {
        break;
      }
    }
    return streak;
  };

  const habitStats = safeHabits.map(h => ({
    name: h.name,
    streak: calculateStreak(h.completedDates),
    completed: h.completedDates?.length || 0
  }));

  // Active streak - max streak across all habits
  const activeStreak = safeHabits.length > 0 
    ? Math.max(...safeHabits.map(h => calculateStreak(h.completedDates)))
    : 0;

  // Tasks due today
  const tasksDueToday = safeTasks.filter(t => {
    if (!t.dueDate || t.status === 'completed') return false;
    const due = new Date(t.dueDate);
    const now = new Date();
    return due.toDateString() === now.toDateString();
  }).length;

  // On track percentage
  const onTrackPercentage = totalTasks > 0 
    ? Math.round(((completedTasks + inProgressTasks) / totalTasks) * 100) 
    : 0;

  // Needs attention (overdue + high priority not done)
  const needsAttention = overdueTasks.length + highPriority;

  if (appLoading) {
    return (
      <div className="min-h-screen bg-[var(--bg-primary)] flex items-center justify-center">
        <div className="w-16 h-16 border-4 border-amber/30 border-t-amber rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[var(--bg-primary)] grain">
      <Sidebar />
      
      <div className="flex-1 lg:ml-64 p-6 lg:p-8 space-y-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-4xl font-display font-black text-[var(--text-primary)]">Analytics</h1>
            <p className="text-[var(--text-tertiary)]">Track your productivity trends and insights</p>
          </div>
          
          <div className="flex items-center gap-2 p-1 bg-[var(--bg-tertiary)]">
            {['week', 'month', 'year'].map((range) => (
              <button
                key={range}
                onClick={() => setTimeRange(range)}
                className={`px-4 py-2 text-sm font-medium transition-all ${
                  timeRange === range 
                    ? 'bg-gradient-strike text-white' 
                    : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
                }`}
              >
                {range.charAt(0).toUpperCase() + range.slice(1)}
              </button>
            ))}
          </div>
        </div>

        {/* Overview Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <AnalyticsCard 
            title="Total Tasks" 
            value={totalTasks} 
            icon={CheckCircle}
          />
          <AnalyticsCard 
            title="Completion Rate" 
            value={`${completionRate}%`} 
            icon={Target}
          />
          <AnalyticsCard 
            title="Overdue" 
            value={overdueTasks.length} 
            icon={AlertCircle}
          />
          <AnalyticsCard 
            title="Active Streak" 
            value={`${activeStreak} days`} 
            icon={Flame}
          />
        </div>

        {/* Main Charts Grid */}
        <div className="grid lg:grid-cols-2 gap-6">
          {/* Completion Chart */}
          <div className="p-6 bg-[var(--bg-secondary)] border border-[var(--border-color)]">
            <div className="flex items-center justify-between mb-6">
              <h3 className="font-display font-bold text-[var(--text-primary)]">
                {timeRange === 'week' ? 'Weekly Completion' : timeRange === 'month' ? 'Monthly Completion' : 'Yearly Completion'}
              </h3>
              <TrendingUp className="w-5 h-5 text-emerald" />
            </div>
            <MiniChart data={completionData} color="bg-gradient-to-t from-amber to-orange-400" />
            <div className="flex justify-between mt-2">
              {dataLabels.map((label, i) => (
                <span key={i} className="text-xs text-[var(--text-tertiary)]">{label}</span>
              ))}
            </div>
          </div>

          {/* Task Status Distribution */}
          <div className="p-6 bg-[var(--bg-secondary)] border border-[var(--border-color)]">
            <h3 className="font-display font-bold text-[var(--text-primary)] mb-6">Task Status</h3>
            
            <div className="space-y-4">
              <ProgressBar label="Completed" value={completedTasks} max={totalTasks} color="bg-emerald" />
              <ProgressBar label="In Progress" value={inProgressTasks} max={totalTasks} color="bg-cyan" />
              <ProgressBar label="To Do" value={todoTasks} max={totalTasks} color="bg-gray-400" />
            </div>

            <div className="flex justify-center gap-6 mt-6">
              {[
                { label: 'Done', value: completedTasks, color: 'bg-emerald' },
                { label: 'Active', value: inProgressTasks, color: 'bg-cyan' },
                { label: 'Pending', value: todoTasks, color: 'bg-gray-400' },
              ].map((item, i) => (
                <div key={i} className="flex items-center gap-2">
                  <div className={`w-3 h-3 ${item.color}`} />
                  <span className="text-sm text-[var(--text-secondary)]">{item.label}: {item.value}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Second Row */}
        <div className="grid lg:grid-cols-3 gap-6">
          {/* Priority Workload */}
          <div className="p-6 bg-[var(--bg-secondary)] border border-[var(--border-color)]">
            <h3 className="font-display font-bold text-[var(--text-primary)] mb-6">Priority Workload</h3>
            {workloadData.map((item, i) => (
              <ProgressBar 
                key={item.label} 
                label={item.label} 
                value={item.value} 
                max={totalTasks || 1} 
                color={item.color} 
              />
            ))}
            
            <div className="mt-4 p-3 bg-amber/10 border border-amber/20">
              <div className="flex items-center gap-2">
                <Zap className="w-4 h-4 text-amber" />
                <span className="text-sm text-amber">
                  {highPriority > 5 ? 'High workload - consider prioritizing' : 'Workload balanced'}
                </span>
              </div>
            </div>
          </div>

          {/* Board Distribution */}
          <div className="p-6 bg-[var(--bg-secondary)] border border-[var(--border-color)]">
            <h3 className="font-display font-bold text-[var(--text-primary)] mb-6">Tasks by Board</h3>
            {tasksByBoard.length === 0 ? (
              <p className="text-[var(--text-tertiary)] text-center py-8">No boards yet</p>
            ) : (
              <div className="space-y-3">
                {tasksByBoard.map((board, i) => (
                  <div key={i} className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3" style={{ backgroundColor: board.color || '#f59e0b' }} />
                      <span className="text-sm text-[var(--text-secondary)]">{board.name}</span>
                    </div>
                    <span className="font-bold text-[var(--text-primary)]">{board.count}</span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Overdue Tasks */}
          <div className="p-6 bg-[var(--bg-secondary)] border border-[var(--border-color)]">
            <h3 className="font-display font-bold text-[var(--text-primary)] mb-6">Upcoming Deadlines</h3>
            
            {overdueTasks.length === 0 ? (
              <div className="text-center py-8">
                <CheckCircle className="w-12 h-12 text-emerald mx-auto mb-3" />
                <p className="text-[var(--text-secondary)]">No overdue tasks!</p>
              </div>
            ) : (
              <div className="space-y-3">
                {overdueTasks.slice(0, 5).map((task, i) => (
                  <div key={i} className="flex items-center justify-between p-2 bg-rose/10 border border-rose/20">
                    <span className="text-sm text-[var(--text-primary)] truncate flex-1">{task.title}</span>
                    <span className="text-xs text-rose font-bold">Overdue</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Habit Streaks */}
        {safeHabits.length > 0 && (
          <div className="p-6 bg-[var(--bg-secondary)] border border-[var(--border-color)]">
            <h3 className="font-display font-bold text-[var(--text-primary)] mb-6">Habit Streaks</h3>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {safeHabits.map((habit, i) => (
                <div key={i} className="p-4 bg-[var(--bg-tertiary)]">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-medium text-[var(--text-primary)]">{habit.name}</span>
                    <span className="text-2xl">🔥</span>
                  </div>
                  <div className="flex items-baseline gap-2">
                    <span className="text-3xl font-display font-bold text-amber">{habit.completedDates?.length || 0}</span>
                    <span className="text-sm text-[var(--text-tertiary)]">days completed</span>
                  </div>
                  <div className="mt-2 h-1.5 bg-[var(--bg-primary)]">
                    <div 
                      className="h-full bg-gradient-to-r from-amber to-orange-400"
                      style={{ width: `${Math.min(((habit.completedDates?.length || 0) / 30) * 100, 100)}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Productivity Insights */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="p-4 bg-gradient-to-br from-emerald/10 to-cyan/10 border border-emerald/20">
            <Activity className="w-6 h-6 text-emerald mb-2" />
            <div className="text-sm text-[var(--text-secondary)]">Avg. Daily Tasks</div>
            <div className="text-2xl font-display font-bold text-emerald">
              {completionData.length > 0 ? Math.round(completionData.reduce((a, b) => a + b, 0) / completionData.length) : 0}
            </div>
          </div>
          
          <div className="p-4 bg-gradient-to-br from-amber/10 to-orange-10 border border-amber/20">
            <Clock className="w-6 h-6 text-amber mb-2" />
            <div className="text-sm text-[var(--text-secondary)]">Tasks Due Today</div>
            <div className="text-2xl font-display font-bold text-amber">
              {safeTasks.filter(t => {
                if (!t.dueDate || t.status === 'completed') return false;
                const due = new Date(t.dueDate);
                const now = new Date();
                return due.toDateString() === now.toDateString();
              }).length}
            </div>
          </div>
          
          <div className="p-4 bg-gradient-to-br from-violet/10 to-pink-10 border border-violet/20">
            <Target className="w-6 h-6 text-violet mb-2" />
            <div className="text-sm text-[var(--text-secondary)]">On Track</div>
            <div className="text-2xl font-display font-bold text-violet">
              {totalTasks > 0 ? Math.round(((completedTasks + inProgressTasks) / totalTasks) * 100) : 0}%
            </div>
          </div>
          
          <div className="p-4 bg-gradient-to-br from-rose/10 to-red-10 border border-rose/20">
            <AlertCircle className="w-6 h-6 text-rose mb-2" />
            <div className="text-sm text-[var(--text-secondary)]">Needs Attention</div>
            <div className="text-2xl font-display font-bold text-rose">
              {overdueTasks.length + highPriority}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Analytics;