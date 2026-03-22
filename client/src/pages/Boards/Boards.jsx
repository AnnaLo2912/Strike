import { useState } from 'react';
import { useApp } from '../../context/AppContext';
import Sidebar from '../../components/Layout/Sidebar';
import { Plus, Edit2, Trash2, X, Folder } from 'lucide-react';

const Boards = () => {
  const { boards, addBoard, updateBoard, deleteBoard, loading } = useApp();
  const [showModal, setShowModal] = useState(false);
  const [editingBoard, setEditingBoard] = useState(null);
  
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    color: '#c18db4'
  });

  const colors = [
    '#c18db4', // Pink
    '#b7a7d0', // Blue
    '#0e1b48', // Navy
    '#ef4444', // Red
    '#f59e0b', // Orange
    '#10b981', // Green
    '#3b82f6', // Blue
    '#8b5cf6', // Purple
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
      setFormData({
        name: '',
        description: '',
        color: '#c18db4'
      });
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
    <div className="min-h-screen bg-gray-50 flex">
      <Sidebar />
      
      <div className="flex-1 lg:ml-64">
        <div className="p-8">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold text-[#0e1b48] mb-2">Boards</h1>
              <p className="text-gray-600">{boards.length} boards created</p>
            </div>
            <button
              onClick={() => openModal()}
              className="flex items-center space-x-2 bg-gradient-to-r from-[#c18db4] to-[#0e1b48] text-white px-6 py-3 rounded-xl hover:shadow-lg transition-all"
            >
              <Plus className="w-5 h-5" />
              <span>New Board</span>
            </button>
          </div>

          {/* Boards Grid */}
          {loading ? (
            <div className="flex justify-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#c18db4]"></div>
            </div>
          ) : boards.length === 0 ? (
            <div className="text-center py-12 bg-white rounded-2xl">
              <Folder className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500 mb-4">No boards yet. Create your first board!</p>
              <button
                onClick={() => openModal()}
                className="inline-flex items-center space-x-2 bg-[#c18db4] text-white px-6 py-3 rounded-xl hover:shadow-lg transition-all"
              >
                <Plus className="w-5 h-5" />
                <span>Create Board</span>
              </button>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {boards.map((board) => (
                <div
                  key={board._id}
                  className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-lg transition-all group"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center space-x-3">
                      <div 
                        className="w-12 h-12 rounded-xl flex items-center justify-center"
                        style={{ backgroundColor: `${board.color}20` }}
                      >
                        <Folder 
                          className="w-6 h-6"
                          style={{ color: board.color }}
                        />
                      </div>
                      <div>
                        <h3 className="font-semibold text-[#0e1b48] text-lg">
                          {board.name}
                        </h3>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button
                        onClick={() => openModal(board)}
                        className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                      >
                        <Edit2 className="w-4 h-4 text-gray-600" />
                      </button>
                      <button
                        onClick={() => handleDelete(board._id)}
                        className="p-2 hover:bg-red-50 rounded-lg transition-colors"
                      >
                        <Trash2 className="w-4 h-4 text-red-600" />
                      </button>
                    </div>
                  </div>

                  {board.description && (
                    <p className="text-sm text-gray-600 mb-4">
                      {board.description}
                    </p>
                  )}

                  <div className="pt-4 border-t border-gray-100">
                    <div className="text-xs text-gray-500">
                      Created {new Date(board.createdAt).toLocaleDateString()}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-[#0e1b48]">
                {editingBoard ? 'Edit Board' : 'New Board'}
              </h2>
              <button onClick={closeModal} className="p-2 hover:bg-gray-100 rounded-lg">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Board Name *
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#c18db4] focus:border-transparent"
                  placeholder="e.g., Work Projects"
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
                  placeholder="What's this board for?"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Color
                </label>
                <div className="grid grid-cols-8 gap-2">
                  {colors.map((color) => (
                    <button
                      key={color}
                      type="button"
                      onClick={() => setFormData({ ...formData, color })}
                      className={`w-10 h-10 rounded-lg transition-all ${
                        formData.color === color 
                          ? 'ring-2 ring-offset-2 ring-[#0e1b48] scale-110' 
                          : 'hover:scale-105'
                      }`}
                      style={{ backgroundColor: color }}
                    />
                  ))}
                </div>
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