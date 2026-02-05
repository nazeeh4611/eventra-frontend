import React, { useState, useEffect } from 'react';
import { 
  PhotoIcon,
  ArrowsUpDownIcon,
  StarIcon,
  EyeIcon,
  CheckCircleIcon,
  XCircleIcon,
  PlusIcon,
  TrashIcon,
  ArrowRightIcon,
  ArrowLeftIcon
} from '@heroicons/react/24/outline';
import axios from 'axios';
import toast from 'react-hot-toast';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import baseurl from '../Base/base';

const AdminCarousel = () => {
  const [events, setEvents] = useState([]);
  const [carouselEvents, setCarouselEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [draggingFromEvents, setDraggingFromEvents] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const token = localStorage.getItem('adminToken');
      const [eventsResponse, carouselResponse] = await Promise.all([
        axios.get(`${baseurl}/events?limit=50`, {
          headers: { Authorization: `Bearer ${token}` }
        }),
        axios.get(`${baseurl}/events/carousel`, {
          headers: { Authorization: `Bearer ${token}` }
        })
      ]);

      setEvents(eventsResponse.data.events);
      setCarouselEvents(carouselResponse.data.events);
    } catch (error) {
      toast.error('Failed to fetch data');
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCarousel = async (event) => {
    if (carouselEvents.length >= 10) {
      toast.error('Maximum 10 events allowed in carousel');
      return;
    }

    try {
      const token = localStorage.getItem('adminToken');
      
      await axios.put(`${baseurl}/events/${event._id}/carousel`, {
        isFeatured: true,
        carouselPosition: carouselEvents.length
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });

      toast.success('Added to carousel');
      fetchData();
    } catch (error) {
      toast.error('Failed to add to carousel');
    }
  };

  const handleRemoveFromCarousel = async (eventId) => {
    try {
      const token = localStorage.getItem('adminToken');
      
      await axios.put(`${baseurl}/events/${eventId}/carousel`, {
        isFeatured: false,
        carouselPosition: 0
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });

      toast.success('Removed from carousel');
      fetchData();
    } catch (error) {
      toast.error('Failed to remove from carousel');
    }
  };

  const handleOnDragEnd = async (result) => {
    if (!result.destination) {
      setDraggingFromEvents(false);
      return;
    }

    if (result.source.droppableId === 'events' && result.destination.droppableId === 'carousel') {
      const eventToAdd = events.find(event => event._id === result.draggableId);
      if (eventToAdd) {
        handleAddToCarousel(eventToAdd);
      }
      setDraggingFromEvents(false);
      return;
    }

    if (result.source.droppableId === 'carousel' && result.destination.droppableId === 'carousel') {
      const items = Array.from(carouselEvents);
      const [reorderedItem] = items.splice(result.source.index, 1);
      items.splice(result.destination.index, 0, reorderedItem);

      const updatedItems = items.map((item, index) => ({
        ...item,
        carouselPosition: index
      }));

      setCarouselEvents(updatedItems);

      try {
        const token = localStorage.getItem('adminToken');
        await axios.put(`${baseurl}/events/carousel/order`, {
          order: updatedItems.map(event => event._id)
        }, {
          headers: { Authorization: `Bearer ${token}` }
        });

        toast.success('Carousel order updated');
      } catch (error) {
        toast.error('Failed to update carousel order');
        fetchData();
      }
    }

    setDraggingFromEvents(false);
  };

  const handleOnDragStart = (start) => {
    if (start.source.droppableId === 'events') {
      setDraggingFromEvents(true);
    }
  };

  const filteredEvents = events.filter(event =>
    !carouselEvents.some(carouselEvent => carouselEvent._id === event._id) &&
    (event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
     event.venue.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Carousel Management</h1>
        <p className="text-gray-600">Drag events from the right panel or click + button to add to carousel</p>
      </div>

      <DragDropContext onDragEnd={handleOnDragEnd} onDragStart={handleOnDragStart}>
        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-xl font-bold text-gray-900">Carousel Events</h2>
                  <p className="text-sm text-gray-500 mt-1">
                    Drag events here from the right panel or reorder them below
                  </p>
                </div>
                <div className="text-sm text-gray-500 bg-gray-50 px-3 py-2 rounded-lg">
                  <span className="font-medium">{carouselEvents.length}</span>/10 events
                </div>
              </div>

              {loading ? (
                <div className="space-y-4">
                  {[1, 2, 3].map((n) => (
                    <div key={n} className="h-24 bg-gray-200 rounded animate-pulse"></div>
                  ))}
                </div>
              ) : carouselEvents.length > 0 ? (
                <Droppable droppableId="carousel">
                  {(provided, snapshot) => (
                    <div
                      {...provided.droppableProps}
                      ref={provided.innerRef}
                      className={`space-y-4 min-h-[200px] ${snapshot.isDraggingOver ? 'bg-blue-50 rounded-lg p-4 border-2 border-dashed border-blue-300' : ''}`}
                    >
                      {carouselEvents.map((event, index) => (
                        <Draggable key={event._id} draggableId={event._id} index={index}>
                          {(provided) => (
                            <div
                              ref={provided.innerRef}
                              {...provided.draggableProps}
                              className="bg-white border border-gray-200 rounded-lg p-4 flex items-center justify-between hover:shadow-md transition-shadow"
                            >
                              <div className="flex items-center flex-1">
                                <div
                                  {...provided.dragHandleProps}
                                  className="p-2 mr-4 text-gray-400 hover:text-gray-600 cursor-move"
                                >
                                  <ArrowsUpDownIcon className="h-5 w-5" />
                                </div>
                                <div className="h-16 w-16 rounded-lg overflow-hidden flex-shrink-0 mr-4">
                                  <img
                                    src={event.featuredImage}
                                    alt={event.title}
                                    className="h-full w-full object-cover"
                                  />
                                </div>
                                <div className="flex-1">
                                  <div className="flex items-center mb-1">
                                    <span className="text-sm font-medium px-2 py-1 bg-dubai-blue/10 text-dubai-blue rounded mr-2">
                                      Position #{index + 1}
                                    </span>
                                    <h3 className="font-medium text-gray-900">{event.title}</h3>
                                  </div>
                                  <div className="text-sm text-gray-500">
                                    {event.venue} • {new Date(event.date).toLocaleDateString()}
                                  </div>
                                </div>
                              </div>
                              <div className="flex items-center space-x-2">
                                <a
                                  href={`/events/${event._id}`}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="p-2 text-gray-400 hover:text-blue-600"
                                  title="View"
                                >
                                  <EyeIcon className="h-5 w-5" />
                                </a>
                                <button
                                  onClick={() => handleRemoveFromCarousel(event._id)}
                                  className="p-2 text-gray-400 hover:text-red-600"
                                  title="Remove from carousel"
                                >
                                  <TrashIcon className="h-5 w-5" />
                                </button>
                              </div>
                            </div>
                          )}
                        </Draggable>
                      ))}
                      {provided.placeholder}
                      
                      {carouselEvents.length === 0 && (
                        <div className="text-center py-12 border-2 border-dashed border-gray-300 rounded-lg">
                          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-100 mb-4">
                            <ArrowLeftIcon className="h-8 w-8 text-gray-400" />
                          </div>
                          <h3 className="text-lg font-medium text-gray-900 mb-2">Drag events here</h3>
                          <p className="text-gray-600">Drag events from the right panel or click + buttons</p>
                        </div>
                      )}
                    </div>
                  )}
                </Droppable>
              ) : (
                <Droppable droppableId="carousel">
                  {(provided, snapshot) => (
                    <div
                      {...provided.droppableProps}
                      ref={provided.innerRef}
                      className={`text-center py-12 border-2 border-dashed ${snapshot.isDraggingOver ? 'border-blue-500 bg-blue-50' : 'border-gray-300'} rounded-lg ${draggingFromEvents ? 'animate-pulse bg-blue-50' : ''}`}
                    >
                      <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-100 mb-4">
                        {draggingFromEvents ? (
                          <ArrowLeftIcon className="h-8 w-8 text-blue-500 animate-bounce" />
                        ) : (
                          <PhotoIcon className="h-8 w-8 text-gray-400" />
                        )}
                      </div>
                      <h3 className="text-lg font-medium text-gray-900 mb-2">
                        {draggingFromEvents ? 'Drop event here' : 'No carousel events'}
                      </h3>
                      <p className="text-gray-600">
                        {draggingFromEvents 
                          ? 'Release to add to carousel' 
                          : 'Drag events from the right panel or click + buttons'}
                      </p>
                    </div>
                  )}
                </Droppable>
              )}
            </div>
          </div>

          <div>
            <div className="bg-white rounded-xl shadow-lg p-6 sticky top-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-gray-900">Available Events</h2>
                <div className="text-sm text-gray-500">
                  {filteredEvents.length} available
                </div>
              </div>
              
              <div className="mb-6">
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Search events by title or venue..."
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-dubai-blue focus:border-transparent"
                />
              </div>

              <Droppable droppableId="events">
                {(provided) => (
                  <div
                    {...provided.droppableProps}
                    ref={provided.innerRef}
                    className="space-y-4 max-h-[500px] overflow-y-auto pr-2"
                  >
                    {filteredEvents.length > 0 ? (
                      filteredEvents.map((event, index) => (
                        <Draggable key={event._id} draggableId={event._id} index={index}>
                          {(provided) => (
                            <div
                              ref={provided.innerRef}
                              {...provided.draggableProps}
                              className="border border-gray-200 rounded-lg p-4 hover:border-dubai-blue transition-colors group relative"
                            >
                              <div className="flex items-center justify-between mb-3">
                                <div className="flex items-center">
                                  <div 
                                    {...provided.dragHandleProps}
                                    className="p-1 mr-2 text-gray-400 hover:text-gray-600 cursor-move opacity-0 group-hover:opacity-100 transition-opacity"
                                    title="Drag to carousel"
                                  >
                                    <ArrowsUpDownIcon className="h-4 w-4" />
                                  </div>
                                  <div className="h-12 w-12 rounded-lg overflow-hidden mr-3">
                                    <img
                                      src={event.featuredImage}
                                      alt={event.title}
                                      className="h-full w-full object-cover"
                                    />
                                  </div>
                                  <div>
                                    <h3 className="font-medium text-gray-900 text-sm line-clamp-1">
                                      {event.title}
                                    </h3>
                                    <p className="text-xs text-gray-500">
                                      {new Date(event.date).toLocaleDateString()}
                                    </p>
                                  </div>
                                </div>
                                <div className="flex items-center space-x-2">
                                  <button
                                    onClick={() => handleAddToCarousel(event)}
                                    disabled={carouselEvents.length >= 10}
                                    className="p-2 bg-dubai-blue text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center space-x-1"
                                    title="Add to carousel"
                                  >
                                    <PlusIcon className="h-4 w-4" />
                                    <span className="text-xs">Add</span>
                                  </button>
                                </div>
                              </div>
                              <div className="flex items-center justify-between text-xs">
                                <span className="text-gray-500 truncate max-w-[120px]">{event.venue}</span>
                                <span className={`px-2 py-1 rounded-full flex-shrink-0 ${
                                  event.status === 'upcoming' ? 'bg-green-100 text-green-800' :
                                  event.status === 'ongoing' ? 'bg-blue-100 text-blue-800' : 'bg-gray-100 text-gray-800'
                                }`}>
                                  {event.status}
                                </span>
                              </div>
                            </div>
                          )}
                        </Draggable>
                      ))
                    ) : (
                      <div className="text-center py-8 border-2 border-dashed border-gray-300 rounded-lg">
                        <p className="text-gray-500">
                          {searchTerm ? 'No matching events found' : 'All events are in carousel'}
                        </p>
                        <p className="text-sm text-gray-400 mt-2">
                          Remove some events from carousel to add new ones
                        </p>
                      </div>
                    )}
                    {provided.placeholder}
                  </div>
                )}
              </Droppable>

              <div className="mt-6 pt-6 border-t">
                <div className="space-y-3">
                  <div className="flex items-center text-sm text-gray-600">
                    <CheckCircleIcon className="h-5 w-5 text-green-500 mr-2 flex-shrink-0" />
                    <span>Drag events or click <PlusIcon className="h-3 w-3 inline ml-1" /> button to add</span>
                  </div>
                  <div className="flex items-center text-sm text-gray-600">
                    <CheckCircleIcon className="h-5 w-5 text-green-500 mr-2 flex-shrink-0" />
                    <span>Drag handles <ArrowsUpDownIcon className="h-3 w-3 inline ml-1" /> appear on hover</span>
                  </div>
                  <div className="flex items-center text-sm text-gray-600">
                    <CheckCircleIcon className="h-5 w-5 text-green-500 mr-2 flex-shrink-0" />
                    <span>Drag carousel events to reorder positions</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </DragDropContext>

      <div className="mt-8 bg-gradient-to-r from-blue-50 to-purple-50 rounded-2xl p-6">
        <h3 className="text-lg font-bold text-gray-900 mb-4">How to Manage Carousel</h3>
        <div className="grid md:grid-cols-3 gap-6">
          <div className="bg-white p-4 rounded-lg">
            <div className="flex items-center mb-3">
              <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center mr-3">
                <span className="text-blue-600 font-bold">1</span>
              </div>
              <h4 className="font-medium text-gray-900">Drag & Drop</h4>
            </div>
            <p className="text-sm text-gray-600">
              Drag events from the right panel and drop them into the carousel area. Look for the drag handle icon <ArrowsUpDownIcon className="h-3 w-3 inline" /> when hovering over events.
            </p>
          </div>
          <div className="bg-white p-4 rounded-lg">
            <div className="flex items-center mb-3">
              <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center mr-3">
                <span className="text-blue-600 font-bold">2</span>
              </div>
              <h4 className="font-medium text-gray-900">Quick Add</h4>
            </div>
            <p className="text-sm text-gray-600">
              Click the blue <PlusIcon className="h-3 w-3 inline" /> button on any event in the right panel to instantly add it to the carousel.
            </p>
          </div>
          <div className="bg-white p-4 rounded-lg">
            <div className="flex items-center mb-3">
              <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center mr-3">
                <span className="text-blue-600 font-bold">3</span>
              </div>
              <h4 className="font-medium text-gray-900">Reorder</h4>
            </div>
            <p className="text-sm text-gray-600">
              Drag carousel events up or down to change their display order. The position number updates automatically.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminCarousel;