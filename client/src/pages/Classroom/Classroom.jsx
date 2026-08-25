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
      if (response.authUrl) {
        window.location.href = response.authUrl;
      } else {
        setMessage('Could not generate connection URL. Please check server configuration.');
      }
    } catch (error) {
      console.error('Error getting auth URL:', error);
      setMessage(error.response?.data?.message || 'Failed to initiate connection. Please check Google Classroom configuration on the server.');
    }
  };

  const handleSync = async () => {
    setSyncing(true);
    setMessage('');
    try {
      const response = await classroomService.sync();
      setMessage(response.message);
      setStatus({ ...status, lastSync: new Date() });
      await loadDeadlines();
    } catch (error) {
      console.error('Error syncing:', error);
      const msg = error.response?.data?.message || 'Sync failed. Please try again.';
      if (error.response?.data?.needsReconnect) {
        setStatus({ connected: false, lastSync: null });
        setMessage('Google Classroom access expired. Please reconnect.');
      } else {
        setMessage(msg);
      }
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
    <div className="min-h-screen bg-[var(--bg-primary)] flex">
      <Sidebar />
      
      <div className="flex-1 lg:ml-52">
        <div className="p-6 lg:p-10 max-w-4xl mx-auto space-y-8">
          <div className="mb-6">
            <h1 className="page-title">Google Classroom</h1>
            <p className="page-subtitle">Sync your assignments and deadlines automatically</p>
          </div>

          {message && (
            <div className="p-4 bg-[rgba(139,92,246,0.06)] border border-[rgba(139,92,246,0.12)] rounded-xl">
              <p className="text-[#8b5cf6] text-sm font-medium">{message}</p>
            </div>
          )}

          <div className="card-surface rounded-xl p-8">
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center space-x-4">
                {status.connected ? (
                  <CheckCircle className="w-12 h-12 text-[#22c55e]" />
                ) : (
                  <XCircle className="w-12 h-12 text-[var(--text-secondary)]" />
                )}
                <div>
                  <h2 className="text-base font-display font-bold text-[var(--text-primary)]">
                    {status.connected ? 'Connected' : 'Not Connected'}
                  </h2>
                  {status.lastSync && (
                    <p className="text-sm text-[var(--text-tertiary)]">Last synced: {new Date(status.lastSync).toLocaleString()}</p>
                  )}
                </div>
              </div>
            </div>

            {!status.connected ? (
              <div>
                <div className="bg-[rgba(20,184,166,0.03)] rounded-xl p-6 mb-6 border border-[rgba(20,184,166,0.08)]">
                  <h3 className="font-display font-bold text-[var(--text-primary)] mb-3">What happens when you connect?</h3>
                  <ul className="space-y-3 text-sm text-[var(--text-tertiary)]">
                    {[
                      'Automatically fetch all your Google Classroom assignments',
                      'Create tasks with due dates in your board',
                      'Add deadlines to your calendar automatically',
                      'Sync anytime to get the latest assignments',
                    ].map((text, i) => (
                      <li key={i} className="flex items-start space-x-2">
                        <CheckCircle className="w-5 h-5 text-[#22c55e] flex-shrink-0 mt-0.5" />
                        <span>{text}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <button
                  onClick={handleConnect}
                  className="w-full flex items-center justify-center space-x-3 bg-gradient-to-r from-[#14b8a6] to-[#0d9488] shadow-lg shadow-[rgba(20,184,166,0.15)] text-white px-8 py-4 rounded-xl hover:shadow-lg hover:shadow-[rgba(20,184,166,0.25)] transition-all duration-300 hover:scale-[1.01] font-display font-semibold"
                >
                  <svg className="w-6 h-6" viewBox="0 0 24 24">
                    <path fill="currentColor" d="M12 0c-6.627 0-12 5.373-12 12s5.373 12 12 12 12-5.373 12-12-5.373-12-12-12zm-2.917 16.083c-2.258 0-4.083-1.825-4.083-4.083s1.825-4.083 4.083-4.083c1.103 0 2.024.402 2.735 1.067l-1.107 1.068c-.304-.292-.834-.63-1.628-.63-1.394 0-2.531 1.155-2.531 2.579 0 1.424 1.138 2.579 2.531 2.579 1.616 0 2.224-1.162 2.316-1.762h-2.316v-1.4h3.855c.036.204.064.408.064.677.001 2.332-1.563 3.988-3.919 3.988zm9.917-3.5h-1.75v1.75h-1.167v-1.75h-1.75v-1.166h1.75v-1.75h1.167v1.75h1.75v1.166z"/>
                  </svg>
                  <span className="font-display font-semibold text-lg">Connect Google Classroom</span>
                </button>
              </div>
            ) : (
              <div className="space-y-5">
                <button
                  onClick={handleSync}
                  disabled={syncing}
                  className="w-full flex items-center justify-center space-x-2 bg-gradient-to-r from-[#14b8a6] to-[#0d9488] shadow-lg shadow-[rgba(20,184,166,0.15)] text-white px-6 py-4 rounded-xl hover:shadow-lg hover:shadow-[rgba(20,184,166,0.25)] transition-all duration-300 disabled:opacity-50 font-display font-semibold"
                >
                  <RefreshCw className={`w-5 h-5 ${syncing ? 'animate-spin' : ''}`} />
                  <span>{syncing ? 'Syncing...' : 'Sync Now'}</span>
                </button>

                <div className="grid md:grid-cols-2 gap-4">
                  <button
                    onClick={() => navigate('/tasks')}
                    className="flex items-center justify-center space-x-2 border border-[rgba(20,184,166,0.15)] text-[#14b8a6] px-6 py-3 rounded-xl hover:bg-[rgba(20,184,166,0.06)] transition-all duration-300 font-display font-semibold"
                  >
                    <span>View Tasks</span>
                    <ExternalLink className="w-4 h-4" />
                  </button>

                  <button
                    onClick={() => navigate('/calendar')}
                    className="flex items-center justify-center space-x-2 border border-[var(--border-color)] text-[#14b8a6] px-6 py-3 rounded-xl hover:bg-[var(--hover-bg)] transition-all duration-300 font-display font-semibold"
                  >
                    <span>View Calendar</span>
                    <ExternalLink className="w-4 h-4" />
                  </button>
                </div>

                <button
                  onClick={handleDisconnect}
                  className="w-full text-[#ef4444] hover:bg-[rgba(239,68,68,0.08)] px-6 py-3 rounded-xl transition-all border border-[rgba(239,68,68,0.12)] font-medium"
                >
                  Disconnect Google Classroom
                </button>
              </div>
            )}
          </div>

          <div className="bg-[rgba(139,92,246,0.04)] rounded-xl p-6 border border-[rgba(139,92,246,0.08)]">
            <div className="flex items-start space-x-3">
              <AlertCircle className="w-6 h-6 text-[#8b5cf6] flex-shrink-0 mt-0.5" />
              <div className="text-sm text-[#8b5cf6]/80">
                <p className="font-semibold text-[#8b5cf6] mb-2">About Google Classroom Integration:</p>
                <p>
                  Once connected, Strike will automatically sync your Google Classroom assignments, create tasks with due dates, and add deadlines to your calendar. You can sync anytime to get the latest assignments.
                </p>
              </div>
            </div>
          </div>

          {/* Deadline Display - Only show when connected and has deadlines */}
          {status.connected && deadlines.length > 0 && (
            <div className="mt-8">
              <h3 className="text-base font-display font-bold text-[var(--text-primary)] mb-6 flex items-center gap-3">
                <Calendar className="w-6 h-6 text-[#14b8a6]" />
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
                          ? 'bg-[rgba(239,68,68,0.08)] border-[rgba(239,68,68,0.15)]'
                          : isUrgent
                          ? 'bg-[rgba(20,184,166,0.06)] border-[rgba(20,184,166,0.12)]'
                          : 'bg-[var(--bg-secondary)] border-[var(--border-color)]'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          <div className="w-10 h-10 flex items-center justify-center bg-[rgba(20,184,166,0.06)] text-[#14b8a6]">
                            <BookOpen className="w-5 h-5" />
                          </div>
                          <div>
                            <h4 className="font-bold text-[var(--text-primary)]">{deadline.title}</h4>
                            <p className="text-sm text-[var(--text-tertiary)]">{deadline.course}</p>
                          </div>
                        </div>
                        <div className={`text-right ${
                          isOverdue ? 'text-[#ef4444]' : isUrgent ? 'text-[#14b8a6]' : 'text-[var(--text-secondary)]'
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
