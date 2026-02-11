import React, { useState, useEffect } from 'react';
import { PhotoIcon, ArrowsUpDownIcon, TrashIcon, EyeIcon } from '@heroicons/react/24/outline';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import axios from 'axios';
import toast from 'react-hot-toast';
import baseurl from '../Base/base';

const AdminCarousel = () => {
  const [events, setEvents] = useState([]);
  const [carouselEvents, setCarouselEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCarouselData();
  }, []);

  const fetchCarouselData = async () => {
    try {
      const token = localStorage.getItem('adminToken');
      const [carouselResponse, eventsResponse] = await Promise.all([
        axios.get(`${baseurl}/admin/carousel`),
        axios.get(`${baseurl}/admin/events?status=live&limit=100`, {
          headers: { Authorization: `Bearer ${token}` }
        })
      ]);

      const carouselEventIds = carouselResponse.data.events.map(e => e._id);
      const sortedCarousel = carouselEventIds.map(id => 
        carouselResponse.data.events.find(e => e._id === id)
      ).filter(e => e);
      
      setCarouselEvents(sortedCarousel);
      
      const now = new Date();
      const nonCarouselEvents = eventsResponse.data.events.filter(
        event => {
          const eventDate = new Date(event.date);
          return (
            !carouselEventIds.includes(event._id) && 
            eventDate >= now
          );
        }
      );
      setEvents(nonCarouselEvents);
    } catch (error) {
      toast.error('Failed to fetch data');
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveFromCarousel = async (eventId) => {
    try {
      const token = localStorage.getItem('adminToken');
      await axios.delete(`${baseurl}/admin/carousel/${eventId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      toast.success('Removed from carousel');
      fetchCarouselData();
    } catch (error) {
      toast.error('Failed to remove from carousel');
    }
  };

  const handleAddToCarousel = async (eventId) => {
    try {
      const token = localStorage.getItem('adminToken');
      await axios.post(`${baseurl}/admin/carousel`, {
        eventId: eventId
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });

      toast.success('Added to carousel');
      fetchCarouselData();
    } catch (error) {
      toast.error('Failed to add to carousel');
    }
  };

  const handleOnDragEnd = async (result) => {
    if (!result.destination) return;

    if (result.source.droppableId === 'events' && result.destination.droppableId === 'carousel') {
      const eventToAdd = events.find(event => event._id === result.draggableId);
      if (eventToAdd) {
        await handleAddToCarousel(eventToAdd._id);
      }
      return;
    }

    if (result.source.droppableId === 'carousel' && result.destination.droppableId === 'carousel') {
      const items = Array.from(carouselEvents);
      const [reorderedItem] = items.splice(result.source.index, 1);
      items.splice(result.destination.index, 0, reorderedItem);
      setCarouselEvents(items);

      try {
        const token = localStorage.getItem('adminToken');
        const orderData = {
          events: items.map((event, index) => ({
            eventId: event._id,
            position: index + 1
          }))
        };
        
        await axios.put(`${baseurl}/admin/carousel/order`, orderData, {
          headers: { Authorization: `Bearer ${token}` }
        });
        toast.success('Carousel order updated');
      } catch (error) {
        toast.error('Failed to update carousel order');
        fetchCarouselData();
      }
    }
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="animate-pulse space-y-8">
          <div className="h-8 bg-gray-200 rounded w-1/4"></div>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 h-64 bg-gray-200 rounded"></div>
            <div className="h-64 bg-gray-200 rounded"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Carousel Management</h1>
        <p className="text-gray-600">Drag and drop to manage featured events</p>
      </div>

      <DragDropContext onDragEnd={handleOnDragEnd}>
        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
              <h2 className="text-xl font-bold text-gray-900 mb-6">Carousel Events</h2>
              <Droppable droppableId="carousel">
                {(provided) => (
                  <div
                    {...provided.droppableProps}
                    ref={provided.innerRef}
                    className="space-y-4 min-h-[200px]"
                  >
                    {carouselEvents.map((event, index) => (
                      <Draggable key={event._id} draggableId={event._id} index={index}>
                        {(provided, snapshot) => (
                          <div
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            className={`bg-white border ${snapshot.isDragging ? 'border-blue-500 shadow-lg' : 'border-gray-200'} rounded-lg p-4 flex items-center justify-between transition-all duration-200`}
                          >
                            <div className="flex items-center flex-1">
                              <div
                                {...provided.dragHandleProps}
                                className="p-2 mr-4 text-gray-400 hover:text-gray-600 cursor-move"
                              >
                                <ArrowsUpDownIcon className="h-5 w-5" />
                              </div>
                              <img
                                src={event.featuredImage || '/placeholder-image.jpg'}
                                alt={event.title}
                                className="h-16 w-16 rounded-lg object-cover mr-4"
                                onError={(e) => {
                                  e.target.src = '/placeholder-image.jpg';
                                }}
                              />
                              <div className="flex-1">
                                <h3 className="font-medium text-gray-900">{event.title}</h3>
                                <p className="text-sm text-gray-500">
                                  {event.hosterId?.companyName} • {new Date(event.date).toLocaleDateString()}
                                </p>
                                <span className="text-xs text-blue-600 bg-blue-50 px-2 py-1 rounded mt-1">
                                  Position #{index + 1}
                                </span>
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
                                title="Remove"
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
            </div>
          </div>

          <div>
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-6">Available Events</h2>
              <Droppable droppableId="events">
                {(provided) => (
                  <div
                    {...provided.droppableProps}
                    ref={provided.innerRef}
                    className="space-y-4 max-h-[500px] overflow-y-auto pr-2"
                  >
                    {events.map((event, index) => (
                      <Draggable key={event._id} draggableId={event._id} index={index}>
                        {(provided, snapshot) => (
                          <div
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            className={`border ${snapshot.isDragging ? 'border-green-500 bg-green-50' : 'border-gray-200'} rounded-lg p-4 hover:border-blue-500 transition-all duration-200`}
                          >
                            <div className="flex items-center">
                              <div
                                {...provided.dragHandleProps}
                                className="p-1 mr-2 text-gray-400 hover:text-gray-600 cursor-move"
                              >
                                <ArrowsUpDownIcon className="h-4 w-4" />
                              </div>
                              <img
                                src={event.featuredImage || '/placeholder-image.jpg'}
                                alt={event.title}
                                className="h-12 w-12 rounded-lg object-cover mr-3"
                                onError={(e) => {
                                  e.target.src = '/placeholder-image.jpg';
                                }}
                              />
                              <div className="flex-1">
                                <h3 className="text-sm font-medium text-gray-900">{event.title}</h3>
                                <p className="text-xs text-gray-500">
                                  {new Date(event.date).toLocaleDateString()} • {event.venue}
                                </p>
                              </div>
                            </div>
                          </div>
                        )}
                      </Draggable>
                    ))}
                    {provided.placeholder}
                  </div>
                )}
              </Droppable>
            </div>
          </div>
        </div>
      </DragDropContext>
    </div>
  );
};

export default AdminCarousel;