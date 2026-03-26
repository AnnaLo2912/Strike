import { useState, useEffect } from 'react';
import { Calendar as BigCalendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';
import Sidebar from '../../components/Layout/Sidebar';
import eventService from '../../services/eventService';
import { Plus, X, Calendar as CalendarIcon } from 'lucide-react';
import 'react-big-calendar/lib/css/react-big-calendar.css';

const localizer = momentLocalizer(moment);

const CalendarPage = () => {
  const [events, setEvents] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    startDate: '',
    endDate: '',
    allDay: false,
    color: '#c18db4'
  });

  useEffect(() => {
    loadEvents();
  }, []);

  const loadEvents = async () => {
    try {
      const response = await eventService.getAll();
      
      // Transform events for calendar
      const calendarEvents = response.data.map(event => ({
        ...event,
        start: new Date(event.startDate),
        end: event.endDate ? new Date(event.endDate) : new Date(event.startDate),
      }));
      
      setEvents(calendarEvents);
    } catch (error) {
      console.error('Error loading events:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSelectSlot = ({ start, end }) => {
    setSelectedEvent(null);
    setFormData({
      title: '',
      description: '',
      startDate: start.toISOString().slice(0, 16),
      endDate: end.toISOString().slice(0, 16),
      allDay: false,
      color: '#c18db4'
    });
    setShowModal(true);
  };

  const handleSelectEvent = (event) => {
    if (event.type === 'classroom') {
      // Can't edit classroom events
      alert('This is a synced assignment from Google Classroom and cannot be edited.');
      return;
    }
    
    setSelectedEvent(event);
    setFormData({
      title: event.title,
      description: event.description || '',
      startDate: new Date(event.startDate).toISOString().slice(0, 16),
      endDate: event.endDate ? new Date(event.endDate).toISOString().slice(0, 16) : new Date(event.startDate).toISOString().slice(0, 16),
      allDay: event.allDay || false,
      color: event.color || '#c18db4'
    });
    setShowModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      if (selectedEvent) {
        await eventService.update(selectedEvent._id, formData);
      } else {
        await eventService.create(formData);
      }
      
      await loadEvents();
      closeModal();
    } catch (error) {
      console.error('Error saving event:', error);
    }
  };

  const handleDelete = async () => {
    if (window.confirm('Delete this event?')) {
      try {
        await eventService.delete(selectedEvent._id);
        await loadEvents();
        closeModal();
      } catch (error) {
        console.error('Error deleting event:', error);
      }
    }
  };

  const closeModal = () => {
    setShowModal(false);
    setSelectedEvent(null);
  };

  const eventStyleGetter = (event) => {
    return {
      style: {
        backgroundColor: event.color || '#c18db4',
        borderRadius: '8px',
        opacity: 0.9,
        color: 'white',
        border: '0px',
        display: 'block'
      }
    };
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <Sidebar />
      
      <div className="flex-1 lg:ml-64">
        <div className="p-8">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold text-[#0e1b48] mb-2">Calendar</h1>
              <p className="text-gray-600">Manage your events and deadlines</p>
            </div>
            <button
              onClick={() => {
                setSelectedEvent(null);
                setFormData({
                  title: '',
                  description: '',
                  startDate: new Date().toISOString().slice(0, 16),
                  endDate: new Date().toISOString().slice(0, 16),
                  allDay: false,
                  color: '#c18db4'
                });
                setShowModal(true);
              }}
              className="flex items-center space-x-2 bg-gradient-to-r from-[#c18db4] to-[#0e1b48] text-white px-6 py-3 rounded-xl hover:shadow-lg transition-all"
            >
              <Plus className="w-5 h-5" />
              <span>New Event</span>
            </button>
          </div>

          {/* Calendar */}
          {loading ? (
            <div className="flex justify-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#c18db4]"></div>
            </div>
          ) : (
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6" style={{ height: '700px' }}>
              <BigCalendar
                localizer={localizer}
                events={events}
                startAccessor="start"
                endAccessor="end"
                style={{ height: '100%' }}
                onSelectSlot={handleSelectSlot}
                onSelectEvent={handleSelectEvent}
                selectable
                eventPropGetter={eventStyleGetter}
                views={['month', 'week', 'day', 'agenda']}
                popup
              />
            </div>
          )}

          {/* Legend */}
          <div className="mt-6 bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
            <h3 className="font-semibold text-[#0e1b48] mb-4">Event Types</h3>
            <div className="flex flex-wrap gap-4">
              <div className="flex items-center space-x-2">
                <div className="w-4 h-4 rounded" style={{ backgroundColor: '#c18db4' }}></div>
                <span className="text-sm text-gray-600">Personal Events</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-4 h-4 rounded" style={{ backgroundColor: '#4285f4' }}></div>
                <span className="text-sm text-gray-600">Classroom Assignments</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-4 h-4 rounded" style={{ backgroundColor: '#10b981' }}></div>
                <span className="text-sm text-gray-600">Task Deadlines</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Event Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-[#0e1b48]">
                {selectedEvent ? 'Edit Event' : 'New Event'}
              </h2>
              <button onClick={closeModal} className="p-2 hover:bg-gray-100 rounded-lg">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Event Title *
                </label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#c18db4] focus:border-transparent"
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
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Start Date & Time *
                </label>
                <input
                  type="datetime-local"
                  value={formData.startDate}
                  onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#c18db4] focus:border-transparent"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  End Date & Time
                </label>
                <input
                  type="datetime-local"
                  value={formData.endDate}
                  onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#c18db4] focus:border-transparent"
                />
              </div>

              <div>
                <label className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.allDay}
                    onChange={(e) => setFormData({ ...formData, allDay: e.target.checked })}
                    className="w-4 h-4 rounded border-gray-200 text-[#c18db4] focus:ring-[#c18db4]"
                  />
                  <span className="text-sm text-gray-700">All Day Event</span>
                </label>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Color
                </label>
                <div className="flex space-x-2">
                  {['#c18db4', '#4285f4', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6'].map(color => (
                    <button
                      key={color}
                      type="button"
                      onClick={() => setFormData({ ...formData, color })}
                      className={`w-10 h-10 rounded-lg transition-all ${
                        formData.color === color ? 'ring-2 ring-offset-2 ring-[#0e1b48] scale-110' : ''
                      }`}
                      style={{ backgroundColor: color }}
                    />
                  ))}
                </div>
              </div>

              <div className="flex space-x-3 pt-4">
                {selectedEvent && (
                  <button
                    type="button"
                    onClick={handleDelete}
                    className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
                  >
                    Delete
                  </button>
                )}
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
                  {selectedEvent ? 'Update' : 'Create'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default CalendarPage;