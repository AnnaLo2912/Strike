import { useState } from 'react';
import { useApp } from '../../context/AppContext';
import Sidebar from '../../components/Layout/Sidebar';
import { Plus, Trash2, X, CheckCircle, Circle, TrendingUp } from 'lucide-react';

const Habits = () => {
  const { habits, addHabit, markHabitComplete, deleteHabit, loading } = useApp();
  const [showModal, setShowModal] = useState(false);
  
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    frequency: 'daily'
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      await addHabit(formData);
      closeModal();
    } catch (error) {
      console.error('Error creating habit:', error);
    }
  };

  const openModal = () => {
    setFormData({
      name: '',
      description: '',
      frequency: 'daily'
    });
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this habit?')) {
      await deleteHabit(id);
    }
  };

  const handleToggleComplete = async (habit) => {
    await markHabitComplete(habit._id);
  };

  const isCompletedToday = (habit) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    return habit.completedDates?.some(date => {
      const completedDate = new Date(date);
      completedDate.setHours(0, 0, 0, 0);
      return completedDate.getTime() === today.getTime();
    });
  };

  const getStreakDays = (habit) => {
    if (!habit.completedDates || habit.completedDates.length === 0) return 0;
    
    const dates = habit.completedDates
      .map(d => new Date(d))
      .sort((a, b) => b - a);
    
    let streak = 0;
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    for (let i = 0; i < dates.length; i++) {
      const checkDate = new Date(today);
      checkDate.setDate(checkDate.getDate() - i);
      checkDate.setHours(0, 0, 0, 0);
      
      const hasDate = dates.some(d => {
        d.setHours(0, 0, 0, 0);
        return d.getTime() === checkDate.getTime();
      });
      
      if (hasDate) {
        streak++;
      } else {
        break;
      }
    }
    
    return streak;
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <Sidebar />
      
      <div className="flex-1 lg:ml-64">
        <div className="p-8">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold text-[#0e1b48] mb-2">Habits</h1>
              <p className="text-gray-600">Build better daily routines</p>
            </div>
            <button
              onClick={openModal}
              className="flex items-center space-x-2 bg-gradient-to-r from-[#c18db4] to-[#0e1b48] text-white px-6 py-3 rounded-xl hover:shadow-lg transition-all"
            >
              <Plus className="w-5 h-5" />
              <span>New Habit</span>
            </button>
          </div>

          {/* Habits List */}
          {loading ? (
            <div className="flex justify-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#c18db4]"></div>
            </div>
          ) : habits.length === 0 ? (
            <div className="text-center py-12 bg-white rounded-2xl">
              <TrendingUp className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500 mb-4">No habits yet. Start building better routines!</p>
              <button
                onClick={openModal}
                className="inline-flex items-center space-x-2 bg-[#c18db4] text-white px-6 py-3 rounded-xl hover:shadow-lg transition-all"
              >
                <Plus className="w-5 h-5" />
                <span>Create Habit</span>
              </button>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {habits.map((habit) => {
                const completedToday = isCompletedToday(habit);
                const streak = getStreakDays(habit);
                
                return (
                  <div
                    key={habit._id}
                    className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-lg transition-all"
                  >
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-start space-x-3 flex-1">
                        <button
                          onClick={() => handleToggleComplete(habit)}
                          className="mt-1"
                        >
                          {completedToday ? (
                            <CheckCircle className="w-6 h-6 text-green-500" />
                          ) : (
                            <Circle className="w-6 h-6 text-gray-300 hover:text-gray-400" />
                          )}
                        </button>
                        <div className="flex-1">
                          <h3 className={`font-semibold text-lg ${
                            completedToday ? 'text-green-600 line-through' : 'text-[#0e1b48]'
                          }`}>
                            {habit.name}
                          </h3>
                          {habit.description && (
                            <p className="text-sm text-gray-600 mt-1">
                              {habit.description}
                            </p>
                          )}
                        </div>
                      </div>
                      
                      <button
                        onClick={() => handleDelete(habit._id)}
                        className="p-2 hover:bg-red-50 rounded-lg transition-colors"
                      >
                        <Trash2 className="w-4 h-4 text-red-600" />
                      </button>
                    </div>

                    <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                      <div className="flex items-center space-x-2">
                        <TrendingUp className="w-4 h-4 text-[#c18db4]" />
                        <span className="text-sm font-semibold text-[#0e1b48]">
                          {streak} day{streak !== 1 ? 's' : ''} streak
                        </span>
                      </div>
                      
                      <span className="px-3 py-1 bg-[#c18db4]/10 text-[#c18db4] text-xs font-medium rounded-full">
                        {habit.frequency}
                      </span>
                    </div>

                    {/* Completion History (Last 7 Days) */}
                    <div className="mt-4 pt-4 border-t border-gray-100">
                      <div className="text-xs text-gray-500 mb-2">Last 7 Days</div>
                      <div className="flex space-x-2">
                        {[...Array(7)].map((_, i) => {
                          const checkDate = new Date();
                          checkDate.setDate(checkDate.getDate() - (6 - i));
                          checkDate.setHours(0, 0, 0, 0);
                          
                          const wasCompleted = habit.completedDates?.some(date => {
                            const d = new Date(date);
                            d.setHours(0, 0, 0, 0);
                            return d.getTime() === checkDate.getTime();
                          });
                          
                          return (
                            <div
                              key={i}
                              className={`w-8 h-8 rounded-lg flex items-center justify-center text-xs font-medium ${
                                wasCompleted 
                                  ? 'bg-green-100 text-green-700' 
                                  : 'bg-gray-100 text-gray-400'
                              }`}
                            >
                              {checkDate.getDate()}
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-[#0e1b48]">New Habit</h2>
              <button onClick={closeModal} className="p-2 hover:bg-gray-100 rounded-lg">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Habit Name *
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#c18db4] focus:border-transparent"
                  placeholder="e.g., Morning Exercise"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Description
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  rows="3"
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#c18db4] focus:border-transparent"
                  placeholder="Why this habit?"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Frequency
                </label>
                <select
                  value={formData.frequency}
                  onChange={(e) => setFormData({ ...formData, frequency: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#c18db4] focus:border-transparent"
                >
                  <option value="daily">Daily</option>
                  <option value="weekly">Weekly</option>
                </select>
              </div>

              <div className="flex space-x-3 pt-4">
                <button
                  type="button"
                  onClick={closeModal}
                  className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-2 bg-gradient-to-r from-[#c18db4] to-[#0e1b48] text-white rounded-lg hover:shadow-lg"
                >
                  Create
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Habits;