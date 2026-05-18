import { Link } from 'react-router-dom';
import { 
  ArrowRight, 
  Zap, 
  Target, 
  Calendar,
  LayoutDashboard,
  TrendingUp,
  Star,
  Menu,
  X,
  Play,
  Check,
  Bolt,
  Flame,
  Trophy,
  Rocket,
  Sparkles,
  ChevronDown
} from 'lucide-react';
import { useState, useEffect } from 'react';
import { useTheme } from '../components/theme-provider';

const Landing = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const { theme, toggleTheme } = useTheme();

  useEffect(() => {
    const handleMouseMove = (e) => {
      setMousePos({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  const features = [
    { icon: LayoutDashboard, title: 'Dashboard', desc: 'Beautiful real-time overview with charts, stats & insights', color: 'from-amber to-orange' },
    { icon: Target, title: 'Boards', desc: 'Powerful kanban boards with drag & drop simplicity', color: 'from-violet to-pink' },
    { icon: Calendar, title: 'Calendar', desc: 'Integrated calendar with deadlines & scheduling', color: 'from-cyan to-blue' },
    { icon: TrendingUp, title: 'Habits', desc: 'Track habits & build streaks with visual progress', color: 'from-emerald to-green' },
  ];

  const steps = [
    { icon: 1, title: 'Sign Up', desc: 'Create your free account in seconds', color: 'bg-amber' },
    { icon: 2, title: 'Add Tasks', desc: 'Create boards & add your first tasks', color: 'bg-violet' },
    { icon: 3, title: 'Crush It', desc: 'Track progress & achieve your goals', color: 'bg-cyan' },
  ];

  return (
    <div className={`min-h-screen overflow-hidden ${theme === 'dark' ? 'bg-[#08080f]' : 'bg-[#fefefe]'}`}>
      {/* FLOATING SHAPES */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className={`absolute w-96 h-96 rounded-full blur-[120px] opacity-30 ${theme === 'dark' ? 'bg-amber' : 'bg-amber/40'}`} style={{ top: '10%', left: '5%', animation: 'float 10s ease-in-out infinite' }} />
        <div className={`absolute w-80 h-80 rounded-full blur-[100px] opacity-25 ${theme === 'dark' ? 'bg-violet' : 'bg-violet/40'}`} style={{ bottom: '20%', right: '10%', animation: 'float 12s ease-in-out infinite', animationDelay: '-5s' }} />
        <div className={`absolute w-64 h-64 rounded-full blur-[80px] opacity-20 ${theme === 'dark' ? 'bg-cyan' : 'bg-cyan/40'}`} style={{ top: '50%', left: '40%', animation: 'float 8s ease-in-out infinite', animationDelay: '-2s' }} />
      </div>

      {/* HEADER */}
      <header className={`fixed top-0 w-full z-50 backdrop-blur-xl border-b ${theme === 'dark' ? 'bg-[#08080f]/90 border-white/5' : 'bg-[#fefefe]/90 border-black/5'}`}>
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <Link to="/" className="flex items-center gap-3 group">
              <div className="w-10 h-10 bg-gradient-to-r from-amber via-orange-500 to-amber flex items-center justify-center shadow-lg group-hover:scale-110 group-hover:rotate-12 transition-all duration-300">
                <Zap className="w-5 h-5 text-white" />
              </div>
              <span className={`text-xl font-display font-black tracking-tight ${theme === 'dark' ? 'text-white' : 'text-black'}`}>Strike</span>
            </Link>

            <nav className="hidden md:flex items-center gap-6">
              <a href="#features" className={`text-sm font-medium hover:text-amber transition-colors ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>Features</a>
              <a href="#how" className={`text-sm font-medium hover:text-amber transition-colors ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>How it Works</a>
              <a href="#testimonials" className={`text-sm font-medium hover:text-amber transition-colors ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>Reviews</a>
              
              <button onClick={toggleTheme} className="p-2 hover:bg-gray-100 dark:hover:bg-white/10 transition-colors rounded-full">
                {theme === 'dark' ? (
                  <svg className="w-5 h-5 text-amber" fill="currentColor" viewBox="0 0 20 20"><path d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z"/></svg>
                ) : (
                  <svg className="w-5 h-5 text-black" fill="currentColor" viewBox="0 0 20 20"><path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z"/></svg>
                )}
              </button>

              <Link to="/login" className={`text-sm font-medium hover:text-amber transition-colors ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>Login</Link>
              <Link to="/signup" className="px-5 py-2.5 bg-black dark:bg-white text-white dark:text-black font-semibold text-sm hover:scale-105 transition-transform">
                Get Started
              </Link>
            </nav>

            <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="md:hidden p-2">
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </header>

      {/* MOBILE MENU */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-40 bg-[var(--bg-primary)] pt-24 px-6 md:hidden">
          <div className="space-y-4">
            <a href="#features" className="block py-3 font-semibold">Features</a>
            <a href="#how" className="block py-3 font-semibold">How it Works</a>
            <a href="#testimonials" className="block py-3 font-semibold">Reviews</a>
            <Link to="/login" className="block py-3 font-semibold">Login</Link>
            <Link to="/signup" className="block py-4 bg-black dark:bg-white text-white dark:text-black text-center font-semibold mt-6">Get Started</Link>
          </div>
        </div>
      )}

      {/* HERO */}
      <section className="relative pt-36 pb-24 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-amber/10 border border-amber/20">
                <Bolt className="w-4 h-4 text-amber" />
                <span className="text-xs font-bold text-amber uppercase tracking-wider">New: Google Classroom Sync</span>
              </div>

              <h1 className="text-5xl md:text-6xl lg:text-7xl font-display font-black leading-[0.9]">
                <span className={theme === 'dark' ? 'text-white' : 'text-black'}>Master Your</span>
                <br />
                <span className="bg-gradient-to-r from-amber via-orange-500 to-amber bg-clip-text text-transparent">Productivity</span>
              </h1>

              <p className={`text-lg leading-relaxed max-w-lg ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                Strike combines task management, boards, habits & reminders. Everything you need to crush your goals in one powerful app.
              </p>

              <div className="flex flex-col sm:flex-row gap-4">
                <Link to="/signup" className="group px-8 py-4 bg-gradient-to-r from-amber to-orange-500 text-white font-bold flex items-center justify-center gap-2 hover:shadow-xl hover:shadow-amber/30 transition-all hover:scale-105">
                  Start Free <ArrowRight className="w-5 h-5 group-hover:translate-x-1" />
                </Link>
                <button className="px-8 py-4 border-2 border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-300 font-bold flex items-center justify-center gap-2 hover:border-amber hover:text-amber transition-all">
                  <Play className="w-4 h-4" /> Watch Demo
                </button>
              </div>

              <div className="flex items-center gap-8 pt-4">
                {[
                  { num: '10K+', label: 'Users' },
                  { num: '500K+', label: 'Tasks' },
                  { num: '98%', label: 'Happy' },
                ].map((stat, i) => (
                  <div key={i}>
                    <div className="text-2xl font-display font-black text-amber">{stat.num}</div>
                    <div className="text-xs text-gray-500">{stat.label}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* FUN DASHBOARD PREVIEW */}
            <div className="relative">
              <div className={`relative p-6 ${theme === 'dark' ? 'bg-[#0f0f1a] border border-white/10' : 'bg-white border border-gray-200'} shadow-2xl`}>
                {/* Header */}
                <div className="flex items-center justify-between mb-6 pb-4 border-b border-gray-200 dark:border-white/10">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-gradient-to-r from-amber to-orange-500 flex items-center justify-center">
                      <Zap className="w-4 h-4 text-white" />
                    </div>
                    <span className="font-display font-bold text-lg">Dashboard</span>
                  </div>
                  <div className="flex gap-1">
                    <div className="w-3 h-3 rounded-full bg-emerald"></div>
                    <div className="w-3 h-3 rounded-full bg-amber"></div>
                    <div className="w-3 h-3 rounded-full bg-rose"></div>
                  </div>
                </div>
                
                {/* Stats Row */}
                <div className="grid grid-cols-4 gap-3 mb-6">
                  {[
                    { num: '24', label: 'Total', c: 'text-amber' },
                    { num: '18', label: 'Done', c: 'text-emerald' },
                    { num: '6', label: 'Left', c: 'text-rose' },
                    { num: '🔥23', label: 'Streak', c: 'text-orange-500' },
                  ].map((s, i) => (
                    <div key={i} className={`text-center p-3 ${theme === 'dark' ? 'bg-[#08080f]' : 'bg-gray-50'}`}>
                      <div className={`text-xl font-display font-bold ${s.c}`}>{s.num}</div>
                      <div className="text-[10px] text-gray-500">{s.label}</div>
                    </div>
                  ))}
                </div>

                {/* Progress Bars */}
                <div className="space-y-2 mb-6">
                  <div className="flex items-center gap-2">
                    <span className="text-xs w-16 text-gray-500">Completed</span>
                    <div className="flex-1 h-2 bg-gray-200 dark:bg-gray-700">
                      <div className="h-full w-[75%] bg-gradient-to-r from-emerald to-green-400"></div>
                    </div>
                    <span className="text-xs font-bold text-emerald">75%</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs w-16 text-gray-500">In Progress</span>
                    <div className="flex-1 h-2 bg-gray-200 dark:bg-gray-700">
                      <div className="h-full w-[50%] bg-gradient-to-r from-amber to-orange-400"></div>
                    </div>
                    <span className="text-xs font-bold text-amber">50%</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs w-16 text-gray-500">High Priority</span>
                    <div className="flex-1 h-2 bg-gray-200 dark:bg-gray-700">
                      <div className="h-full w-[90%] bg-gradient-to-r from-rose to-red-400"></div>
                    </div>
                    <span className="text-xs font-bold text-rose">90%</span>
                  </div>
                </div>

                {/* Mini Cards */}
                <div className="grid grid-cols-2 gap-3">
                  <div className="p-3 border-l-4 border-emerald bg-emerald/5">
                    <div className="text-xs text-gray-500">Today's Tasks</div>
                    <div className="text-lg font-display font-bold text-emerald">5/8</div>
                  </div>
                  <div className="p-3 border-l-4 border-amber bg-amber/5">
                    <div className="text-xs text-gray-500">This Week</div>
                    <div className="text-lg font-display font-bold text-amber">23</div>
                  </div>
                </div>
              </div>

              {/* Floating badges */}
              <div className="absolute -top-4 -right-4 px-4 py-2 bg-gradient-to-r from-amber to-orange-500 text-white font-bold text-sm shadow-lg animate-bounce">
                🚀 v2.0 Live
              </div>
              <div className="absolute -bottom-3 -left-3 px-3 py-1.5 bg-emerald text-white font-bold text-xs">
                ✓ Synced
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FEATURES - FUN CARDS */}
      <section id="features" className="py-24 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <span className="text-amber font-bold text-sm tracking-widest uppercase">Features</span>
            <h2 className="text-4xl md:text-5xl font-display font-black mt-4" style={{ color: theme === 'dark' ? 'white' : 'black' }}>
              Everything You Need
            </h2>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((f, i) => {
              const Icon = f.icon;
              return (
                <div key={i} className={`group p-6 transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl ${theme === 'dark' ? 'bg-[#0f0f1a] border border-white/10' : 'bg-white border border-gray-200'}`}>
                  <div className={`w-12 h-12 bg-gradient-to-r ${f.color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                    <Icon className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="font-display font-bold text-lg mb-2" style={{ color: theme === 'dark' ? 'white' : 'black' }}>{f.title}</h3>
                  <p className="text-sm" style={{ color: theme === 'dark' ? '#9ca3af' : '#6b7280' }}>{f.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* HOW IT WORKS - FUN STYLE */}
      <section id="how" className="py-24 px-6" style={{ background: theme === 'dark' ? 'linear-gradient(180deg, #08080f 0%, #0f0f1a 100%)' : 'linear-gradient(180deg, #fefefe 0%, #f5f5f5 100%)' }}>
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <span className="text-violet font-bold text-sm tracking-widest uppercase">How It Works</span>
            <h2 className="text-4xl md:text-5xl font-display font-black mt-4" style={{ color: theme === 'dark' ? 'white' : 'black' }}>
              Get Started in 3 Steps
            </h2>
          </div>

          <div className="flex flex-col md:flex-row items-center justify-center gap-8">
            {steps.map((s, i) => (
              <div key={i} className="relative group">
                <div className={`w-24 h-24 ${s.color} rounded-2xl flex items-center justify-center text-3xl font-display font-black text-white shadow-xl group-hover:scale-110 transition-transform`}>
                  {s.icon}
                </div>
                <div className={`mt-4 text-center p-4 ${theme === 'dark' ? 'bg-[#0f0f1a]' : 'bg-white'} border border-gray-200`}>
                  <h4 className="font-display font-bold" style={{ color: theme === 'dark' ? 'white' : 'black' }}>{s.title}</h4>
                  <p className="text-sm text-gray-500">{s.desc}</p>
                </div>
                {i < steps.length - 1 && (
                  <ArrowRight className="hidden md:block absolute -right-6 top-12 w-8 h-8 text-gray-400" />
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section id="testimonials" className="py-24 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <span className="text-cyan font-bold text-sm tracking-widest uppercase">Reviews</span>
            <h2 className="text-4xl md:text-5xl font-display font-black mt-4" style={{ color: theme === 'dark' ? 'white' : 'black' }}>
              Loved by Thousands
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {[
              { name: 'Alex R.', role: 'Productivity Guru', text: 'This app is a game-changer! My productivity has skyrocketed 🚀', stars: 5 },
              { name: 'Sarah K.', role: 'Designer', text: 'The beautiful design makes me actually want to use it every day', stars: 5 },
              { name: 'Marcus J.', role: 'Student', text: 'Google Classroom sync saved me so many times. Thank you Strike!', stars: 5 },
            ].map((t, i) => (
              <div key={i} className={`p-6 ${theme === 'dark' ? 'bg-[#0f0f1a] border border-white/10' : 'bg-white border border-gray-200'}`}>
                <div className="flex gap-1 mb-4">
                  {[...Array(t.stars)].map((_, j) => <Star key={j} className="w-4 h-4 fill-amber text-amber" />)}
                </div>
                <p className="mb-4" style={{ color: theme === 'dark' ? '#9ca3af' : '#6b7280' }}>"{t.text}"</p>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gradient-to-r from-amber to-orange-500 flex items-center justify-center text-white font-bold rounded-full">
                    {t.name[0]}
                  </div>
                  <div>
                    <div className="font-bold" style={{ color: theme === 'dark' ? 'white' : 'black' }}>{t.name}</div>
                    <div className="text-xs text-gray-500">{t.role}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <div className={`p-12 ${theme === 'dark' ? 'bg-gradient-to-br from-amber/20 via-[#0f0f1a] to-violet/20 border border-amber/20' : 'bg-gradient-to-br from-amber/10 to-violet/10 border border-amber/20'}`}>
            <Rocket className="w-16 h-16 text-amber mx-auto mb-6" />
            <h2 className="text-4xl md:text-5xl font-display font-black mb-4" style={{ color: theme === 'dark' ? 'white' : 'black' }}>
              Ready to Strike?
            </h2>
            <p className="text-lg mb-8" style={{ color: theme === 'dark' ? '#9ca3af' : '#6b7280' }}>
              Join thousands of users and start crushing your goals today!
            </p>
            <Link to="/signup" className="inline-flex items bg-gradient-to-r from-amber to-orange-500 text-white px-10 py-4 font-bold text-lg hover:shadow-xl hover:shadow-amber/30 hover:scale-105 transition-all">
              Get Started Free <ArrowRight className="ml-2" />
            </Link>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="py-10 px-6 border-t border-gray-200 dark:border-white/10">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-gradient-to-r from-amber to-orange-500 flex items-center justify-center">
              <Zap className="w-4 h-4 text-white" />
            </div>
            <span className="font-display font-bold" style={{ color: theme === 'dark' ? 'white' : 'black' }}>Strike</span>
          </div>
          <div className="flex items-center gap-6 text-sm text-gray-500">
            <a href="#" className="hover:text-amber">Privacy</a>
            <a href="#" className="hover:text-amber">Terms</a>
            <a href="#" className="hover:text-amber">Contact</a>
          </div>
          <div className="text-sm text-gray-500">© 2026 Strike</div>
        </div>
      </footer>
    </div>
  );
};

export default Landing;