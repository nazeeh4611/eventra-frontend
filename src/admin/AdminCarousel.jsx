import React, { useState, useEffect } from 'react';
import { PhotoIcon, ArrowsUpDownIcon, TrashIcon, EyeIcon, PlusIcon } from '@heroicons/react/24/outline';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import axios from 'axios';
import toast from 'react-hot-toast';
import baseurl from '../Base/base';

const AdminCarousel = () => {
  const [events, setEvents] = useState([]);
  const [carouselEvents, setCarouselEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchCarouselData();
  }, []);

  const fetchCarouselData = async () => {
    try {
      const token = localStorage.getItem('adminToken');
      
      if (!token) {
        toast.error('Authentication required');
        return;
      }

      const [carouselResponse, eventsResponse] = await Promise.all([
        axios.get(`${baseurl}/admin/carousel`, {
          headers: { Authorization: `Bearer ${token}` }
        }),
        axios.get(`${baseurl}/admin/events`, {
          headers: { Authorization: `Bearer ${token}` }
        })
      ]);

      const carouselEventsData = carouselResponse.data.events || [];
      const carouselEventIds = carouselEventsData.map(e => e._id);
      
      setCarouselEvents(carouselEventsData);

      const now = new Date();
      now.setHours(0, 0, 0, 0);
      
      const availableEvents = eventsResponse.data.events?.filter(event => {
        if (!event || !event._id) return false;
        if (carouselEventIds.includes(event._id)) return false;
        if (event.status !== 'upcoming' && event.status !== 'ongoing') return false;
        
        const eventDate = event.date ? new Date(event.date) : null;
        if (event.status === 'upcoming' && eventDate && eventDate < now) return false;
        
        return true;
      }) || [];

      setEvents(availableEvents);
    } catch (error) {
      console.error('Error fetching carousel data:', error);
      
      if (error.response?.status === 401) {
        toast.error('Session expired. Please login again.');
      } else if (error.response?.status === 403) {
        toast.error('You do not have permission to access carousel management.');
      } else {
        toast.error('Failed to fetch carousel data');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveFromCarousel = async (eventId) => {
    try {
      const token = localStorage.getItem('adminToken');
      
      if (!token) {
        toast.error('Authentication required');
        return;
      }

      await axios.delete(`${baseurl}/admin/carousel/${eventId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      toast.success('Event removed from carousel');
      
      await fetchCarouselData();
    } catch (error) {
      console.error('Error removing from carousel:', error);
      
      if (error.response?.status === 404) {
        toast.error('Event not found in carousel');
      } else {
        toast.error('Failed to remove from carousel');
      }
    }
  };

  const handleAddToCarousel = async (eventId) => {
    try {
      const token = localStorage.getItem('adminToken');
      
      if (!token) {
        toast.error('Authentication required');
        return;
      }

      if (carouselEvents.length >= 10) {
        toast.error('Maximum carousel items reached (10)');
        return;
      }

      await axios.post(`${baseurl}/admin/carousel`, 
        { eventId },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      toast.success('Event added to carousel');
      
      await fetchCarouselData();
    } catch (error) {
      console.error('Error adding to carousel:', error);
      
      if (error.response?.status === 409) {
        toast.error('Event already in carousel');
      } else if (error.response?.status === 400) {
        toast.error('Invalid event or event not available');
      } else {
        toast.error('Failed to add to carousel');
      }
    }
  };

  const handleOnDragEnd = async (result) => {
    if (!result.destination) return;

    const { source, destination, draggableId } = result;

    try {
      if (source.droppableId === 'events' && destination.droppableId === 'carousel') {
        const eventToAdd = events.find(event => event._id === draggableId);
        if (eventToAdd) {
          await handleAddToCarousel(eventToAdd._id);
        }
        return;
      }

      if (source.droppableId === 'carousel' && destination.droppableId === 'events') {
        const eventToRemove = carouselEvents.find(event => event._id === draggableId);
        if (eventToRemove) {
          await handleRemoveFromCarousel(eventToRemove._id);
        }
        return;
      }

      if (source.droppableId === 'carousel' && destination.droppableId === 'carousel') {
        const reorderedEvents = Array.from(carouselEvents);
        const [movedEvent] = reorderedEvents.splice(source.index, 1);
        reorderedEvents.splice(destination.index, 0, movedEvent);
        
        setCarouselEvents(reorderedEvents);

        try {
          const token = localStorage.getItem('adminToken');
          
          const orderData = {
            events: reorderedEvents.map((event, index) => ({
              eventId: event._id,
              position: index + 1
            }))
          };
          
          await axios.put(`${baseurl}/admin/carousel/order`, orderData, {
            headers: { Authorization: `Bearer ${token}` }
          });
          
          toast.success('Carousel order updated');
        } catch (error) {
          await fetchCarouselData();
          
          if (error.response?.status === 400) {
            toast.error('Invalid order data');
          } else {
            toast.error('Failed to update carousel order');
          }
        }
        return;
      }

      if (source.droppableId === 'events' && destination.droppableId === 'events') {
        const reorderedEvents = Array.from(events);
        const [movedEvent] = reorderedEvents.splice(source.index, 1);
        reorderedEvents.splice(destination.index, 0, movedEvent);
        setEvents(reorderedEvents);
        return;
      }
    } catch (error) {
      console.error('Error during drag and drop:', error);
      await fetchCarouselData();
    }
  };

  const filteredEvents = events.filter(event => 
    event.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    event.hosterId?.companyName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    event.venue?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    event.category?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="animate-pulse space-y-8">
          <div className="h-8 bg-gray-200 rounded w-1/4"></div>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-4">
              <div className="h-12 bg-gray-200 rounded"></div>
              <div className="h-32 bg-gray-200 rounded"></div>
              <div className="h-32 bg-gray-200 rounded"></div>
            </div>
            <div className="space-y-4">
              <div className="h-12 bg-gray-200 rounded"></div>
              <div className="h-24 bg-gray-200 rounded"></div>
              <div className="h-24 bg-gray-200 rounded"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Carousel Management</h1>
        <p className="text-gray-600 mt-2">Drag and drop to manage featured events in the homepage carousel</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="p-3 bg-blue-100 rounded-lg">
              <PhotoIcon className="h-6 w-6 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Carousel Events</p>
              <p className="text-2xl font-semibold text-gray-900">{carouselEvents.length} / 10</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="p-3 bg-green-100 rounded-lg">
              <EyeIcon className="h-6 w-6 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Available Events</p>
              <p className="text-2xl font-semibold text-gray-900">{events.length}</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="p-3 bg-purple-100 rounded-lg">
              <ArrowsUpDownIcon className="h-6 w-6 text-purple-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Drag & Drop</p>
              <p className="text-sm text-gray-600">Reorder or move between lists</p>
            </div>
          </div>
        </div>
      </div>

      <DragDropContext onDragEnd={handleOnDragEnd}>
        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl shadow-lg p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold text-gray-900">Carousel Events</h2>
                <span className="px-3 py-1 bg-blue-100 text-blue-800 text-sm font-medium rounded-full">
                  {carouselEvents.length} Selected
                </span>
              </div>
              
              <Droppable droppableId="carousel">
                {(provided, snapshot) => (
                  <div
                    {...provided.droppableProps}
                    ref={provided.innerRef}
                    className={`space-y-4 min-h-[400px] transition-colors duration-200 ${
                      snapshot.isDraggingOver ? 'bg-blue-50 rounded-lg p-2' : ''
                    }`}
                  >
                    {carouselEvents.length === 0 ? (
                      <div className="flex flex-col items-center justify-center h-64 border-2 border-dashed border-gray-300 rounded-lg">
                        <PhotoIcon className="h-12 w-12 text-gray-400 mb-3" />
                        <p className="text-gray-500 text-center">No events in carousel</p>
                        <p className="text-sm text-gray-400 mt-1">Drag events here to feature them</p>
                      </div>
                    ) : (
                      carouselEvents.map((event, index) => (
                        <Draggable key={event._id} draggableId={event._id} index={index}>
                          {(provided, snapshot) => (
                            <div
                              ref={provided.innerRef}
                              {...provided.draggableProps}
                              className={`bg-white border-2 ${
                                snapshot.isDragging 
                                  ? 'border-blue-500 shadow-lg' 
                                  : 'border-gray-100 hover:border-gray-300'
                              } rounded-lg p-4 transition-all duration-200`}
                            >
                              <div className="flex items-center justify-between">
                                <div className="flex items-center flex-1">
                                  <div
                                    {...provided.dragHandleProps}
                                    className="p-2 mr-3 text-gray-400 hover:text-gray-600 cursor-move rounded-lg hover:bg-gray-100"
                                  >
                                    <ArrowsUpDownIcon className="h-5 w-5" />
                                  </div>
                                  
                                  <div className="relative">
                                    <img
                                      src={event.featuredImage || '/placeholder-image.jpg'}
                                      alt={event.title}
                                      className="h-16 w-16 rounded-lg object-cover"
                                      onError={(e) => {
                                        e.target.src = '/placeholder-image.jpg';
                                      }}
                                    />
                                    <span className="absolute -top-2 -right-2 bg-blue-600 text-white text-xs font-bold rounded-full h-6 w-6 flex items-center justify-center">
                                      #{index + 1}
                                    </span>
                                  </div>
                                  
                                  <div className="ml-4 flex-1">
                                    <div className="flex items-center gap-2">
                                      <h3 className="font-medium text-gray-900">{event.title}</h3>
                                      <span className={`px-2 py-0.5 text-xs font-medium rounded-full ${
                                        event.status === 'ongoing' 
                                          ? 'bg-green-100 text-green-800' 
                                          : 'bg-yellow-100 text-yellow-800'
                                      }`}>
                                        {event.status}
                                      </span>
                                    </div>
                                    <p className="text-sm text-gray-500">
                                      {event.hosterId?.companyName || 'No hoster'} • {event.date ? new Date(event.date).toLocaleDateString() : 'Date TBD'}
                                    </p>
                                    <p className="text-xs text-gray-400 mt-1">
                                      {event.venue || 'Venue TBD'}
                                    </p>
                                  </div>
                                </div>
                                
                                <div className="flex items-center space-x-1">
                                  <a
                                    href={`/events/${event._id}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="p-2 text-gray-400 hover:text-blue-600 rounded-lg hover:bg-gray-100"
                                    title="View Event"
                                  >
                                    <EyeIcon className="h-5 w-5" />
                                  </a>
                                  <button
                                    onClick={() => handleRemoveFromCarousel(event._id)}
                                    className="p-2 text-gray-400 hover:text-red-600 rounded-lg hover:bg-gray-100"
                                    title="Remove from Carousel"
                                  >
                                    <TrashIcon className="h-5 w-5" />
                                  </button>
                                </div>
                              </div>
                            </div>
                          )}
                        </Draggable>
                      ))
                    )}
                    {provided.placeholder}
                  </div>
                )}
              </Droppable>
            </div>
          </div>

          <div>
            <div className="bg-white rounded-xl shadow-lg p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold text-gray-900">Available Events</h2>
                <span className="px-3 py-1 bg-green-100 text-green-800 text-sm font-medium rounded-full">
                  {events.length} Available
                </span>
              </div>
              
              <div className="mb-4">
                <input
                  type="text"
                  placeholder="Search by title, host, venue, or category..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                {searchTerm && (
                  <div className="mt-2 text-sm text-gray-500">
                    Found {filteredEvents.length} {filteredEvents.length === 1 ? 'event' : 'events'}
                  </div>
                )}
              </div>
              
              <Droppable droppableId="events">
                {(provided, snapshot) => (
                  <div
                    {...provided.droppableProps}
                    ref={provided.innerRef}
                    className={`space-y-3 max-h-[600px] overflow-y-auto pr-2 transition-colors duration-200 ${
                      snapshot.isDraggingOver ? 'bg-green-50 rounded-lg p-2' : ''
                    }`}
                  >
                    {filteredEvents.length === 0 ? (
                      <div className="flex flex-col items-center justify-center h-64 border-2 border-dashed border-gray-300 rounded-lg">
                        <p className="text-gray-500 text-center">
                          {searchTerm ? 'No matching events found' : 'No available events'}
                        </p>
                        <p className="text-sm text-gray-400 mt-1">
                          {searchTerm 
                            ? 'Try adjusting your search terms' 
                            : 'Only upcoming and ongoing events are shown here'}
                        </p>
                      </div>
                    ) : (
                      filteredEvents.map((event, index) => (
                        <Draggable key={event._id} draggableId={event._id} index={index}>
                          {(provided, snapshot) => (
                            <div
                              ref={provided.innerRef}
                              {...provided.draggableProps}
                              className={`border ${
                                snapshot.isDragging 
                                  ? 'border-green-500 bg-green-50 shadow-md' 
                                  : 'border-gray-200 hover:border-blue-500 hover:shadow-md'
                              } rounded-lg p-3 transition-all duration-200 cursor-pointer`}
                            >
                              <div className="flex items-center">
                                <div
                                  {...provided.dragHandleProps}
                                  className="p-1 mr-2 text-gray-400 hover:text-gray-600 cursor-move rounded hover:bg-gray-100"
                                >
                                  <ArrowsUpDownIcon className="h-4 w-4" />
                                </div>
                                
                                <img
                                  src={event.featuredImage || '/placeholder-image.jpg'}
                                  alt={event.title}
                                  className="h-12 w-12 rounded-lg object-cover"
                                  onError={(e) => {
                                    e.target.src = '/placeholder-image.jpg';
                                  }}
                                />
                                
                                <div className="ml-3 flex-1 min-w-0">
                                  <div className="flex items-center gap-2">
                                    <h3 className="text-sm font-medium text-gray-900 truncate">
                                      {event.title}
                                    </h3>
                                    <span className={`inline-flex items-center px-1.5 py-0.5 rounded text-xs font-medium ${
                                      event.status === 'ongoing' 
                                        ? 'bg-green-100 text-green-800' 
                                        : 'bg-yellow-100 text-yellow-800'
                                    }`}>
                                      {event.status}
                                    </span>
                                  </div>
                                  <p className="text-xs text-gray-500 truncate">
                                    {event.date ? new Date(event.date).toLocaleDateString('en-US', {
                                      month: 'short',
                                      day: 'numeric',
                                      year: 'numeric'
                                    }) : 'Date TBD'}
                                  </p>
                                  <div className="flex items-center mt-1">
                                    <span className="text-xs text-gray-400 truncate">
                                      {event.hosterId?.companyName || 'No hoster'} • {event.venue?.split(',')[0] || 'Venue TBD'}
                                    </span>
                                  </div>
                                  {event.category && (
                                    <span className="inline-flex items-center mt-1 px-1.5 py-0.5 rounded text-xs bg-gray-100 text-gray-700">
                                      {event.category}
                                    </span>
                                  )}
                                </div>
                              </div>
                            </div>
                          )}
                        </Draggable>
                      ))
                    )}
                    {provided.placeholder}
                  </div>
                )}
              </Droppable>
              
              <div className="mt-6 p-4 bg-gray-50 rounded-lg">
                <p className="text-xs text-gray-500">
                  <span className="font-medium">Tips:</span>
                </p>
                <ul className="text-xs text-gray-500 mt-2 space-y-1">
                  <li>• Drag events to/from carousel to add/remove</li>
                  <li>• Reorder carousel events by dragging</li>
                  <li>• Maximum 10 events in carousel</li>
                  <li>• Only upcoming and ongoing events are available</li>
                  <li>• Use search to quickly find specific events</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </DragDropContext>
    </div>
  );
};

export default AdminCarousel;