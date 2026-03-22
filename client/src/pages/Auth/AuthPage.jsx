import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Mail, Lock, User, Eye, EyeOff, Zap, CheckCircle, Target, TrendingUp } from 'lucide-react';
import axios from 'axios';

const AuthPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  
  // Determine if login or signup based on URL
  const [isLogin, setIsLogin] = useState(location.pathname === '/login');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    // Clear errors when user starts typing
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
        // ========== LOGIN ==========
        const response = await axios.post('http://localhost:5000/api/auth/login', {
          email: formData.email,
          password: formData.password
        });

        if (response.data.success) {
          // Save token and user data to localStorage
          localStorage.setItem('token', response.data.data.token);
          localStorage.setItem('user', JSON.stringify(response.data.data));
          
          setSuccess('Login successful! Redirecting...');
          
          // Redirect to dashboard after 1 second
          setTimeout(() => {
            navigate('/dashboard');
          }, 1000);
        }
      } else {
        // ========== SIGNUP ==========
        // Validate passwords match
        if (formData.password !== formData.confirmPassword) {
          setError('Passwords do not match');
          setLoading(false);
          return;
        }

        // Validate password length
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
          // Save token and user data to localStorage
          localStorage.setItem('token', response.data.data.token);
          localStorage.setItem('user', JSON.stringify(response.data.data));
          
          setSuccess('Account created successfully! Redirecting...');
          
          // Redirect to dashboard after 1 second
          setTimeout(() => {
            navigate('/dashboard');
          }, 1000);
        }
      }
    } catch (err) {
      console.error('Auth error:', err);
      
      // Handle different error scenarios
      if (err.response) {
        // Server responded with error
        setError(err.response.data.message || 'Authentication failed');
      } else if (err.request) {
        // Request made but no response
        setError('Cannot connect to server. Make sure backend is running on port 5000');
      } else {
        // Something else went wrong
        setError('Something went wrong. Please try again.');
      }
      
      setLoading(false);
    }
  };

  const toggleAuthMode = () => {
    setIsLogin(!isLogin);
    setFormData({
      name: '',
      email: '',
      password: '',
      confirmPassword: ''
    });
    setError('');
    setSuccess('');
    navigate(isLogin ? '/signup' : '/login');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#e2cadb] via-[#b7a7d0] to-[#e2cadb] flex items-center justify-center p-4">
      <div className="w-full max-w-6xl glass rounded-3xl overflow-hidden shadow-2xl">
        <div className="grid md:grid-cols-2">
          {/* Left Side - Illustration */}
          <div className="hidden md:flex bg-gradient-to-br from-[#0e1b48] to-[#27425d] p-12 items-center justify-center relative overflow-hidden">
            <div className="absolute top-0 left-0 w-64 h-64 bg-[#c18db4]/20 rounded-full -translate-x-1/2 -translate-y-1/2 animate-pulse"></div>
            <div className="absolute bottom-0 right-0 w-96 h-96 bg-[#b7a7d0]/20 rounded-full translate-x-1/3 translate-y-1/3 animate-pulse" style={{animationDelay: '1s'}}></div>
            
            <div className="relative z-10 text-white space-y-8">
              {/* Logo */}
              <div className="flex items-center space-x-3 mb-8">
                <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center">
                  <Zap className="w-7 h-7 text-white" />
                </div>
                <span className="text-3xl font-bold">Strike</span>
              </div>

              {/* Title */}
              <div>
                <h2 className="text-4xl font-bold mb-4">
                  {isLogin ? 'Welcome Back!' : 'Join Strike Today!'}
                </h2>
                <p className="text-lg text-white/80 leading-relaxed">
                  {isLogin 
                    ? 'Your tasks are waiting. Let\'s crush that to-do list and make today productive!' 
                    : 'Start your journey to better productivity. Organize, track, and achieve your goals with Strike.'}
                </p>
              </div>

              {/* Features List */}
              <div className="space-y-4">
                <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20 transform hover:scale-105 transition-transform">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-[#c18db4]/30 rounded-lg flex items-center justify-center">
                      <CheckCircle className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <div className="font-semibold">Smart Task Management</div>
                      <div className="text-sm text-white/70">Organize with custom boards</div>
                    </div>
                  </div>
                </div>

                <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20 transform hover:scale-105 transition-transform">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-[#b7a7d0]/30 rounded-lg flex items-center justify-center">
                      <Target className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <div className="font-semibold">Habit Tracking</div>
                      <div className="text-sm text-white/70">Build better daily routines</div>
                    </div>
                  </div>
                </div>

                <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20 transform hover:scale-105 transition-transform">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-[#0e1f2f]/30 rounded-lg flex items-center justify-center">
                      <TrendingUp className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <div className="font-semibold">Progress Analytics</div>
                      <div className="text-sm text-white/70">Track your productivity</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-3 gap-4 pt-6 border-t border-white/10">
                <div className="text-center">
                  <div className="text-2xl font-bold">10k+</div>
                  <div className="text-xs text-white/70">Users</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold">50k+</div>
                  <div className="text-xs text-white/70">Tasks Done</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold">99%</div>
                  <div className="text-xs text-white/70">Happy</div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Side - Form */}
          <div className="p-12 bg-white/80 backdrop-blur-lg">
            <div className="max-w-md mx-auto">
              {/* Mobile Logo */}
              <div className="md:hidden flex items-center justify-center space-x-2 mb-8">
                <div className="w-10 h-10 bg-gradient-to-br from-[#c18db4] to-[#0e1b48] rounded-lg flex items-center justify-center">
                  <Zap className="w-6 h-6 text-white" />
                </div>
                <span className="text-2xl font-bold bg-gradient-to-r from-[#0e1b48] to-[#c18db4] bg-clip-text text-transparent">
                  Strike
                </span>
              </div>

              {/* Header */}
              <div className="text-center mb-8">
                <h1 className="text-3xl font-bold text-[#0e1b48] mb-2">
                  {isLogin ? 'Sign In' : 'Create Account'}
                </h1>
                <p className="text-[#27425d]">
                  {isLogin 
                    ? 'Enter your credentials to access your workspace' 
                    : 'Fill in your details to get started with Strike'}
                </p>
              </div>

              {/* Error Message */}
              {error && (
                <div className="mb-4 p-4 bg-red-50 border-l-4 border-red-500 rounded-lg">
                  <p className="text-red-700 text-sm font-medium">{error}</p>
                </div>
              )}

              {/* Success Message */}
              {success && (
                <div className="mb-4 p-4 bg-green-50 border-l-4 border-green-500 rounded-lg">
                  <p className="text-green-700 text-sm font-medium">{success}</p>
                </div>
              )}

              {/* Form */}
              <form onSubmit={handleSubmit} className="space-y-5">
                {/* Name field (only for signup) */}
                {!isLogin && (
                  <div>
                    <label className="block text-sm font-medium text-[#0e1b48] mb-2">
                      Full Name
                    </label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[#27425d]" />
                      <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        placeholder="Enter your name"
                        className="w-full pl-10 pr-4 py-3 border-2 border-[#0e1b48]/20 rounded-xl focus:border-[#c18db4] focus:outline-none transition-colors bg-white/50"
                        required={!isLogin}
                        disabled={loading}
                      />
                    </div>
                  </div>
                )}

                {/* Email field */}
                <div>
                  <label className="block text-sm font-medium text-[#0e1b48] mb-2">
                    Email Address
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[#27425d]" />
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="you@example.com"
                      className="w-full pl-10 pr-4 py-3 border-2 border-[#0e1b48]/20 rounded-xl focus:border-[#c18db4] focus:outline-none transition-colors bg-white/50"
                      required
                      disabled={loading}
                    />
                  </div>
                </div>

                {/* Password field */}
                <div>
                  <label className="block text-sm font-medium text-[#0e1b48] mb-2">
                    Password
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[#27425d]" />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      name="password"
                      value={formData.password}
                      onChange={handleChange}
                      placeholder="••••••••"
                      className="w-full pl-10 pr-12 py-3 border-2 border-[#0e1b48]/20 rounded-xl focus:border-[#c18db4] focus:outline-none transition-colors bg-white/50"
                      required
                      disabled={loading}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-[#27425d] hover:text-[#0e1b48]"
                      disabled={loading}
                    >
                      {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>
                  {!isLogin && (
                    <p className="text-xs text-gray-500 mt-1">Must be at least 6 characters</p>
                  )}
                </div>

                {/* Confirm Password (only for signup) */}
                {!isLogin && (
                  <div>
                    <label className="block text-sm font-medium text-[#0e1b48] mb-2">
                      Confirm Password
                    </label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[#27425d]" />
                      <input
                        type={showPassword ? 'text' : 'password'}
                        name="confirmPassword"
                        value={formData.confirmPassword}
                        onChange={handleChange}
                        placeholder="••••••••"
                        className="w-full pl-10 pr-4 py-3 border-2 border-[#0e1b48]/20 rounded-xl focus:border-[#c18db4] focus:outline-none transition-colors bg-white/50"
                        required={!isLogin}
                        disabled={loading}
                      />
                    </div>
                  </div>
                )}

                {/* Remember me / Forgot password */}
                {isLogin && (
                  <div className="flex items-center justify-between">
                    <label className="flex items-center space-x-2 cursor-pointer">
                      <input 
                        type="checkbox" 
                        className="w-4 h-4 rounded border-[#0e1b48]/20 text-[#c18db4] focus:ring-[#c18db4]"
                        disabled={loading}
                      />
                      <span className="text-sm text-[#27425d]">Remember me</span>
                    </label>
                    <button 
                      type="button"
                      className="text-sm text-[#c18db4] hover:text-[#0e1b48] transition-colors"
                      disabled={loading}
                    >
                      Forgot password?
                    </button>
                  </div>
                )}

                {/* Terms acceptance (only for signup) */}
                {!isLogin && (
                  <label className="flex items-start space-x-2 cursor-pointer">
                    <input 
                      type="checkbox" 
                      className="w-4 h-4 mt-1 rounded border-[#0e1b48]/20 text-[#c18db4] focus:ring-[#c18db4]"
                      required
                      disabled={loading}
                    />
                    <span className="text-sm text-[#27425d]">
                      I agree to the{' '}
                      <a href="#" className="text-[#c18db4] hover:text-[#0e1b48]">Terms of Service</a>
                      {' '}and{' '}
                      <a href="#" className="text-[#c18db4] hover:text-[#0e1b48]">Privacy Policy</a>
                    </span>
                  </label>
                )}

                {/* Submit button */}
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-gradient-to-r from-[#c18db4] to-[#0e1b48] text-white py-3 rounded-xl font-semibold hover:shadow-lg transition-all duration-300 transform hover:scale-[1.02] flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                >
                  {loading ? (
                    <>
                      <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
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

                {/* Toggle between login/signup */}
                <div className="text-center">
                  <p className="text-[#27425d]">
                    {isLogin ? "Don't have an account? " : "Already have an account? "}
                    <button
                      type="button"
                      onClick={toggleAuthMode}
                      className="text-[#c18db4] hover:text-[#0e1b48] font-semibold transition-colors"
                      disabled={loading}
                    >
                      {isLogin ? 'Sign Up' : 'Sign In'}
                    </button>
                  </p>
                </div>
              </form>

              {/* Back to home link */}
              <div className="mt-6 text-center">
                <Link 
                  to="/" 
                  className="text-sm text-[#27425d] hover:text-[#0e1b48] transition-colors inline-flex items-center space-x-1"
                >
                  <span>←</span>
                  <span>Back to Home</span>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthPage;