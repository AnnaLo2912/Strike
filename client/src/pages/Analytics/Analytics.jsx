import { useState, useEffect } from 'react';
import Sidebar from '../../components/layout/Sidebar';
import { useApp } from '../../context/AppContext';
import { 
  BarChart3,
  Target,
  Clock,
  Flame,
  CheckCircle,
  AlertCircle,
  TrendingUp,
  Zap
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Badge } from '../../components/ui/badge';
import { Button } from '../../components/ui/button';

const AnalyticsCard = ({ title, value, icon: Icon, gradient }) => (
  <Card className="group hover:border-primary/20 transition-all">
    <CardContent className="p-5">
      <div className="flex items-start justify-between mb-3">
        <div className={`w-10 h-10 rounded-lg bg-gradient-to-br ${gradient} flex items-center justify-center group-hover:scale-105 transition-transform`}>
          <Icon className="w-5 h-5 text-white" />
        </div>
      </div>
      <div className="text-xs text-[var(--text-tertiary)] font-medium uppercase tracking-wider mb-1">{title}</div>
      <div className="text-2xl font-display font-bold text-[var(--text-primary)]">{value}</div>
    </CardContent>
  </Card>
);

const ProgressBar = ({ label, value, max, color }) => {
  const percentage = max > 0 ? (value / max) * 100 : 0;
  return (
    <div className="space-y-1.5">
      <div className="flex justify-between text-sm">
        <span className="text-[var(--text-tertiary)]">{label}</span>
        <span className="font-bold text-[var(--text-primary)] text-xs">{value} / {max}</span>
      </div>
      <div className="h-1.5 bg-[var(--bg-tertiary)] rounded-full overflow-hidden">
        <div 
          className={`h-full rounded-full ${color} transition-all`} 
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
          className={`flex-1 rounded-sm ${color}`}
          style={{ height: `${(val / maxVal) * 100}%` }}
        />
      ))}
    </div>
  );
};

