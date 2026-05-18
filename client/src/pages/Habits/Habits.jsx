import { useState } from 'react';
import { useApp } from '../../context/AppContext';
import Sidebar from '../../components/layout/Sidebar';
import { Plus, Trash2, X, CheckCircle, Circle, TrendingUp, Zap } from 'lucide-react';

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
    console.log('handleSubmit called - formData:', formData);
    try {
      if (!formData.name) {
        alert('Please enter a habit name');
        return;
      }
      
      const habitData = {
        name: formData.name,
        description: formData.description || undefined,
        frequency: formData.frequency || 'daily'
      };
      
      console.log('Creating habit with data:', habitData);
      
      await addHabit(habitData);
      console.log('Habit created successfully!');
      closeModal();
    } catch (error) {
      console.error('Error creating habit:', error);
      alert('Failed to create habit. Check console for details.');
    }
  };

  const openModal = () => {
    setFormData({ name: '', description: '', frequency: 'daily' });
    setShowModal(true);
  };

  const closeModal = () => setShowModal(false);

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
    const dates = habit.completedDates.map(d => new Date(d)).sort((a, b) => b - a);
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
      if (hasDate) streak++;
      else break;
    }
    return streak;
  };

  return (
    <div className="min-h-screen bg-[var(--bg-primary)] flex grain">
      <Sidebar />
      
      <div className="flex-1 lg:ml-64">
        <div className="p-6 lg:p-10 space-y-8">
          <div className="relative mb-10">
            <div className="absolute inset-0 bg-gradient-to-r from-amber/[0.03] to-violet/[0.03] rounded-3xl blur-3xl" />
            <div className="relative flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-gradient-strike rounded-2xl flex items-center justify-center shadow-lg shadow-amber/20">
                  <Zap className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h1 className="text-4xl lg:text-5xl font-display font-black text-[var(--text-primary)] mb-1">Habits</h1>
                  <p className="text-[var(--text-secondary)] font-body">Build better daily routines</p>
                </div>
              </div>
              <button
                onClick={openModal}
                className="flex items-center space-x-2 bg-gradient-strike text-white px-6 py-3.5 rounded-xl hover:shadow-lg hover:shadow-amber/25 transition-all duration-300 hover:scale-[1.02] font-bold"
              >
                <Plus className="w-5 h-5" />
                <span>New Habit</span>
              </button>
            </div>
          </div>

          {loading ? (
            <div className="flex justify-center py-20">
              <div className="relative w-16 h-16">
                <div className="absolute inset-0 bg-gradient-strike rounded-full animate-spin" style={{ maskImage: 'radial-gradient(circle, transparent 35%, black 65%)' }} />
                <div className="absolute inset-2 bg-[var(--bg-primary)] rounded-full" />
              </div>
            </div>
          ) : habits.length === 0 ? (
            <div className="text-center py-20 rounded-2xl border-2 border-dashed border-[var(--border-color)]">
              <TrendingUp className="w-16 h-16 text-[var(--text-tertiary)] mx-auto mb-4" />
              <p className="text-[var(--text-secondary)] mb-4">No habits yet. Start building better routines!</p>
              <button
                onClick={openModal}
                className="inline-flex items-center space-x-2 bg-gradient-strike text-white px-6 py-3 rounded-xl hover:shadow-lg hover:shadow-amber/25 transition-all"
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
                    className="bg-[var(--bg-secondary)] border border-[var(--border-color)] rounded-2xl p-6 group"
                  >
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-start space-x-3 flex-1">
                        <button onClick={() => handleToggleComplete(habit)} className="mt-1 transition-transform duration-300 hover:scale-110">
                          {completedToday ? (
                            <CheckCircle className="w-6 h-6 text-emerald" />
                          ) : (
                            <Circle className="w-6 h-6 text-[var(--text-tertiary)] hover:text-amber" />
                          )}
                        </button>
                        <div className="flex-1">
                          <h3 className={`font-display font-bold text-lg ${completedToday ? 'text-emerald line-through' : 'text-[var(--text-primary)]'}`}>
                            {habit.name}
                          </h3>
                          {habit.description && (
                            <p className="text-sm text-[var(--text-secondary)] mt-1">{habit.description}</p>
                          )}
                        </div>
                      </div>
                      
                      <button onClick={() => handleDelete(habit._id)} className="p-2 hover:bg-rose/10 rounded-lg transition-colors opacity-0 group-hover:opacity-100">
                        <Trash2 className="w-4 h-4 text-rose" />
                      </button>
                    </div>

                    <div className="flex items-center justify-between pt-4 border-t border-[var(--border-color)]">
                      <div className="flex items-center space-x-2">
                        <TrendingUp className="w-4 h-4 text-amber" />
                        <span className="text-sm font-semibold text-[var(--text-primary)]">
                          {streak} day{streak !== 1 ? 's' : ''} streak
                        </span>
                      </div>
                      <span className="px-3 py-1 bg-amber/10 text-amber text-xs font-medium rounded-full border border-amber/20">
                        {habit.frequency}
                      </span>
                    </div>

                    <div className="mt-4 pt-4 border-t border-[var(--border-color)]">
                      <div className="text-xs text-[var(--text-tertiary)] mb-2">Last 7 Days</div>
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
                              className={`w-8 h-8 rounded-lg flex items-center justify-center text-xs font-medium transition-all ${
                                wasCompleted 
                                  ? 'bg-emerald/20 text-emerald border border-emerald/30' 
                                  : 'bg-[var(--bg-tertiary)] text-[var(--text-tertiary)] border border-[var(--border-color)]'
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

      {showModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-[var(--bg-secondary)] border border-[var(--border-color)] rounded-2xl max-w-md w-full p-8 shadow-2xl shadow-black/50">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-display font-bold text-[var(--text-primary)]">New Habit</h2>
              <button onClick={closeModal} className="p-2 hover:bg-white/5 rounded-lg transition-colors">
                <X className="w-5 h-5 text-[var(--text-tertiary)] hover:text-[var(--text-primary)]" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-[var(--text-secondary)] mb-2">Habit Name *</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-4 py-3 bg-[var(--bg-tertiary)] border border-[var(--border-color)] rounded-xl focus:ring-2 focus:ring-amber/30 focus:border-amber/50 text-[var(--text-primary)] placeholder-[var(--text-tertiary)]"
                  placeholder="e.g., Morning Exercise"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-[var(--text-secondary)] mb-2">Description</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  rows="3"
                  className="w-full px-4 py-3 bg-[var(--bg-tertiary)] border border-[var(--border-color)] rounded-xl focus:ring-2 focus:ring-amber/30 focus:border-amber/50 text-[var(--text-primary)] placeholder-[var(--text-tertiary)] resize-none"
                  placeholder="Why this habit?"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-[var(--text-secondary)] mb-2">Frequency</label>
                <select
                  value={formData.frequency}
                  onChange={(e) => setFormData({ ...formData, frequency: e.target.value })}
                  className="w-full px-4 py-3 bg-[var(--bg-tertiary)] border border-[var(--border-color)] rounded-xl focus:ring-2 focus:ring-amber/30 focus:border-amber/50 text-[var(--text-primary)]"
                >
                  <option value="daily">Daily</option>
                  <option value="weekly">Weekly</option>
                </select>
              </div>

              <div className="flex space-x-3 pt-4 border-t border-[var(--border-color)]">
                <button
                  type="button"
                  onClick={closeModal}
                  className="flex-1 px-4 py-3 border border-[var(--border-color)] text-[var(--text-secondary)] rounded-xl hover:bg-white/5 font-bold transition-all"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-3 bg-gradient-strike text-white rounded-xl hover:shadow-lg hover:shadow-amber/25 font-bold transition-all"
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
