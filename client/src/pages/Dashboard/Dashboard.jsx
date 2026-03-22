import { useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import Sidebar from '../../components/Layout/Sidebar';
import { 
  CheckCircle, 
  Clock, 
  TrendingUp,
  Calendar,
  AlertCircle,
  Target
} from 'lucide-react';

const Dashboard = () => {
  const { stats, tasks, loading, refreshStats } = useApp();

  useEffect(() => {
    refreshStats();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#c18db4]"></div>
      </div>
    );
  }

  const todayTasks = stats?.todayTasks || [];
  const completionRate = stats?.totalTasks > 0 
    ? Math.round((stats?.completedTasks / stats?.totalTasks) * 100) 
    : 0;

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <Sidebar />
      
      <div className="flex-1 lg:ml-64">
        <div className="p-8">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-[#0e1b48] mb-2">Dashboard</h1>
            <p className="text-gray-600">Welcome back! Here's your productivity overview.</p>
          </div>

          {/* Stats Cards */}
          <div className="grid md:grid-cols-4 gap-6 mb-8">
            {/* Total Tasks */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-[#c18db4]/10 rounded-xl flex items-center justify-center">
                  <CheckCircle className="w-6 h-6 text-[#c18db4]" />
                </div>
              </div>
              <div className="text-3xl font-bold text-[#0e1b48] mb-1">
                {stats?.totalTasks || 0}
              </div>
              <div className="text-sm text-gray-600">Total Tasks</div>
            </div>

            {/* Completed */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
                  <Target className="w-6 h-6 text-green-600" />
                </div>
              </div>
              <div className="text-3xl font-bold text-[#0e1b48] mb-1">
                {stats?.completedTasks || 0}
              </div>
              <div className="text-sm text-gray-600">Completed</div>
            </div>

            {/* Pending */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center">
                  <Clock className="w-6 h-6 text-orange-600" />
                </div>
              </div>
              <div className="text-3xl font-bold text-[#0e1b48] mb-1">
                {stats?.pendingTasks || 0}
              </div>
              <div className="text-sm text-gray-600">Pending</div>
            </div>

            {/* Completion Rate */}
            <div className="bg-gradient-to-br from-[#c18db4] to-[#0e1b48] rounded-2xl p-6 shadow-lg text-white">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
                  <TrendingUp className="w-6 h-6 text-white" />
                </div>
              </div>
              <div className="text-3xl font-bold mb-1">{completionRate}%</div>
              <div className="text-sm text-white/80">Completion Rate</div>
            </div>
          </div>

          <div className="grid lg:grid-cols-3 gap-6">
            {/* Today's Tasks */}
            <div className="lg:col-span-2 bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-[#0e1b48]">Today's Tasks</h2>
                <Calendar className="w-5 h-5 text-gray-400" />
              </div>

              {todayTasks.length === 0 ? (
                <div className="text-center py-12">
                  <AlertCircle className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                  <p className="text-gray-500">No tasks due today</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {todayTasks.map((task) => (
                    <div 
                      key={task._id}
                      className="flex items-center justify-between p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors"
                    >
                      <div className="flex items-center space-x-3">
                        <div className={`w-2 h-2 rounded-full ${
                          task.priority === 'high' ? 'bg-red-500' :
                          task.priority === 'medium' ? 'bg-yellow-500' :
                          'bg-green-500'
                        }`} />
                        <div>
                          <div className="font-medium text-[#0e1b48]">{task.title}</div>
                          {task.board && (
                            <div className="text-xs text-gray-500 flex items-center mt-1">
                              <div 
                                className="w-2 h-2 rounded-full mr-2" 
                                style={{ backgroundColor: task.board.color }}
                              />
                              {task.board.name}
                            </div>
                          )}
                        </div>
                      </div>
                      <div className={`px-3 py-1 rounded-full text-xs font-medium ${
                        task.status === 'completed' ? 'bg-green-100 text-green-700' :
                        task.status === 'in-progress' ? 'bg-blue-100 text-blue-700' :
                        'bg-gray-100 text-gray-700'
                      }`}>
                        {task.status}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Task Distribution */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
              <h2 className="text-xl font-bold text-[#0e1b48] mb-6">Task Status</h2>
              
              <div className="space-y-4">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-gray-600">To Do</span>
                    <span className="text-sm font-semibold text-[#0e1b48]">
                      {stats?.tasksByStatus?.todo || 0}
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-gray-500 h-2 rounded-full"
                      style={{ 
                        width: `${stats?.totalTasks > 0 ? ((stats?.tasksByStatus?.todo || 0) / stats.totalTasks) * 100 : 0}%` 
                      }}
                    />
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-gray-600">In Progress</span>
                    <span className="text-sm font-semibold text-[#0e1b48]">
                      {stats?.tasksByStatus?.['in-progress'] || 0}
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-blue-500 h-2 rounded-full"
                      style={{ 
                        width: `${stats?.totalTasks > 0 ? ((stats?.tasksByStatus?.['in-progress'] || 0) / stats.totalTasks) * 100 : 0}%` 
                      }}
                    />
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-gray-600">Completed</span>
                    <span className="text-sm font-semibold text-[#0e1b48]">
                      {stats?.tasksByStatus?.completed || 0}
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-green-500 h-2 rounded-full"
                      style={{ 
                        width: `${stats?.totalTasks > 0 ? ((stats?.tasksByStatus?.completed || 0) / stats.totalTasks) * 100 : 0}%` 
                      }}
                    />
                  </div>
                </div>
              </div>

              {/* Motivational Message */}
              <div className="mt-6 p-4 bg-gradient-to-r from-[#c18db4]/10 to-[#b7a7d0]/10 rounded-xl border border-[#c18db4]/20">
                <p className="text-sm text-[#0e1b48] font-medium">
                  {completionRate >= 75 ? '🎉 Excellent progress!' :
                   completionRate >= 50 ? '💪 Keep going!' :
                   completionRate >= 25 ? '🚀 You can do it!' :
                   '✨ Start striking tasks!'}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;