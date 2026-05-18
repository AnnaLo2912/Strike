import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Mail, Lock, User, Eye, EyeOff, Zap, CheckCircle, Target, TrendingUp, X } from 'lucide-react';
import axios from 'axios';
import authService from '../../services/authService';



const AuthPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  
  const [isLogin, setIsLogin] = useState(location.pathname === '/login');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [showForgotModal, setShowForgotModal] = useState(false);
  const [forgotStep, setForgotStep] = useState(1);
  const [forgotEmail, setForgotEmail] = useState('');
  const [resetToken, setResetToken] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [forgotError, setForgotError] = useState('');
  const [forgotLoading, setForgotLoading] = useState(false);
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError('');
    setSuccess('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    try {
      if (isLogin) {
        const response = await axios.post('http://localhost:5000/api/auth/login', {
          email: formData.email,
          password: formData.password
        });

        if (response.data.success) {
          localStorage.setItem('token', response.data.data.token);
          localStorage.setItem('user', JSON.stringify(response.data.data));
          setSuccess('Login successful! Redirecting...');
          setTimeout(() => navigate('/dashboard'), 1000);
        }
      } else {
        if (formData.password !== formData.confirmPassword) {
          setError('Passwords do not match');
          setLoading(false);
          return;
        }

        if (formData.password.length < 6) {
          setError('Password must be at least 6 characters');
          setLoading(false);
          return;
        }

        const response = await axios.post('http://localhost:5000/api/auth/register', {
          name: formData.name,
          email: formData.email,
          password: formData.password
        });

        if (response.data.success) {
          localStorage.setItem('token', response.data.data.token);
          localStorage.setItem('user', JSON.stringify(response.data.data));
          setSuccess('Account created successfully! Redirecting...');
          setTimeout(() => navigate('/dashboard'), 1000);
        }
      }
    } catch (err) {
      console.error('Auth error:', err);
      if (err.response) {
        setError(err.response.data.message || 'Authentication failed');
      } else if (err.request) {
        setError('Cannot connect to server. Make sure backend is running on port 5000');
      } else {
        setError('Something went wrong. Please try again.');
      }
      setLoading(false);
    }
  };

  const toggleAuthMode = () => {
    setIsLogin(!isLogin);
    setFormData({ name: '', email: '', password: '', confirmPassword: '' });
    setError('');
    setSuccess('');
    navigate(isLogin ? '/signup' : '/login');
  };

  const handleForgotPasswordClick = () => {
    setShowForgotModal(true);
    setForgotStep(1);
    setForgotError('');
    setForgotEmail('');
    setResetToken('');
    setNewPassword('');
    setConfirmPassword('');
  };

  const handleForgotPasswordEmail = async (e) => {
    e.preventDefault();
    setForgotError('');
    setForgotLoading(true);

    try {
      const response = await authService.forgotPassword(forgotEmail);
      if (response.success) {
        if (response.resetToken) {
          setResetToken(response.resetToken);
          setForgotStep(3);
        } else {
          setForgotStep(2);
        }
      }
    } catch (err) {
      setForgotError(err.message || 'Failed to send reset link');
    } finally {
      setForgotLoading(false);
    }
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    setForgotError('');

    if (newPassword !== confirmPassword) {
      setForgotError('Passwords do not match');
      return;
    }

    if (newPassword.length < 6) {
      setForgotError('Password must be at least 6 characters');
      return;
    }

    setForgotLoading(true);

    try {
      const response = await authService.resetPasswordWithToken(resetToken, newPassword);
      if (response.success) {
        setSuccess('Password reset successful! Redirecting to login...');
        setTimeout(() => {
          setShowForgotModal(false);
          setIsLogin(true);
          setFormData({ name: '', email: forgotEmail, password: '', confirmPassword: '' });
        }, 2000);
      }
    } catch (err) {
      setForgotError(err.message || 'Failed to reset password');
    } finally {
      setForgotLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-obsidian grain flex items-center justify-center p-4">
      <div className="w-full max-w-6xl glass-dark rounded-3xl overflow-hidden shadow-2xl shadow-amber/5 border border-amber/10">
        <div className="grid md:grid-cols-2">
          <div className="hidden md:flex bg-gradient-to-br from-obsidian-light via-surface to-obsidian-light p-12 items-center justify-center relative overflow-hidden border-r border-amber/10">
            <div className="absolute top-0 left-0 w-64 h-64 bg-amber/10 rounded-full -translate-x-1/2 -translate-y-1/2 blur-3xl" />
            <div className="absolute bottom-0 right-0 w-96 h-96 bg-violet/10 rounded-full translate-x-1/3 translate-y-1/3 blur-3xl" />
            
            <div className="relative z-10 text-white space-y-8">
              <div className="flex items-center space-x-3 mb-8">
                <div className="w-12 h-12 bg-gradient-strike sharp flex items-center justify-center shadow-lg shadow-amber/20">
                  <Zap className="w-7 h-7 text-white" />
                </div>
                <span className="text-3xl font-display font-bold">Strike</span>
              </div>

              <div>
                <h2 className="text-4xl font-display font-bold mb-4">
                  {isLogin ? 'Welcome Back!' : 'Join Strike!'}
                </h2>
                <p className="text-lg text-slate leading-relaxed">
                  {isLogin 
                    ? 'Your tasks are waiting. Let\'s crush that to-do list and make today productive!' 
                    : 'Start your journey to better productivity. Organize, track, and achieve your goals.'}
                </p>
              </div>

              <div className="space-y-4">
                {[
                  { icon: CheckCircle, title: 'Smart Task Management', desc: 'Organize with custom boards', color: 'from-amber/20 to-violet/20' },
                  { icon: Target, title: 'Habit Tracking', desc: 'Build better daily routines', color: 'from-violet/20 to-cyan/20' },
                  { icon: TrendingUp, title: 'Progress Analytics', desc: 'Track your productivity', color: 'from-cyan/20 to-amber/20' },
                ].map((item, i) => {
                  const Icon = item.icon;
                  return (
                    <div key={i} className="bg-white/5 backdrop-blur-sm sharp p-4 border border-amber/10 hover:bg-white/10 transition-all duration-300">
                      <div className="flex items-center space-x-3">
                        <div className={`w-10 h-10 bg-gradient-to-br ${item.color} rounded-lg flex items-center justify-center`}>
                          <Icon className="w-5 h-5 text-white" />
                        </div>
                        <div>
                          <div className="font-semibold text-white">{item.title}</div>
                          <div className="text-sm text-slate">{item.desc}</div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="grid grid-cols-3 gap-4 pt-6 border-t border-amber/10">
                {[
                  { num: '10k+', label: 'Users' },
                  { num: '50k+', label: 'Tasks Done' },
                  { num: '99%', label: 'Happy' },
                ].map((stat, i) => (
                  <div key={i} className="text-center">
                    <div className="text-2xl font-display font-bold text-gradient-amber">{stat.num}</div>
                    <div className="text-xs text-slate">{stat.label}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="p-12 bg-surface/80 backdrop-blur-lg">
            <div className="max-w-md mx-auto">
              <div className="md:hidden flex items-center justify-center space-x-2 mb-8">
                <div className="w-10 h-10 bg-gradient-strike rounded-lg flex items-center justify-center">
                  <Zap className="w-6 h-6 text-white" />
                </div>
                <span className="text-2xl font-display font-bold text-gradient-amber">Strike</span>
              </div>

              <div className="text-center mb-8">
                <h1 className="text-3xl font-display font-bold text-white mb-2">
                  {isLogin ? 'Sign In' : 'Create Account'}
                </h1>
                <p className="text-slate">
                  {isLogin 
                    ? 'Enter your credentials to access your workspace' 
                    : 'Fill in your details to get started'}
                </p>
              </div>

              {error && (
                <div className="mb-4 p-4 bg-rose/10 border border-rose/30 sharp">
                  <p className="text-rose text-sm font-medium">{error}</p>
                </div>
              )}

              {success && (
                <div className="mb-4 p-4 bg-emerald/10 border border-emerald/30 sharp">
                  <p className="text-emerald text-sm font-medium">{success}</p>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-5">
                {!isLogin && (
                  <div>
                    <label className="block text-sm font-medium text-slate mb-2">Full Name</label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-dark" />
                      <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        placeholder="Enter your name"
                        className="w-full pl-10 pr-4 py-3 bg-obsidian-light border border-amber/20 sharp focus:border-amber focus:outline-none transition-colors text-white placeholder-slate-dark"
                        required={!isLogin}
                        disabled={loading}
                      />
                    </div>
                  </div>
                )}

                <div>
                  <label className="block text-sm font-medium text-slate mb-2">Email Address</label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-dark" />
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="you@example.com"
                      className="w-full pl-10 pr-4 py-3 bg-obsidian-light border border-amber/20 sharp focus:border-amber focus:outline-none transition-colors text-white placeholder-slate-dark"
                      required
                      disabled={loading}
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate mb-2">Password</label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-dark" />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      name="password"
                      value={formData.password}
                      onChange={handleChange}
                      placeholder="••••••••"
                      className="w-full pl-10 pr-12 py-3 bg-obsidian-light border border-amber/20 sharp focus:border-amber focus:outline-none transition-colors text-white placeholder-slate-dark"
                      required
                      disabled={loading}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-dark hover:text-amber transition-colors"
                      disabled={loading}
                    >
                      {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>
                  {!isLogin && (
                    <p className="text-xs text-slate-dark mt-1">Must be at least 6 characters</p>
                  )}
                </div>

                {!isLogin && (
                  <div>
                    <label className="block text-sm font-medium text-slate mb-2">Confirm Password</label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-dark" />
                      <input
                        type={showPassword ? 'text' : 'password'}
                        name="confirmPassword"
                        value={formData.confirmPassword}
                        onChange={handleChange}
                        placeholder="••••••••"
                        className="w-full pl-10 pr-4 py-3 bg-obsidian-light border border-amber/20 sharp focus:border-amber focus:outline-none transition-colors text-white placeholder-slate-dark"
                        required={!isLogin}
                        disabled={loading}
                      />
                    </div>
                  </div>
                )}

                {isLogin && (
                  <div className="flex items-center justify-between">
                    <label className="flex items-center space-x-2 cursor-pointer">
                      <input 
                        type="checkbox" 
                        className="w-4 h-4 rounded border-amber/20 bg-obsidian-light text-amber focus:ring-amber"
                        disabled={loading}
                      />
                      <span className="text-sm text-slate">Remember me</span>
                    </label>
                    <button 
                      type="button"
                      onClick={handleForgotPasswordClick}
                      className="text-sm text-amber hover:text-amber-light transition-colors font-medium"
                      disabled={loading}
                    >
                      Forgot password?
                    </button>
                  </div>
                )}

                {!isLogin && (
                  <label className="flex items-start space-x-2 cursor-pointer">
                    <input 
                      type="checkbox" 
                      className="w-4 h-4 mt-1 rounded border-amber/20 bg-obsidian-light text-amber focus:ring-amber"
                      required
                      disabled={loading}
                    />
                    <span className="text-sm text-slate">
                      I agree to the{' '}
                      <a href="#" className="text-amber hover:text-amber-light">Terms of Service</a>
                      {' '}and{' '}
                      <a href="#" className="text-amber hover:text-amber-light">Privacy Policy</a>
                    </span>
                  </label>
                )}

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-gradient-strike text-white py-3 sharp font-semibold hover:shadow-lg hover:shadow-amber/25 transition-all duration-300 hover:scale-[1.02] flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                >
                  {loading ? (
                    <>
                      <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                      </svg>
                      <span>{isLogin ? 'Signing In...' : 'Creating Account...'}</span>
                    </>
                  ) : (
                    <>
                      <span>{isLogin ? 'Sign In to Strike' : 'Create My Account'}</span>
                      <Zap className="w-5 h-5" />
                    </>
                  )}
                </button>

                <div className="text-center">
                  <p className="text-slate">
                    {isLogin ? "Don't have an account? " : "Already have an account? "}
                    <button
                      type="button"
                      onClick={toggleAuthMode}
                      className="text-amber hover:text-amber-light font-semibold transition-colors"
                      disabled={loading}
                    >
                      {isLogin ? 'Sign Up' : 'Sign In'}
                    </button>
                  </p>
                </div>
              </form>

              <div className="mt-6 text-center">
                <Link 
                  to="/" 
                  className="text-sm text-slate-dark hover:text-amber transition-colors inline-flex items-center space-x-1"
                >
                  <span>←</span>
                  <span>Back to Home</span>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>

      {showForgotModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-surface border border-amber/10 rounded-2xl shadow-2xl shadow-black/50 w-full max-w-md p-8">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-display font-bold text-white">Reset Password</h2>
              <button
                onClick={() => setShowForgotModal(false)}
                className="text-slate-dark hover:text-white transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {forgotError && (
              <div className="mb-4 p-4 bg-rose/10 border border-rose/30 sharp">
                <p className="text-rose text-sm font-medium">{forgotError}</p>
              </div>
            )}

            {forgotStep === 1 && (
              <form onSubmit={handleForgotPasswordEmail} className="space-y-5">
                <div>
                  <label className="block text-sm font-medium text-slate mb-2">Enter your email address</label>
                  <p className="text-sm text-slate-dark mb-4">We'll send you a link to reset your password.</p>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-dark" />
                    <input
                      type="email"
                      value={forgotEmail}
                      onChange={(e) => setForgotEmail(e.target.value)}
                      placeholder="you@example.com"
                      className="w-full pl-10 pr-4 py-3 bg-obsidian-light border border-amber/20 sharp focus:border-amber focus:outline-none transition-colors text-white placeholder-slate-dark"
                      required
                      disabled={forgotLoading}
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={forgotLoading}
                  className="w-full bg-gradient-strike text-white py-3 sharp font-semibold hover:shadow-lg hover:shadow-amber/25 transition-all disabled:opacity-50"
                >
                  {forgotLoading ? 'Sending...' : 'Send Reset Link'}
                </button>

                <button
                  type="button"
                  onClick={() => setShowForgotModal(false)}
                  className="w-full border border-amber/20 text-slate py-3 sharp font-semibold hover:bg-white/5 transition-all"
                >
                  Cancel
                </button>
              </form>
            )}

            {forgotStep === 2 && (
              <div className="space-y-5 text-center">
                <div className="w-16 h-16 bg-gradient-strike rounded-full flex items-center justify-center mx-auto shadow-lg shadow-amber/20">
                  <CheckCircle className="w-8 h-8 text-white" />
                </div>
                <div>
                  <h3 className="text-xl font-display font-bold text-white mb-2">Check your email</h3>
                  <p className="text-slate text-sm">
                    We've sent a password reset link to <strong className="text-white">{forgotEmail}</strong>
                  </p>
                  <p className="text-slate-dark text-sm mt-2">
                    Check your inbox and follow the link to reset your password.
                  </p>
                </div>

                <button
                  onClick={() => setShowForgotModal(false)}
                  className="w-full bg-gradient-strike text-white py-3 sharp font-semibold hover:shadow-lg hover:shadow-amber/25 transition-all"
                >
                  Got it, close
                </button>
              </div>
            )}

            {forgotStep === 3 && (
              <form onSubmit={handleResetPassword} className="space-y-5">
                <div>
                  <label className="block text-sm font-medium text-slate mb-2">New Password</label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-dark" />
                    <input
                      type="password"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      placeholder="••••••••"
                      className="w-full pl-10 pr-4 py-3 bg-obsidian-light border border-amber/20 sharp focus:border-amber focus:outline-none transition-colors text-white placeholder-slate-dark"
                      required
                      disabled={forgotLoading}
                    />
                  </div>
                  <p className="text-xs text-slate-dark mt-1">Must be at least 6 characters</p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate mb-2">Confirm Password</label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-dark" />
                    <input
                      type="password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="••••••••"
                      className="w-full pl-10 pr-4 py-3 bg-obsidian-light border border-amber/20 sharp focus:border-amber focus:outline-none transition-colors text-white placeholder-slate-dark"
                      required
                      disabled={forgotLoading}
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={forgotLoading}
                  className="w-full bg-gradient-strike text-white py-3 sharp font-semibold hover:shadow-lg hover:shadow-amber/25 transition-all disabled:opacity-50"
                >
                  {forgotLoading ? 'Resetting...' : 'Reset Password'}
                </button>

                <button
                  type="button"
                  onClick={() => setShowForgotModal(false)}
                  className="w-full border border-amber/20 text-slate py-3 sharp font-semibold hover:bg-white/5 transition-all"
                >
                  Cancel
                </button>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default AuthPage;
