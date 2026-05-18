import { useState } from 'react';
import { useApp } from '../../context/AppContext';
import Sidebar from '../../components/layout/Sidebar';
import { Plus, Edit2, Trash2, X, Folder, Zap } from 'lucide-react';

const Boards = () => {
  const { boards, addBoard, updateBoard, deleteBoard, loading } = useApp();
  const [showModal, setShowModal] = useState(false);
  const [editingBoard, setEditingBoard] = useState(null);
  
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    color: '#f59e0b'
  });

  const colors = [
    '#f59e0b', '#8b5cf6', '#06b6d4', '#10b981',
    '#f43f5e', '#0e1b48', '#3b82f6', '#d97706',
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingBoard) {
        await updateBoard(editingBoard._id, formData);
      } else {
        await addBoard(formData);
      }
      closeModal();
    } catch (error) {
      console.error('Error saving board:', error);
    }
  };

  const openModal = (board = null) => {
    if (board) {
      setEditingBoard(board);
      setFormData({
        name: board.name,
        description: board.description || '',
        color: board.color
      });
    } else {
      setEditingBoard(null);
      setFormData({ name: '', description: '', color: '#f59e0b' });
    }
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setEditingBoard(null);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure? This will also delete all tasks in this board.')) {
      await deleteBoard(id);
    }
  };

  return (
    <div className="min-h-screen bg-obsidian flex grain">
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
                  <h1 className="text-4xl lg:text-5xl font-display font-black text-[var(--text-primary)] mb-1">Boards</h1>
                  <p className="text-[var(--text-secondary)] font-body">{boards.length} boards created</p>
                </div>
              </div>
              <button
                onClick={() => openModal()}
                className="flex items-center space-x-2 bg-gradient-strike text-white px-6 py-3.5 rounded-xl hover:shadow-lg hover:shadow-amber/25 transition-all duration-300 hover:scale-[1.02] font-bold"
              >
                <Plus className="w-5 h-5" />
                <span>New Board</span>
              </button>
            </div>
          </div>

          {loading ? (
            <div className="flex justify-center py-20">
              <div className="relative w-16 h-16">
                <div className="absolute inset-0 bg-gradient-strike rounded-full animate-spin" style={{ maskImage: 'radial-gradient(circle, transparent 35%, black 65%)' }} />
                <div className="absolute inset-2 bg-obsidian rounded-full" />
              </div>
            </div>
          ) : boards.length === 0 ? (
            <div className="text-center py-20 rounded-2xl border-2 border-dashed border-[var(--border-color)]">
              <Folder className="w-16 h-16 text-[var(--text-tertiary)] mx-auto mb-4" />
              <p className="text-[var(--text-secondary)] mb-4">No boards yet. Create your first board!</p>
              <button
                onClick={() => openModal()}
                className="inline-flex items-center space-x-2 bg-gradient-strike text-white px-6 py-3 rounded-xl hover:shadow-lg hover:shadow-amber/25 transition-all"
              >
                <Plus className="w-5 h-5" />
                <span>Create Board</span>
              </button>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 animate-stagger">
              {boards.map((board) => (
                <div
                  key={board._id}
                  className="bg-[var(--bg-secondary)] border border-[var(--border-color)] rounded-2xl p-6 group hover:border-amber/30 transition-all duration-300"
                  style={{ boxShadow: '0 4px 24px rgba(0, 0, 0, 0.3)' }}
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center space-x-3">
                      <div 
                        className="w-12 h-12 rounded-xl flex items-center justify-center transition-transform duration-300 group-hover:scale-110"
                        style={{ backgroundColor: `${board.color}20` }}
                      >
                        <Folder className="w-6 h-6" style={{ color: board.color }} />
                      </div>
                      <div>
                        <h3 className="font-display font-bold text-[var(--text-primary)] text-lg">
                          {board.name}
                        </h3>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-2 opacity-0 group-hover:opacity-100 transition-all">
                      <button onClick={() => openModal(board)} className="p-2 hover:bg-amber/10 rounded-lg transition-colors">
                        <Edit2 className="w-4 h-4 text-[var(--text-tertiary)] hover:text-amber transition-colors" />
                      </button>
                      <button onClick={() => handleDelete(board._id)} className="p-2 hover:bg-rose/10 rounded-lg transition-colors">
                        <Trash2 className="w-4 h-4 text-[var(--text-tertiary)] hover:text-rose transition-colors" />
                      </button>
                    </div>
                  </div>

                  {board.description && (
                    <p className="text-sm text-[var(--text-secondary)] mb-4">{board.description}</p>
                  )}

                  <div className="pt-4 border-t border-[var(--border-color)]">
                    <div className="text-xs text-[var(--text-tertiary)]">
                      Created {new Date(board.createdAt).toLocaleDateString()}
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
          <div className="bg-[var(--bg-secondary)] border border-[var(--border-color)] rounded-2xl max-w-md w-full p-8 shadow-2xl shadow-black/50">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-display font-bold text-[var(--text-primary)]">
                {editingBoard ? 'Edit Board' : 'New Board'}
              </h2>
              <button onClick={closeModal} className="p-2 hover:bg-white/5 rounded-lg transition-colors">
                <X className="w-5 h-5 text-[var(--text-tertiary)] hover:text-[var(--text-primary)]" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-[var(--text-secondary)] mb-2">Board Name *</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-4 py-3 bg-[var(--bg-tertiary)] border border-[var(--border-color)] rounded-xl focus:ring-2 focus:ring-amber/30 focus:border-amber/50 text-[var(--text-primary)] placeholder-[var(--text-tertiary)]"
                  placeholder="e.g., Work Projects"
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
                  placeholder="What's this board for?"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-[var(--text-secondary)] mb-2">Color</label>
                <div className="grid grid-cols-8 gap-2">
                  {colors.map((color) => (
                    <button
                      key={color}
                      type="button"
                      onClick={() => setFormData({ ...formData, color })}
                      className={`w-10 h-10 rounded-lg transition-all duration-300 ${
                        formData.color === color 
                          ? 'ring-2 ring-offset-2 ring-offset-[var(--bg-secondary)] ring-amber scale-110' 
                          : 'hover:scale-105'
                      }`}
                      style={{ backgroundColor: color }}
                    />
                  ))}
                </div>
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
                  {editingBoard ? 'Update' : 'Create'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Boards;
