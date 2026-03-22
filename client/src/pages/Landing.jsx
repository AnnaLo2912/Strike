import { Link } from 'react-router-dom';
import { 
  ArrowRight, 
  CheckCircle, 
  Zap, 
  Target, 
  Calendar,
  LayoutDashboard,
  Bell,
  TrendingUp,
  Clock,
  Star,
  Play,
  Menu,
  X
} from 'lucide-react';
import { useState } from 'react';

const Landing = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <nav className="sticky top-0 z-50 bg-white border-b border-gray-200">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <div className="flex items-center space-x-2">
              <div className="w-10 h-10 bg-gradient-to-br from-[#c18db4] to-[#0e1b48] rounded-lg flex items-center justify-center">
                <Zap className="w-6 h-6 text-white" />
              </div>
              <span className="text-2xl font-bold text-[#0e1b48]">Strike</span>
            </div>
            
            {/* Desktop Menu */}
            <div className="hidden md:flex items-center space-x-8">
              <a href="#courses" className="text-gray-700 hover:text-[#c18db4] transition-colors font-medium">
                Features
              </a>
              <a href="#about" className="text-gray-700 hover:text-[#c18db4] transition-colors font-medium">
                About
              </a>
              <a href="#testimonials" className="text-gray-700 hover:text-[#c18db4] transition-colors font-medium">
                Testimonials
              </a>
              <Link 
                to="/login" 
                className="text-gray-700 hover:text-[#c18db4] transition-colors font-medium"
              >
                Login
              </Link>
              <Link 
                to="/signup" 
                className="bg-[#c18db4] text-white px-6 py-2.5 rounded-lg hover:bg-[#0e1b48] transition-all duration-300 font-semibold"
              >
                Sign Up
              </Link>
            </div>

            {/* Mobile menu button */}
            <button 
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2"
            >
              {mobileMenuOpen ? (
                <X className="w-6 h-6 text-[#0e1b48]" />
              ) : (
                <Menu className="w-6 h-6 text-[#0e1b48]" />
              )}
            </button>
          </div>

          {/* Mobile Menu */}
          {mobileMenuOpen && (
            <div className="md:hidden pt-4 pb-3 space-y-3">
              <a href="#courses" className="block text-gray-700 hover:text-[#c18db4] font-medium">
                Features
              </a>
              <a href="#about" className="block text-gray-700 hover:text-[#c18db4] font-medium">
                About
              </a>
              <a href="#testimonials" className="block text-gray-700 hover:text-[#c18db4] font-medium">
                Testimonials
              </a>
              <Link to="/login" className="block text-gray-700 hover:text-[#c18db4] font-medium">
                Login
              </Link>
              <Link 
                to="/signup" 
                className="block bg-[#c18db4] text-white px-6 py-2.5 rounded-lg text-center font-semibold"
              >
                Sign Up
              </Link>
            </div>
          )}
        </div>
      </nav>

      {/* Hero Section */}
      <section className="bg-gradient-to-br from-[#e2cadb]/30 via-white to-[#b7a7d0]/20 py-20">
        <div className="container mx-auto px-6">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left - Text */}
            <div className="space-y-6">
              <div className="inline-flex items-center space-x-2 bg-[#c18db4]/10 px-4 py-2 rounded-full">
                <div className="w-2 h-2 bg-[#c18db4] rounded-full animate-pulse"></div>
                <span className="text-sm font-medium text-[#0e1b48]">Boost Your Productivity</span>
              </div>

              <h1 className="text-5xl lg:text-6xl font-bold text-[#0e1b48] leading-tight">
                Develop your tasks in a{' '}
                <span className="text-[#c18db4]">new and unique</span> way
              </h1>
              
              <p className="text-xl text-gray-600 leading-relaxed">
                Strike helps you manage tasks, track habits, and achieve your goals with 
                beautiful boards, smart reminders, and powerful analytics.
              </p>

              <div className="flex flex-col sm:flex-row gap-4">
                <Link 
                  to="/signup"
                  className="bg-[#c18db4] text-white px-8 py-4 rounded-lg hover:bg-[#0e1b48] transition-all duration-300 font-semibold text-center"
                >
                  Get Started
                </Link>
                
                <button className="flex items-center justify-center space-x-2 border-2 border-[#c18db4] text-[#c18db4] px-8 py-4 rounded-lg hover:bg-[#c18db4] hover:text-white transition-all duration-300 font-semibold">
                  <Play className="w-5 h-5" />
                  <span>Watch Demo</span>
                </button>
              </div>

              {/* Stats */}
              <div className="flex items-center space-x-8 pt-6">
                <div>
                  <div className="text-3xl font-bold text-[#0e1b48]">10K+</div>
                  <div className="text-sm text-gray-600">Active Users</div>
                </div>
                <div>
                  <div className="text-3xl font-bold text-[#0e1b48]">50K+</div>
                  <div className="text-sm text-gray-600">Tasks Completed</div>
                </div>
              </div>
            </div>

            {/* Right - Image with decorative elements */}
            <div className="relative">
              {/* Main Image Card */}
              <div className="relative z-10 bg-white rounded-3xl p-8 shadow-2xl">
                <div className="aspect-square bg-gradient-to-br from-[#c18db4] to-[#0e1b48] rounded-2xl flex items-center justify-center">
                  <div className="text-white text-center">
                    <Zap className="w-24 h-24 mx-auto mb-4" />
                    <h3 className="text-2xl font-bold">Strike Dashboard</h3>
                    <p className="mt-2 text-white/80">Your productivity hub</p>
                  </div>
                </div>
              </div>

              {/* Floating Card 1 */}
              <div className="absolute -top-4 -right-4 bg-white rounded-2xl p-4 shadow-xl z-20 hidden lg:block">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
                    <CheckCircle className="w-6 h-6 text-green-600" />
                  </div>
                  <div>
                    <div className="font-semibold text-sm text-[#0e1b48]">5 Tasks</div>
                    <div className="text-xs text-gray-500">Completed today</div>
                  </div>
                </div>
              </div>

              {/* Floating Card 2 */}
              <div className="absolute -bottom-4 -left-4 bg-white rounded-2xl p-4 shadow-xl z-20 hidden lg:block">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-[#c18db4]/20 rounded-xl flex items-center justify-center">
                    <Target className="w-6 h-6 text-[#c18db4]" />
                  </div>
                  <div>
                    <div className="font-semibold text-sm text-[#0e1b48]">3 Goals</div>
                    <div className="text-xs text-gray-500">In progress</div>
                  </div>
                </div>
              </div>

              {/* Background circles */}
              <div className="absolute top-0 right-0 w-32 h-32 bg-[#c18db4]/10 rounded-full -z-10"></div>
              <div className="absolute bottom-0 left-0 w-40 h-40 bg-[#b7a7d0]/10 rounded-full -z-10"></div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="courses" className="py-20 bg-white">
        <div className="container mx-auto px-6">
          <div className="text-center mb-4">
            <h2 className="text-4xl font-bold text-[#0e1b48] mb-4">
              Search <span className="text-[#c18db4]">Features</span>
            </h2>
          </div>

          {/* Feature Cards Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mt-12">
            {/* Feature 1 */}
            <div className="bg-white border-2 border-gray-100 rounded-2xl p-6 hover:border-[#c18db4] hover:shadow-xl transition-all duration-300 cursor-pointer group">
              <div className="w-14 h-14 bg-[#c18db4]/10 rounded-xl flex items-center justify-center mb-4 group-hover:bg-[#c18db4] transition-colors">
                <LayoutDashboard className="w-7 h-7 text-[#c18db4] group-hover:text-white transition-colors" />
              </div>
              <h3 className="text-xl font-bold text-[#0e1b48] mb-2">Smart Dashboard</h3>
              <p className="text-gray-600 text-sm leading-relaxed mb-4">
                Beautiful overview of all your tasks and progress in one place
              </p>
              <button className="text-[#c18db4] font-semibold text-sm flex items-center space-x-1 group-hover:space-x-2 transition-all">
                <span>Learn More</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>

            {/* Feature 2 */}
            <div className="bg-white border-2 border-gray-100 rounded-2xl p-6 hover:border-[#c18db4] hover:shadow-xl transition-all duration-300 cursor-pointer group">
              <div className="w-14 h-14 bg-[#b7a7d0]/10 rounded-xl flex items-center justify-center mb-4 group-hover:bg-[#b7a7d0] transition-colors">
                <Target className="w-7 h-7 text-[#b7a7d0] group-hover:text-white transition-colors" />
              </div>
              <h3 className="text-xl font-bold text-[#0e1b48] mb-2">Custom Boards</h3>
              <p className="text-gray-600 text-sm leading-relaxed mb-4">
                Organize tasks into unlimited boards for work, life, and projects
              </p>
              <button className="text-[#c18db4] font-semibold text-sm flex items-center space-x-1 group-hover:space-x-2 transition-all">
                <span>Learn More</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>

            {/* Feature 3 */}
            <div className="bg-white border-2 border-gray-100 rounded-2xl p-6 hover:border-[#c18db4] hover:shadow-xl transition-all duration-300 cursor-pointer group">
              <div className="w-14 h-14 bg-[#0e1b48]/10 rounded-xl flex items-center justify-center mb-4 group-hover:bg-[#0e1b48] transition-colors">
                <Bell className="w-7 h-7 text-[#0e1b48] group-hover:text-white transition-colors" />
              </div>
              <h3 className="text-xl font-bold text-[#0e1b48] mb-2">Smart Reminders</h3>
              <p className="text-gray-600 text-sm leading-relaxed mb-4">
                Location-based reminders and deadline sync from calendars
              </p>
              <button className="text-[#c18db4] font-semibold text-sm flex items-center space-x-1 group-hover:space-x-2 transition-all">
                <span>Learn More</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>

            {/* Feature 4 */}
            <div className="bg-white border-2 border-gray-100 rounded-2xl p-6 hover:border-[#c18db4] hover:shadow-xl transition-all duration-300 cursor-pointer group">
              <div className="w-14 h-14 bg-[#c18db4]/10 rounded-xl flex items-center justify-center mb-4 group-hover:bg-[#c18db4] transition-colors">
                <TrendingUp className="w-7 h-7 text-[#c18db4] group-hover:text-white transition-colors" />
              </div>
              <h3 className="text-xl font-bold text-[#0e1b48] mb-2">Progress Tracking</h3>
              <p className="text-gray-600 text-sm leading-relaxed mb-4">
                Detailed analytics to track productivity and achievements
              </p>
              <button className="text-[#c18db4] font-semibold text-sm flex items-center space-x-1 group-hover:space-x-2 transition-all">
                <span>Learn More</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Popular Courses Section (Features Showcase) */}
      <section className="py-20 bg-gradient-to-br from-[#c18db4] to-[#0e1b48] text-white">
        <div className="container mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold mb-4">Our Popular Features</h2>
            <p className="text-lg text-white/80">
              Discover what makes Strike the best productivity tool
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {/* Card 1 */}
            <div className="bg-white rounded-2xl overflow-hidden shadow-xl hover:shadow-2xl transition-shadow group cursor-pointer">
              <div className="aspect-video bg-gradient-to-br from-[#e2cadb] to-[#b7a7d0] flex items-center justify-center">
                <LayoutDashboard className="w-20 h-20 text-[#0e1b48]" />
              </div>
              <div className="p-6">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-semibold text-[#c18db4]">PRODUCTIVITY</span>
                  <div className="flex items-center space-x-1">
                    <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                    <span className="text-sm font-semibold text-gray-700">4.9</span>
                  </div>
                </div>
                <h3 className="text-xl font-bold text-[#0e1b48] mb-2">
                  Dashboard & Analytics
                </h3>
                <p className="text-gray-600 text-sm mb-4">
                  Track your progress with beautiful charts and insights
                </p>
                <div className="flex items-center justify-between">
                  <span className="text-2xl font-bold text-[#0e1b48]">Free</span>
                  <button className="text-[#c18db4] font-semibold group-hover:text-[#0e1b48]">
                    Explore →
                  </button>
                </div>
              </div>
            </div>

            {/* Card 2 */}
            <div className="bg-white rounded-2xl overflow-hidden shadow-xl hover:shadow-2xl transition-shadow group cursor-pointer">
              <div className="aspect-video bg-gradient-to-br from-[#b7a7d0] to-[#c18db4] flex items-center justify-center">
                <Clock className="w-20 h-20 text-white" />
              </div>
              <div className="p-6">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-semibold text-[#c18db4]">HABITS</span>
                  <div className="flex items-center space-x-1">
                    <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                    <span className="text-sm font-semibold text-gray-700">5.0</span>
                  </div>
                </div>
                <h3 className="text-xl font-bold text-[#0e1b48] mb-2">
                  Habit Tracking
                </h3>
                <p className="text-gray-600 text-sm mb-4">
                  Build better routines with visual tracking cards
                </p>
                <div className="flex items-center justify-between">
                  <span className="text-2xl font-bold text-[#0e1b48]">Free</span>
                  <button className="text-[#c18db4] font-semibold group-hover:text-[#0e1b48]">
                    Explore →
                  </button>
                </div>
              </div>
            </div>

            {/* Card 3 */}
            <div className="bg-white rounded-2xl overflow-hidden shadow-xl hover:shadow-2xl transition-shadow group cursor-pointer">
              <div className="aspect-video bg-gradient-to-br from-[#0e1b48] to-[#27425d] flex items-center justify-center">
                <Bell className="w-20 h-20 text-white" />
              </div>
              <div className="p-6">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-semibold text-[#c18db4]">REMINDERS</span>
                  <div className="flex items-center space-x-1">
                    <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                    <span className="text-sm font-semibold text-gray-700">4.8</span>
                  </div>
                </div>
                <h3 className="text-xl font-bold text-[#0e1b48] mb-2">
                  Smart Notifications
                </h3>
                <p className="text-gray-600 text-sm mb-4">
                  Never miss deadlines with intelligent reminders
                </p>
                <div className="flex items-center justify-between">
                  <span className="text-2xl font-bold text-[#0e1b48]">Free</span>
                  <button className="text-[#c18db4] font-semibold group-hover:text-[#0e1b48]">
                    Explore →
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section id="testimonials" className="py-20 bg-gradient-to-br from-[#e2cadb]/20 to-[#b7a7d0]/20">
        <div className="container mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-[#0e1b48] mb-4">
              Student's <span className="text-[#c18db4]">Testimonials</span>
            </h2>
            <p className="text-gray-600">What our users say about Strike</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-white rounded-2xl p-6 shadow-lg">
                <div className="flex items-center space-x-1 mb-4">
                  {[...Array(5)].map((_, j) => (
                    <Star key={j} className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>
                <p className="text-gray-600 mb-6 leading-relaxed">
                  "Strike transformed how I manage my daily tasks. The board system is intuitive 
                  and the reminders keep me on track!"
                </p>
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-gradient-to-br from-[#c18db4] to-[#0e1b48] rounded-full flex items-center justify-center text-white font-bold">
                    U{i}
                  </div>
                  <div>
                    <div className="font-semibold text-[#0e1b48]">User {i}</div>
                    <div className="text-sm text-gray-500">Productivity Enthusiast</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-br from-[#c18db4] to-[#0e1b48] text-white">
        <div className="container mx-auto px-6 text-center">
          <h2 className="text-4xl font-bold mb-4">
            Ready to Boost Your Productivity?
          </h2>
          <p className="text-xl mb-8 text-white/90">
            Join thousands of users who trust Strike every day
          </p>
          <Link 
            to="/signup"
            className="inline-flex items-center bg-white text-[#0e1b48] px-10 py-4 rounded-lg hover:bg-gray-100 transition-all duration-300 space-x-2 font-semibold text-lg shadow-xl"
          >
            <span>Get Started Free</span>
            <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-[#0e1b48] text-white py-12">
        <div className="container mx-auto px-6">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <div className="w-8 h-8 bg-[#c18db4] rounded-lg flex items-center justify-center">
                  <Zap className="w-5 h-5 text-white" />
                </div>
                <span className="text-xl font-bold">Strike</span>
              </div>
              <p className="text-white/70 text-sm">
                Your ultimate productivity companion
              </p>
            </div>

            <div>
              <h4 className="font-bold mb-4">Product</h4>
              <ul className="space-y-2 text-sm text-white/70">
                <li><a href="#" className="hover:text-white">Features</a></li>
                <li><a href="#" className="hover:text-white">Pricing</a></li>
              </ul>
            </div>

            <div>
              <h4 className="font-bold mb-4">Company</h4>
              <ul className="space-y-2 text-sm text-white/70">
                <li><a href="#" className="hover:text-white">About</a></li>
                <li><a href="#" className="hover:text-white">Contact</a></li>
              </ul>
            </div>

            <div>
              <h4 className="font-bold mb-4">Legal</h4>
              <ul className="space-y-2 text-sm text-white/70">
                <li><a href="#" className="hover:text-white">Privacy</a></li>
                <li><a href="#" className="hover:text-white">Terms</a></li>
              </ul>
            </div>
          </div>

          <div className="border-t border-white/10 pt-8 text-center text-white/70 text-sm">
            <p>&copy; 2024 Strike. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Landing;