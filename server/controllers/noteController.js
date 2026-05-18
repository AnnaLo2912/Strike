import { Notebook, Page } from '../models/Note.js';
import User from '../models/User.js';

const hasAccess = (notebook, userId) => {
  if (!notebook) return false;
  if (notebook.user.toString() === userId.toString()) return true;
  if (notebook.collaborators?.some(c => c.user.toString() === userId.toString())) return true;
  return false;
};

export const getNotebooks = async (req, res) => {
  try {
    const userId = req.user.id;
    
    const ownedNotebooks = await Notebook.find({ user: userId }).sort({ createdAt: -1 });
    
    const collaboratedNotebooks = await Notebook.find({
      'collaborators.user': userId
    }).sort({ createdAt: -1 });
    
    const allNotebooks = [...ownedNotebooks, ...collaboratedNotebooks];
    
    const notebooksWithPages = await Promise.all(allNotebooks.map(async (nb) => {
      const pages = await Page.find({ notebook: nb._id }).sort({ pageNumber: 1 });
      const isOwner = nb.user.toString() === userId.toString();
      return { 
        ...nb.toObject(), 
        pages,
        isOwner 
      };
    }));
    
    res.status(200).json({ success: true, data: notebooksWithPages });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
};

export const createNotebook = async (req, res) => {
  try {
    const { title, color } = req.body;
    const notebook = await Notebook.create({
      title,
      color,
      user: req.user.id
    });
    const page = await Page.create({
      notebook: notebook._id,
      title: 'Page 1',
      content: '',
      pageNumber: 1,
      user: req.user.id
    });
    res.status(201).json({ success: true, data: { ...notebook.toObject(), pages: [page], isOwner: true } });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
};

export const updateNotebook = async (req, res) => {
  try {
    const notebook = await Notebook.findById(req.params.id);
    if (!hasAccess(notebook, req.user.id)) {
      return res.status(403).json({ success: false, message: 'Access denied' });
    }
    
    const updated = await Notebook.findOneAndUpdate(
      { _id: req.params.id },
      req.body,
      { new: true, runValidators: true }
    );
    res.status(200).json({ success: true, data: { ...updated.toObject(), isOwner: updated.user.toString() === req.user.id.toString() } });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
};

export const deleteNotebook = async (req, res) => {
  try {
    const notebook = await Notebook.findById(req.params.id);
    if (!notebook || notebook.user.toString() !== req.user.id.toString()) {
      return res.status(403).json({ success: false, message: 'Only owner can delete' });
    }
    await Notebook.findByIdAndDelete(req.params.id);
    await Page.deleteMany({ notebook: req.params.id });
    res.status(200).json({ success: true, data: {} });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
};

export const addCollaborator = async (req, res) => {
  try {
    const { email } = req.body;
    const notebook = await Notebook.findById(req.params.id);
    
    if (!notebook || notebook.user.toString() !== req.user.id.toString()) {
      return res.status(403).json({ success: false, message: 'Only owner can add collaborators' });
    }
    
    const userToAdd = await User.findOne({ email });
    if (!userToAdd) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }
    
    if (userToAdd._id.toString() === req.user.id.toString()) {
      return res.status(400).json({ success: false, message: 'Cannot add yourself' });
    }
    
    if (notebook.collaborators?.some(c => c.user.toString() === userToAdd._id.toString())) {
      return res.status(400).json({ success: false, message: 'User already a collaborator' });
    }
    
    notebook.collaborators = notebook.collaborators || [];
    notebook.collaborators.push({
      user: userToAdd._id,
      email: userToAdd.email
    });
    
    await notebook.save();
    res.status(200).json({ success: true, data: notebook });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
};

export const removeCollaborator = async (req, res) => {
  try {
    const { collaboratorId } = req.params;
    const notebook = await Notebook.findById(req.params.id);
    
    if (!notebook || notebook.user.toString() !== req.user.id.toString()) {
      return res.status(403).json({ success: false, message: 'Only owner can remove collaborators' });
    }
    
    notebook.collaborators = notebook.collaborators.filter(c => c.user.toString() !== collaboratorId);
    await notebook.save();
    res.status(200).json({ success: true, data: notebook });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
};

export const addPage = async (req, res) => {
  try {
    const { notebookId } = req.params;
    const notebook = await Notebook.findById(notebookId);
    
    if (!hasAccess(notebook, req.user.id)) {
      return res.status(403).json({ success: false, message: 'Access denied' });
    }
    
    const count = await Page.countDocuments({ notebook: notebookId });
    const newPageNumber = count + 1;
    const page = await Page.create({
      notebook: notebookId,
      title: `Page ${newPageNumber}`,
      content: '',
      pageNumber: newPageNumber,
      user: req.user.id
    });
    res.status(201).json({ success: true, data: page });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
};

export const updatePage = async (req, res) => {
  try {
    const page = await Page.findById(req.params.id);
    if (!page) {
      return res.status(404).json({ success: false, message: 'Page not found' });
    }
    
    const notebook = await Notebook.findById(page.notebook);
    if (!hasAccess(notebook, req.user.id)) {
      return res.status(403).json({ success: false, message: 'Access denied' });
    }
    
    const updated = await Page.findOneAndUpdate(
      { _id: req.params.id },
      req.body,
      { new: true, runValidators: true }
    );
    res.status(200).json({ success: true, data: updated });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
};

export const deletePage = async (req, res) => {
  try {
    const page = await Page.findById(req.params.id);
    if (!page) {
      return res.status(404).json({ success: false, message: 'Page not found' });
    }
    
    const notebook = await Notebook.findById(page.notebook);
    if (!notebook || notebook.user.toString() !== req.user.id.toString()) {
      return res.status(403).json({ success: false, message: 'Only owner can delete pages' });
    }
    
    await Page.findByIdAndDelete(req.params.id);
    res.status(200).json({ success: true, data: {} });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
};

export const getPages = async (req, res) => {
  try {
    const { notebookId } = req.params;
    const notebook = await Notebook.findById(notebookId);
    
    if (!hasAccess(notebook, req.user.id)) {
      return res.status(403).json({ success: false, message: 'Access denied' });
    }
    
    const pages = await Page.find({ notebook: notebookId }).sort({ pageNumber: 1 });
    res.status(200).json({ success: true, data: pages });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
};