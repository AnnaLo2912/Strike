import { useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import Sidebar from '../../components/Layout/Sidebar';
import { useTheme } from '../../components/theme-provider';
import { 
  CheckCircle, 
  Clock, 
  TrendingUp,
  Target,
  Zap,
  Flame,
  Trophy,
  ArrowUpRight,
  Activity,
  Calendar,
  ListTodo,
  Star
} from 'lucide-react';

const StatCard = ({ icon: Icon, label, value, change, gradient, accent, delay }) => (
  <div 
    className="relative overflow-hidden group sharp"
    style={{ 
      animation: `reveal 0.6s ease-out ${delay}s forwards, glow 3s ease-in-out ${delay + 0.5}s infinite`,
      opacity: 0 
    }}
  >
    <div className={`absolute inset-0 bg-gradient-to-br ${gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-500`} />
    <div className="relative z-10 bg-[var(--bg-secondary)] border border-[var(--border-color)] p-6 h-full">
      <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-amber/5 to-transparent rounded-none" />
      
      <div className="flex items-start justify-between mb-4">
        <div className={`w-12 h-12 flex items-center justify-center border border-[var(--border-color)] group-hover:border-amber/30 transition-colors ${gradient}`}>
          <Icon className="w-6 h-6 text-white" />
        </div>
        {change && (
          <span className={`text-xs font-bold font-display ${accent}`}>{change}</span>
        )}
      </div>
      
      <div className="text-xs text-[var(--text-tertiary)] font-medium mb-2 uppercase tracking-wider">{label}</div>
      <div className="text-4xl font-display font-black text-[var(--text-primary)] tracking-tight">{value}</div>
      
      {/* Mini progress bar */}
      <div className="mt-4 h-1 bg-[var(--bg-tertiary)] w-full overflow-hidden">
        <div className={`h-full bg-gradient-to-r ${gradient} animate-shimmer`} style={{ width: '70%' }} />
      </div>
    </div>
  </div>
);

const ProgressRing = ({ progress, size = 80, strokeWidth = 8, gradient }) => {
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
        className={`bg-gradient-to-r ${gradient}`}
        strokeWidth={strokeWidth}
        strokeDasharray={circumference}
        strokeDashoffset={offset}
        strokeLinecap="square"
        style={{ transition: 'stroke-dashoffset 1s ease-out' }}
      />
    </svg>
  );
};

