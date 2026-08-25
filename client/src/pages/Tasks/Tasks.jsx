import { useState } from 'react';
import { useApp } from '../../context/AppContext';
import Sidebar from '../../components/layout/Sidebar';
import { 
  Plus, 
  Search, 
  Filter,
  Calendar,
  Flag,
  Edit2,
  Trash2
} from 'lucide-react';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { Textarea } from '../../components/ui/textarea';
import { Switch } from '../../components/ui/switch';
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

const Tasks = () => {
  const { tasks, boards, addTask, updateTask, deleteTask, loading } = useApp();
  const [showModal, setShowModal] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [autoDelete, setAutoDelete] = useState(() => {
    return localStorage.getItem('taskAutoDelete') === 'true';
  });

  const toggleAutoDelete = () => {
    const next = !autoDelete;
    setAutoDelete(next);
    localStorage.setItem('taskAutoDelete', next);
  };
  
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
    try {
      if (!formData.title) return;
      
      const taskData = {
        title: formData.title,
        description: formData.description || undefined,
        status: formData.status || 'todo',
        priority: formData.priority || 'medium',
        dueDate: formData.dueDate || undefined,
        board: formData.board || null
      };

      if (autoDelete && formData.status === 'completed') {
        taskData.autoDelete = true;
      }
      
      if (editingTask) {
        await updateTask(editingTask._id, taskData);
      } else {
        await addTask(taskData);
      }
      closeModal();
    } catch (error) {
      console.error('Error saving task:', error);
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
      setFormData({ title: '', description: '', status: 'todo', priority: 'medium', dueDate: '', board: '' });
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
    if (task.deleted) return false;
    const matchesSearch = task.title.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'all' || task.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="min-h-screen bg-[var(--bg-primary)] flex">
      <Sidebar />
      
      <div className="flex-1 lg:ml-52">
        <div className="p-6 lg:p-8 space-y-5">
          {/* Header */}
          <div className="page-header">
            <div>
              <h1 className="page-title">Tasks</h1>
              <p className="page-subtitle">{filteredTasks.length} tasks to manage</p>
            </div>
            <Button onClick={() => openModal()} className="gap-2 bg-gradient-to-r from-[#14b8a6] to-[#0d9488] text-white hover:opacity-90 font-display font-semibold text-sm h-9 rounded-lg px-4 shadow-lg shadow-[rgba(20,184,166,0.15)]">
              <Plus className="w-4 h-4" />
              Add Task
            </Button>
          </div>

          {/* Filters & Auto-delete */}
          <div className="flex flex-col sm:flex-row gap-3 items-center">
            <div className="relative flex-1 w-full">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--text-tertiary)]" />
              <Input
                placeholder="Search tasks..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-9 h-9 bg-[var(--input-bg)] border-[var(--border-color)] text-[var(--text-primary)] placeholder:text-[var(--text-tertiary)] focus:border-[#14b8a6]"
              />
            </div>
            <Select value={filterStatus} onValueChange={setFilterStatus}>
              <SelectTrigger className="w-full sm:w-36 h-9 bg-[var(--input-bg)] border-[var(--border-color)] text-[var(--text-primary)]">
                <Filter className="w-3.5 h-3.5 mr-1.5 text-[var(--text-tertiary)]" />
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-[var(--card-bg)] border-[var(--border-color)]">
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="todo">To Do</SelectItem>
                <SelectItem value="in-progress">In Progress</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
              </SelectContent>
            </Select>
            <div className="flex items-center gap-2 px-3 h-9 rounded-lg border border-[var(--border-color)] bg-[var(--input-bg)]">
              <Trash2 className="w-3.5 h-3.5 text-[var(--text-tertiary)]" />
              <span className="text-xs text-[var(--text-tertiary)] whitespace-nowrap">Auto-delete</span>
              <Switch checked={autoDelete} onCheckedChange={toggleAutoDelete} className="scale-75 origin-left" />
            </div>
          </div>

          {/* Task List */}
          {loading ? (
            <div className="flex justify-center py-16">
              <div className="w-6 h-6 border-2 border-[rgba(20,184,166,0.2)] border-t-[#14b8a6] rounded-full animate-spin" />
            </div>
          ) : filteredTasks.length === 0 ? (
            <div className="card-surface">
              <div className="empty-state">
                <div className="empty-state-icon">
                  <Plus className="w-5 h-5 text-[#14b8a6]" />
                </div>
                <p className="empty-state-title">No tasks found</p>
                <p className="empty-state-text">Create your first task to get started</p>
                <Button onClick={() => openModal()} className="gap-2 bg-gradient-to-r from-[#14b8a6] to-[#0d9488] text-white hover:opacity-90 h-8 text-xs rounded-lg shadow-lg shadow-[rgba(20,184,166,0.15)]">
                  <Plus className="w-3.5 h-3.5" />
                  Create Task
                </Button>
              </div>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-3">
              {filteredTasks.map((task) => (
                <div key={task._id} className="card-surface p-4 group cursor-default">
                  <div className="flex items-start justify-between mb-2">
                    <h3 className="text-sm font-medium text-[var(--text-primary)] flex-1 leading-snug group-hover:text-[#14b8a6] transition-colors pr-2">
                      {task.title}
                    </h3>
                    <div className="flex items-center gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button onClick={() => openModal(task)} className="p-1 rounded hover:bg-[var(--hover-bg)] transition-colors">
                        <Edit2 className="w-3.5 h-3.5 text-[var(--text-tertiary)]" />
                      </button>
                      <button onClick={() => handleDelete(task._id)} className="p-1 rounded hover:bg-[rgba(239,68,68,0.08)] transition-colors">
                        <Trash2 className="w-3.5 h-3.5 text-[var(--text-tertiary)] hover:text-[#ef4444]" />
                      </button>
                    </div>
                  </div>

                  {task.description && (
                    <p className="text-xs text-[var(--text-tertiary)] line-clamp-2 mb-2">{task.description}</p>
                  )}

                  {task.board && (
                    <div className="flex items-center gap-1.5 mb-2">
                      <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: task.board.color || '#14b8a6' }} />
                      <span className="text-[11px] text-[var(--text-tertiary)]">{task.board.name}</span>
                    </div>
                  )}

                  <div className="flex items-center gap-2 mb-3">
                    <Flag className={`w-3 h-3 priority-${task.priority}`} />
                    <span className={`text-[10px] font-medium uppercase tracking-wider priority-${task.priority}`}>
                      {task.priority}
                    </span>
                  </div>

                  <div className="flex items-center justify-between pt-2.5 border-t border-[var(--border-color)]">
                    {task.dueDate ? (
                      <div className="flex items-center gap-1 text-[11px] text-[var(--text-tertiary)]">
                        <Calendar className="w-3 h-3" />
                        {new Date(task.dueDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                      </div>
                    ) : <div />}
                    <span className={`text-[10px] font-medium px-2 py-0.5 rounded-full ${
                      task.status === 'completed' ? 'badge-completed' :
                      task.status === 'in-progress' ? 'badge-in-progress' :
                      'badge-todo'
                    }`}>
                      {task.status === 'in-progress' ? 'In Progress' : task.status.charAt(0).toUpperCase() + task.status.slice(1)}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Create/Edit Dialog */}
      <Dialog open={showModal} onOpenChange={setShowModal}>
        <DialogContent className="sm:max-w-md bg-[var(--card-bg)] border-[var(--border-color)]">
          <DialogHeader>
            <DialogTitle className="text-base font-display font-bold text-[var(--text-primary)]">
              {editingTask ? 'Update Task' : 'Create Task'}
            </DialogTitle>
          </DialogHeader>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1.5">
              <Label htmlFor="task-title" className="text-xs font-medium text-[var(--text-secondary)] uppercase tracking-wider">Title</Label>
              <Input
                id="task-title"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                placeholder="Task name"
                className="h-9 bg-[var(--input-bg)] border-[var(--border-color)] text-[var(--text-primary)] focus:border-[#14b8a6]"
                required
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="task-desc" className="text-xs font-medium text-[var(--text-secondary)] uppercase tracking-wider">Description</Label>
              <Textarea
                id="task-desc"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Add details..."
                rows={3}
                className="bg-[var(--input-bg)] border-[var(--border-color)] text-[var(--text-primary)] focus:border-[#14b8a6]"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label className="text-xs font-medium text-[var(--text-secondary)] uppercase tracking-wider">Status</Label>
                <Select value={formData.status} onValueChange={(v) => setFormData({ ...formData, status: v })}>
                  <SelectTrigger className="h-9 bg-[var(--input-bg)] border-[var(--border-color)] text-[var(--text-primary)]">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-[var(--card-bg)] border-[var(--border-color)]">
                    <SelectItem value="todo">To Do</SelectItem>
                    <SelectItem value="in-progress">In Progress</SelectItem>
                    <SelectItem value="completed">Completed</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-1.5">
                <Label className="text-xs font-medium text-[var(--text-secondary)] uppercase tracking-wider">Priority</Label>
                <Select value={formData.priority} onValueChange={(v) => setFormData({ ...formData, priority: v })}>
                  <SelectTrigger className="h-9 bg-[var(--input-bg)] border-[var(--border-color)] text-[var(--text-primary)]">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-[var(--card-bg)] border-[var(--border-color)]">
                    <SelectItem value="low">Low</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="high">High</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="task-due" className="text-xs font-medium text-[var(--text-secondary)] uppercase tracking-wider">Due Date</Label>
              <Input
                id="task-due"
                type="date"
                value={formData.dueDate}
                onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
                className="h-9 bg-[var(--input-bg)] border-[var(--border-color)] text-[var(--text-primary)] focus:border-[#14b8a6]"
              />
            </div>

            <div className="space-y-1.5">
              <Label className="text-xs font-medium text-[var(--text-secondary)] uppercase tracking-wider">Board</Label>
              <Select value={formData.board} onValueChange={(v) => setFormData({ ...formData, board: v })}>
                <SelectTrigger className="h-9 bg-[var(--input-bg)] border-[var(--border-color)] text-[var(--text-primary)]">
                  <SelectValue placeholder="No Board" />
                </SelectTrigger>
                <SelectContent className="bg-[var(--card-bg)] border-[var(--border-color)]">
                  <SelectItem value="">No Board</SelectItem>
                  {boards.map((board) => (
                    <SelectItem key={board._id} value={board._id}>
                      {board.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <DialogFooter className="gap-2 pt-2">
              <Button type="button" variant="outline" onClick={closeModal} className="h-9 border-[var(--border-color)] text-[var(--text-secondary)]">
                Cancel
              </Button>
              <Button type="submit" className="h-9 bg-gradient-to-r from-[#14b8a6] to-[#0d9488] text-white hover:opacity-90 font-display font-semibold shadow-lg shadow-[rgba(20,184,166,0.15)]">
                {editingTask ? 'Update' : 'Create'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Tasks;
