import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../../components/Layout/Sidebar';
import classroomService from '../../services/classroomService';
import { 
  RefreshCw, 
  CheckCircle, 
  XCircle, 
  ExternalLink,
  AlertCircle
} from 'lucide-react';

const Classroom = () => {
  const navigate = useNavigate();
  const [status, setStatus] = useState({ connected: false, lastSync: null });
  const [syncing, setSyncing] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    loadStatus();
    
    // Check if redirected from OAuth with success/error
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
    } catch (error) {
      console.error('Error loading status:', error);
    }
  };

  const handleConnect = async () => {
    try {
      const response = await classroomService.getAuthUrl();
      // Redirect to Google OAuth
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
    <div className="min-h-screen bg-gray-50 flex">
      <Sidebar />
      
      <div className="flex-1 lg:ml-64">
        <div className="p-8 max-w-4xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-[#0e1b48] mb-2">Google Classroom</h1>
            <p className="text-gray-600">Sync your assignments and deadlines automatically</p>
          </div>

          {/* Message */}
          {message && (
            <div className="mb-6 p-4 bg-blue-50 border-l-4 border-blue-500 rounded-lg">
              <p className="text-blue-700">{message}</p>
            </div>
          )}

          {/* Status Card */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 mb-6">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center space-x-4">
                {status.connected ? (
                  <CheckCircle className="w-12 h-12 text-green-500" />
                ) : (
                  <XCircle className="w-12 h-12 text-gray-400" />
                )}
                <div>
                  <h2 className="text-2xl font-bold text-[#0e1b48]">
                    {status.connected ? 'Connected' : 'Not Connected'}
                  </h2>
                  {status.lastSync && (
                    <p className="text-sm text-gray-600">
                      Last synced: {new Date(status.lastSync).toLocaleString()}
                    </p>
                  )}
                </div>
              </div>
            </div>

            {!status.connected ? (
              <div>
                <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl p-6 mb-6">
                  <h3 className="font-semibold text-[#0e1b48] mb-3">What happens when you connect?</h3>
                  <ul className="space-y-2 text-sm text-gray-700">
                    <li className="flex items-start space-x-2">
                      <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                      <span>Automatically fetch all your Google Classroom assignments</span>
                    </li>
                    <li className="flex items-start space-x-2">
                      <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                      <span>Create tasks with due dates in your "Google Classroom" board</span>
                    </li>
                    <li className="flex items-start space-x-2">
                      <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                      <span>Add deadlines to your calendar automatically</span>
                    </li>
                    <li className="flex items-start space-x-2">
                      <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                      <span>Sync anytime to get the latest assignments</span>
                    </li>
                  </ul>
                </div>

                <button
                  onClick={handleConnect}
                  className="w-full flex items-center justify-center space-x-3 bg-[#4285f4] text-white px-8 py-4 rounded-xl hover:bg-[#3367d6] transition-all shadow-lg"
                >
                  <svg className="w-6 h-6" viewBox="0 0 24 24">
                    <path fill="currentColor" d="M12 0c-6.627 0-12 5.373-12 12s5.373 12 12 12 12-5.373 12-12-5.373-12-12-12zm-2.917 16.083c-2.258 0-4.083-1.825-4.083-4.083s1.825-4.083 4.083-4.083c1.103 0 2.024.402 2.735 1.067l-1.107 1.068c-.304-.292-.834-.63-1.628-.63-1.394 0-2.531 1.155-2.531 2.579 0 1.424 1.138 2.579 2.531 2.579 1.616 0 2.224-1.162 2.316-1.762h-2.316v-1.4h3.855c.036.204.064.408.064.677.001 2.332-1.563 3.988-3.919 3.988zm9.917-3.5h-1.75v1.75h-1.167v-1.75h-1.75v-1.166h1.75v-1.75h1.167v1.75h1.75v1.166z"/>
                  </svg>
                  <span className="font-semibold text-lg">Connect Google Classroom</span>
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                <button
                  onClick={handleSync}
                  disabled={syncing}
                  className="w-full flex items-center justify-center space-x-2 bg-gradient-to-r from-[#c18db4] to-[#0e1b48] text-white px-6 py-4 rounded-xl hover:shadow-lg transition-all disabled:opacity-50"
                >
                  <RefreshCw className={`w-5 h-5 ${syncing ? 'animate-spin' : ''}`} />
                  <span className="font-semibold">{syncing ? 'Syncing...' : 'Sync Now'}</span>
                </button>

                <div className="grid md:grid-cols-2 gap-4">
                  <button
                    onClick={() => navigate('/tasks')}
                    className="flex items-center justify-center space-x-2 border-2 border-[#c18db4] text-[#c18db4] px-6 py-3 rounded-xl hover:bg-[#c18db4] hover:text-white transition-all"
                  >
                    <span>View Tasks</span>
                    <ExternalLink className="w-4 h-4" />
                  </button>

                  <button
                    onClick={() => navigate('/calendar')}
                    className="flex items-center justify-center space-x-2 border-2 border-[#0e1b48] text-[#0e1b48] px-6 py-3 rounded-xl hover:bg-[#0e1b48] hover:text-white transition-all"
                  >
                    <span>View Calendar</span>
                    <ExternalLink className="w-4 h-4" />
                  </button>
                </div>

                <button
                  onClick={handleDisconnect}
                  className="w-full text-red-600 hover:bg-red-50 px-6 py-3 rounded-xl transition-all border border-red-200"
                >
                  Disconnect Google Classroom
                </button>
              </div>
            )}
          </div>

          {/* Info Card */}
          <div className="bg-blue-50 rounded-2xl p-6 border border-blue-100">
            <div className="flex items-start space-x-3">
              <AlertCircle className="w-6 h-6 text-blue-600 flex-shrink-0 mt-0.5" />
              <div className="text-sm text-blue-800">
                <p className="font-semibold mb-2">How to get Google OAuth Credentials:</p>
                <ol className="list-decimal list-inside space-y-1">
                  <li>Go to Google Cloud Console</li>
                  <li>Create a new project or select existing</li>
                  <li>Enable Google Classroom API</li>
                  <li>Create OAuth 2.0 credentials</li>
                  <li>Add redirect URI: http://localhost:5000/api/google/callback</li>
                  <li>Copy Client ID and Secret to server/.env</li>
                </ol>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Classroom;