const Dashboard = () => {
  const { stats, loading, refreshStats, habits, tasks } = useApp();
  const { theme } = useTheme();

  useEffect(() => {
    refreshStats();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-[var(--bg-primary)] flex items-center justify-center">
        <div className="relative w-20 h-20">
          <div className="absolute inset-0 bg-gradient-strike rounded-none animate-spin" style={{ maskImage: 'radial-gradient(circle, transparent 35%, black 65%)' }} />
          <div className="absolute inset-2 bg-[var(--bg-primary)]" />
        </div>
      </div>
    );
  }

  const todayTasks = stats?.todayTasks || [];
  const completionRate = stats?.totalTasks > 0 
    ? Math.round((stats?.completedTasks / stats?.totalTasks) * 100) 
    : 0;

  // Calculate streak from habits - find the longest streak
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
    { label: 'Total Tasks', value: stats?.totalTasks || 0, icon: ListTodo, gradient: 'from-amber to-orange-600', change: null, accent: '' },
    { label: 'Completed', value: stats?.completedTasks || 0, icon: CheckCircle, gradient: 'from-emerald to-cyan', change: null, accent: '' },
    { label: 'Pending', value: stats?.pendingTasks || 0, icon: Clock, gradient: 'from-rose to-amber', change: null, accent: '' },
    { label: 'Streak', value: `${streakDays}d`, icon: Flame, gradient: 'from-orange-500 to-amber', change: null, accent: '' },
  ];

  return (
    <div className="min-h-screen bg-[var(--bg-primary)] grain">
      <Sidebar />
      
      <div className="flex-1 lg:ml-64">
        <div className="p-6 lg:p-8 space-y-8">
          {/* HEADER - KILLER DESIGN */}
          <div className="relative">
            <div className={`absolute inset-0 ${theme === 'dark' ? 'bg-gradient-to-r from-amber/[0.05] via-transparent to-violet/[0.05]' : 'bg-gradient-to-r from-amber/[0.02] via-transparent to-violet/[0.02]'}`} />
            
            <div className="relative flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6">
              <div className="space-y-3">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-gradient-strike flex items-center justify-center shadow-xl shadow-amber/20">
                    <Zap className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h1 className="text-4xl lg:text-6xl font-display font-black text-[var(--text-primary)] leading-none">
                      DASH<span className="text-gradient-strike">BOARD</span>
                    </h1>
                  </div>
                </div>
                <p className="text-[var(--text-tertiary)] font-body text-lg">
                  Welcome back, let's crush it today
                </p>
              </div>

              {/* Quick Stats Row */}
              <div className="flex items-center space-x-6">
                <div className="text-center">
                  <div className="text-3xl font-display font-black text-gradient-amber">{completionRate}%</div>
                  <div className="text-xs text-[var(--text-tertiary)] uppercase tracking-wider">Complete</div>
                </div>
                <div className="w-px h-12 bg-[var(--border-color)]" />
                <div className="text-center">
                  <div className="text-3xl font-display font-black text-[var(--text-primary)]">{todayTasks.length}</div>
                  <div className="text-xs text-[var(--text-tertiary)] uppercase tracking-wider">Today</div>
                </div>
                <div className="w-px h-12 bg-[var(--border-color)]" />
                <div className="text-center">
                  <div className="text-3xl font-display font-black text-orange-500">{streakDays}</div>
                  <div className="text-xs text-[var(--text-tertiary)] uppercase tracking-wider">Streak</div>
                </div>
              </div>
            </div>
          </div>

          {/* STATS GRID */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {statCards.map((card, idx) => (
              <StatCard key={idx} {...card} delay={idx * 0.1} />
            ))}
          </div>

          {/* MAIN CONTENT GRID */}
          <div className="grid lg:grid-cols-3 gap-6">
            {/* TODAY'S TASKS - Priority focus */}
            <div className="lg:col-span-2 bg-[var(--bg-secondary)] border border-[var(--border-color)]">
              <div className="p-6 border-b border-[var(--border-color)] flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="w-10 h-10 bg-gradient-strike flex items-center justify-center">
                    <Target className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h2 className="text-xl font-display font-bold text-[var(--text-primary)]">Today's Focus</h2>
                    <p className="text-xs text-[var(--text-tertiary)]">{todayTasks.length} tasks remaining</p>
                  </div>
                </div>
                <button className="text-sm text-amber font-medium hover:underline flex items-center gap-1">
                  View All <ArrowUpRight className="w-4 h-4" />
                </button>
              </div>

              <div className="p-6">
                {todayTasks.length === 0 ? (
                  <div className="text-center py-12">
                    <div className="w-16 h-16 bg-emerald/10 flex items-center justify-center mx-auto mb-4 border border-emerald/20">
                      <CheckCircle className="w-8 h-8 text-emerald" />
                    </div>
                    <p className="text-lg font-display font-semibold text-[var(--text-primary)] mb-2">All caught up!</p>
                    <p className="text-[var(--text-tertiary)]">No tasks due today. Enjoy your day!</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {todayTasks.slice(0, 5).map((task, idx) => (
                      <div
                        key={task._id}
                        className="group flex items-center justify-between p-4 bg-[var(--bg-tertiary)] hover:bg-[var(--border-color)] border border-transparent hover:border-[var(--border-color)] transition-all duration-300 sharp"
                        style={{ animation: `reveal 0.5s ease-out ${idx * 0.05}s forwards`, opacity: 0 }}
                      >
                        <div className="flex items-center space-x-4 flex-1">
                          <div className={`w-3 h-3 rounded-full ${task.priority === 'high' ? 'bg-rose' : task.priority === 'medium' ? 'bg-amber' : 'bg-emerald'}`} />
                          <div className="flex-1">
                            <div className="flex items-center gap-2">
                              <span className="w-2 h-2 rounded-full" style={{ backgroundColor: task.board?.color || '#f59e0b' }} />
                              <div className="font-medium text-[var(--text-primary)] group-hover:text-amber transition-colors">
                                {task.title}
                              </div>
                            </div>
                            {task.board && (
                              <div className="text-xs text-[var(--text-tertiary)] mt-1">
                                {task.board.name}
                              </div>
                            )}
                          </div>
                        </div>
                        <span className={`px-3 py-1 text-xs font-bold sharp ${
                          task.status === 'completed' ? 'bg-emerald/20 text-emerald' :
                          task.status === 'in-progress' ? 'bg-cyan/20 text-cyan' :
                          'bg-[var(--bg-primary)] text-[var(--text-tertiary)]'
                        }`}>
                          {task.status === 'in-progress' ? 'IN PROGRESS' : task.status.toUpperCase()}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* RIGHT COLUMN */}
            <div className="space-y-6">
              {/* COMPLETION RATE - Big visual */}
              <div className="bg-[var(--bg-secondary)] border border-[var(--border-color)] p-6">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-lg font-display font-bold text-[var(--text-primary)]">Completion Rate</h3>
                  <Trophy className="w-5 h-5 text-amber" />
                </div>
                
                <div className="flex items-center justify-center">
                  <div className="relative">
                    <ProgressRing 
                      progress={completionRate} 
                      size={140} 
                      strokeWidth={12}
                      gradient="from-amber via-orange-500 to-rose"
                    />
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="text-center">
                        <div className="text-4xl font-display font-black text-[var(--text-primary)]">{completionRate}%</div>
                        <div className="text-xs text-[var(--text-tertiary)]">Done</div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="mt-6 space-y-3">
                  {[
                    { label: 'Done', count: stats?.completedTasks || 0, color: 'bg-emerald' },
                    { label: 'In Progress', count: stats?.tasksByStatus?.['in-progress'] || 0, color: 'bg-cyan' },
                    { label: 'To Do', count: stats?.tasksByStatus?.['todo'] || 0, color: 'bg-amber' },
                  ].map((item) => (
                    <div key={item.label} className="flex items-center justify-between text-sm">
                      <div className="flex items-center space-x-2">
                        <div className={`w-2 h-2 rounded-full ${item.color}`} />
                        <span className="text-[var(--text-secondary)]">{item.label}</span>
                      </div>
                      <span className="font-display font-bold text-[var(--text-primary)]">{item.count}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* MOTIVATION - Impact card */}
              <div className="relative overflow-hidden bg-gradient-to-br from-amber/10 via-[var(--bg-secondary)] to-violet/10 border border-amber/20 p-6 group cursor-pointer">
                <div className="absolute inset-0 bg-gradient-to-br from-amber/0 to-violet/0 group-hover:from-amber/5 group-hover:to-violet/5 transition-colors duration-500" />
                
                <div className="relative z-10">
                  <div className="flex items-center justify-between mb-4">
                    <div className="text-5xl font-display">
                      {completionRate >= 80 ? '🔥' : completionRate >= 60 ? '⚡' : completionRate >= 40 ? '💪' : '✨'}
                    </div>
                    <Activity className="w-5 h-5 text-amber animate-pulse" />
                  </div>
                  
                  <h4 className="text-xl font-display font-bold text-[var(--text-primary)] mb-3">
                    {completionRate >= 80 ? 'ABSOLUTELY CRUSHING IT!' :
                     completionRate >= 60 ? 'GREAT MOMENTUM!' :
                     completionRate >= 40 ? 'KEEP PUSHING!' :
                     "LET'S GET STARTED!"}
                  </h4>
                  
                  <p className="text-sm text-[var(--text-secondary)] leading-relaxed mb-4">
                    {completionRate >= 80 ? 'You\'re on fire! Keep this incredible pace going. Every task you complete builds towards your goals!' :
                     completionRate >= 60 ? 'You\'re making serious progress. Push a bit more and you\'ll hit your targets!' :
                     completionRate >= 40 ? 'Good progress so far. Don\'t stop now - you\'re closer than you think!' :
                     'Every journey begins with a single step. Start with one task and build your momentum!'}
                  </p>

                  {/* Progress to next level */}
                  <div className="w-full h-2 bg-[var(--bg-tertiary)] overflow-hidden">
                    <div 
                      className="h-full bg-gradient-to-r from-amber to-violet"
                      style={{ width: `${completionRate}%` }}
                    />
                  </div>
                  <div className="flex justify-between mt-2 text-xs text-[var(--text-tertiary)]">
                    <span>Current</span>
                    <span>{completionRate >= 80 ? 'Legendary' : completionRate >= 60 ? 'Expert' : completionRate >= 40 ? 'Pro' : 'Rookie'}</span>
                  </div>
                </div>
              </div>

              {/* QUICK ACTIONS */}
              <div className="grid grid-cols-2 gap-3">
                <button className="p-4 bg-[var(--bg-secondary)] border border-[var(--border-color)] hover:border-amber/30 transition-all duration-300 text-left group sharp">
                  <Calendar className="w-5 h-5 text-amber mb-2 group-hover:scale-110 transition-transform" />
                  <div className="font-display font-bold text-[var(--text-primary)] text-sm">Calendar</div>
                  <div className="text-xs text-[var(--text-tertiary)]">View schedule</div>
                </button>
                <button className="p-4 bg-[var(--bg-secondary)] border border-[var(--border-color)] hover:border-violet/30 transition-all duration-300 text-left group sharp">
                  <Star className="w-5 h-5 text-violet mb-2 group-hover:scale-110 transition-transform" />
                  <div className="font-display font-bold text-[var(--text-primary)] text-sm">Habits</div>
                  <div className="text-xs text-[var(--text-tertiary)]">Track streak</div>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;