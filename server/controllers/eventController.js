import Event from '../models/Event.js';

// Get all events
export const getEvents = async (req, res) => {
  try {
    const { start, end } = req.query;
    
    let query = { user: req.user.id };
    
    // Filter by date range if provided
    if (start && end) {
      query.startDate = {
        $gte: new Date(start),
        $lte: new Date(end)
      };
    }
    
    const events = await Event.find(query)
      .populate('taskId', 'title status')
      .sort({ startDate: 1 });
    
    res.status(200).json({ success: true, data: events });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
};

// Create event
export const createEvent = async (req, res) => {
  try {
    const { title, description, startDate, endDate, allDay, color } = req.body;
    
    const event = await Event.create({
      title,
      description,
      startDate,
      endDate,
      allDay,
      color,
      type: 'personal',
      user: req.user.id
    });
    
    res.status(201).json({ success: true, data: event });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
};

// Update event
export const updateEvent = async (req, res) => {
  try {
    const event = await Event.findOneAndUpdate(
      { _id: req.params.id, user: req.user.id },
      req.body,
      { new: true, runValidators: true }
    );
    
    if (!event) {
      return res.status(404).json({ success: false, message: 'Event not found' });
    }
    
    res.status(200).json({ success: true, data: event });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
};

// Delete event
export const deleteEvent = async (req, res) => {
  try {
    const event = await Event.findOneAndDelete({ _id: req.params.id, user: req.user.id });
    
    if (!event) {
      return res.status(404).json({ success: false, message: 'Event not found' });
    }
    
    res.status(200).json({ success: true, data: {} });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
};