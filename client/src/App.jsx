import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AppProvider } from './context/AppContext';
import Landing from './pages/Landing';
import AuthPage from './pages/Auth/AuthPage';
import Dashboard from './pages/Dashboard/Dashboard';
import Boards from './pages/Boards/Boards';
import Tasks from './pages/Tasks/Tasks';
import Habits from './pages/Habits/Habits';
import CalendarPage from './pages/Calendar/Calendar';      // NEW
import Classroom from './pages/Classroom/Classroom';        // NEW
import ProtectedRoute from './components/ProtectedRoute';

function App() {
  return (
    <AppProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/login" element={<AuthPage />} />
          <Route path="/signup" element={<AuthPage />} />
          
          {/* Protected Routes */}
          <Route 
            path="/dashboard" 
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/boards" 
            element={
              <ProtectedRoute>
                <Boards />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/tasks" 
            element={
              <ProtectedRoute>
                <Tasks />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/habits" 
            element={
              <ProtectedRoute>
                <Habits />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/calendar" 
            element={
              <ProtectedRoute>
                <CalendarPage />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/classroom" 
            element={
              <ProtectedRoute>
                <Classroom />
              </ProtectedRoute>
            } 
          />
        </Routes>
      </Router>
    </AppProvider>
  );
}

export default App;