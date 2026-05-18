import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { X, AlertTriangle, Clock, BookOpen } from 'lucide-react';

const Notifications = () => {
  const location = useLocation();
  const { notifications, clearNotification, clearAllNotifications } = useApp();

  // Public routes where notifications should NOT show
  const publicRoutes = ['/', '/login', '/signup'];
  const isPublicRoute = publicRoutes.includes(location.pathname);

  // Force clear notifications on public routes or if not authenticated
  useEffect(() => {
    const token = localStorage.getItem('token');
    const user = localStorage.getItem('user');
    
    if (!token || !user || isPublicRoute) {
      clearAllNotifications();
    }
  }, [location.pathname]);

  // Don't render on public routes or if no auth
  const token = localStorage.getItem('token');
  const user = localStorage.getItem('user');
  
  if (!token || !user || isPublicRoute || notifications.length === 0) {
    return null;
  }

  return (
    <div className="fixed top-4 right-4 z-50 space-y-2 max-w-sm">
      {notifications.map((notification) => (
        <div
          key={notification.id}
          className="p-4 border shadow-lg animate-slide-in bg-rose/90 border-rose text-white"
        >
          <div className="flex items-start gap-3">
            <div className="flex-shrink-0 mt-0.5">
              {notification.type.includes('overdue') ? (
                <AlertTriangle className="w-5 h-5" />
              ) : notification.type.includes('classroom') ? (
                <BookOpen className="w-5 h-5" />
              ) : (
                <Clock className="w-5 h-5" />
              )}
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-bold text-sm">{notification.title}</p>
              <p className="text-sm opacity-90 mt-1">{notification.message}</p>
            </div>
            <button
              onClick={() => clearNotification(notification.id)}
              className="flex-shrink-0 hover:opacity-70 transition-opacity"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default Notifications;