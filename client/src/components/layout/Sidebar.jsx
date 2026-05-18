import { Link, useLocation, useNavigate } from 'react-router-dom';
import { 
  LayoutDashboard, 
  CheckSquare, 
  Folder, 
  TrendingUp,
  Calendar,
  BookOpen,
  LogOut, 
  Zap,
  Menu,
  X,
  Sun,
  Moon,
  BarChart3,
  StickyNote
} from 'lucide-react';
import { useState } from 'react';
import { useTheme } from '../theme-provider';

const Sidebar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);
  const { theme, toggleTheme } = useTheme();
  
  const user = JSON.parse(localStorage.getItem('user') || '{}');

  const handleLogout = () => {
    localStorage.clear();
    navigate('/login');
  };

  const menuItems = [
    { path: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
    { path: '/analytics', icon: BarChart3, label: 'Analytics' },
    { path: '/tasks', icon: CheckSquare, label: 'Tasks' },
    { path: '/boards', icon: Folder, label: 'Boards' },
    { path: '/habits', icon: TrendingUp, label: 'Habits' },
    { path: '/calendar', icon: Calendar, label: 'Calendar' },
    { path: '/notes', icon: StickyNote, label: 'Notes' },
    { path: '/classroom', icon: BookOpen, label: 'Classroom' },
  ];

  const SidebarContent = () => (
    <>
      <div className="p-6 border-b border-[var(--border-color)]">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-gradient-strike rounded-none flex items-center justify-center shadow-lg shadow-amber/20">
            <Zap className="w-6 h-6 text-white" />
          </div>
          <span className="text-xl font-display font-bold text-[var(--text-primary)]">Strike</span>
        </div>
      </div>

      {/* Theme Toggle */}
      <div className="px-6 py-4 border-b border-[var(--border-color)]">
        <button
          onClick={toggleTheme}
          className="w-full flex items-center justify-between group"
        >
          <span className="text-sm font-medium text-[var(--text-secondary)] group-hover:text-[var(--text-primary)] transition-colors">
            {theme === 'dark' ? 'Dark Mode' : 'Light Mode'}
          </span>
          <div className={`w-12 h-7 rounded-none border border-[var(--border-color)] relative transition-all duration-300 ${
            theme === 'dark' ? 'bg-obsidian-light' : 'bg-amber/20'
          }`}>
            <div className={`absolute top-1 w-5 h-5 transition-all duration-300 ${
              theme === 'dark' ? 'left-1 bg-gradient-strike' : 'left-6 bg-amber'
            }`}>
              {theme === 'dark' ? (
                <Moon className="w-3 h-3 text-white" />
              ) : (
                <Sun className="w-3 h-3 text-white" />
              )}
            </div>
          </div>
        </button>
      </div>

      <nav className="flex-1 p-4 overflow-y-auto">
        <ul className="space-y-1">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;
            
            return (
              <li key={item.path}>
                <Link
                  to={item.path}
                  onClick={() => setMobileOpen(false)}
                  className={`flex items-center space-x-3 px-4 py-3 rounded-none transition-all duration-300 group ${
                    isActive
                      ? 'bg-gradient-strike text-white shadow-lg shadow-amber/20'
                      : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-tertiary)]'
                  }`}
                >
                  <Icon className="w-5 h-5 transition-transform duration-300 group-hover:scale-110" />
                  <span className="font-medium text-sm">{item.label}</span>
                  {isActive && (
                    <div className="ml-auto w-1.5 h-1.5 bg-white animate-pulse" />
                  )}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      <div className="p-4 border-t border-[var(--border-color)]">
        {/* Profile Section */}
        <div className="flex items-center space-x-3 mb-4 p-2">
          <div className="w-10 h-10 bg-gradient-strike rounded-none flex items-center justify-center text-white font-display font-bold text-sm shadow-lg shadow-amber/20">
            {user.name?.charAt(0).toUpperCase() || 'U'}
          </div>
          <div className="flex-1 min-w-0">
            <div className="font-display font-semibold text-[var(--text-primary)] text-sm truncate">{user.name || 'User'}</div>
            <div className="text-xs text-[var(--text-tertiary)] truncate">{user.email || ''}</div>
          </div>
        </div>
        
        <button
          onClick={handleLogout}
          className="w-full flex items-center space-x-3 px-4 py-3 text-rose hover:bg-rose/10 rounded-none transition-all duration-300 group"
        >
          <LogOut className="w-5 h-5 transition-transform duration-300 group-hover:translate-x-1" />
          <span className="font-medium text-sm">Logout</span>
        </button>
      </div>
    </>
  );

  return (
    <>
      <button
        onClick={() => setMobileOpen(!mobileOpen)}
        className="lg:hidden fixed top-4 left-4 z-50 p-2.5 bg-[var(--bg-secondary)] border border-[var(--border-color)] shadow-lg"
      >
        {mobileOpen ? <X className="w-5 h-5 text-[var(--text-primary)]" /> : <Menu className="w-5 h-5 text-[var(--text-primary)]" />}
      </button>

      <div className="hidden lg:flex lg:w-64 lg:flex-col lg:fixed lg:inset-y-0 bg-[var(--bg-primary)] border-r border-[var(--border-color)] z-40">
        <SidebarContent />
      </div>

      {mobileOpen && (
        <>
          <div 
            className="lg:hidden fixed inset-0 bg-black/60 backdrop-blur-sm z-40"
            onClick={() => setMobileOpen(false)}
          />
          <div className="lg:hidden fixed inset-y-0 left-0 w-64 bg-[var(--bg-primary)] border-r border-[var(--border-color)] z-50 flex flex-col animate-reveal">
            <SidebarContent />
          </div>
        </>
      )}
    </>
  );
};

export default Sidebar;