import { useState } from 'react';
import { useApp } from '../../context/AppContext';
import Sidebar from '../../components/layout/Sidebar';
import { Plus, Trash2, CheckCircle, Circle, TrendingUp } from 'lucide-react';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { Textarea } from '../../components/ui/textarea';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogFooter 
} from '../../components/ui/dialog';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '../../components/ui/select';

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
      if (!formData.name) return;
      
      const habitData = {
        name: formData.name,
        description: formData.description || undefined,
        frequency: formData.frequency || 'daily'
      };
      
      await addHabit(habitData);
      closeModal();
    } catch (error) {
      console.error('Error creating habit:', error);
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
    <div className="min-h-screen bg-[var(--bg-primary)] flex">
      <Sidebar />
      
      <div className="flex-1 lg:ml-52">
        <div className="p-6 lg:p-8 space-y-5">
          {/* Header */}
          <div className="page-header">
            <div>
              <h1 className="page-title">Habits</h1>
              <p className="page-subtitle">Build better daily routines</p>
            </div>
            <Button onClick={openModal} className="gap-2 bg-gradient-to-r from-[#14b8a6] to-[#0d9488] text-white hover:opacity-90 font-display font-semibold text-sm h-9 rounded-lg px-4 shadow-lg shadow-[rgba(20,184,166,0.15)]">
              <Plus className="w-4 h-4" />
              New Habit
            </Button>
          </div>

          {/* Habits List */}
          {loading ? (
            <div className="flex justify-center py-16">
              <div className="w-6 h-6 border-2 border-[rgba(20,184,166,0.2)] border-t-[#14b8a6] rounded-full animate-spin" />
            </div>
          ) : habits.length === 0 ? (
            <div className="card-surface">
              <div className="empty-state">
                <div className="empty-state-icon">
                  <TrendingUp className="w-5 h-5 text-[#14b8a6]" />
                </div>
                <p className="empty-state-title">No habits yet</p>
                <p className="empty-state-text">Start building better routines!</p>
                <Button onClick={openModal} className="gap-2 bg-gradient-to-r from-[#14b8a6] to-[#0d9488] text-white hover:opacity-90 h-8 text-xs rounded-lg shadow-lg shadow-[rgba(20,184,166,0.15)]">
                  <Plus className="w-3.5 h-3.5" />
                  Create Habit
                </Button>
              </div>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-3">
              {habits.map((habit) => {
                const completedToday = isCompletedToday(habit);
                const streak = getStreakDays(habit);
                
                return (
                  <div key={habit._id} className="card-surface p-4 group">
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex items-start gap-2.5 flex-1">
                        <button 
                          onClick={() => handleToggleComplete(habit)} 
                          className="mt-0.5 transition-transform duration-150 hover:scale-110"
                        >
                          {completedToday ? (
                            <CheckCircle className="w-5 h-5 text-[#22c55e]" />
                          ) : (
                            <Circle className="w-5 h-5 text-[var(--text-tertiary)] hover:text-[#14b8a6]" />
                          )}
                        </button>
                        <div className="flex-1 min-w-0">
                          <h3 className={`text-sm font-medium ${completedToday ? 'text-[#22c55e] line-through' : 'text-[var(--text-primary)]'}`}>
                            {habit.name}
                          </h3>
                          {habit.description && (
                            <p className="text-[11px] text-[var(--text-tertiary)] mt-0.5">{habit.description}</p>
                          )}
                        </div>
                      </div>
                      <button 
                        className="p-1 rounded opacity-0 group-hover:opacity-100 hover:bg-[rgba(20,184,166,0.08)] transition-all" 
                        onClick={() => handleDelete(habit._id)}
                      >
                        <Trash2 className="w-3.5 h-3.5 text-[var(--text-tertiary)] hover:text-[#ef4444]" />
                      </button>
                    </div>

                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-1.5">
                        <TrendingUp className="w-3 h-3 text-[#14b8a6]" />
                        <span className="text-[11px] font-medium text-[var(--text-secondary)]">
                          {streak} day{streak !== 1 ? 's' : ''}
                        </span>
                      </div>
                      <span className="text-[10px] font-medium text-[var(--text-tertiary)] uppercase tracking-wider bg-[var(--bg-tertiary)] px-2 py-0.5 rounded-full">
                        {habit.frequency}
                      </span>
                    </div>

                    {/* Last 7 Days */}
                    <div className="pt-3 border-t border-[var(--border-color)]">
                      <div className="text-[10px] text-[var(--text-tertiary)] mb-1.5 uppercase tracking-wider">Last 7 Days</div>
                      <div className="flex gap-1">
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
                              className={`w-7 h-7 rounded-md flex items-center justify-center text-[10px] font-medium transition-all ${
                                wasCompleted 
                                  ? 'bg-[rgba(34,197,94,0.1)] text-[#22c55e] border border-[rgba(34,197,94,0.15)]' 
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

      {/* Create Dialog */}
      <Dialog open={showModal} onOpenChange={setShowModal}>
        <DialogContent className="sm:max-w-md bg-[var(--card-bg)] border-[var(--border-color)]">
          <DialogHeader>
            <DialogTitle className="text-base font-display font-bold text-[var(--text-primary)]">New Habit</DialogTitle>
          </DialogHeader>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1.5">
              <Label htmlFor="habit-name" className="text-xs font-medium text-[var(--text-secondary)] uppercase tracking-wider">Habit Name</Label>
              <Input
                id="habit-name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="e.g., Morning Exercise"
                className="h-9 bg-[var(--input-bg)] border-[var(--border-color)] text-[var(--text-primary)] focus:border-[#14b8a6]"
                required
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="habit-desc" className="text-xs font-medium text-[var(--text-secondary)] uppercase tracking-wider">Description</Label>
              <Textarea
                id="habit-desc"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Why this habit?"
                rows={3}
                className="bg-[var(--input-bg)] border-[var(--border-color)] text-[var(--text-primary)] focus:border-[#14b8a6]"
              />
            </div>

            <div className="space-y-1.5">
              <Label className="text-xs font-medium text-[var(--text-secondary)] uppercase tracking-wider">Frequency</Label>
              <Select value={formData.frequency} onValueChange={(v) => setFormData({ ...formData, frequency: v })}>
                <SelectTrigger className="h-9 bg-[var(--input-bg)] border-[var(--border-color)] text-[var(--text-primary)]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-[var(--card-bg)] border-[var(--border-color)]">
                  <SelectItem value="daily">Daily</SelectItem>
                  <SelectItem value="weekly">Weekly</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <DialogFooter className="gap-2 pt-2">
              <Button type="button" variant="outline" onClick={closeModal} className="h-9 border-[var(--border-color)] text-[var(--text-secondary)]">
                Cancel
              </Button>
              <Button type="submit" className="h-9 bg-gradient-to-r from-[#14b8a6] to-[#0d9488] text-white hover:opacity-90 font-display font-semibold shadow-lg shadow-[rgba(20,184,166,0.15)]">
                Create
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Habits;