const Analytics = () => {
  const { tasks, boards, habits, stats, loading: appLoading } = useApp();
  const [timeRange, setTimeRange] = useState('week');

  const safeTasks = Array.isArray(tasks) ? tasks : [];
  const safeBoards = Array.isArray(boards) ? boards : [];
  const safeHabits = Array.isArray(habits) ? habits : [];

  const totalTasks = safeTasks.length;
  const completedTasks = safeTasks.filter(t => t.status === 'completed').length;
  const inProgressTasks = safeTasks.filter(t => t.status === 'in-progress').length;
  const todoTasks = safeTasks.filter(t => t.status === 'todo').length;
  const completionRate = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;
  
  const highPriority = safeTasks.filter(t => t.priority === 'high').length;
  const mediumPriority = safeTasks.filter(t => t.priority === 'medium').length;
  const lowPriority = safeTasks.filter(t => t.priority === 'low').length;

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const overdueTasks = safeTasks.filter(t => {
    if (!t.dueDate || t.status === 'completed') return false;
    return new Date(t.dueDate) < today;
  });

  const tasksByBoard = safeBoards.map(board => ({
    name: board.name,
    count: safeTasks.filter(t => t.board?._id === board._id || t.board === board._id).length,
    color: board.color
  }));

  const [completionData, setCompletionData] = useState([0, 0, 0, 0, 0, 0, 0]);
  const [dataLabels, setDataLabels] = useState(['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']);

  useEffect(() => {
    try {
      if (!safeTasks || safeTasks.length === 0) {
        if (timeRange === 'week') {
          const emptyLabels = [];
          for (let i = 6; i >= 0; i--) {
            const d = new Date();
            d.setDate(d.getDate() - i);
            emptyLabels.push(d.toLocaleDateString('en-US', { weekday: 'short' }));
          }
          setCompletionData([0, 0, 0, 0, 0, 0, 0]);
          setDataLabels(emptyLabels);
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
        const labels = [];
        for (let i = 6; i >= 0; i--) {
          const date = new Date();
          date.setDate(date.getDate() - i);
          date.setHours(0, 0, 0, 0);
          labels.push(date.toLocaleDateString('en-US', { weekday: 'short' }));
          const dayTasks = safeTasks.filter(t => {
            if (!t.completedAt) return false;
            try {
              const completedDate = new Date(t.completedAt);
              completedDate.setHours(0, 0, 0, 0);
              return completedDate.getTime() === date.getTime();
            } catch (e) { return false; }
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
            } catch (e) { return false; }
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
            } catch (e) { return false; }
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

  const activeStreak = safeHabits.length > 0 
    ? Math.max(...safeHabits.map(h => calculateStreak(h.completedDates)))
    : 0;

  if (appLoading) {
    return (
      <div className="min-h-screen bg-[var(--bg-primary)] flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-primary/30 border-t-primary rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[var(--bg-primary)]">
      <Sidebar />
      
      <div className="flex-1 lg:ml-52 p-6 lg:p-8 space-y-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1">
            <h1 className="text-3xl font-display font-bold text-[var(--text-primary)] tracking-tight">Analytics</h1>
            <p className="text-[var(--text-tertiary)] text-sm">Track your productivity trends</p>
          </div>
          
          <div className="flex items-center gap-1 p-1 bg-[var(--bg-tertiary)] rounded-lg">
            {['week', 'month', 'year'].map((range) => (
              <Button
                key={range}
                variant={timeRange === range ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setTimeRange(range)}
                className="text-xs"
              >
                {range.charAt(0).toUpperCase() + range.slice(1)}
              </Button>
            ))}
          </div>
        </div>

        {/* Overview Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <AnalyticsCard title="Total Tasks" value={totalTasks} icon={CheckCircle} gradient="from-amber to-orange-600" />
          <AnalyticsCard title="Completion" value={`${completionRate}%`} icon={Target} gradient="from-emerald to-cyan" />
          <AnalyticsCard title="Overdue" value={overdueTasks.length} icon={AlertCircle} gradient="from-rose to-pink-600" />
          <AnalyticsCard title="Active Streak" value={`${activeStreak}d`} icon={Flame} gradient="from-orange-500 to-amber" />
        </div>

        {/* Main Charts */}
        <div className="grid lg:grid-cols-2 gap-4">
          <Card>
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-display font-bold">
                  {timeRange === 'week' ? 'Weekly' : timeRange === 'month' ? 'Monthly' : 'Yearly'} Completion
                </CardTitle>
                <TrendingUp className="w-4 h-4 text-[#22c55e]" />
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              <MiniChart data={completionData} color="bg-gradient-to-t from-primary to-orange-400" />
              <div className="flex justify-between">
                {dataLabels.map((label, i) => (
                  <span key={i} className="text-[10px] text-[var(--text-tertiary)]">{label}</span>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-display font-bold">Task Status</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <ProgressBar label="Completed" value={completedTasks} max={totalTasks} color="bg-emerald" />
              <ProgressBar label="In Progress" value={inProgressTasks} max={totalTasks} color="bg-cyan" />
              <ProgressBar label="To Do" value={todoTasks} max={totalTasks} color="bg-[var(--bg-tertiary)]" />
              
              <div className="flex justify-center gap-4 pt-2">
                {[
                  { label: 'Done', value: completedTasks, color: 'bg-emerald' },
                  { label: 'Active', value: inProgressTasks, color: 'bg-cyan' },
                  { label: 'Pending', value: todoTasks, color: 'bg-[var(--bg-tertiary)]' },
                ].map((item, i) => (
                  <div key={i} className="flex items-center gap-1.5">
                    <div className={`w-2 h-2 rounded-full ${item.color}`} />
                    <span className="text-xs text-[var(--text-tertiary)]">{item.label}: {item.value}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Second Row */}
        <div className="grid lg:grid-cols-3 gap-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-display font-bold">Priority Workload</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <ProgressBar label="High" value={highPriority} max={totalTasks || 1} color="bg-rose" />
              <ProgressBar label="Medium" value={mediumPriority} max={totalTasks || 1} color="bg-amber" />
              <ProgressBar label="Low" value={lowPriority} max={totalTasks || 1} color="bg-emerald" />
              
              <div className="p-2.5 bg-[rgba(20,184,166,0.1)] border border-primary/10 rounded-lg mt-2">
                <div className="flex items-center gap-2">
                  <Zap className="w-3.5 h-3.5 text-[#14b8a6]" />
                  <span className="text-xs text-[var(--text-tertiary)]">
                    {highPriority > 5 ? 'High workload — consider prioritizing' : 'Workload balanced'}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-display font-bold">Tasks by Board</CardTitle>
            </CardHeader>
            <CardContent>
              {tasksByBoard.length === 0 ? (
                <p className="text-[var(--text-tertiary)] text-center py-6 text-sm">No boards yet</p>
              ) : (
                <div className="space-y-2.5">
                  {tasksByBoard.map((board, i) => (
                    <div key={i} className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: board.color || '#14b8a6' }} />
                        <span className="text-sm text-[var(--text-tertiary)]">{board.name}</span>
                      </div>
                      <span className="font-bold text-[var(--text-primary)] text-sm">{board.count}</span>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-display font-bold">Overdue Tasks</CardTitle>
            </CardHeader>
            <CardContent>
              {overdueTasks.length === 0 ? (
                <div className="text-center py-6">
                  <CheckCircle className="w-8 h-8 text-[#22c55e] mx-auto mb-2" />
                  <p className="text-sm text-[var(--text-tertiary)]">No overdue tasks!</p>
                </div>
              ) : (
                <div className="space-y-2">
                  {overdueTasks.slice(0, 5).map((task, i) => (
                    <div key={i} className="flex items-center justify-between p-2 bg-destructive/5 border border-destructive/10 rounded-lg">
                      <span className="text-sm text-[var(--text-primary)] truncate flex-1">{task.title}</span>
                      <Badge variant="outline" className="text-[10px] text-destructive border-destructive/20 ml-2">Overdue</Badge>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Habit Streaks */}
        {safeHabits.length > 0 && (
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-display font-bold">Habit Streaks</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-3">
                {safeHabits.map((habit, i) => (
                  <div key={i} className="p-3 bg-[var(--hover-bg)] rounded-lg space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="font-medium text-[var(--text-primary)] text-sm">{habit.name}</span>
                      <span className="text-lg">🔥</span>
                    </div>
                    <div className="flex items-baseline gap-1.5">
                      <span className="text-xl font-display font-bold text-[#14b8a6]">{habit.completedDates?.length || 0}</span>
                      <span className="text-xs text-[var(--text-tertiary)]">days</span>
                    </div>
                    <div className="h-1 bg-[var(--bg-tertiary)] rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-gradient-to-r from-primary to-orange-400 rounded-full"
                        style={{ width: `${Math.min(((habit.completedDates?.length || 0) / 30) * 100, 100)}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Productivity Insights */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          <Card className="bg-[rgba(34,197,94,0.1)] border-emerald/10">
            <CardContent className="p-4">
              <div className="flex items-center gap-2 mb-2">
                <CheckCircle className="w-4 h-4 text-[#22c55e]" />
                <span className="text-xs text-[var(--text-tertiary)]">Avg. Daily</span>
              </div>
              <div className="text-xl font-display font-bold text-[var(--text-primary)]">
                {completionData.length > 0 ? Math.round(completionData.reduce((a, b) => a + b, 0) / completionData.length) : 0}
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-[rgba(20,184,166,0.1)] border-primary/10">
            <CardContent className="p-4">
              <div className="flex items-center gap-2 mb-2">
                <Clock className="w-4 h-4 text-[#14b8a6]" />
                <span className="text-xs text-[var(--text-tertiary)]">Due Today</span>
              </div>
              <div className="text-xl font-display font-bold text-[var(--text-primary)]">
                {safeTasks.filter(t => {
                  if (!t.dueDate || t.status === 'completed') return false;
                  return new Date(t.dueDate).toDateString() === new Date().toDateString();
                }).length}
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-violet/5 border-violet/10">
            <CardContent className="p-4">
              <div className="flex items-center gap-2 mb-2">
                <Target className="w-4 h-4 text-[#14b8a6]" />
                <span className="text-xs text-[var(--text-tertiary)]">On Track</span>
              </div>
              <div className="text-xl font-display font-bold text-[var(--text-primary)]">
                {totalTasks > 0 ? Math.round(((completedTasks + inProgressTasks) / totalTasks) * 100) : 0}%
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-rose/5 border-rose/10">
            <CardContent className="p-4">
              <div className="flex items-center gap-2 mb-2">
                <AlertCircle className="w-4 h-4 text-[#ef4444]" />
                <span className="text-xs text-[var(--text-tertiary)]">Attention</span>
              </div>
              <div className="text-xl font-display font-bold text-[var(--text-primary)]">
                {overdueTasks.length + highPriority}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Analytics;
