import Board from '../models/Board.js';

// Get all boards for logged-in user
export const getBoards = async (req, res) => {
  try {
    const boards = await Board.find({ user: req.user.id }).sort({ createdAt: -1 });
    res.status(200).json({ success: true, data: boards });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
};

// Get single board
export const getBoard = async (req, res) => {
  try {
    const board = await Board.findOne({ _id: req.params.id, user: req.user.id });
    
    if (!board) {
      return res.status(404).json({ success: false, message: 'Board not found' });
    }
    
    res.status(200).json({ success: true, data: board });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
};

// Create board
export const createBoard = async (req, res) => {
  try {
    const { name, description, color } = req.body;
    
    const board = await Board.create({
      name,
      description,
      color,
      user: req.user.id
    });
    
    res.status(201).json({ success: true, data: board });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
};

// Update board
export const updateBoard = async (req, res) => {
  try {
    const board = await Board.findOneAndUpdate(
      { _id: req.params.id, user: req.user.id },
      req.body,
      { new: true, runValidators: true }
    );
    
    if (!board) {
      return res.status(404).json({ success: false, message: 'Board not found' });
    }
    
    res.status(200).json({ success: true, data: board });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
};

// Delete board
export const deleteBoard = async (req, res) => {
  try {
    const board = await Board.findOneAndDelete({ _id: req.params.id, user: req.user.id });
    
    if (!board) {
      return res.status(404).json({ success: false, message: 'Board not found' });
    }
    
    res.status(200).json({ success: true, data: {} });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
};