import { Link } from 'react-router-dom';
import { 
  ArrowRight, 
  Zap, 
  Target, 
  Calendar,
  LayoutDashboard,
  TrendingUp,
  Menu,
  X,
  Check,
  Rocket,
  BookOpen,
  StickyNote,
  BarChart3,
  Sparkles,
  Star,
  Flame,
  Trophy,
  Clock,
  Palette
} from 'lucide-react';
import { useState, useEffect, useRef } from 'react';
import { useTheme } from '../components/theme-provider';

const Landing = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [visibleSections, setVisibleSections] = useState(new Set());
  const { theme, toggleTheme } = useTheme();
  const heroRef = useRef(null);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            setVisibleSections(prev => new Set([...prev, entry.target.id]));
          }
        });
      },
      { threshold: 0.15 }
    );

    document.querySelectorAll('[data-animate]').forEach(el => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const handleMouseMove = (e) => {
      if (heroRef.current) {
        const rect = heroRef.current.getBoundingClientRect();
        setMousePos({
          x: (e.clientX - rect.left) / rect.width,
          y: (e.clientY - rect.top) / rect.height,
        });
      }
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  const features = [
    { icon: LayoutDashboard, title: 'Dashboard', desc: 'Real-time overview with charts and insights that actually make sense', color: 'from-amber to-orange-500', tag: 'Popular' },
    { icon: Target, title: 'Boards', desc: 'Kanban boards with drag & drop to organize your workflow', color: 'from-violet to-pink-500', tag: null },
    { icon: Calendar, title: 'Calendar', desc: 'Integrated calendar with deadlines and event scheduling', color: 'from-cyan to-blue-500', tag: null },
    { icon: TrendingUp, title: 'Habits', desc: 'Track daily habits and build streaks that stick', color: 'from-emerald to-green-500', tag: 'New' },
    { icon: StickyNote, title: 'Notes', desc: 'Rich text notes with a book-like writing experience', color: 'from-orange-400 to-amber', tag: null },
    { icon: BookOpen, title: 'Classroom', desc: 'Sync with Google Classroom to import assignments', color: 'from-blue-500 to-indigo-500', tag: null },
    { icon: BarChart3, title: 'Analytics', desc: 'Detailed analytics to understand your patterns', color: 'from-rose to-pink-500', tag: null },
    { icon: Check, title: 'Tasks', desc: 'Smart task management with priorities and due dates', color: 'from-emerald to-teal-500', tag: null },
  ];

  const steps = [
    { num: '01', title: 'Create your account', desc: 'Sign up for free in seconds. No credit card required.', icon: Sparkles },
    { num: '02', title: 'Set up your workspace', desc: 'Create boards, add tasks, and organize your life.', icon: Palette },
    { num: '03', title: 'Track and improve', desc: 'Monitor progress, build habits, and achieve goals.', icon: Trophy },
  ];

  const stats = [
    { value: '8+', label: 'Powerful Features', icon: Zap },
    { value: '100%', label: 'Free to Use', icon: Star },
    { value: '24/7', label: 'Always Available', icon: Clock },
    { value: '∞', label: 'Unlimited Tasks', icon: Flame },
  ];

  const testimonials = [
    { name: 'Alex M.', role: 'Computer Science Student', text: 'Strike replaced 4 different apps for me. The classroom sync is a game changer!' },
    { name: 'Sarah K.', role: 'Product Manager', text: 'Finally, a productivity tool that doesn\'t feel like work. The habits tracker is so satisfying.' },
    { name: 'Jordan L.', role: 'Freelance Designer', text: 'The notes section with the book-like editor is my favorite. It\'s beautiful and functional.' },
  ];

  return (
    <div className="min-h-screen overflow-hidden" style={{ background: 'var(--bg-primary)' }}>
      {/* ANIMATED BACKGROUND */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div 
          className="absolute w-[800px] h-[800px] rounded-full blur-[200px] opacity-[0.06] bg-[#14b8a6] transition-transform duration-[2000ms] ease-out"
          style={{ 
            top: '-15%', 
            right: '-10%',
            transform: `translate(${mousePos.x * -30}px, ${mousePos.y * -30}px)`
          }} 
        />
        <div 
          className="absolute w-[500px] h-[500px] rounded-full blur-[150px] opacity-[0.04] bg-violet-500 transition-transform duration-[2000ms] ease-out"
          style={{ 
            bottom: '5%', 
            left: '-8%',
            transform: `translate(${mousePos.x * 20}px, ${mousePos.y * 20}px)`
          }} 
        />
        <div 
          className="absolute w-[300px] h-[300px] rounded-full blur-[100px] opacity-[0.05] bg-amber-400 transition-transform duration-[2000ms] ease-out"
          style={{ 
            top: '40%', 
            left: '30%',
            transform: `translate(${mousePos.x * -15}px, ${mousePos.y * -15}px)`
          }} 
        />
        
        {/* Floating shapes */}
        <div className="absolute top-20 left-[15%] w-2 h-2 bg-[#14b8a6] rounded-full opacity-20 animate-bounce" style={{ animationDelay: '0s', animationDuration: '3s' }} />
        <div className="absolute top-40 right-[20%] w-1.5 h-1.5 bg-violet-400 rounded-full opacity-25 animate-bounce" style={{ animationDelay: '1s', animationDuration: '4s' }} />
        <div className="absolute bottom-32 left-[25%] w-2.5 h-2.5 bg-amber-400 rounded-full opacity-15 animate-bounce" style={{ animationDelay: '2s', animationDuration: '3.5s' }} />
        <div className="absolute top-[60%] right-[15%] w-1 h-1 bg-pink-400 rounded-full opacity-20 animate-bounce" style={{ animationDelay: '0.5s', animationDuration: '4.5s' }} />
      </div>

      {/* HEADER */}
      <header className="fixed top-0 w-full z-50 backdrop-blur-xl border-b" style={{ background: 'color-mix(in srgb, var(--bg-primary) 80%, transparent)', borderColor: 'var(--border-color)' }}>
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2.5 group">
            <div className="w-8 h-8 bg-[#14b8a6] flex items-center justify-center rounded-lg group-hover:scale-110 group-hover:rotate-3 transition-all duration-300">
              <Zap className="w-4 h-4 text-white" />
            </div>
            <span className="text-lg font-display font-bold tracking-tight" style={{ color: 'var(--text-primary)' }}>Strike</span>
          </Link>

          <nav className="hidden md:flex items-center gap-1">
            <a href="#features" className="px-3 py-2 text-sm transition-colors rounded-lg hover:opacity-80" style={{ color: 'var(--text-tertiary)' }}>Features</a>
            <a href="#how" className="px-3 py-2 text-sm transition-colors rounded-lg hover:opacity-80" style={{ color: 'var(--text-tertiary)' }}>How it Works</a>
            <a href="#testimonials" className="px-3 py-2 text-sm transition-colors rounded-lg hover:opacity-80" style={{ color: 'var(--text-tertiary)' }}>Reviews</a>
            
            <button onClick={toggleTheme} className="p-2 rounded-lg transition-all ml-2 hover:scale-110" style={{ color: 'var(--text-tertiary)' }}>
              {theme === 'dark' ? (
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z"/></svg>
              ) : (
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z"/></svg>
              )}
            </button>

            <Link to="/login" className="ml-1 px-4 py-2 text-sm font-medium rounded-lg transition-all hover:opacity-80" style={{ color: 'var(--text-secondary)' }}>
              Log in
            </Link>
            <Link to="/signup" className="ml-1 px-4 py-2 text-sm font-medium bg-[#14b8a6] text-white rounded-lg transition-all hover:bg-[#0d9488] hover:shadow-lg hover:shadow-[#14b8a6]/25">
              Get Started
            </Link>
          </nav>

          <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="md:hidden p-2" style={{ color: 'var(--text-tertiary)' }}>
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </header>

      {/* MOBILE MENU */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-40 pt-20 px-6 md:hidden" style={{ background: 'var(--bg-primary)' }}>
          <div className="space-y-1">
            <a href="#features" className="block py-3 font-medium" style={{ color: 'var(--text-primary)' }} onClick={() => setMobileMenuOpen(false)}>Features</a>
            <a href="#how" className="block py-3 font-medium" style={{ color: 'var(--text-primary)' }} onClick={() => setMobileMenuOpen(false)}>How it Works</a>
            <a href="#testimonials" className="block py-3 font-medium" style={{ color: 'var(--text-primary)' }} onClick={() => setMobileMenuOpen(false)}>Reviews</a>
            <Link to="/login" className="block py-3 font-medium" style={{ color: 'var(--text-primary)' }} onClick={() => setMobileMenuOpen(false)}>Log in</Link>
            <Link to="/signup" className="block mt-4" onClick={() => setMobileMenuOpen(false)}>
              <button className="w-full px-4 py-3 bg-[#14b8a6] text-white rounded-xl font-medium">Get Started</button>
            </Link>
          </div>
        </div>
      )}

      {/* HERO */}
      <section ref={heroRef} className="relative pt-32 pb-20 px-6 min-h-[90vh] flex items-center">
        <div className="max-w-6xl mx-auto w-full">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div className="space-y-8">
              {/* Badge */}
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium" style={{ background: 'rgba(20, 184, 166, 0.1)', color: '#14b8a6', border: '1px solid rgba(20, 184, 166, 0.2)' }}>
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#14b8a6] opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-[#14b8a6]"></span>
                </span>
                Now with Google Classroom Sync
              </div>

              {/* Headline */}
              <h1 className="text-5xl md:text-6xl lg:text-7xl font-display font-bold leading-[1.05] tracking-tight" style={{ color: 'var(--text-primary)' }}>
                Your productivity
                <br />
                <span className="relative">
                  <span className="text-[#14b8a6]">workspace.</span>
                  <svg className="absolute -bottom-2 left-0 w-full" viewBox="0 0 200 12" fill="none">
                    <path d="M2 8C40 2 80 2 100 6C120 10 160 10 198 4" stroke="#14b8a6" strokeWidth="3" strokeLinecap="round" opacity="0.4"/>
                  </svg>
                </span>
              </h1>

              <p className="text-lg leading-relaxed max-w-lg" style={{ color: 'var(--text-tertiary)' }}>
                Tasks, boards, habits, calendar, notes — everything you need to stay organized and focused, in one clean workspace.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 pt-2">
                <Link to="/signup">
                  <button className="group flex items-center gap-2 px-8 py-4 bg-[#14b8a6] text-white rounded-xl font-display font-semibold text-lg transition-all duration-300 hover:bg-[#0d9488] hover:shadow-xl hover:shadow-[#14b8a6]/25 hover:scale-[1.02] active:scale-[0.98]">
                    Start for free 
                    <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
                  </button>
                </Link>
                <a href="#features">
                  <button className="px-8 py-4 rounded-xl font-display font-semibold text-lg transition-all duration-300 hover:scale-[1.02] active:scale-[0.98]" style={{ border: '2px solid var(--border-color)', color: 'var(--text-secondary)' }}>
                    See features
                  </button>
                </a>
              </div>

              {/* Trust badges */}
              <div className="flex items-center gap-6 pt-4">
                <div className="flex -space-x-2">
                  {['bg-amber', 'bg-violet', 'bg-emerald', 'bg-rose', 'bg-cyan'].map((color, i) => (
                    <div key={i} className={`w-8 h-8 rounded-full ${color} border-2 flex items-center justify-center text-white text-xs font-bold`} style={{ borderColor: 'var(--bg-primary)' }}>
                      {String.fromCharCode(65 + i)}
                    </div>
                  ))}
                </div>
                <div className="text-sm" style={{ color: 'var(--text-tertiary)' }}>
                  <span className="font-semibold" style={{ color: 'var(--text-secondary)' }}>2,500+</span> productive people
                </div>
              </div>
            </div>

            {/* DASHBOARD PREVIEW */}
            <div className="relative">
              {/* Glow behind card */}
              <div className="absolute inset-0 bg-gradient-to-r from-[#14b8a6]/20 to-violet-500/20 rounded-3xl blur-3xl -z-10 scale-95 opacity-50" />
              
              <div className="rounded-2xl overflow-hidden transition-all duration-500 hover:shadow-2xl hover:shadow-[#14b8a6]/10" style={{ background: 'var(--card-bg)', border: '1px solid var(--border-color)' }}>
                {/* Window chrome */}
                <div className="flex items-center gap-2 px-4 py-3" style={{ borderBottom: '1px solid var(--border-color)' }}>
                  <div className="flex gap-1.5">
                    <div className="w-3 h-3 rounded-full bg-rose/60" />
                    <div className="w-3 h-3 rounded-full bg-amber/60" />
                    <div className="w-3 h-3 rounded-full bg-emerald/60" />
                  </div>
                  <div className="flex-1 text-center">
                    <span className="text-xs font-mono" style={{ color: 'var(--text-tertiary)' }}>strike.app/dashboard</span>
                  </div>
                </div>

                {/* Preview content */}
                <div className="p-6 space-y-5">
                  {/* Greeting */}
                  <div className="space-y-1">
                    <p className="text-sm" style={{ color: 'var(--text-tertiary)' }}>Good morning</p>
                    <h3 className="text-xl font-display font-bold" style={{ color: 'var(--text-primary)' }}>Here's your day</h3>
                  </div>

                  {/* Stat row with icons */}
                  <div className="grid grid-cols-4 gap-2">
                    {[
                      { label: 'Tasks', value: '12', icon: Target, color: '#14b8a6' },
                      { label: 'Done', value: '8', icon: Check, color: '#22c55e' },
                      { label: 'Streak', value: '5d', icon: Flame, color: '#f97316' },
                      { label: 'Score', value: '94', icon: Trophy, color: '#8b5cf6' },
                    ].map((s, i) => (
                      <div key={i} className="p-3 rounded-xl transition-all duration-300 hover:scale-105" style={{ background: 'var(--bg-tertiary)' }}>
                        <s.icon className="w-4 h-4 mb-1.5 opacity-60" style={{ color: s.color }} />
                        <div className="text-lg font-display font-bold" style={{ color: s.color }}>{s.value}</div>
                        <div className="text-[10px] font-medium" style={{ color: 'var(--text-tertiary)' }}>{s.label}</div>
                      </div>
                    ))}
                  </div>

                  {/* Progress bars with animation */}
                  <div className="space-y-3">
                    {[
                      { label: 'Weekly Goal', pct: 72, color: '#14b8a6' },
                      { label: 'Habits Done', pct: 85, color: '#22c55e' },
                    ].map((bar, i) => (
                      <div key={i} className="space-y-1.5">
                        <div className="flex justify-between text-xs">
                          <span style={{ color: 'var(--text-tertiary)' }}>{bar.label}</span>
                          <span className="font-semibold" style={{ color: 'var(--text-primary)' }}>{bar.pct}%</span>
                        </div>
                        <div className="h-2 rounded-full overflow-hidden" style={{ background: 'var(--bg-tertiary)' }}>
                          <div 
                            className="h-full rounded-full transition-all duration-1000 ease-out" 
                            style={{ width: `${bar.pct}%`, background: bar.color, transitionDelay: `${i * 200}ms` }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Task list with checkboxes */}
                  <div className="space-y-2">
                    {[
                      { title: 'Review design mockups', done: true, priority: 'high' },
                      { title: 'Ship feature update', done: false, priority: 'medium' },
                      { title: 'Write documentation', done: false, priority: 'low' },
                      { title: 'Team standup meeting', done: true, priority: 'medium' },
                    ].map((task, i) => (
                      <div key={i} className="flex items-center gap-3 p-2.5 rounded-xl transition-all duration-200 hover:scale-[1.01]" style={{ background: 'var(--bg-tertiary)' }}>
                        <div className={`w-5 h-5 rounded-md border-2 flex items-center justify-center flex-shrink-0 transition-all ${
                          task.done ? 'bg-emerald border-emerald' : ''
                        }`} style={!task.done ? { borderColor: 'var(--text-tertiary)', opacity: 0.4 } : {}}>
                          {task.done && <Check className="w-3 h-3 text-white" />}
                        </div>
                        <span className={`text-sm flex-1 ${task.done ? 'line-through' : ''}`} style={{ color: task.done ? 'var(--text-tertiary)' : 'var(--text-primary)' }}>
                          {task.title}
                        </span>
                        <span className={`text-[9px] font-bold uppercase px-1.5 py-0.5 rounded ${
                          task.priority === 'high' ? 'bg-rose/10 text-rose' :
                          task.priority === 'medium' ? 'bg-amber/10 text-amber' :
                          'bg-emerald/10 text-emerald'
                        }`}>
                          {task.priority}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Floating elements */}
              <div className="absolute -top-4 -right-4 px-3 py-1.5 bg-[#14b8a6] text-white text-xs font-bold rounded-full shadow-lg shadow-[#14b8a6]/30 animate-bounce" style={{ animationDuration: '2s' }}>
                v2.0
              </div>
              <div className="absolute -bottom-3 -left-3 px-3 py-1.5 bg-violet-500 text-white text-xs font-bold rounded-full shadow-lg shadow-violet-500/30 animate-bounce" style={{ animationDuration: '2.5s', animationDelay: '0.5s' }}>
                Free
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* STATS BAR */}
      <section className="py-12 px-6" style={{ borderTop: '1px solid var(--border-color)', borderBottom: '1px solid var(--border-color)' }}>
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, i) => {
              const Icon = stat.icon;
              return (
                <div key={i} className="flex items-center gap-4 group">
                  <div className="w-12 h-12 rounded-xl flex items-center justify-center transition-all duration-300 group-hover:scale-110 group-hover:rotate-3" style={{ background: 'rgba(20, 184, 166, 0.1)' }}>
                    <Icon className="w-5 h-5 text-[#14b8a6]" />
                  </div>
                  <div>
                    <div className="text-2xl font-display font-bold" style={{ color: 'var(--text-primary)' }}>{stat.value}</div>
                    <div className="text-sm" style={{ color: 'var(--text-tertiary)' }}>{stat.label}</div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* FEATURES */}
      <section id="features" className="py-24 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16 space-y-4">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium" style={{ background: 'rgba(20, 184, 166, 0.1)', color: '#14b8a6', border: '1px solid rgba(20, 184, 166, 0.2)' }}>
              <Sparkles className="w-4 h-4" />
              Features
            </div>
            <h2 className="text-3xl md:text-5xl font-display font-bold" style={{ color: 'var(--text-primary)' }}>
              Everything you need
            </h2>
            <p className="max-w-lg mx-auto text-lg" style={{ color: 'var(--text-tertiary)' }}>
              A complete productivity toolkit designed to help you focus on what matters.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
            {features.map((f, i) => {
              const Icon = f.icon;
              return (
                <div 
                  key={i} 
                  className="group relative p-6 rounded-2xl transition-all duration-500 hover:-translate-y-1 hover:shadow-xl cursor-default"
                  style={{ background: 'var(--card-bg)', border: '1px solid var(--border-color)' }}
                  id={`feature-${i}`}
                >
                  {f.tag && (
                    <span className="absolute top-4 right-4 text-[10px] font-bold uppercase px-2 py-0.5 rounded-full bg-[#14b8a6]/10 text-[#14b8a6]">
                      {f.tag}
                    </span>
                  )}
                  <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${f.color} flex items-center justify-center mb-4 transition-all duration-300 group-hover:scale-110 group-hover:rotate-3 shadow-lg`}>
                    <Icon className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="font-display font-bold text-lg mb-2" style={{ color: 'var(--text-primary)' }}>{f.title}</h3>
                  <p className="text-sm leading-relaxed" style={{ color: 'var(--text-tertiary)' }}>{f.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section id="how" className="py-24 px-6" style={{ background: 'var(--hover-bg)' }}>
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16 space-y-4">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium" style={{ background: 'rgba(139, 92, 246, 0.1)', color: '#8b5cf6', border: '1px solid rgba(139, 92, 246, 0.2)' }}>
              <Rocket className="w-4 h-4" />
              How it Works
            </div>
            <h2 className="text-3xl md:text-5xl font-display font-bold" style={{ color: 'var(--text-primary)' }}>
              Get started in minutes
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            {steps.map((s, i) => {
              const Icon = s.icon;
              return (
                <div key={i} className="relative text-center space-y-4 p-8 rounded-2xl transition-all duration-300 hover:-translate-y-1" style={{ background: 'var(--card-bg)', border: '1px solid var(--border-color)' }}>
                  <div className="w-16 h-16 rounded-2xl mx-auto flex items-center justify-center transition-all duration-300 hover:scale-110 hover:rotate-3" style={{ background: 'rgba(20, 184, 166, 0.1)' }}>
                    <Icon className="w-7 h-7 text-[#14b8a6]" />
                  </div>
                  <div className="text-sm font-bold text-[#14b8a6]">Step {s.num}</div>
                  <h3 className="font-display font-bold text-lg" style={{ color: 'var(--text-primary)' }}>{s.title}</h3>
                  <p className="text-sm leading-relaxed" style={{ color: 'var(--text-tertiary)' }}>{s.desc}</p>
                  {i < steps.length - 1 && (
                    <div className="hidden md:block absolute top-1/2 -right-4 w-8 h-0.5" style={{ background: 'var(--border-color)' }}>
                      <ArrowRight className="w-4 h-4 absolute -top-2 -left-0" style={{ color: 'var(--text-tertiary)' }} />
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section id="testimonials" className="py-24 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16 space-y-4">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium" style={{ background: 'rgba(249, 115, 22, 0.1)', color: '#f97316', border: '1px solid rgba(249, 115, 22, 0.2)' }}>
              <Star className="w-4 h-4" />
              Testimonials
            </div>
            <h2 className="text-3xl md:text-5xl font-display font-bold" style={{ color: 'var(--text-primary)' }}>
              Loved by users
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {testimonials.map((t, i) => (
              <div key={i} className="p-6 rounded-2xl transition-all duration-300 hover:-translate-y-1 hover:shadow-xl" style={{ background: 'var(--card-bg)', border: '1px solid var(--border-color)' }}>
                <div className="flex gap-1 mb-4">
                  {[...Array(5)].map((_, j) => (
                    <Star key={j} className="w-4 h-4 fill-amber text-amber" />
                  ))}
                </div>
                <p className="text-sm leading-relaxed mb-4" style={{ color: 'var(--text-secondary)' }}>"{t.text}"</p>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#14b8a6] to-[#0d9488] flex items-center justify-center text-white font-bold text-sm">
                    {t.name.charAt(0)}
                  </div>
                  <div>
                    <div className="font-semibold text-sm" style={{ color: 'var(--text-primary)' }}>{t.name}</div>
                    <div className="text-xs" style={{ color: 'var(--text-tertiary)' }}>{t.role}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 px-6">
        <div className="max-w-3xl mx-auto">
          <div className="relative rounded-3xl overflow-hidden p-12 text-center" style={{ background: 'linear-gradient(135deg, #14b8a6 0%, #0d9488 50%, #0f766e 100%)' }}>
            {/* Background pattern */}
            <div className="absolute inset-0 opacity-10">
              <div className="absolute top-0 left-0 w-full h-full" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)', backgroundSize: '32px 32px' }} />
            </div>
            
            <div className="relative space-y-6">
              <div className="w-16 h-16 rounded-2xl bg-white/20 flex items-center justify-center mx-auto backdrop-blur-sm">
                <Rocket className="w-8 h-8 text-white" />
              </div>
              <h2 className="text-3xl md:text-4xl font-display font-bold text-white">
                Ready to get organized?
              </h2>
              <p className="text-lg text-white/80 max-w-md mx-auto">
                Start managing your tasks, habits, and goals. Free to use, forever.
              </p>
              <div className="pt-2 flex flex-col sm:flex-row gap-4 justify-center">
                <Link to="/signup">
                  <button className="group flex items-center gap-2 px-8 py-4 bg-white text-[#0d9488] rounded-xl font-display font-semibold text-lg transition-all duration-300 hover:shadow-xl hover:scale-[1.02] active:scale-[0.98]">
                    Get started free
                    <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
                  </button>
                </Link>
              </div>
              <p className="text-sm text-white/60">No credit card required. Set up in 30 seconds.</p>
            </div>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="py-8 px-6" style={{ borderTop: '1px solid var(--border-color)' }}>
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 bg-[#14b8a6] rounded flex items-center justify-center">
              <Zap className="w-3 h-3 text-white" />
            </div>
            <span className="font-display font-bold text-sm" style={{ color: 'var(--text-primary)' }}>Strike</span>
          </div>
          <div className="flex items-center gap-6 text-sm" style={{ color: 'var(--text-tertiary)' }}>
            <a href="#" className="hover:opacity-80 transition-opacity">Privacy</a>
            <a href="#" className="hover:opacity-80 transition-opacity">Terms</a>
            <a href="#" className="hover:opacity-80 transition-opacity">Contact</a>
          </div>
          <div className="text-sm" style={{ color: 'var(--text-tertiary)' }}>&copy; 2026 Strike</div>
        </div>
      </footer>
    </div>
  );
};

export default Landing;
