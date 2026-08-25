import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Mail, Lock, User, Eye, EyeOff, Zap, CheckCircle, Target, TrendingUp, X } from 'lucide-react';
import authService from '../../services/authService';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { Card, CardContent } from '../../components/ui/card';
import { useTheme } from '../../components/theme-provider';

const AuthPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { theme } = useTheme();
  
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
        const response = await authService.login({
          email: formData.email,
          password: formData.password
        });

        if (response.success) {
          localStorage.setItem('token', response.data.token);
          localStorage.setItem('user', JSON.stringify(response.data));
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

        const response = await authService.register({
          name: formData.name,
          email: formData.email,
          password: formData.password
        });

        if (response.success) {
          localStorage.setItem('token', response.data.token);
          localStorage.setItem('user', JSON.stringify(response.data));
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
    <div className="min-h-screen bg-[var(--bg-primary)] flex items-center justify-center p-4 grain">
      <div className="w-full max-w-4xl">
        <div className="grid md:grid-cols-2 gap-0 overflow-hidden rounded-xl border border-[var(--border-color)]" style={{ boxShadow: '0 4px 40px rgba(0,0,0,0.15)' }}>
          
          {/* Left panel - Brand */}
          <div className="hidden md:flex flex-col justify-between p-10 relative overflow-hidden bg-[var(--bg-secondary)]">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-[#14b8a6] to-[#8b5cf6]" />
            <div className="absolute -top-20 -left-20 w-60 h-60 rounded-full" style={{ background: 'radial-gradient(circle, rgba(20,184,166,0.06) 0%, transparent 70%)' }} />
            <div className="absolute -bottom-20 -right-20 w-60 h-60 rounded-full" style={{ background: 'radial-gradient(circle, rgba(139,92,246,0.04) 0%, transparent 70%)' }} />
            
            <div className="relative z-10">
              <Link to="/" className="flex items-center gap-2.5 mb-12">
                <div className="w-8 h-8 bg-gradient-to-br from-[#14b8a6] to-[#0d9488] rounded-lg flex items-center justify-center shadow-lg shadow-[rgba(20,184,166,0.15)]">
                  <Zap className="w-4 h-4 text-white" />
                </div>
                <span className="text-lg font-display font-bold text-[var(--text-primary)] tracking-tight">Strike</span>
              </Link>

              <h2 className="text-2xl font-display font-bold text-[var(--text-primary)] leading-snug mb-3">
                {isLogin ? 'Welcome back.' : 'Start building.'}
              </h2>
              <p className="text-sm text-[var(--text-secondary)] leading-relaxed max-w-xs">
                {isLogin 
                  ? 'Sign in to access your workspace and keep the momentum going.' 
                  : 'Organize tasks, build habits, and track progress — beautifully.'}
              </p>
            </div>

            <div className="relative z-10 space-y-3 mt-10">
              {[
                { icon: CheckCircle, text: 'Smart task management with boards' },
                { icon: Target, text: 'Habit tracking and streak building' },
                { icon: TrendingUp, text: 'Analytics to understand your patterns' },
              ].map((item, i) => {
                const Icon = item.icon;
                return (
                  <div key={i} className="flex items-center gap-3">
                    <div className="w-7 h-7 rounded-md bg-[rgba(20,184,166,0.08)] flex items-center justify-center flex-shrink-0">
                      <Icon className="w-3.5 h-3.5 text-[#14b8a6]" />
                    </div>
                    <span className="text-xs text-[var(--text-secondary)]">{item.text}</span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Right panel - Form */}
          <div className="p-8 md:p-10 bg-[var(--bg-primary)]">
            <div className="max-w-sm mx-auto">
              {/* Mobile logo */}
              <div className="md:hidden flex items-center justify-center gap-2 mb-8">
                <div className="w-8 h-8 bg-gradient-to-br from-[#14b8a6] to-[#0d9488] rounded-lg flex items-center justify-center shadow-lg shadow-[rgba(20,184,166,0.15)]">
                  <Zap className="w-4 h-4 text-white" />
                </div>
                <span className="text-lg font-display font-bold text-[var(--text-primary)] tracking-tight">Strike</span>
              </div>

              <div className="mb-6">
                <h1 className="text-xl font-display font-bold text-[var(--text-primary)] mb-1">
                  {isLogin ? 'Sign in' : 'Create account'}
                </h1>
                <p className="text-sm text-[var(--text-tertiary)]">
                  {isLogin ? 'Enter your credentials to continue' : 'Fill in your details to get started'}
                </p>
              </div>

              {error && (
                <div className="mb-4 p-3 rounded-lg bg-[rgba(239,68,68,0.08)] border border-[rgba(239,68,68,0.12)]">
                  <p className="text-sm text-[#ef4444]">{error}</p>
                </div>
              )}

              {success && (
                <div className="mb-4 p-3 rounded-lg bg-[rgba(34,197,94,0.08)] border border-[rgba(34,197,94,0.12)]">
                  <p className="text-sm text-[#22c55e]">{success}</p>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-4">
                {!isLogin && (
                  <div className="space-y-1.5">
                    <Label htmlFor="name" className="text-xs font-medium text-[var(--text-secondary)] uppercase tracking-wider">Full Name</Label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--text-tertiary)]" />
                      <Input
                        id="name"
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        placeholder="Your name"
                        className="pl-9 h-10 bg-[var(--input-bg)] border-[var(--border-color)] text-[var(--text-primary)] placeholder:text-[var(--text-tertiary)] focus:border-[#14b8a6] focus:ring-1 focus:ring-[rgba(20,184,166,0.2)]"
                        required={!isLogin}
                        disabled={loading}
                      />
                    </div>
                  </div>
                )}

                <div className="space-y-1.5">
                  <Label htmlFor="email" className="text-xs font-medium text-[var(--text-secondary)] uppercase tracking-wider">Email</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--text-tertiary)]" />
                    <Input
                      id="email"
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="you@example.com"
                      className="pl-9 h-10 bg-[var(--input-bg)] border-[var(--border-color)] text-[var(--text-primary)] placeholder:text-[var(--text-tertiary)] focus:border-[#14b8a6] focus:ring-1 focus:ring-[rgba(20,184,166,0.2)]"
                      required
                      disabled={loading}
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="password" className="text-xs font-medium text-[var(--text-secondary)] uppercase tracking-wider">Password</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--text-tertiary)]" />
                    <Input
                      id="password"
                      type={showPassword ? 'text' : 'password'}
                      name="password"
                      value={formData.password}
                      onChange={handleChange}
                      placeholder="Enter password"
                      className="pl-9 pr-9 h-10 bg-[var(--input-bg)] border-[var(--border-color)] text-[var(--text-primary)] placeholder:text-[var(--text-tertiary)] focus:border-[#14b8a6] focus:ring-1 focus:ring-[rgba(20,184,166,0.2)]"
                      required
                      disabled={loading}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--text-tertiary)] hover:text-[var(--text-secondary)] transition-colors"
                      disabled={loading}
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                  {!isLogin && (
                    <p className="text-[11px] text-[var(--text-tertiary)]">Minimum 6 characters</p>
                  )}
                </div>

                {!isLogin && (
                  <div className="space-y-1.5">
                    <Label htmlFor="confirmPassword" className="text-xs font-medium text-[var(--text-secondary)] uppercase tracking-wider">Confirm Password</Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--text-tertiary)]" />
                      <Input
                        id="confirmPassword"
                        type={showPassword ? 'text' : 'password'}
                        name="confirmPassword"
                        value={formData.confirmPassword}
                        onChange={handleChange}
                        placeholder="Confirm password"
                        className="pl-9 h-10 bg-[var(--input-bg)] border-[var(--border-color)] text-[var(--text-primary)] placeholder:text-[var(--text-tertiary)] focus:border-[#14b8a6] focus:ring-1 focus:ring-[rgba(20,184,166,0.2)]"
                        required={!isLogin}
                        disabled={loading}
                      />
                    </div>
                  </div>
                )}

                {isLogin && (
                  <div className="flex items-center justify-between">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input 
                        type="checkbox" 
                        className="w-3.5 h-3.5 rounded border-[var(--border-color)] bg-[var(--input-bg)] text-[#14b8a6] focus:ring-[#14b8a6]"
                        disabled={loading}
                      />
                      <span className="text-xs text-[var(--text-tertiary)]">Remember me</span>
                    </label>
                    <button 
                      type="button"
                      onClick={handleForgotPasswordClick}
                      className="text-xs text-[#14b8a6] hover:text-[#0d9488] transition-colors font-medium"
                      disabled={loading}
                    >
                      Forgot password?
                    </button>
                  </div>
                )}

                {!isLogin && (
                  <label className="flex items-start gap-2 cursor-pointer">
                    <input 
                      type="checkbox" 
                      className="w-3.5 h-3.5 mt-0.5 rounded border-[var(--border-color)] bg-[var(--input-bg)] text-[#14b8a6] focus:ring-[#14b8a6]"
                      required
                      disabled={loading}
                    />
                    <span className="text-xs text-[var(--text-tertiary)] leading-relaxed">
                      I agree to the{' '}
                      <a href="#" className="text-[#14b8a6] hover:text-[#0d9488]">Terms</a>
                      {' '}and{' '}
                      <a href="#" className="text-[#14b8a6] hover:text-[#0d9488]">Privacy Policy</a>
                    </span>
                  </label>
                )}

                <Button
                  type="submit"
                  disabled={loading}
                  className="w-full h-10 bg-gradient-to-r from-[#14b8a6] to-[#0d9488] text-white font-display font-semibold text-sm hover:opacity-90 transition-opacity rounded-lg shadow-lg shadow-[rgba(20,184,166,0.15)]"
                >
                  {loading ? (
                    <span className="flex items-center gap-2">
                      <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                      </svg>
                      {isLogin ? 'Signing in...' : 'Creating account...'}
                    </span>
                  ) : (
                    <span>{isLogin ? 'Sign in' : 'Create account'}</span>
                  )}
                </Button>

                <div className="text-center pt-1">
                  <p className="text-sm text-[var(--text-tertiary)]">
                    {isLogin ? "New here? " : "Already have an account? "}
                    <button
                      type="button"
                      onClick={toggleAuthMode}
                      className="text-[#14b8a6] hover:text-[#0d9488] font-medium transition-colors"
                      disabled={loading}
                    >
                      {isLogin ? 'Create an account' : 'Sign in'}
                    </button>
                  </p>
                </div>
              </form>

              <div className="mt-8 text-center">
                <Link 
                  to="/" 
                  className="text-xs text-[var(--text-tertiary)] hover:text-[var(--text-secondary)] transition-colors inline-flex items-center gap-1"
                >
                  &larr; Back to home
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Forgot Password Modal */}
      {showForgotModal && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <Card className="w-full max-w-md bg-[var(--card-bg)] border-[var(--border-color)]">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-base font-display font-bold text-[var(--text-primary)]">Reset Password</h2>
                <button
                  onClick={() => setShowForgotModal(false)}
                  className="p-1 text-[var(--text-tertiary)] hover:text-[var(--text-primary)] rounded-md hover:bg-[var(--hover-bg)] transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {forgotError && (
                <div className="mb-4 p-3 rounded-lg bg-[rgba(239,68,68,0.08)] border border-[rgba(239,68,68,0.12)]">
                  <p className="text-sm text-[#ef4444]">{forgotError}</p>
                </div>
              )}

              {forgotStep === 1 && (
                <form onSubmit={handleForgotPasswordEmail} className="space-y-4">
                  <div className="space-y-1.5">
                    <Label className="text-xs font-medium text-[var(--text-secondary)] uppercase tracking-wider">Email address</Label>
                    <p className="text-xs text-[var(--text-tertiary)]">We'll send a link to reset your password.</p>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--text-tertiary)]" />
                      <Input
                        type="email"
                        value={forgotEmail}
                        onChange={(e) => setForgotEmail(e.target.value)}
                        placeholder="you@example.com"
                        className="pl-9 h-10 bg-[var(--input-bg)] border-[var(--border-color)] text-[var(--text-primary)]"
                        required
                        disabled={forgotLoading}
                      />
                    </div>
                  </div>
                  <div className="flex gap-3 pt-2">
                    <Button type="button" variant="outline" className="flex-1 h-9 border-[var(--border-color)] text-[var(--text-secondary)]" onClick={() => setShowForgotModal(false)}>
                      Cancel
                    </Button>
                    <Button type="submit" disabled={forgotLoading} className="flex-1 h-9 bg-gradient-to-r from-[#14b8a6] to-[#0d9488] text-white">
                      {forgotLoading ? 'Sending...' : 'Send link'}
                    </Button>
                  </div>
                </form>
              )}

              {forgotStep === 2 && (
                <div className="space-y-4 text-center py-4">
                  <div className="w-10 h-10 rounded-full bg-[rgba(34,197,94,0.08)] flex items-center justify-center mx-auto">
                    <CheckCircle className="w-5 h-5 text-[#22c55e]" />
                  </div>
                  <div>
                    <h3 className="font-display font-bold text-[var(--text-primary)] mb-1 text-sm">Check your email</h3>
                    <p className="text-xs text-[var(--text-tertiary)]">
                      Reset link sent to <strong className="text-[var(--text-secondary)]">{forgotEmail}</strong>
                    </p>
                  </div>
                  <Button onClick={() => setShowForgotModal(false)} className="w-full h-9 bg-gradient-to-r from-[#14b8a6] to-[#0d9488] text-white">
                    Got it
                  </Button>
                </div>
              )}

              {forgotStep === 3 && (
                <form onSubmit={handleResetPassword} className="space-y-4">
                  <div className="space-y-1.5">
                    <Label className="text-xs font-medium text-[var(--text-secondary)] uppercase tracking-wider">New Password</Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--text-tertiary)]" />
                      <Input
                        type="password"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        placeholder="New password"
                        className="pl-9 h-10 bg-[var(--input-bg)] border-[var(--border-color)] text-[var(--text-primary)]"
                        required
                        disabled={forgotLoading}
                      />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <Label className="text-xs font-medium text-[var(--text-secondary)] uppercase tracking-wider">Confirm Password</Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--text-tertiary)]" />
                      <Input
                        type="password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        placeholder="Confirm password"
                        className="pl-9 h-10 bg-[var(--input-bg)] border-[var(--border-color)] text-[var(--text-primary)]"
                        required
                        disabled={forgotLoading}
                      />
                    </div>
                  </div>

                  <div className="flex gap-3 pt-2">
                    <Button type="button" variant="outline" className="flex-1 h-9 border-[var(--border-color)] text-[var(--text-secondary)]" onClick={() => setShowForgotModal(false)}>
                      Cancel
                    </Button>
                    <Button type="submit" disabled={forgotLoading} className="flex-1 h-9 bg-gradient-to-r from-[#14b8a6] to-[#0d9488] text-white">
                      {forgotLoading ? 'Resetting...' : 'Reset password'}
                    </Button>
                  </div>
                </form>
              )}
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
};

export default AuthPage;
