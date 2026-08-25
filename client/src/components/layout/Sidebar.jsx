import { Link, useLocation, useNavigate } from 'react-router-dom';
import { 
  LayoutDashboard, 
  CheckSquare, 
  Folder, 
  TrendingUp,
  Calendar,
  LogOut, 
  Zap,
  Menu,
  X,
  Sun,
  Moon,
  BarChart3,
  StickyNote,
  BookOpen
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
    <div className="flex flex-col h-full">
      {/* Logo */}
      <div className="px-4 pt-5 pb-3">
        <Link to="/" className="flex items-center gap-2.5 group">
          <div className="w-8 h-8 bg-gradient-to-br from-[#14b8a6] to-[#0d9488] rounded-lg flex items-center justify-center group-hover:scale-105 transition-transform shadow-lg shadow-[rgba(20,184,166,0.15)]">
            <Zap className="w-4 h-4 text-white" />
          </div>
          <span className="text-base font-display font-bold text-[var(--text-primary)] tracking-tight">Strike</span>
        </Link>
      </div>

      {/* Divider */}
      <div className="mx-4 h-px bg-[var(--border-color)]" />

      {/* Navigation */}
      <nav className="flex-1 px-2.5 py-3 overflow-y-auto">
        <ul className="space-y-0.5">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;
            return (
              <li key={item.path}>
                <Link
                  to={item.path}
                  onClick={() => setMobileOpen(false)}
                  className={`sidebar-nav-item ${isActive ? 'active' : ''}`}
                >
                  <Icon className="w-4 h-4 flex-shrink-0" strokeWidth={isActive ? 2.2 : 1.8} />
                  <span>{item.label}</span>
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* Bottom section */}
      <div className="px-2.5 pb-3 space-y-1">
        <div className="mx-1.5 h-px bg-[var(--border-color)] mb-2" />
        
        {/* Theme toggle */}
        <button
          onClick={toggleTheme}
          className="sidebar-nav-item w-full"
        >
          {theme === 'dark' ? (
            <Sun className="w-4 h-4" strokeWidth={1.8} />
          ) : (
            <Moon className="w-4 h-4" strokeWidth={1.8} />
          )}
          <span>{theme === 'dark' ? 'Light mode' : 'Dark mode'}</span>
        </button>

        {/* User */}
        <div className="flex items-center gap-2.5 px-3 py-2 rounded-lg">
          <div className="w-7 h-7 bg-gradient-to-br from-[#14b8a6] to-[#0d9488] rounded-md flex items-center justify-center text-white font-display font-bold text-[10px] flex-shrink-0">
            {user.name?.charAt(0).toUpperCase() || 'U'}
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-xs font-medium text-[var(--text-primary)] truncate leading-tight">{user.name || 'User'}</div>
            <div className="text-[10px] text-[var(--text-tertiary)] truncate leading-tight">{user.email || ''}</div>
          </div>
        </div>

        {/* Logout */}
        <button
          onClick={handleLogout}
          className="sidebar-nav-item w-full text-[var(--text-tertiary)] hover:text-[#ef4444] hover:bg-[rgba(239,68,68,0.06)]"
        >
          <LogOut className="w-4 h-4" strokeWidth={1.8} />
          <span>Logout</span>
        </button>
      </div>
    </div>
  );

  return (
    <>
      {/* Mobile toggle */}
      <button
        onClick={() => setMobileOpen(!mobileOpen)}
        className="lg:hidden fixed top-3 left-3 z-50 p-2 bg-[var(--bg-secondary)] border border-[var(--border-color)] rounded-lg shadow-lg"
      >
        {mobileOpen ? <X className="w-4 h-4 text-[var(--text-primary)]" /> : <Menu className="w-4 h-4 text-[var(--text-primary)]" />}
      </button>

      {/* Desktop sidebar */}
      <div className="hidden lg:flex lg:w-52 lg:flex-col lg:fixed lg:inset-y-0 bg-[var(--sidebar-bg)] border-r border-[var(--border-color)] z-40">
        <SidebarContent />
      </div>

      {/* Mobile sidebar */}
      {mobileOpen && (
        <>
          <div 
            className="lg:hidden fixed inset-0 bg-black/40 backdrop-blur-sm z-40"
            onClick={() => setMobileOpen(false)}
          />
          <div className="lg:hidden fixed inset-y-0 left-0 w-52 bg-[var(--sidebar-bg)] border-r border-[var(--border-color)] z-50 flex flex-col animate-reveal">
            <SidebarContent />
          </div>
        </>
      )}
    </>
  );
};

export default Sidebar;
