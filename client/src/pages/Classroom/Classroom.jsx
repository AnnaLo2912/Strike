import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../../components/layout/Sidebar';
import classroomService from '../../services/classroomService';
import { useApp } from '../../context/AppContext';
import { 
  RefreshCw, 
  CheckCircle, 
  XCircle, 
  ExternalLink,
  AlertCircle,
  Zap,
  Calendar,
  BookOpen,
  Clock
} from 'lucide-react';

const Classroom = () => {
  const navigate = useNavigate();
  const { updateClassroomDeadlines } = useApp();
  const [status, setStatus] = useState({ connected: false, lastSync: null });
  const [syncing, setSyncing] = useState(false);
  const [message, setMessage] = useState('');
  const [deadlines, setDeadlines] = useState([]);

  useEffect(() => {
    loadStatus();
    const params = new URLSearchParams(window.location.search);
    if (params.get('classroom') === 'connected') {
      setMessage('Google Classroom connected successfully!');
      loadStatus();
    } else if (params.get('error')) {
      setMessage('Failed to connect Google Classroom. Please try again.');
    }
  }, []);

  const loadStatus = async () => {
    try {
      const response = await classroomService.getStatus();
      setStatus(response.data);
      
      // If connected, fetch deadlines
      if (response.data.connected) {
        loadDeadlines();
      }
    } catch (error) {
      console.error('Error loading status:', error);
    }
  };

  const loadDeadlines = async () => {
    try {
      const response = await classroomService.getDeadlines();
      const deadlinesData = response.data || [];
      setDeadlines(deadlinesData);
      // Update context so notifications can use these deadlines
      updateClassroomDeadlines(deadlinesData);
    } catch (error) {
      console.error('Error loading deadlines:', error);
    }
  };

  const handleConnect = async () => {
    try {
      const response = await classroomService.getAuthUrl();
      window.location.href = response.authUrl;
    } catch (error) {
      console.error('Error getting auth URL:', error);
      setMessage('Failed to initiate connection. Please try again.');
    }
  };

  const handleSync = async () => {
    setSyncing(true);
    setMessage('');
    try {
      const response = await classroomService.sync();
      setMessage(response.message);
      setStatus({ ...status, lastSync: new Date() });
      await loadDeadlines(); // Reload deadlines after sync
    } catch (error) {
      console.error('Error syncing:', error);
      setMessage('Sync failed. Please try again.');
    } finally {
      setSyncing(false);
    }
  };

  const handleDisconnect = async () => {
    if (window.confirm('Are you sure you want to disconnect Google Classroom?')) {
      try {
        await classroomService.disconnect();
        setStatus({ connected: false, lastSync: null });
        setMessage('Google Classroom disconnected');
      } catch (error) {
        console.error('Error disconnecting:', error);
        setMessage('Failed to disconnect. Please try again.');
      }
    }
  };

  return (
    <div className="min-h-screen bg-obsidian flex grain">
      <Sidebar />
      
      <div className="flex-1 lg:ml-64">
        <div className="p-6 lg:p-10 max-w-4xl mx-auto space-y-8">
          <div className="relative mb-10">
            <div className="absolute inset-0 bg-gradient-to-r from-amber/[0.03] to-violet/[0.03] rounded-3xl blur-3xl" />
            <div className="relative flex items-center space-x-4">
              <div className="w-12 h-12 bg-gradient-strike rounded-2xl flex items-center justify-center shadow-lg shadow-amber/20">
                <Zap className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-4xl lg:text-5xl font-display font-black text-white mb-1">Google Classroom</h1>
                <p className="text-slate font-body">Sync your assignments and deadlines automatically</p>
              </div>
            </div>
          </div>

          {message && (
            <div className="p-4 bg-cyan/10 border border-cyan/30 rounded-xl">
              <p className="text-cyan text-sm font-medium">{message}</p>
            </div>
          )}

          <div className="card-dark rounded-2xl p-8">
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center space-x-4">
                {status.connected ? (
                  <CheckCircle className="w-12 h-12 text-emerald" />
                ) : (
                  <XCircle className="w-12 h-12 text-slate-dark" />
                )}
                <div>
                  <h2 className="text-2xl font-display font-bold text-white">
                    {status.connected ? 'Connected' : 'Not Connected'}
                  </h2>
                  {status.lastSync && (
                    <p className="text-sm text-slate">Last synced: {new Date(status.lastSync).toLocaleString()}</p>
                  )}
                </div>
              </div>
            </div>

            {!status.connected ? (
              <div>
                <div className="bg-gradient-to-br from-amber/[0.05] to-violet/[0.05] rounded-xl p-6 mb-6 border border-amber/10">
                  <h3 className="font-display font-bold text-white mb-3">What happens when you connect?</h3>
                  <ul className="space-y-3 text-sm text-slate">
                    {[
                      'Automatically fetch all your Google Classroom assignments',
                      'Create tasks with due dates in your board',
                      'Add deadlines to your calendar automatically',
                      'Sync anytime to get the latest assignments',
                    ].map((text, i) => (
                      <li key={i} className="flex items-start space-x-2">
                        <CheckCircle className="w-5 h-5 text-emerald flex-shrink-0 mt-0.5" />
                        <span>{text}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <button
                  onClick={handleConnect}
                  className="w-full flex items-center justify-center space-x-3 bg-gradient-strike text-white px-8 py-4 rounded-xl hover:shadow-lg hover:shadow-amber/25 transition-all duration-300 hover:scale-[1.01] font-bold"
                >
                  <svg className="w-6 h-6" viewBox="0 0 24 24">
                    <path fill="currentColor" d="M12 0c-6.627 0-12 5.373-12 12s5.373 12 12 12 12-5.373 12-12-5.373-12-12-12zm-2.917 16.083c-2.258 0-4.083-1.825-4.083-4.083s1.825-4.083 4.083-4.083c1.103 0 2.024.402 2.735 1.067l-1.107 1.068c-.304-.292-.834-.63-1.628-.63-1.394 0-2.531 1.155-2.531 2.579 0 1.424 1.138 2.579 2.531 2.579 1.616 0 2.224-1.162 2.316-1.762h-2.316v-1.4h3.855c.036.204.064.408.064.677.001 2.332-1.563 3.988-3.919 3.988zm9.917-3.5h-1.75v1.75h-1.167v-1.75h-1.75v-1.166h1.75v-1.75h1.167v1.75h1.75v1.166z"/>
                  </svg>
                  <span className="font-bold text-lg">Connect Google Classroom</span>
                </button>
              </div>
            ) : (
              <div className="space-y-5">
                <button
                  onClick={handleSync}
                  disabled={syncing}
                  className="w-full flex items-center justify-center space-x-2 bg-gradient-strike text-white px-6 py-4 rounded-xl hover:shadow-lg hover:shadow-amber/25 transition-all duration-300 disabled:opacity-50 font-bold"
                >
                  <RefreshCw className={`w-5 h-5 ${syncing ? 'animate-spin' : ''}`} />
                  <span>{syncing ? 'Syncing...' : 'Sync Now'}</span>
                </button>

                <div className="grid md:grid-cols-2 gap-4">
                  <button
                    onClick={() => navigate('/tasks')}
                    className="flex items-center justify-center space-x-2 border border-amber/30 text-amber px-6 py-3 rounded-xl hover:bg-amber/10 transition-all duration-300 font-bold"
                  >
                    <span>View Tasks</span>
                    <ExternalLink className="w-4 h-4" />
                  </button>

                  <button
                    onClick={() => navigate('/calendar')}
                    className="flex items-center justify-center space-x-2 border border-violet/30 text-violet px-6 py-3 rounded-xl hover:bg-violet/10 transition-all duration-300 font-bold"
                  >
                    <span>View Calendar</span>
                    <ExternalLink className="w-4 h-4" />
                  </button>
                </div>

                <button
                  onClick={handleDisconnect}
                  className="w-full text-rose hover:bg-rose/10 px-6 py-3 rounded-xl transition-all border border-rose/20 font-medium"
                >
                  Disconnect Google Classroom
                </button>
              </div>
            )}
          </div>

          <div className="bg-cyan/5 rounded-2xl p-6 border border-cyan/10">
            <div className="flex items-start space-x-3">
              <AlertCircle className="w-6 h-6 text-cyan flex-shrink-0 mt-0.5" />
              <div className="text-sm text-cyan/80">
                <p className="font-semibold text-cyan mb-2">About Google Classroom Integration:</p>
                <p>
                  Once connected, Strike will automatically sync your Google Classroom assignments, create tasks with due dates, and add deadlines to your calendar. You can sync anytime to get the latest assignments.
                </p>
              </div>
            </div>
          </div>

          {/* Deadline Display - Only show when connected and has deadlines */}
          {status.connected && deadlines.length > 0 && (
            <div className="mt-8">
              <h3 className="text-2xl font-display font-bold text-white mb-6 flex items-center gap-3">
                <Calendar className="w-6 h-6 text-amber" />
                Upcoming Deadlines
              </h3>
              <div className="space-y-3">
                {deadlines.map((deadline) => {
                  const dueDate = new Date(deadline.dueDate);
                  const now = new Date();
                  const hoursLeft = Math.round((dueDate - now) / (1000 * 60 * 60));
                  const isOverdue = hoursLeft < 0;
                  const isUrgent = hoursLeft > 0 && hoursLeft <= 24;

                  return (
                    <div
                      key={deadline.id}
                      className={`p-4 border ${
                        isOverdue
                          ? 'bg-rose/10 border-rose/30'
                          : isUrgent
                          ? 'bg-amber/10 border-amber/30'
                          : 'bg-[var(--bg-secondary)] border-[var(--border-color)]'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          <div className={`w-10 h-10 flex items-center justify-center ${
                            deadline.type === 'quiz' ? 'bg-violet/20 text-violet' :
                            deadline.type === 'lab' ? 'bg-cyan/20 text-cyan' :
                            deadline.type === 'project' ? 'bg-emerald/20 text-emerald' :
                            'bg-amber/20 text-amber'
                          }`}>
                            <BookOpen className="w-5 h-5" />
                          </div>
                          <div>
                            <h4 className="font-bold text-[var(--text-primary)]">{deadline.title}</h4>
                            <p className="text-sm text-[var(--text-tertiary)]">{deadline.course}</p>
                          </div>
                        </div>
                        <div className={`text-right ${
                          isOverdue ? 'text-rose' : isUrgent ? 'text-amber' : 'text-[var(--text-secondary)]'
                        }`}>
                          <div className="flex items-center gap-1 text-sm font-bold">
                            <Clock className="w-4 h-4" />
                            {isOverdue
                              ? `${Math.abs(hoursLeft)}h overdue`
                              : hoursLeft === 0
                              ? 'Due today'
                              : `${hoursLeft}h left`}
                          </div>
                          <p className="text-xs text-[var(--text-tertiary)] mt-1">
                            {dueDate.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}
                          </p>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Classroom;
