import React, { useState, useEffect, useRef } from 'react';
import Sidebar from '../../components/Layout/Sidebar';
import noteService from '../../services/noteService';
import { Plus, Trash2, StickyNote, Book, FileText, ArrowLeft, Search, Save, Clock, ToggleLeft, ToggleRight, UserPlus, UserX, Users } from 'lucide-react';

const NotesPage = () => {
  const [notebooks, setNotebooks] = useState([]);
  const [selectedNotebook, setSelectedNotebook] = useState(null);
  const [selectedPage, setSelectedPage] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showNewNotebook, setShowNewNotebook] = useState(false);
  const [newNotebookTitle, setNewNotebookTitle] = useState('');
  const [newNotebookColor, setNewNotebookColor] = useState('#f59e0b');
  const [searchQuery, setSearchQuery] = useState('');
  const [autoSave, setAutoSave] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [lastSaved, setLastSaved] = useState(null);
  const [showCollaborators, setShowCollaborators] = useState(false);
  const [collaboratorEmail, setCollaboratorEmail] = useState('');
  const saveTimeoutRef = useRef(null);

  useEffect(() => { loadNotebooks(); }, []);

  const loadNotebooks = async () => {
    try {
      const response = await noteService.getAllNotebooks();
      setNotebooks(response.data);
    } catch (error) {
      console.error('Error loading notebooks:', error);
    } finally {
      setLoading(false);
    }
  };

  const createNotebook = async () => {
    if (!newNotebookTitle.trim()) return;
    try {
      const result = await noteService.createNotebook({ title: newNotebookTitle, color: newNotebookColor });
      await loadNotebooks();
      setSelectedNotebook(result.data);
      setSelectedPage(result.data.pages[0]);
      setShowNewNotebook(false);
      setNewNotebookTitle('');
    } catch (error) {
      console.error('Error creating notebook:', error);
    }
  };

  const deleteNotebook = async (id) => {
    if (window.confirm('Delete this notebook and all its pages?')) {
      try {
        await noteService.deleteNotebook(id);
        setSelectedNotebook(null);
        setSelectedPage(null);
        await loadNotebooks();
      } catch (error) {
        console.error('Error deleting notebook:', error);
      }
    }
  };

  const addCollaborator = async () => {
    if (!collaboratorEmail.trim() || !selectedNotebook) return;
    try {
      await noteService.addCollaborator(selectedNotebook._id, collaboratorEmail);
      await loadNotebooks();
      const updated = notebooks.find(n => n._id === selectedNotebook._id);
      if (updated) setSelectedNotebook(updated);
      setCollaboratorEmail('');
      alert('Collaborator added successfully!');
    } catch (error) {
      alert(error.response?.data?.message || 'Failed to add collaborator');
    }
  };

  const removeCollaborator = async (collaboratorId) => {
    if (!selectedNotebook) return;
    try {
      await noteService.removeCollaborator(selectedNotebook._id, collaboratorId);
      await loadNotebooks();
      const updated = notebooks.find(n => n._id === selectedNotebook._id);
      if (updated) setSelectedNotebook(updated);
    } catch (error) {
      console.error('Error removing collaborator:', error);
    }
  };

  const addPage = async () => {
    if (!selectedNotebook) return;
    try {
      const result = await noteService.addPage(selectedNotebook._id);
      const newPage = result.data;
      await loadNotebooks();
      const allNotebooks = await noteService.getAllNotebooks();
      setNotebooks(allNotebooks.data);
      const updatedNotebook = allNotebooks.data.find(n => n._id === selectedNotebook._id);
      if (updatedNotebook) {
        setSelectedNotebook(updatedNotebook);
      }
      setSelectedPage(newPage);
    } catch (error) {
      console.error('Error adding page:', error);
    }
  };

  const savePage = async (showMessage = true) => {
    if (!selectedPage || !selectedPage._id) return;
    
    if (showMessage) setIsSaving(true);
    try {
      await noteService.updatePage(selectedPage._id, {
        title: selectedPage.title,
        content: selectedPage.content || ''
      });
      setLastSaved(new Date());
      await new Promise(r => setTimeout(r, 300));
    } catch (error) {
      console.error('Error saving page:', error);
    } finally {
      if (showMessage) setIsSaving(false);
    }
  };

  const updatePageContent = (field, value) => {
    const updatedPage = { ...selectedPage, [field]: value };
    setSelectedPage(updatedPage);
    
    if (autoSave) {
      if (saveTimeoutRef.current) clearTimeout(saveTimeoutRef.current);
      saveTimeoutRef.current = setTimeout(() => {
        savePage();
      }, 1000);
    }
  };

  const deletePage = async (pageId) => {
    try {
      await noteService.deletePage(pageId);
      if (selectedPage?._id === pageId) {
        setSelectedPage(null);
      }
      await loadNotebooks();
    } catch (error) {
      console.error('Error deleting page:', error);
    }
  };

  const filteredNotebooks = searchQuery 
    ? notebooks.filter(nb => nb.title.toLowerCase().includes(searchQuery.toLowerCase()))
    : notebooks;

  const colors = ['#f59e0b', '#4285f4', '#10b981', '#8b5cf6', '#f43f5e', '#06b6d4'];

  return (
    <div className="min-h-screen bg-[var(--bg-primary)] flex grain">
      <Sidebar />
      
      <div className="flex-1 lg:ml-64 flex">
        {!selectedNotebook ? (
          /* Index View - All Notebooks */
          <div className="flex-1 flex flex-col">
            <div className="p-6 border-b border-[var(--border-color)] bg-[var(--bg-secondary)]">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h1 className="text-3xl font-display font-bold text-[var(--text-primary)]">Notebooks</h1>
                  <p className="text-[var(--text-secondary)] text-sm">{notebooks.length} notebooks</p>
                </div>
                <button 
                  onClick={() => setShowNewNotebook(true)}
                  className="flex items-center gap-2 bg-gradient-strike text-white px-5 py-2.5 rounded-xl hover:shadow-lg hover:shadow-amber/25 transition-all font-bold"
                >
                  <Plus className="w-5 h-5" />
                  New Notebook
                </button>
              </div>
              
              {notebooks.length > 0 && (
                <div className="relative max-w-md">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[var(--text-tertiary)]" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search notebooks..."
                    className="w-full pl-10 pr-4 py-2.5 bg-[var(--bg-tertiary)] border border-[var(--border-color)] rounded-xl text-[var(--text-primary)]"
                  />
                </div>
              )}
            </div>

            {showNewNotebook && (
              <div className="p-6 border-b border-[var(--border-color)]">
                <div className="max-w-md space-y-3 p-4 bg-[var(--bg-secondary)] rounded-xl border border-[var(--border-color)]">
                  <input
                    type="text"
                    value={newNotebookTitle}
                    onChange={(e) => setNewNotebookTitle(e.target.value)}
                    placeholder="Notebook title..."
                    className="w-full px-4 py-3 bg-[var(--bg-tertiary)] border border-[var(--border-color)] rounded-lg text-[var(--text-primary)]"
                    autoFocus
                    onKeyDown={(e) => e.key === 'Enter' && createNotebook()}
                  />
                  <div className="flex gap-2">
                    {colors.map(c => (
                      <button
                        key={c}
                        onClick={() => setNewNotebookColor(c)}
                        className={`w-8 h-8 rounded-lg ${newNotebookColor === c ? 'ring-2 ring-white' : ''}`}
                        style={{ backgroundColor: c }}
                      />
                    ))}
                  </div>
                  <div className="flex gap-2">
                    <button onClick={createNotebook} className="flex-1 py-2 bg-gradient-strike text-white rounded-lg font-medium">Create</button>
                    <button onClick={() => setShowNewNotebook(false)} className="px-4 py-2 text-[var(--text-secondary)]">Cancel</button>
                  </div>
                </div>
              </div>
            )}

            <div className="flex-1 p-6 overflow-y-auto">
              {filteredNotebooks.length === 0 ? (
                <div className="text-center py-20">
                  <Book className="w-16 h-16 text-[var(--text-tertiary)] mx-auto mb-4" />
                  <p className="text-[var(--text-secondary)]">No notebooks yet</p>
                  <p className="text-[var(--text-tertiary)]">Create your first notebook</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                  {filteredNotebooks.map(nb => (
                    <div 
                      key={nb._id}
                      onClick={() => {
                        setSelectedNotebook(nb);
                        if (nb.pages?.length > 0) {
                          setSelectedPage(nb.pages[0]);
                        }
                      }}
                      className="bg-[var(--bg-secondary)] border border-[var(--border-color)] rounded-xl p-5 cursor-pointer hover:shadow-lg hover:shadow-black/20 transition-all group"
                    >
                      <div className="flex items-center gap-3 mb-3">
                        <div className="w-4 h-4 rounded" style={{ backgroundColor: nb.color || '#f59e0b' }} />
                        <Book className="w-5 h-5 text-[var(--text-tertiary)]" />
                      </div>
                      <h3 className="font-display font-bold text-lg text-[var(--text-primary)] mb-2 truncate">{nb.title}</h3>
                      <p className="text-sm text-[var(--text-secondary)]">{nb.pages?.length || 0} pages</p>
                      <p className="text-xs text-[var(--text-tertiary)] mt-3">
                        {new Date(nb.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        ) : (
          /* Notebook View - 3 Panels */
          <>
            {/* Notebooks Panel */}
            <div className="w-56 bg-[var(--bg-secondary)] border-r border-[var(--border-color)] flex flex-col h-screen">
              <div className="p-3 border-b border-[var(--border-color)]">
                <button 
                  onClick={() => { setSelectedNotebook(null); setSelectedPage(null); }}
                  className="flex items-center gap-2 text-[var(--text-secondary)] hover:text-[var(--text-primary)] mb-3"
                >
                  <ArrowLeft className="w-4 h-4" />
                  <span className="text-sm">All Notebooks</span>
                </button>
                <button 
                  onClick={() => setShowNewNotebook(true)}
                  className="w-full flex items-center justify-center gap-2 py-2 bg-gradient-strike text-white rounded-lg text-sm"
                >
                  <Plus className="w-4 h-4" />
                  New Notebook
                </button>
              </div>

              {showNewNotebook && (
                <div className="p-3 border-b border-[var(--border-color)] space-y-2">
                  <input
                    type="text"
                    value={newNotebookTitle}
                    onChange={(e) => setNewNotebookTitle(e.target.value)}
                    placeholder="Notebook title..."
                    className="w-full px-3 py-2 bg-[var(--bg-tertiary)] border border-[var(--border-color)] rounded-lg text-sm text-[var(--text-primary)]"
                    autoFocus
                    onKeyDown={(e) => e.key === 'Enter' && createNotebook()}
                  />
                  <div className="flex gap-1">
                    {colors.map(c => (
                      <button
                        key={c}
                        onClick={() => setNewNotebookColor(c)}
                        className={`w-6 h-6 rounded ${newNotebookColor === c ? 'ring-2 ring-white' : ''}`}
                        style={{ backgroundColor: c }}
                      />
                    ))}
                  </div>
                  <div className="flex gap-2">
                    <button onClick={createNotebook} className="flex-1 py-1 bg-gradient-strike text-white text-sm rounded">Create</button>
                    <button onClick={() => setShowNewNotebook(false)} className="px-2 py-1 text-[var(--text-tertiary)] text-sm">Cancel</button>
                  </div>
                </div>
              )}

              <div className="flex-1 overflow-y-auto p-2">
                {notebooks.map(nb => (
                  <div 
                    key={nb._id}
                    onClick={() => {
                      setSelectedNotebook(nb);
                      if (nb.pages?.length > 0) setSelectedPage(nb.pages[0]);
                    }}
                    className={`group flex items-center gap-2 p-2.5 rounded-lg cursor-pointer mb-1 transition-colors ${
                      selectedNotebook?._id === nb._id ? 'bg-[var(--bg-tertiary)]' : 'hover:bg-[var(--bg-tertiary)]/50'
                    }`}
                  >
                    <div className="w-3 h-3 rounded-sm" style={{ backgroundColor: nb.color || '#f59e0b' }} />
                    <Book className="w-4 h-4 text-[var(--text-tertiary)]" />
                    <span className="flex-1 text-sm text-[var(--text-primary)] truncate">{nb.title}</span>
                    <span className="text-xs text-[var(--text-tertiary)]">{nb.pages?.length}</span>
                    <button 
                      onClick={(e) => { e.stopPropagation(); deleteNotebook(nb._id); }}
                      className="opacity-0 group-hover:opacity-100 p-1 hover:bg-rose/10 rounded"
                    >
                      <Trash2 className="w-3 h-3 text-rose" />
                    </button>
                  </div>
                ))}
              </div>

              {/* Collaborators Section - Only show for selected notebook if owner */}
              {selectedNotebook?.isOwner && (
                <div className="border-t border-[var(--border-color)] p-2">
                  <button 
                    onClick={() => setShowCollaborators(!showCollaborators)}
                    className="flex items-center gap-2 w-full p-2 text-sm text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
                  >
                    <Users className="w-4 h-4" />
                    <span>Collaborators</span>
                    <span className="text-xs">({selectedNotebook.collaborators?.length || 0})</span>
                  </button>
                  
                  {showCollaborators && (
                    <div className="space-y-2">
                      <div className="flex gap-1">
                        <input
                          type="email"
                          value={collaboratorEmail}
                          onChange={(e) => setCollaboratorEmail(e.target.value)}
                          placeholder="User email..."
                          className="flex-1 px-2 py-1 text-xs bg-[var(--bg-tertiary)] border border-[var(--border-color)] rounded text-[var(--text-primary)]"
                          onKeyDown={(e) => e.key === 'Enter' && addCollaborator()}
                        />
                        <button 
                          onClick={addCollaborator}
                          className="p-1 bg-amber/20 text-amber rounded hover:bg-amber/30"
                        >
                          <UserPlus className="w-4 h-4" />
                        </button>
                      </div>
                      
                      {selectedNotebook.collaborators?.map(collab => (
                        <div key={collab._id || collab.user} className="flex items-center gap-2 p-1.5 bg-[var(--bg-tertiary)] rounded text-xs">
                          <span className="flex-1 text-[var(--text-primary)] truncate">{collab.email}</span>
                          <button 
                            onClick={() => removeCollaborator(collab.user)}
                            className="p-1 hover:bg-rose/10 rounded"
                          >
                            <UserX className="w-3 h-3 text-rose" />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Pages Panel */}
            <div className="w-44 bg-[var(--bg-secondary)] border-r border-[var(--border-color)] flex flex-col h-screen">
              <div className="p-3 border-b border-[var(--border-color)]">
                <button 
                  onClick={addPage}
                  className="w-full flex items-center justify-center gap-2 py-2 bg-[var(--bg-tertiary)] rounded-lg text-sm text-[var(--text-secondary)] hover:bg-amber/10 hover:text-amber"
                >
                  <Plus className="w-4 h-4" />
                  Add Page
                </button>
              </div>
              
              <div className="flex-1 overflow-y-auto p-2">
                {selectedNotebook?.pages?.map(page => (
                  <div 
                    key={page._id}
                    onClick={() => setSelectedPage(page)}
                    className={`group flex items-center gap-2 p-2 rounded-lg cursor-pointer mb-1 transition-colors ${
                      selectedPage?._id === page._id ? 'bg-[var(--bg-tertiary)]' : 'hover:bg-[var(--bg-tertiary)]/50'
                    }`}
                  >
                    <FileText className="w-4 h-4 text-[var(--text-tertiary)] shrink-0" />
                    <span className="flex-1 text-sm text-[var(--text-primary)] truncate">{page.title}</span>
                    <button 
                      onClick={(e) => { e.stopPropagation(); deletePage(page._id); }}
                      className="opacity-0 group-hover:opacity-100 p-1 hover:bg-rose/10 rounded shrink-0"
                    >
                      <Trash2 className="w-3 h-3 text-rose" />
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Content Panel */}
            <div className="flex-1 flex flex-col h-screen bg-[var(--bg-primary)]">
              {selectedPage ? (
                <>
                  <div className="p-4 border-b border-[var(--border-color)] bg-[var(--bg-secondary)] flex items-center justify-between">
                    <input
                      type="text"
                      value={selectedPage.title}
                      onChange={(e) => updatePageContent('title', e.target.value)}
                      className="text-xl font-display font-bold text-[var(--text-primary)] bg-transparent border-none outline-none flex-1"
                      placeholder="Page title..."
                    />
                    <div className="flex items-center gap-3">
                      <button 
                        onClick={() => setAutoSave(!autoSave)}
                        className={`flex items-center gap-1.5 text-sm ${autoSave ? 'text-emerald' : 'text-[var(--text-tertiary)]'}`}
                        title={autoSave ? 'Auto-save ON' : 'Auto-save OFF'}
                      >
                        {autoSave ? <ToggleRight className="w-5 h-5" /> : <ToggleLeft className="w-5 h-5" />}
                        <span className="hidden sm:inline">{autoSave ? 'Auto' : 'Manual'}</span>
                      </button>
                      {!autoSave && (
                        <button 
                          onClick={savePage}
                          disabled={isSaving}
                          className="flex items-center gap-1.5 px-3 py-1.5 bg-amber/20 text-amber rounded-lg text-sm hover:bg-amber/30 transition-colors"
                        >
                          <Save className="w-4 h-4" />
                          {isSaving ? 'Saving...' : 'Save'}
                        </button>
                      )}
                      {autoSave && lastSaved && (
                        <span className="text-xs text-[var(--text-tertiary)] flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          Saved
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="flex-1 p-4">
                    <textarea
                      value={selectedPage.content || ''}
                      onChange={(e) => updatePageContent('content', e.target.value)}
                      className="w-full h-full bg-transparent text-[var(--text-primary)] resize-none outline-none font-body text-lg leading-relaxed"
                      placeholder="Start writing..."
                    />
                  </div>
                </>
              ) : (
                <div className="flex-1 flex items-center justify-center">
                  <div className="text-center">
                    <FileText className="w-16 h-16 text-[var(--text-tertiary)] mx-auto mb-4" />
                    <p className="text-[var(--text-secondary)]">Select a page to edit</p>
                  </div>
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default NotesPage;