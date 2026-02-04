import React, { useState, useEffect } from 'react';
import { 
  PhotoIcon,
  ArrowsUpDownIcon,
  StarIcon,
  EyeIcon,
  CheckCircleIcon,
  XCircleIcon,
  PlusIcon,
  TrashIcon
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
    try {
      const token = localStorage.getItem('adminToken');
      await axios.put(`${baseurl}/events/${event._id}`, {
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
      await axios.put(`${baseurl}/events/${eventId}`, {
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
    if (!result.destination) return;

    const items = Array.from(carouselEvents);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);

    setCarouselEvents(items);

    try {
      const token = localStorage.getItem('adminToken');
      await axios.put(`${baseurl}/events/carousel/order`, {
        order: items.map(event => event._id)
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });

      toast.success('Carousel order updated');
    } catch (error) {
      toast.error('Failed to update carousel order');
      fetchData();
    }
  };

  const handleSaveOrder = async () => {
    try {
      const token = localStorage.getItem('adminToken');
      await axios.put(`${baseurl}/events/carousel/order`, {
        order: carouselEvents.map(event => event._id)
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });

      toast.success('Carousel order saved');
    } catch (error) {
      toast.error('Failed to save carousel order');
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
        <p className="text-gray-600">Manage featured events displayed in the homepage carousel</p>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-gray-900">Carousel Events</h2>
              <div className="text-sm text-gray-500">
                Drag to reorder • {carouselEvents.length}/10 slots used
              </div>
            </div>

            {loading ? (
              <div className="space-y-4">
                {[1, 2, 3].map((n) => (
                  <div key={n} className="h-24 bg-gray-200 rounded animate-pulse"></div>
                ))}
              </div>
            ) : carouselEvents.length > 0 ? (
              <DragDropContext onDragEnd={handleOnDragEnd}>
                <Droppable droppableId="carousel">
                  {(provided) => (
                    <div
                      {...provided.droppableProps}
                      ref={provided.innerRef}
                      className="space-y-4"
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
                                      #{index + 1}
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
                    </div>
                  )}
                </Droppable>
              </DragDropContext>
            ) : (
              <div className="text-center py-12">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-100 mb-4">
                  <PhotoIcon className="h-8 w-8 text-gray-400" />
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">No carousel events</h3>
                <p className="text-gray-600">Add events to display in the homepage carousel</p>
              </div>
            )}

            {carouselEvents.length > 0 && (
              <div className="mt-6 pt-6 border-t">
                <button
                  onClick={handleSaveOrder}
                  className="btn-primary w-full"
                >
                  Save Carousel Order
                </button>
              </div>
            )}
          </div>
        </div>

        <div>
          <div className="bg-white rounded-xl shadow-lg p-6 sticky top-6">
            <h2 className="text-xl font-bold text-gray-900 mb-6">Add Events</h2>
            
            <div className="mb-6">
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search events..."
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-dubai-blue focus:border-transparent"
              />
            </div>

            <div className="space-y-4 max-h-[500px] overflow-y-auto">
              {filteredEvents.length > 0 ? (
                filteredEvents.map((event) => (
                  <div
                    key={event._id}
                    className="border border-gray-200 rounded-lg p-4 hover:border-dubai-blue transition-colors"
                  >
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center">
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
                      <button
                        onClick={() => handleAddToCarousel(event)}
                        disabled={carouselEvents.length >= 10}
                        className="p-2 bg-dubai-blue text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                        title="Add to carousel"
                      >
                        <PlusIcon className="h-4 w-4" />
                      </button>
                    </div>
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-gray-500">{event.venue}</span>
                      <span className={`px-2 py-1 rounded-full ${
                        event.status === 'upcoming' ? 'bg-green-100 text-green-800' :
                        event.status === 'ongoing' ? 'bg-blue-100 text-blue-800' : 'bg-gray-100 text-gray-800'
                      }`}>
                        {event.status}
                      </span>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-8">
                  <p className="text-gray-500">
                    {searchTerm ? 'No matching events found' : 'No events available to add'}
                  </p>
                </div>
              )}
            </div>

            <div className="mt-6 pt-6 border-t">
              <div className="space-y-3">
                <div className="flex items-center text-sm text-gray-600">
                  <CheckCircleIcon className="h-5 w-5 text-green-500 mr-2" />
                  <span>Maximum 10 events in carousel</span>
                </div>
                <div className="flex items-center text-sm text-gray-600">
                  <CheckCircleIcon className="h-5 w-5 text-green-500 mr-2" />
                  <span>Only upcoming events recommended</span>
                </div>
                <div className="flex items-center text-sm text-gray-600">
                  <CheckCircleIcon className="h-5 w-5 text-green-500 mr-2" />
                  <span>High-quality images required</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-8 bg-gradient-to-r from-blue-50 to-purple-50 rounded-2xl p-6">
        <h3 className="text-lg font-bold text-gray-900 mb-4">Carousel Guidelines</h3>
        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <h4 className="font-medium text-gray-900 mb-2">Best Practices</h4>
            <ul className="space-y-2 text-sm text-gray-600">
              <li className="flex items-start">
                <StarIcon className="h-4 w-4 text-dubai-gold mr-2 mt-0.5" />
                <span>Use high-resolution images (1920x1080 recommended)</span>
              </li>
              <li className="flex items-start">
                <StarIcon className="h-4 w-4 text-dubai-gold mr-2 mt-0.5" />
                <span>Featured events should have compelling descriptions</span>
              </li>
              <li className="flex items-start">
                <StarIcon className="h-4 w-4 text-dubai-gold mr-2 mt-0.5" />
                <span>Mix different categories for variety</span>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="font-medium text-gray-900 mb-2">Technical Notes</h4>
            <ul className="space-y-2 text-sm text-gray-600">
              <li className="flex items-start">
                <XCircleIcon className="h-4 w-4 text-red-500 mr-2 mt-0.5" />
                <span>Avoid low-quality or blurry images</span>
              </li>
              <li className="flex items-start">
                <XCircleIcon className="h-4 w-4 text-red-500 mr-2 mt-0.5" />
                <span>Don't add past events to carousel</span>
              </li>
              <li className="flex items-start">
                <XCircleIcon className="h-4 w-4 text-red-500 mr-2 mt-0.5" />
                <span>Keep text concise for mobile readability</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminCarousel;