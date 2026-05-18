import { useState } from 'react';
import { useApp } from '../../context/AppContext';
import Sidebar from '../../components/Layout/Sidebar';
import { 
  Plus, 
  Search, 
  Filter,
  Calendar,
  Flag,
  Edit2,
  Trash2,
  X,
  Zap
} from 'lucide-react';

const Tasks = () => {
  const { tasks, boards, addTask, updateTask, deleteTask, loading } = useApp();
  const [showModal, setShowModal] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    status: 'todo',
    priority: 'medium',
    dueDate: '',
    board: ''
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log('handleSubmit called - formData:', formData);
    try {
      if (!formData.title) {
        alert('Please enter a task title');
        return;
      }
      
      const taskData = {
        title: formData.title,
        description: formData.description || undefined,
        status: formData.status || 'todo',
        priority: formData.priority || 'medium',
        dueDate: formData.dueDate || undefined,
        board: formData.board || null
      };
      
      console.log('Creating task with data:', taskData);
      
      if (editingTask) {
        await updateTask(editingTask._id, taskData);
      } else {
        await addTask(taskData);
      }
      console.log('Task created successfully!');
      closeModal();
    } catch (error) {
      console.error('Error saving task:', error);
      alert('Failed to save task. Check console for details.');
    }
  };

  const openModal = (task = null) => {
    if (task) {
      setEditingTask(task);
      setFormData({
        title: task.title,
        description: task.description || '',
        status: task.status,
        priority: task.priority,
        dueDate: task.dueDate ? new Date(task.dueDate).toISOString().split('T')[0] : '',
        board: task.board?._id || ''
      });
    } else {
      setEditingTask(null);
      setFormData({
        title: '',
        description: '',
        status: 'todo',
        priority: 'medium',
        dueDate: '',
        board: ''
      });
    }
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setEditingTask(null);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this task?')) {
      await deleteTask(id);
    }
  };

  const filteredTasks = tasks.filter(task => {
    const matchesSearch = task.title.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'all' || task.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

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
                  <h1 className="text-4xl lg:text-5xl font-display font-black text-[var(--text-primary)] mb-1">Tasks</h1>
                  <p className="text-[var(--text-secondary)] font-body">{filteredTasks.length} tasks to manage</p>
                </div>
              </div>
              <button
                onClick={() => openModal()}
                className="group relative px-6 py-3.5 bg-gradient-strike text-white rounded-xl font-bold flex items-center gap-2 overflow-hidden transition-all duration-300 hover:shadow-lg hover:shadow-amber/25 hover:scale-[1.02]"
              >
                <Plus className="w-5 h-5 relative z-10" />
                <span className="relative z-10">Add Task</span>
              </button>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <div className="relative group">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[var(--text-tertiary)] group-focus-within:text-amber transition-colors" />
              <input
                type="text"
                placeholder="Search tasks..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-12 pr-4 py-3 bg-[var(--bg-tertiary)] border border-[var(--border-color)] rounded-2xl focus:ring-2 focus:ring-amber/30 focus:border-amber/50 text-[var(--text-primary)] placeholder-[var(--text-tertiary)] transition-all"
              />
            </div>

            <div className="relative group">
              <Filter className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[var(--text-tertiary)] group-focus-within:text-amber transition-colors pointer-events-none" />
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="w-full pl-12 pr-4 py-3 bg-[var(--bg-tertiary)] border border-[var(--border-color)] rounded-2xl focus:ring-2 focus:ring-amber/30 focus:border-amber/50 text-[var(--text-primary)] appearance-none transition-all cursor-pointer"
              >
                <option value="all">All Status</option>
                <option value="todo">To Do</option>
                <option value="in-progress">In Progress</option>
                <option value="completed">Completed</option>
              </select>
            </div>
          </div>

          {loading ? (
            <div className="flex justify-center py-20">
              <div className="relative w-16 h-16">
                <div className="absolute inset-0 bg-gradient-strike rounded-full animate-spin" style={{ maskImage: 'radial-gradient(circle, transparent 35%, black 65%)' }} />
                <div className="absolute inset-2 bg-obsidian rounded-full" />
              </div>
            </div>
          ) : filteredTasks.length === 0 ? (
            <div className="text-center py-20 rounded-2xl border-2 border-dashed border-[var(--border-color)]">
              <div className="w-16 h-16 bg-amber/10 rounded-full flex items-center justify-center mx-auto mb-4 border border-amber/20">
                <Plus className="w-8 h-8 text-amber" />
              </div>
              <p className="text-lg font-display font-semibold text-[var(--text-primary)] mb-2">No tasks found</p>
              <p className="text-[var(--text-secondary)] mb-6">Create your first task to get started</p>
              <button
                onClick={() => openModal()}
                className="inline-flex items-center space-x-2 bg-gradient-strike text-white px-6 py-3 rounded-xl hover:shadow-lg hover:shadow-amber/25 transition-all"
              >
                <Plus className="w-5 h-5" />
                <span>Create Task</span>
              </button>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
              {filteredTasks.map((task, idx) => (
                <div
                  key={task._id}
                  className="group bg-[var(--bg-secondary)] border border-[var(--border-color)] rounded-2xl p-6 overflow-hidden hover:border-amber/30 transition-all duration-300"
                  style={{ animation: `reveal 0.5s ease-out ${idx * 0.03}s forwards`, opacity: 0, boxShadow: '0 4px 24px rgba(0, 0, 0, 0.3)' }}
                >
                  <div className={`absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none ${
                    task.status === 'completed' ? 'bg-emerald/[0.03]' :
                    task.status === 'in-progress' ? 'bg-cyan/[0.03]' :
                    'bg-amber/[0.03]'
                  }`} />

                  <div className={`absolute top-0 left-0 h-0.5 w-0 group-hover:w-full transition-all duration-500 ${
                    task.status === 'completed' ? 'bg-emerald' :
                    task.status === 'in-progress' ? 'bg-cyan' :
                    'bg-amber'
                  }`} />

                  <div className="relative z-10">
                    <div className="flex items-start justify-between mb-4">
                      <h3 className="font-display font-bold text-[var(--text-primary)] text-lg flex-1 leading-tight group-hover:text-amber transition-colors">
                        {task.title}
                      </h3>
                      <div className="flex items-center space-x-1 opacity-0 group-hover:opacity-100 transition-all translate-x-2 group-hover:translate-x-0">
                        <button onClick={() => openModal(task)} className="p-2 hover:bg-amber/10 rounded-lg transition-colors">
                          <Edit2 className="w-4 h-4 text-amber" />
                        </button>
                        <button onClick={() => handleDelete(task._id)} className="p-2 hover:bg-rose/10 rounded-lg transition-colors">
                          <Trash2 className="w-4 h-4 text-rose" />
                        </button>
                      </div>
                    </div>

                    {task.description && (
                      <p className="text-sm text-[var(--text-secondary)] mb-4 line-clamp-2">{task.description}</p>
                    )}

                    {task.board && (
                      <div className="flex items-center space-x-2 mb-4">
                        <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: task.board.color || '#f59e0b' }} />
                        <span className="text-xs font-semibold text-[var(--text-secondary)] uppercase tracking-wide">{task.board.name}</span>
                      </div>
                    )}

                    <div className="inline-flex items-center gap-2 mb-5">
                      <Flag className={`w-4 h-4 ${
                        task.priority === 'high' ? 'text-rose' :
                        task.priority === 'medium' ? 'text-amber' :
                        'text-emerald'
                      }`} />
                      <span className={`text-xs font-bold uppercase tracking-wide ${
                        task.priority === 'high' ? 'text-rose' :
                        task.priority === 'medium' ? 'text-amber' :
                        'text-emerald'
                      }`}>
                        {task.priority} Priority
                      </span>
                    </div>

                    <div className="flex items-center justify-between pt-4 border-t border-amber/10">
                      <div className="flex items-center space-x-2">
                        {task.dueDate && (
                          <div className="flex items-center space-x-1 text-xs text-slate">
                            <Calendar className="w-3.5 h-3.5" />
                            <span>{new Date(task.dueDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</span>
                          </div>
                        )}
                      </div>
                      
                      <span className={`px-3 py-1.5 rounded-full text-xs font-bold ${
                        task.status === 'completed' ? 'bg-emerald/20 text-emerald' :
                        task.status === 'in-progress' ? 'bg-cyan/20 text-cyan' :
                        'bg-slate/20 text-slate'
                      }`}>
                        {task.status === 'in-progress' ? 'In Progress' : task.status.charAt(0).toUpperCase() + task.status.slice(1)}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-[var(--bg-secondary)] border border-[var(--border-color)] rounded-3xl max-w-md w-full p-8 shadow-2xl shadow-black/50">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-3xl font-display font-bold text-[var(--text-primary)]">
                {editingTask ? 'Update Task' : 'Create Task'}
              </h2>
              <button onClick={closeModal} className="p-2 hover:bg-white/5 rounded-xl transition-colors">
                <X className="w-6 h-6 text-[var(--text-tertiary)] hover:text-[var(--text-primary)]" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="block text-sm font-bold text-[var(--text-secondary)] mb-3">Title *</label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full px-4 py-3 bg-[var(--bg-tertiary)] border border-[var(--border-color)] focus:ring-2 focus:ring-amber/30 focus:border-amber/50 text-[var(--text-primary)] placeholder-[var(--text-tertiary)] font-medium"
                  placeholder="Task name"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-[var(--text-secondary)] mb-3">Description</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  rows="3"
                  className="w-full px-4 py-3 bg-[var(--bg-tertiary)] border border-[var(--border-color)] focus:ring-2 focus:ring-amber/30 focus:border-amber/50 text-[var(--text-primary)] placeholder-[var(--text-tertiary)] resize-none"
                  placeholder="Add details about this task..."
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-bold text-[var(--text-secondary)] mb-3">Status</label>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                    className="w-full px-4 py-3 bg-[var(--bg-tertiary)] border border-[var(--border-color)] focus:ring-2 focus:ring-amber/30 focus:border-amber/50 text-[var(--text-primary)] font-medium"
                  >
                    <option value="todo">To Do</option>
                    <option value="in-progress">In Progress</option>
                    <option value="completed">Completed</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-bold text-[var(--text-secondary)] mb-3">Priority</label>
                  <select
                    value={formData.priority}
                    onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
                    className="w-full px-4 py-3 bg-[var(--bg-tertiary)] border border-[var(--border-color)] focus:ring-2 focus:ring-amber/30 focus:border-amber/50 text-[var(--text-primary)] font-medium"
                  >
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-bold text-[var(--text-secondary)] mb-3">Due Date</label>
                <input
                  type="date"
                  value={formData.dueDate}
                  onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
                  className="w-full px-4 py-3 bg-[var(--bg-tertiary)] border border-[var(--border-color)] focus:ring-2 focus:ring-amber/30 focus:border-amber/50 text-[var(--text-primary)]"
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-[var(--text-secondary)] mb-3">Board</label>
                <select
                  value={formData.board}
                  onChange={(e) => setFormData({ ...formData, board: e.target.value })}
                  className="w-full px-4 py-3 bg-[var(--bg-tertiary)] border border-[var(--border-color)] focus:ring-2 focus:ring-amber/30 focus:border-amber/50 text-[var(--text-primary)] font-medium"
                >
                  <option value="">No Board</option>
                  {boards.map((board) => (
                    <option key={board._id} value={board._id}>
                      {board.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex space-x-3 pt-6 border-t border-[var(--border-color)]">
                <button
                  type="button"
                  onClick={closeModal}
                  className="flex-1 px-4 py-3 border border-[var(--border-color)] text-[var(--text-secondary)] hover:bg-white/5 font-bold transition-all"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-3 bg-gradient-strike text-white hover:shadow-lg hover:shadow-amber/25 font-bold transition-all"
                >
                  {editingTask ? 'Update' : 'Create'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Tasks;
