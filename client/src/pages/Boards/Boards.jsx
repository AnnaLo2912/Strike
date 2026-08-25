import { useState } from 'react';
import { useApp } from '../../context/AppContext';
import Sidebar from '../../components/layout/Sidebar';
import { Plus, Edit2, Trash2, Folder } from 'lucide-react';
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

const Boards = () => {
  const { boards, addBoard, updateBoard, deleteBoard, loading } = useApp();
  const [showModal, setShowModal] = useState(false);
  const [editingBoard, setEditingBoard] = useState(null);
  
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    color: '#14b8a6'
  });

  const colors = [
    '#14b8a6', '#8b5cf6', '#06b6d4', '#10b981',
    '#f43f5e', '#3b82f6', '#d97706', '#ec4899',
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
      setFormData({ name: board.name, description: board.description || '', color: board.color });
    } else {
      setEditingBoard(null);
      setFormData({ name: '', description: '', color: '#14b8a6' });
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
    <div className="min-h-screen bg-[var(--bg-primary)] flex">
      <Sidebar />
      
      <div className="flex-1 lg:ml-52">
        <div className="p-6 lg:p-8 space-y-5">
          {/* Header */}
          <div className="page-header">
            <div>
              <h1 className="page-title">Boards</h1>
              <p className="page-subtitle">{boards.length} boards created</p>
            </div>
            <Button onClick={() => openModal()} className="gap-2 bg-gradient-to-r from-[#14b8a6] to-[#0d9488] text-white hover:opacity-90 shadow-lg shadow-[rgba(20,184,166,0.15)] font-display font-semibold text-sm h-9 rounded-lg px-4">
              <Plus className="w-4 h-4" />
              New Board
            </Button>
          </div>

          {/* Board List */}
          {loading ? (
            <div className="flex justify-center py-16">
              <div className="w-6 h-6 border-2 border-[rgba(20,184,166,0.2)] border-t-[#14b8a6] rounded-full animate-spin" />
            </div>
          ) : boards.length === 0 ? (
            <div className="card-surface">
              <div className="empty-state">
                <div className="empty-state-icon">
                  <Folder className="w-5 h-5 text-[#14b8a6]" />
                </div>
                <p className="empty-state-title">No boards yet</p>
                <p className="empty-state-text">Create your first board to organize tasks</p>
                <Button onClick={() => openModal()} className="gap-2 bg-gradient-to-r from-[#14b8a6] to-[#0d9488] text-white hover:opacity-90 shadow-lg shadow-[rgba(20,184,166,0.15)] h-8 text-xs rounded-lg">
                  <Plus className="w-3.5 h-3.5" />
                  Create Board
                </Button>
              </div>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-3">
              {boards.map((board) => (
                <div key={board._id} className="card-surface p-4 group">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-2.5">
                      <div 
                        className="w-8 h-8 rounded-lg flex items-center justify-center"
                        style={{ backgroundColor: `${board.color}12` }}
                      >
                        <Folder className="w-4 h-4" style={{ color: board.color }} />
                      </div>
                      <h3 className="text-sm font-medium text-[var(--text-primary)]">{board.name}</h3>
                    </div>
                    <div className="flex items-center gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button onClick={() => openModal(board)} className="p-1 rounded hover:bg-[var(--hover-bg)] transition-colors">
                        <Edit2 className="w-3.5 h-3.5 text-[var(--text-tertiary)]" />
                      </button>
                      <button onClick={() => handleDelete(board._id)} className="p-1 rounded hover:bg-[rgba(239,68,68,0.08)] transition-colors">
                        <Trash2 className="w-3.5 h-3.5 text-[var(--text-tertiary)] hover:text-[#ef4444]" />
                      </button>
                    </div>
                  </div>

                  {board.description && (
                    <p className="text-xs text-[var(--text-tertiary)] mb-3 line-clamp-2">{board.description}</p>
                  )}

                  <div className="pt-2.5 border-t border-[var(--border-color)]">
                    <div className="text-[11px] text-[var(--text-tertiary)]">
                      Created {new Date(board.createdAt).toLocaleDateString()}
                    </div>
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
              {editingBoard ? 'Edit Board' : 'New Board'}
            </DialogTitle>
          </DialogHeader>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1.5">
              <Label htmlFor="board-name" className="text-xs font-medium text-[var(--text-secondary)] uppercase tracking-wider">Board Name</Label>
              <Input
                id="board-name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="e.g., Work Projects"
                className="h-9 bg-[var(--input-bg)] border-[var(--border-color)] text-[var(--text-primary)] focus:border-[#14b8a6]"
                required
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="board-desc" className="text-xs font-medium text-[var(--text-secondary)] uppercase tracking-wider">Description</Label>
              <Textarea
                id="board-desc"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="What's this board for?"
                rows={3}
                className="bg-[var(--input-bg)] border-[var(--border-color)] text-[var(--text-primary)] focus:border-[#14b8a6]"
              />
            </div>

            <div className="space-y-1.5">
              <Label className="text-xs font-medium text-[var(--text-secondary)] uppercase tracking-wider">Color</Label>
              <div className="flex gap-2">
                {colors.map((color) => (
                  <button
                    key={color}
                    type="button"
                    onClick={() => setFormData({ ...formData, color })}
                    className={`w-7 h-7 rounded-md transition-all duration-150 ${
                      formData.color === color 
                        ? 'ring-2 ring-offset-2 ring-offset-[var(--card-bg)] ring-[#14b8a6] scale-110' 
                        : 'hover:scale-105'
                    }`}
                    style={{ backgroundColor: color }}
                  />
                ))}
              </div>
            </div>

            <DialogFooter className="gap-2 pt-2">
              <Button type="button" variant="outline" onClick={closeModal} className="h-9 border-[var(--border-color)] text-[var(--text-secondary)]">
                Cancel
              </Button>
              <Button type="submit" className="h-9 bg-gradient-to-r from-[#14b8a6] to-[#0d9488] text-white hover:opacity-90 shadow-lg shadow-[rgba(20,184,166,0.15)] font-display font-semibold">
                {editingBoard ? 'Update' : 'Create'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Boards;
