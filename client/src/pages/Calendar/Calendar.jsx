import React, { useState, useEffect } from 'react';
import { Calendar as BigCalendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';
import Sidebar from '../../components/layout/Sidebar';
import eventService from '../../services/eventService';
import { Plus, X, ChevronLeft, ChevronRight, Calendar as CalendarIcon, List, Zap, Star } from 'lucide-react';
import 'react-big-calendar/lib/css/react-big-calendar.css';

const localizer = momentLocalizer(moment);

const CalendarPage = () => {
  const [events, setEvents] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [viewMode, setViewMode] = useState('month');
  const [agendaView, setAgendaView] = useState(false);
  
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    startDate: '',
    endDate: '',
    allDay: false,
    color: '#f59e0b',
    isImportant: false
  });

  useEffect(() => { loadEvents(); }, []);

  const loadEvents = async () => {
    try {
      const response = await eventService.getAll(null, null, {});
      console.log('Raw events from server:', response.data);
      
      const calendarEvents = response.data.map(event => {
        const startDate = new Date(event.startDate);
        let endDate;
        
        if (event.endDate) {
          endDate = new Date(event.endDate);
        } else {
          // Default: 1 hour after start
          endDate = new Date(startDate);
          endDate.setHours(endDate.getHours() + 1);
        }
        
        // If event has no specific time (midnight 00:00) and not all day, set to noon
        if (startDate.getHours() === 0 && startDate.getMinutes() === 0 && !event.allDay) {
          startDate.setHours(12, 0, 0, 0);
          endDate.setHours(13, 0, 0, 0);
        }
        
        console.log(`Event: ${event.title}, Start: ${startDate.toISOString()}, End: ${endDate.toISOString()}`);
        
        return {
          ...event,
          start: startDate,
          end: endDate
        };
      });
      setEvents(calendarEvents);
    } catch (error) {
      console.error('Error loading events:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleToday = () => setCurrentDate(new Date());

  const handleNext = () => {
    const newDate = new Date(currentDate);
    if (viewMode === 'month') newDate.setMonth(newDate.getMonth() + 1);
    else if (viewMode === 'week') newDate.setDate(newDate.getDate() + 7);
    else if (viewMode === 'day') newDate.setDate(newDate.getDate() + 1);
    setCurrentDate(newDate);
  };

  const handlePrevious = () => {
    const newDate = new Date(currentDate);
    if (viewMode === 'month') newDate.setMonth(newDate.getMonth() - 1);
    else if (viewMode === 'week') newDate.setDate(newDate.getDate() - 7);
    else if (viewMode === 'day') newDate.setDate(newDate.getDate() - 1);
    setCurrentDate(newDate);
  };

  const handleSelectSlot = ({ start, end }) => {
    setSelectedEvent(null);
    setFormData({
      title: '',
      description: '',
      startDate: formatLocalDateTime(start),
      endDate: formatLocalDateTime(end),
      allDay: false,
      color: '#f59e0b',
      isImportant: false
    });
    setShowModal(true);
  };

  const formatLocalDateTime = (date) => {
    if (!date) return '';
    const d = new Date(date);
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    const hours = String(d.getHours()).padStart(2, '0');
    const minutes = String(d.getMinutes()).padStart(2, '0');
    return `${year}-${month}-${day}T${hours}:${minutes}`;
  };

  const handleSelectEvent = (event) => {
    if (event.type === 'classroom') {
      alert('This is a synced assignment from Google Classroom and cannot be edited.');
      return;
    }
    setSelectedEvent(event);
    setFormData({
      title: event.title,
      description: event.description || '',
      startDate: formatLocalDateTime(event.startDate),
      endDate: event.endDate ? formatLocalDateTime(event.endDate) : formatLocalDateTime(event.startDate),
      allDay: event.allDay || false,
      color: event.color || '#f59e0b',
      isImportant: event.isImportant || false
    });
    setShowModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log('handleSubmit called - formData:', formData);
    try {
      if (!formData.title || !formData.startDate) {
        alert('Please fill in all required fields');
        return;
      }
      
      // Ensure proper ISO format with time
      let startDateTime = formData.startDate;
      // If it's just a date without time, add default time
      if (!formData.startDate.includes('T')) {
        startDateTime = formData.startDate + 'T12:00:00';
      } else if (formData.startDate.includes('T00:00') || formData.startDate.includes('T0000')) {
        // If time is midnight, change to noon
        startDateTime = formData.startDate.replace(/T00:00/, 'T12:00').replace(/T0000/, 'T1200');
      }
      
      let endDateTime;
      if (formData.endDate) {
        endDateTime = formData.endDate;
        // Fix midnight to noon
        if (endDateTime.includes('T00:00') || endDateTime.includes('T0000')) {
          endDateTime = endDateTime.replace(/T00:00/, 'T13:00').replace(/T0000/, 'T1300');
        }
      } else {
        // Default end time is 1 hour after start
        const startDateObj = new Date(startDateTime);
        startDateObj.setHours(startDateObj.getHours() + 1);
        endDateTime = startDateObj.toISOString();
      }
      
      const eventData = {
        title: formData.title,
        description: formData.description || undefined,
        startDate: startDateTime,
        endDate: endDateTime,
        allDay: formData.allDay || false,
        color: formData.color || '#f59e0b',
        isImportant: formData.isImportant || false
      };
      
      console.log('Creating event with data:', eventData);
      
      if (selectedEvent) {
        await eventService.update(selectedEvent._id, eventData);
      } else {
        await eventService.create(eventData);
      }
      console.log('Event created successfully!');
      await loadEvents();
      closeModal();
    } catch (error) {
      console.error('Error saving event:', error);
      alert('Failed to save event. Check console for details.');
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

  const handleEventDrop = async ({ event, start, end }) => {
    try {
      await eventService.update(event._id, {
        ...event,
        startDate: start.toISOString(),
        endDate: end.toISOString()
      });
      await loadEvents();
    } catch (error) {
      console.error('Error moving event:', error);
      alert('Failed to update event time');
    }
  };

  const generateMonthDays = (date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const startDay = firstDay.getDay();
    const days = [];
    
    // Get days from previous month
    for (let i = startDay - 1; i >= 0; i--) {
      const d = new Date(year, month, -i);
      days.push({ date: d, isCurrentMonth: false });
    }
    
    // Get days of current month
    for (let i = 1; i <= lastDay.getDate(); i++) {
      const d = new Date(year, month, i);
      days.push({ date: d, isCurrentMonth: true });
    }
    
    // Get days from next month to fill grid
    const remaining = 42 - days.length;
    for (let i = 1; i <= remaining; i++) {
      const d = new Date(year, month + 1, i);
      days.push({ date: d, isCurrentMonth: false });
    }
    
    return days;
  };

  const eventStyleGetter = (event) => {
    const baseColor = event.color || '#f59e0b';
    const startDate = new Date(event.start);
    const endDate = new Date(event.end);
    
    // Check if event has actual time or is just a date (midnight)
    const hasTime = startDate.getHours() > 0 || startDate.getMinutes() > 0;
    const startTime = moment(startDate).format('h:mm A');
    const endTime = moment(endDate).format('h:mm A');
    
    return {
      style: {
        backgroundColor: baseColor,
        color: 'white',
        borderRadius: '4px',
        padding: hasTime ? '4px 8px' : '2px 6px',
        fontSize: '11px',
        fontWeight: '500',
        border: 'none',
        boxShadow: '0 2px 4px rgba(0,0,0,0.3)',
        cursor: 'pointer',
        display: 'block',
        height: '100%',
        minHeight: '24px'
      },
      title: hasTime ? `${event.title}\n${startTime} - ${endTime}` : event.title
    };
  };

  const upcomingEvents = events
    .filter(event => new Date(event.start) >= new Date())
    .sort((a, b) => new Date(a.start) - new Date(b.start))
    .slice(0, 10);

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
                  <h1 className="text-4xl lg:text-5xl font-display font-black text-[var(--text-primary)] mb-1">Calendar</h1>
                  <p className="text-[var(--text-secondary)] font-body">Manage your events and deadlines</p>
                </div>
              </div>
              <button
                onClick={() => {
                  setSelectedEvent(null);
                  setFormData({
                    title: '',
                    description: '',
                    startDate: formatLocalDateTime(new Date()),
                    endDate: formatLocalDateTime(new Date()),
                    allDay: false,
                    color: '#f59e0b',
                    isImportant: false
                  });
                  setShowModal(true);
                }}
                className="flex items-center space-x-2 bg-gradient-strike text-white px-6 py-3.5 rounded-xl hover:shadow-lg hover:shadow-amber/25 transition-all duration-300 hover:scale-[1.02] font-bold"
              >
                <Plus className="w-5 h-5" />
                <span>New Event</span>
              </button>
            </div>
          </div>

          <div className="bg-[var(--bg-secondary)] border border-[var(--border-color)] rounded-2xl p-5 mb-6">
            <div className="flex items-center justify-between flex-wrap gap-4">
              <div className="flex items-center space-x-2">
                <button onClick={handlePrevious} className="p-2 hover:bg-amber/10 rounded-lg transition-colors">
                  <ChevronLeft className="w-5 h-5 text-[var(--text-tertiary)] hover:text-amber" />
                </button>
                <span className="text-lg font-display font-bold text-[var(--text-primary)] min-w-[200px] text-center">
                  {currentDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
                </span>
                <button onClick={handleNext} className="p-2 hover:bg-amber/10 rounded-lg transition-colors">
                  <ChevronRight className="w-5 h-5 text-[var(--text-tertiary)] hover:text-amber" />
                </button>
              </div>

              <button onClick={handleToday} className="px-4 py-2 bg-amber/10 text-amber rounded-lg hover:bg-amber/20 transition-all font-medium text-sm">
                Today
              </button>

              <div className="flex items-center space-x-1 border border-[var(--border-color)] rounded-lg p-1">
                {['month', 'week', 'day'].map((v) => (
                  <button
                    key={v}
                    onClick={() => setViewMode(v)}
                    className={`px-3 py-1.5 rounded transition-all text-sm font-medium ${
                      viewMode === v ? 'bg-gradient-strike text-white' : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-tertiary)]'
                    }`}
                  >
                    {v.charAt(0).toUpperCase() + v.slice(1)}
                  </button>
                ))}
              </div>

              <button
                onClick={() => setAgendaView(!agendaView)}
                className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-all text-sm ${
                  agendaView ? 'bg-gradient-strike text-white' : 'bg-[var(--bg-tertiary)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] border border-[var(--border-color)]'
                }`}
              >
                <List className="w-4 h-4" />
                <span>Agenda</span>
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
          ) : agendaView ? (
            <div className="grid md:grid-cols-3 gap-6">
              <div className="md:col-span-2">
                <div className="bg-[var(--bg-secondary)] border border-[var(--border-color)] rounded-2xl overflow-hidden">
                  <div className="bg-gradient-strike p-5">
                    <h3 className="font-display font-bold text-lg text-white">Upcoming Events</h3>
                  </div>
                  {upcomingEvents.length === 0 ? (
                    <div className="p-12 text-center">
                      <CalendarIcon className="w-12 h-12 text-[var(--text-tertiary)] mx-auto mb-4" />
                      <p className="text-[var(--text-secondary)]">No upcoming events</p>
                    </div>
                  ) : (
                    <div className="divide-y divide-[var(--border-color)]">
                      {upcomingEvents.map(event => (
                        <div
                          key={event._id}
                          onClick={() => handleSelectEvent(event)}
                          className="p-5 hover:bg-[var(--bg-tertiary)] cursor-pointer transition-colors border-l-4"
                          style={{ borderLeftColor: event.color || '#f59e0b' }}
                        >
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <h4 className="font-semibold text-[var(--text-primary)] flex items-center space-x-2">
                                <span>{event.title}</span>
                                {event.isImportant && (
                                  <span className="px-2 py-0.5 bg-rose/20 text-rose text-xs rounded-full font-bold">Important</span>
                                )}
                              </h4>
                              <p className="text-sm text-[var(--text-secondary)] mt-1">
                                {new Date(event.start).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                              </p>
                              {event.description && <p className="text-sm text-[var(--text-tertiary)] mt-2">{event.description}</p>}
                            </div>
                            <span className="text-xs font-medium text-[var(--text-tertiary)] ml-2">
                              {event.type === 'classroom' ? 'Classroom' : 'Personal'}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              <div className="space-y-6">
                <div className="bg-[var(--bg-secondary)] border border-[var(--border-color)] rounded-2xl p-6">
                  <h4 className="font-display font-bold text-[var(--text-primary)] mb-4">Summary</h4>
                  <div className="space-y-3">
                    <div>
                      <p className="text-sm text-[var(--text-secondary)]">Total Events</p>
                      <p className="text-2xl font-display font-bold text-[var(--text-primary)]">{events.length}</p>
                    </div>
                    <div>
                      <p className="text-sm text-[var(--text-secondary)]">Upcoming</p>
                      <p className="text-2xl font-display font-bold text-amber">{upcomingEvents.length}</p>
                    </div>
                    <div>
                      <p className="text-sm text-[var(--text-secondary)]">Important</p>
                      <p className="text-2xl font-display font-bold text-rose">
                        {upcomingEvents.filter(e => e.isImportant).length}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="bg-[var(--bg-secondary)] border border-[var(--border-color)] rounded-2xl p-6">
                  <h4 className="font-display font-bold text-[var(--text-primary)] mb-4">Event Types</h4>
                  <div className="space-y-3 text-sm">
                    {[
                      { color: '#f59e0b', label: 'Personal' },
                      { color: '#4285f4', label: 'Classroom' },
                      { color: '#10b981', label: 'Deadline' },
                    ].map((t, i) => (
                      <div key={i} className="flex items-center space-x-2">
                        <div className="w-3 h-3 rounded" style={{ backgroundColor: t.color }} />
                        <span className="text-[var(--text-secondary)]">{t.label}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-[var(--bg-secondary)] border border-[var(--border-color)] rounded-2xl overflow-hidden">
              {viewMode === 'month' ? (
                <div className="p-4">
                  <div className="grid grid-cols-7 gap-px bg-[var(--border-color)] rounded-lg overflow-hidden">
                    {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                      <div key={day} className="bg-[var(--bg-tertiary)] p-3 text-center text-sm font-semibold text-[var(--text-secondary)]">
                        {day}
                      </div>
                    ))}
                    
                    {generateMonthDays(currentDate).map((dayObj, idx) => {
                      const dayStart = new Date(dayObj.date);
                      dayStart.setHours(0, 0, 0, 0);
                      const dayEnd = new Date(dayObj.date);
                      dayEnd.setHours(23, 59, 59, 999);
                      
                      const dayEvents = events.filter(event => {
                        const eventStart = new Date(event.start);
                        eventStart.setHours(0, 0, 0, 0);
                        const eventEnd = new Date(event.end || event.start);
                        eventEnd.setHours(23, 59, 59, 999);
                        return eventStart.getTime() <= dayEnd.getTime() && eventEnd.getTime() >= dayStart.getTime();
                      }).slice(0, 3);
                      
                      const isToday = new Date().toDateString() === dayObj.date.toDateString();
                      
                      return (
                        <div 
                          key={idx} 
                          className={`bg-[var(--bg-secondary)] min-h-[120px] p-2 cursor-pointer hover:bg-[var(--bg-tertiary)] transition-colors ${
                            !dayObj.isCurrentMonth ? 'opacity-40' : ''
                          }`}
                          onClick={() => {
                            const clickedDate = new Date(dayObj.date);
                            clickedDate.setHours(12, 0, 0, 0);
                            setFormData({
                              title: '',
                              description: '',
                              startDate: clickedDate.toISOString().slice(0, 16),
                              endDate: '',
                              allDay: false,
                              color: '#f59e0b',
                              isImportant: false
                            });
                            setSelectedEvent(null);
                            setShowModal(true);
                          }}
                        >
                          <div className={`text-sm font-medium mb-1 ${isToday ? 'text-amber font-bold' : 'text-[var(--text-primary)]'}`}>
                            {dayObj.date.getDate()}
                          </div>
                          <div className="space-y-1">
                            {dayEvents.map((event, eIdx) => (
                              <div 
                                key={eIdx}
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleSelectEvent(event);
                                }}
                                className={`text-xs p-1.5 rounded truncate ${event.isImportant ? 'ring-2 ring-white/50' : ''}`}
                                style={{ backgroundColor: event.color || '#f59e0b', color: 'white' }}
                                title={`${event.title}${event.description ? '\n' + event.description : ''}`}
                              >
                                <div className="font-medium truncate flex items-center gap-1">
                                  {event.isImportant && <Star className="w-3 h-3 fill-current" />}
                                  {event.title}
                                </div>
                                {event.description && (
                                  <div className="opacity-80 truncate text-[10px]">{event.description}</div>
                                )}
                              </div>
                            ))}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              ) : viewMode === 'week' ? (
                <div className="p-4 overflow-x-auto">
                  {(() => {
                    const weekStart = new Date(currentDate);
                    weekStart.setDate(weekStart.getDate() - weekStart.getDay());
                    const weekDays = Array.from({ length: 7 }, (_, i) => {
                      const d = new Date(weekStart);
                      d.setDate(d.getDate() + i);
                      return d;
                    });
                    
                    const hours = Array.from({ length: 24 }, (_, i) => i);
                    
                    const isMultiDay = (event) => {
                      const start = new Date(event.start);
                      const end = new Date(event.end || event.start);
                      const startDay = new Date(start.getFullYear(), start.getMonth(), start.getDate());
                      const endDay = new Date(end.getFullYear(), end.getMonth(), end.getDate());
                      return endDay.getTime() > startDay.getTime();
                    };
                    
                    const isEventOnDay = (event, day) => {
                      const eventStart = new Date(event.start);
                      const eventEnd = new Date(event.end || event.start);
                      const dayStart = new Date(day);
                      dayStart.setHours(0, 0, 0, 0);
                      const dayEnd = new Date(day);
                      dayEnd.setHours(23, 59, 59, 999);
                      return eventStart.getTime() <= dayEnd.getTime() && eventEnd.getTime() >= dayStart.getTime();
                    };
                    
                    return (
                      <div className="grid grid-cols-8 gap-px bg-[var(--border-color)] min-w-[800px]">
                        <div className="bg-[var(--bg-tertiary)] p-2"></div>
                        {weekDays.map((day, idx) => (
                          <div key={idx} className="bg-[var(--bg-tertiary)] p-2 text-center">
                            <div className="text-xs text-[var(--text-tertiary)]">{day.toLocaleDateString('en-US', { weekday: 'short' })}</div>
                            <div className={`text-lg font-bold ${new Date().toDateString() === day.toDateString() ? 'text-amber' : 'text-[var(--text-primary)]'}`}>
                              {day.getDate()}
                            </div>
                          </div>
                        ))}
                        
                        {hours.map(hour => (
                          <React.Fragment key={hour}>
                            <div className="bg-[var(--bg-secondary)] p-1 text-[10px] text-[var(--text-tertiary)] text-center border-r border-[var(--border-color)]">
                              {hour === 0 ? '12 AM' : hour < 12 ? `${hour} AM` : hour === 12 ? '12 PM' : `${hour - 12} PM`}
                            </div>
                            {weekDays.map((day, dayIdx) => {
                              const dayStart = new Date(day);
                              dayStart.setHours(hour, 0, 0, 0);
                              const dayEnd = new Date(day);
                              dayEnd.setHours(hour + 1, 0, 0, 0);
                              
                              const hourEvents = events.filter(event => {
                                const eventStart = new Date(event.start);
                                const eventEnd = new Date(event.end || event.start);
                                const isMulti = isMultiDay(event);
                                const eventStartDay = new Date(eventStart);
                                eventStartDay.setHours(0, 0, 0, 0);
                                const currentDayStart = new Date(day);
                                currentDayStart.setHours(0, 0, 0, 0);
                                
                                if (isMulti) {
                                  const eventEndDate = new Date(eventEnd);
                                  eventEndDate.setHours(0, 0, 0, 0);
                                  const showAtEnd = eventEndDate.getTime() === currentDayStart.getTime() && hour === eventEnd.getHours();
                                  const showAtStart = eventStartDay.getTime() === currentDayStart.getTime() && hour === eventStart.getHours();
                                  return showAtStart || showAtEnd;
                                }
                                
                                return eventStart.getTime() < dayEnd.getTime() && eventEnd.getTime() > dayStart.getTime() && eventStart.getHours() === hour;
                              });
                              
                              return (
                                <div 
                                  key={dayIdx}
                                  className="bg-[var(--bg-secondary)] min-h-[40px] p-0.5 cursor-pointer hover:bg-[var(--bg-tertiary)]"
                                  onClick={() => {
                                    const clickedDate = new Date(day);
                                    clickedDate.setHours(hour, 0, 0, 0);
                                    setFormData({
                                      title: '',
                                      description: '',
                                      startDate: clickedDate.toISOString().slice(0, 16),
                                      endDate: '',
                                      allDay: false,
                                      color: '#f59e0b',
                                      isImportant: false
                                    });
                                    setSelectedEvent(null);
                                    setShowModal(true);
                                  }}
                                >
                                  {hourEvents.map((event, eIdx) => (
                                    <div
                                      key={eIdx}
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        handleSelectEvent(event);
                                      }}
                                      className="h-4 rounded cursor-pointer hover:opacity-80 mb-1"
                                      style={{ backgroundColor: event.color || '#f59e0b' }}
                                      title={`${event.title}${event.description ? '\n' + event.description : ''}`}
                                    >
                                      <div className="text-[9px] text-white truncate px-1 leading-4 flex items-center gap-0.5">
                                        {event.isImportant && <Star className="w-2.5 h-2.5 fill-current" />}
                                        {event.title}
                                      </div>
                                    </div>
                                  ))}
                                </div>
                              );
                            })}
                          </React.Fragment>
                        ))}
                      </div>
                    );
                  })()}
                </div>
              ) : (
                <div className="p-4">
                  {(() => {
                    const dayStart = new Date(currentDate);
                    dayStart.setHours(0, 0, 0, 0);
                    const hours = Array.from({ length: 24 }, (_, i) => i);
                    
                    const isMultiDay = (event) => {
                      const start = new Date(event.start);
                      const end = new Date(event.end || event.start);
                      const startDay = new Date(start.getFullYear(), start.getMonth(), start.getDate());
                      const endDay = new Date(end.getFullYear(), end.getMonth(), end.getDate());
                      return endDay.getTime() > startDay.getTime();
                    };
                    
                    return (
                      <div className="space-y-0">
                        {hours.map(hour => {
                          const hourStart = new Date(dayStart);
                          hourStart.setHours(hour, 0, 0, 0);
                          const hourEnd = new Date(dayStart);
                          hourEnd.setHours(hour + 1, 0, 0, 0);
                          
                          const hourEvents = events.filter(event => {
                            const eventStart = new Date(event.start);
                            const eventEnd = new Date(event.end || event.start);
                            const isMulti = isMultiDay(event);
                            const eventStartDay = new Date(eventStart);
                            eventStartDay.setHours(0, 0, 0, 0);
                            
                            if (isMulti) {
                              const eventEndDate = new Date(eventEnd);
                              eventEndDate.setHours(0, 0, 0, 0);
                              const showAtEnd = eventEndDate.getTime() === dayStart.getTime() && hour === eventEnd.getHours();
                              const showAtStart = eventStartDay.getTime() === dayStart.getTime() && hour === eventStart.getHours();
                              return showAtStart || showAtEnd;
                            }
                            
                            return eventStart.getTime() < hourEnd.getTime() && eventEnd.getTime() > hourStart.getTime() && eventStart.getHours() === hour;
                          });
                          
                          return (
                            <div 
                              key={hour} 
                              className="flex border-b border-[var(--border-color)] hover:bg-[var(--bg-tertiary)] cursor-pointer"
                              onClick={() => {
                                const clickedDate = new Date(dayStart);
                                clickedDate.setHours(hour, 0, 0, 0);
                                setFormData({
                                  title: '',
                                  description: '',
                                  startDate: clickedDate.toISOString().slice(0, 16),
                                  endDate: '',
                                  allDay: false,
                                  color: '#f59e0b',
                                  isImportant: false
                                });
                                setSelectedEvent(null);
                                setShowModal(true);
                              }}
                            >
                              <div className="w-16 p-2 text-xs text-[var(--text-tertiary)] text-right border-r border-[var(--border-color)] shrink-0">
                                {hour === 0 ? '12 AM' : hour < 12 ? `${hour} AM` : hour === 12 ? '12 PM' : `${hour - 12} PM`}
                              </div>
                              <div className="flex-1 p-1 min-h-[40px] flex flex-wrap gap-1 items-start">
                                {hourEvents.map((event, eIdx) => (
                                  <div
                                    key={eIdx}
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      handleSelectEvent(event);
                                    }}
                                    className="h-5 rounded cursor-pointer hover:opacity-80"
                                    style={{ backgroundColor: event.color || '#f59e0b', minWidth: '80px', maxWidth: '200px' }}
                                    title={`${event.title}${event.description ? '\n' + event.description : ''}`}
                                  >
                                    <div className="text-[10px] text-white truncate px-2 leading-5 flex items-center gap-0.5">
                                      {event.isImportant && <Star className="w-2.5 h-2.5 fill-current" />}
                                      {event.title}
                                    </div>
                                  </div>
                                ))}
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    );
                  })()}
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-[var(--bg-secondary)] border border-[var(--border-color)] rounded-2xl max-w-md w-full p-8 shadow-2xl shadow-black/50">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-display font-bold text-[var(--text-primary)]">
                {selectedEvent ? 'Edit Event' : 'New Event'}
              </h2>
              <button onClick={closeModal} className="p-2 hover:bg-white/5 rounded-lg transition-colors">
                <X className="w-5 h-5 text-[var(--text-tertiary)] hover:text-[var(--text-primary)]" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-[var(--text-secondary)] mb-2">Event Title</label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full px-4 py-3 bg-[var(--bg-tertiary)] border border-[var(--border-color)] rounded-xl focus:ring-2 focus:ring-amber/30 focus:border-amber/50 text-[var(--text-primary)]"
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
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-[var(--text-secondary)] mb-2">Start Date & Time</label>
                <input
                  type="datetime-local"
                  value={formData.startDate}
                  onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                  className="w-full px-4 py-3 bg-[var(--bg-tertiary)] border border-[var(--border-color)] rounded-xl focus:ring-2 focus:ring-amber/30 focus:border-amber/50 text-[var(--text-primary)]"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-[var(--text-secondary)] mb-2">End Date & Time</label>
                <input
                  type="datetime-local"
                  value={formData.endDate}
                  onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                  className="w-full px-4 py-3 bg-[var(--bg-tertiary)] border border-[var(--border-color)] rounded-xl focus:ring-2 focus:ring-amber/30 focus:border-amber/50 text-[var(--text-primary)]"
                />
              </div>

              <div className="space-y-3">
                <label className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.allDay}
                    onChange={(e) => setFormData({ ...formData, allDay: e.target.checked })}
                    className="w-4 h-4 rounded border-[var(--border-color)] bg-[var(--bg-tertiary)] text-amber focus:ring-amber"
                  />
                  <span className="text-sm font-medium text-[var(--text-primary)]">All Day Event</span>
                </label>

                <label className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.isImportant}
                    onChange={(e) => setFormData({ ...formData, isImportant: e.target.checked })}
                    className="w-4 h-4 rounded border-[var(--border-color)] bg-[var(--bg-tertiary)] text-rose focus:ring-rose"
                  />
                  <span className="text-sm font-medium text-[var(--text-primary)]">Mark as Important</span>
                </label>
              </div>

              <div>
                <label className="block text-sm font-medium text-[var(--text-secondary)] mb-2">Color</label>
                <div className="flex space-x-2">
                  {['#f59e0b', '#4285f4', '#10b981', '#8b5cf6', '#f43f5e', '#06b6d4'].map(color => (
                    <button
                      key={color}
                      type="button"
                      onClick={() => setFormData({ ...formData, color })}
                      className={`w-10 h-10 rounded-lg transition-all duration-300 ${
                        formData.color === color ? 'ring-2 ring-offset-2 ring-offset-[var(--bg-secondary)] ring-amber scale-110' : ''
                      }`}
                      style={{ backgroundColor: color }}
                    />
                  ))}
                </div>
              </div>

              <div className="flex space-x-3 pt-4 border-t border-[var(--border-color)]">
                {selectedEvent && (
                  <button
                    type="button"
                    onClick={handleDelete}
                    className="flex-1 px-4 py-2 bg-rose/10 text-rose rounded-lg hover:bg-rose/20 transition-all font-medium"
                  >
                    Delete
                  </button>
                )}
                <button
                  type="button"
                  onClick={closeModal}
                  className="flex-1 px-4 py-2 border border-[var(--border-color)] text-[var(--text-secondary)] rounded-lg hover:bg-white/5 transition-all font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-2 bg-gradient-strike text-white rounded-lg hover:shadow-lg hover:shadow-amber/25 transition-all font-medium"
                >
                  Save Event
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
