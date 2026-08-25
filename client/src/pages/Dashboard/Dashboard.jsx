import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import Sidebar from '../../components/layout/Sidebar';
import { 
  CheckCircle, 
  Clock, 
  Flame,
  ArrowUpRight,
  Activity,
  Calendar,
  ListTodo,
  TrendingUp,
  Zap
} from 'lucide-react';

const StatCard = ({ icon: Icon, label, value, colorClass }) => (
  <div className="stat-card group">
    <div className="flex items-center gap-3 mb-3">
      <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${colorClass}`}>
        <Icon className="w-4 h-4" />
      </div>
    </div>
    <div className="text-[11px] text-[var(--text-tertiary)] font-medium uppercase tracking-wider mb-0.5">{label}</div>
    <div className="text-xl font-display font-bold text-[var(--text-primary)]">{value}</div>
  </div>
);

const ProgressRing = ({ progress, size = 120, strokeWidth = 10 }) => {
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const offset = circumference - (progress / 100) * circumference;
  
  return (
    <svg width={size} height={size} className="transform -rotate-90">
      <circle
        cx={size / 2}
        cy={size / 2}
        r={radius}
        fill="none"
        stroke="var(--bg-tertiary)"
        strokeWidth={strokeWidth}
      />
      <circle
        cx={size / 2}
        cy={size / 2}
        r={radius}
        fill="none"
        stroke="#14b8a6"
        strokeWidth={strokeWidth}
        strokeDasharray={circumference}
        strokeDashoffset={offset}
        strokeLinecap="round"
        style={{ transition: 'stroke-dashoffset 1s cubic-bezier(0.16, 1, 0.3, 1)' }}
      />
    </svg>
  );
};

const Dashboard = () => {
  const { stats, loading, refreshStats, habits, tasks } = useApp();

  useEffect(() => {
    refreshStats();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-[var(--bg-primary)] flex items-center justify-center">
        <div className="w-6 h-6 border-2 border-[rgba(20,184,166,0.2)] border-t-[#14b8a6] rounded-full animate-spin" />
      </div>
    );
  }

  const todayTasks = stats?.todayTasks || [];
  const completionRate = stats?.totalTasks > 0 
    ? Math.round((stats?.completedTasks / stats?.totalTasks) * 100) 
    : 0;

  const calculateStreak = () => {
    if (!habits || habits.length === 0) return 0;
    let maxStreak = 0;
    const now = new Date();
    now.setHours(0, 0, 0, 0);
    
    habits.forEach(habit => {
      if (!habit.completedDates || habit.completedDates.length === 0) return;
      let currentStreak = 0;
      for (let i = 0; i < 365; i++) {
        const checkDate = new Date(now);
        checkDate.setDate(checkDate.getDate() - i);
        const checkStr = checkDate.toISOString().split('T')[0];
        const hasCompleted = habit.completedDates.some(d => {
          const dStr = new Date(d).toISOString().split('T')[0];
          return dStr === checkStr;
        });
        if (hasCompleted) {
          currentStreak++;
        } else if (i > 0) {
          break;
        }
      }
      maxStreak = Math.max(maxStreak, currentStreak);
    });
    return maxStreak;
  };

  const streakDays = calculateStreak();
  
  const statCards = [
    { label: 'Total Tasks', value: stats?.totalTasks || 0, icon: ListTodo, colorClass: 'bg-[rgba(20,184,166,0.1)] text-[#14b8a6]' },
    { label: 'Completed', value: stats?.completedTasks || 0, icon: CheckCircle, colorClass: 'bg-[rgba(34,197,94,0.1)] text-[#22c55e]' },
    { label: 'Pending', value: stats?.pendingTasks || 0, icon: Clock, colorClass: 'bg-[rgba(239,68,68,0.1)] text-[#ef4444]' },
    { label: 'Streak', value: `${streakDays}d`, icon: Flame, colorClass: 'bg-[rgba(245,158,11,0.1)] text-[#f59e0b]' },
  ];

  return (
    <div className="min-h-screen bg-[var(--bg-primary)] flex">
      <Sidebar />
      
      <div className="flex-1 lg:ml-52">
        <div className="p-6 lg:p-8 space-y-6">
          {/* Header */}
          <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-4">
            <div>
              <h1 className="text-2xl lg:text-3xl font-display font-bold text-[var(--text-primary)] tracking-tight">
                Dashboard
              </h1>
              <p className="text-sm text-[var(--text-tertiary)] mt-1">
                Welcome back — let's make today count.
              </p>
            </div>

            <div className="flex items-center gap-5">
              <div className="text-center">
                <div className="text-lg font-display font-bold text-[#14b8a6]">{completionRate}%</div>
                <div className="text-[10px] text-[var(--text-tertiary)] uppercase tracking-wider">Complete</div>
              </div>
              <div className="w-px h-6 bg-[var(--border-color)]" />
              <div className="text-center">
                <div className="text-lg font-display font-bold text-[var(--text-primary)]">{todayTasks.length}</div>
                <div className="text-[10px] text-[var(--text-tertiary)] uppercase tracking-wider">Today</div>
              </div>
              <div className="w-px h-6 bg-[var(--border-color)]" />
              <div className="text-center">
                <div className="text-lg font-display font-bold text-[#14b8a6]">{streakDays}</div>
                <div className="text-[10px] text-[var(--text-tertiary)] uppercase tracking-wider">Streak</div>
              </div>
            </div>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
            {statCards.map((card, idx) => (
              <StatCard key={idx} {...card} />
            ))}
          </div>

          {/* Main Content */}
          <div className="grid lg:grid-cols-3 gap-5">
            {/* Today's Tasks */}
            <div className="lg:col-span-2 card-surface">
              <div className="flex items-center justify-between px-5 py-4 border-b border-[var(--border-color)]">
                <div>
                  <h3 className="text-sm font-display font-semibold text-[var(--text-primary)]">Today's Focus</h3>
                  <p className="text-[11px] text-[var(--text-tertiary)] mt-0.5">{todayTasks.length} tasks remaining</p>
                </div>
                <Link to="/tasks" className="text-[11px] text-[var(--text-tertiary)] hover:text-[#14b8a6] transition-colors font-medium inline-flex items-center gap-1">
                  View all <ArrowUpRight className="w-3 h-3" />
                </Link>
              </div>
              <div className="p-4">
                {todayTasks.length === 0 ? (
                  <div className="text-center py-10">
                    <div className="w-10 h-10 rounded-lg bg-[rgba(34,197,94,0.08)] flex items-center justify-center mx-auto mb-3">
                      <CheckCircle className="w-5 h-5 text-[#22c55e]" />
                    </div>
                    <p className="text-sm font-display font-semibold text-[var(--text-primary)] mb-1">All caught up!</p>
                    <p className="text-xs text-[var(--text-tertiary)]">No tasks due today.</p>
                  </div>
                ) : (
                  <div className="space-y-1.5">
                    {todayTasks.slice(0, 5).map((task, idx) => (
                      <div
                        key={task._id}
                        className="flex items-center justify-between px-3 py-2.5 rounded-lg hover:bg-[var(--hover-bg)] transition-colors group"
                      >
                        <div className="flex items-center gap-3 flex-1 min-w-0">
                          <div className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${
                            task.priority === 'high' ? 'bg-[#ef4444]' : 
                            task.priority === 'medium' ? 'bg-[#f59e0b]' : 'bg-[#22c55e]'
                          }`} />
                          <div className="min-w-0">
                            <div className="text-sm text-[var(--text-primary)] truncate group-hover:text-[#14b8a6] transition-colors">
                              {task.title}
                            </div>
                            {task.board && (
                              <div className="text-[11px] text-[var(--text-tertiary)] mt-0.5">{task.board.name}</div>
                            )}
                          </div>
                        </div>
                        <span className={`flex-shrink-0 ml-3 text-[10px] font-medium px-2 py-0.5 rounded-full ${
                          task.status === 'completed' ? 'badge-completed' :
                          task.status === 'in-progress' ? 'badge-in-progress' :
                          'badge-todo'
                        }`}>
                          {task.status === 'in-progress' ? 'In Progress' : task.status.charAt(0).toUpperCase() + task.status.slice(1)}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Right Column */}
            <div className="space-y-5">
              {/* Completion Rate */}
              <div className="card-surface p-5 space-y-4">
                <h3 className="text-sm font-display font-semibold text-[var(--text-primary)]">Completion</h3>
                <div className="flex items-center justify-center">
                  <div className="relative">
                    <ProgressRing progress={completionRate} />
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="text-center">
                        <div className="text-2xl font-display font-bold text-[var(--text-primary)]">{completionRate}%</div>
                        <div className="text-[10px] text-[var(--text-tertiary)]">Done</div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  {[
                    { label: 'Done', count: stats?.completedTasks || 0, color: 'bg-[#22c55e]' },
                    { label: 'In Progress', count: stats?.tasksByStatus?.['in-progress'] || 0, color: 'bg-[#14b8a6]' },
                    { label: 'To Do', count: stats?.tasksByStatus?.['todo'] || 0, color: 'bg-[#8b5cf6]' },
                  ].map((item) => (
                    <div key={item.label} className="flex items-center justify-between text-sm">
                      <div className="flex items-center gap-2">
                        <div className={`w-2 h-2 rounded-full ${item.color}`} />
                        <span className="text-xs text-[var(--text-tertiary)]">{item.label}</span>
                      </div>
                      <span className="text-sm font-display font-semibold text-[var(--text-primary)]">{item.count}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Motivation Card */}
              <div className="card-surface p-5 space-y-3 bg-gradient-strike-subtle">
                <div className="flex items-center justify-between">
                  <div className="text-2xl">
                    {completionRate >= 80 ? '🔥' : completionRate >= 60 ? '⚡' : completionRate >= 40 ? '💪' : '✨'}
                  </div>
                  <Activity className="w-4 h-4 text-[#14b8a6] animate-pulse" />
                </div>
                
                <h4 className="text-sm font-display font-semibold text-[var(--text-primary)]">
                  {completionRate >= 80 ? 'Crushing it!' :
                   completionRate >= 60 ? 'Great momentum!' :
                   completionRate >= 40 ? 'Keep pushing!' :
                   "Let's get started!"}
                </h4>
                
                <p className="text-xs text-[var(--text-tertiary)] leading-relaxed">
                  {completionRate >= 80 ? 'You\'re on fire. Keep this incredible pace going!' :
                   completionRate >= 60 ? 'Serious progress. Push a bit more to hit your targets!' :
                   completionRate >= 40 ? 'Good progress so far. You\'re closer than you think!' :
                   'Every journey begins with a single step. Start with one task!'}
                </p>

                <div className="h-1 bg-[var(--bg-tertiary)] rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-[#14b8a6] rounded-full transition-all duration-700"
                    style={{ width: `${completionRate}%` }}
                  />
                </div>
              </div>

              {/* Quick Actions */}
              <div className="grid grid-cols-2 gap-3">
                <Link to="/calendar">
                  <div className="card-surface p-4 flex flex-col items-center text-center gap-2 cursor-pointer hover:border-[rgba(20,184,166,0.12)] transition-all h-full">
                    <Calendar className="w-4 h-4 text-[#14b8a6]" />
                    <div className="text-xs font-medium text-[var(--text-primary)]">Calendar</div>
                    <div className="text-[10px] text-[var(--text-tertiary)]">View schedule</div>
                  </div>
                </Link>
                <Link to="/habits">
                  <div className="card-surface p-4 flex flex-col items-center text-center gap-2 cursor-pointer hover:border-[rgba(20,184,166,0.12)] transition-all h-full">
                    <TrendingUp className="w-4 h-4 text-[#14b8a6]" />
                    <div className="text-xs font-medium text-[var(--text-primary)]">Habits</div>
                    <div className="text-[10px] text-[var(--text-tertiary)]">Track streak</div>
                  </div>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
