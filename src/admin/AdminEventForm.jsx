import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  ArrowLeftIcon,
  PhotoIcon,
  CalendarDaysIcon,
  MapPinIcon,
  CurrencyDollarIcon,
  UserGroupIcon,
  CloudArrowUpIcon,
  XMarkIcon
} from '@heroicons/react/24/outline';
import axios from 'axios';
import toast from 'react-hot-toast';
import baseurl from '../Base/base';

const AdminEventForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEditMode = !!id;

  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [previewImages, setPreviewImages] = useState([]);

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    shortDescription: '',
    venue: '',
    location: '',
    date: '',
    time: '',
    category: '',
    price: '',
    capacity: '',
    organizer: '',
    contactEmail: '',
    contactPhone: '',
    tags: '',
    isFeatured: false,
    status: 'upcoming',
    existingImages: [],
    featuredImageIndex: 0
  });

  useEffect(() => {
    if (isEditMode) {
      fetchEventData();
    }
  }, [id]);

  const fetchEventData = async () => {
    try {
      const token = localStorage.getItem('adminToken');
      const response = await axios.get(`${baseurl}/events/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      const event = response.data.event;
      const featuredIndex = event.images.indexOf(event.featuredImage);
      
      setFormData({
        title: event.title,
        description: event.description,
        shortDescription: event.shortDescription,
        venue: event.venue,
        location: event.location,
        date: new Date(event.date).toISOString().split('T')[0],
        time: event.time,
        category: event.category,
        price: event.price,
        capacity: event.capacity,
        organizer: event.organizer,
        contactEmail: event.contactEmail,
        contactPhone: event.contactPhone,
        tags: event.tags.join(', '),
        isFeatured: event.isFeatured,
        status: event.status,
        existingImages: event.images || [],
        featuredImageIndex: featuredIndex >= 0 ? featuredIndex : 0
      });

      setPreviewImages(event.images || []);
    } catch (error) {
      toast.error('Failed to load event data');
      navigate('/admin/events');
    }
  };

  const handleFileSelect = (files) => {
    const fileArray = Array.from(files);
    setSelectedFiles(prev => [...prev, ...fileArray]);
    
    const newPreviews = fileArray.map(file => URL.createObjectURL(file));
    setPreviewImages(prev => [...prev, ...newPreviews]);
  };

  const handleImageRemove = (index) => {
    const isExistingImage = index < formData.existingImages.length;
    
    if (isExistingImage) {
      const newExistingImages = [...formData.existingImages];
      newExistingImages.splice(index, 1);
      setFormData(prev => ({
        ...prev,
        existingImages: newExistingImages,
        featuredImageIndex: prev.featuredImageIndex >= newExistingImages.length ? 0 : prev.featuredImageIndex
      }));
    } else {
      const newFileIndex = index - formData.existingImages.length;
      const newSelectedFiles = [...selectedFiles];
      newSelectedFiles.splice(newFileIndex, 1);
      setSelectedFiles(newSelectedFiles);
    }
    
    const newPreviews = [...previewImages];
    newPreviews.splice(index, 1);
    setPreviewImages(newPreviews);
  };

  const handleSetFeatured = (index) => {
    setFormData(prev => ({
      ...prev,
      featuredImageIndex: index
    }));
    toast.success('Set as featured image');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const token = localStorage.getItem('adminToken');
      const submitData = new FormData();
      
      submitData.append('title', formData.title);
      submitData.append('description', formData.description);
      submitData.append('shortDescription', formData.shortDescription);
      submitData.append('venue', formData.venue);
      submitData.append('location', formData.location);
      submitData.append('date', formData.date);
      submitData.append('time', formData.time);
      submitData.append('category', formData.category);
      submitData.append('price', formData.price);
      submitData.append('capacity', formData.capacity);
      submitData.append('organizer', formData.organizer);
      submitData.append('contactEmail', formData.contactEmail);
      submitData.append('contactPhone', formData.contactPhone);
      submitData.append('tags', formData.tags);
      submitData.append('isFeatured', formData.isFeatured);
      submitData.append('status', formData.status);
      submitData.append('featuredImageIndex', formData.featuredImageIndex);
      
      formData.existingImages.forEach(img => {
        submitData.append('existingImages', img);
      });
      
      selectedFiles.forEach(file => {
        submitData.append('images', file);
      });

      if (isEditMode) {
        await axios.put(`${baseurl}/events/${id}`, submitData, {
          headers: { 
            Authorization: `Bearer ${token}`,
            'Content-Type': 'multipart/form-data'
          }
        });
        toast.success('Event updated successfully');
      } else {
        await axios.post(`${baseurl}/events`, submitData, {
          headers: { 
            Authorization: `Bearer ${token}`,
            'Content-Type': 'multipart/form-data'
          }
        });
        toast.success('Event created successfully');
      }

      navigate('/admin/events');
    } catch (error) {
      toast.error(error.response?.data?.error || 'Operation failed');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const categories = [
    'Business',
    'Technology',
    'Music',
    'Sports',
    'Arts & Culture',
    'Food & Drink',
    'Networking',
    'Entertainment',
    'Education',
    'Lifestyle',
    'Health & Wellness',
    'Charity'
  ];

  return (
    <div>
      <div className="mb-8">
        <button
          onClick={() => navigate('/admin/events')}
          className="inline-flex items-center text-dubai-blue hover:text-blue-700 mb-6"
        >
          <ArrowLeftIcon className="h-5 w-5 mr-2" />
          Back to Events
        </button>
        <h1 className="text-3xl font-bold text-gray-900">
          {isEditMode ? 'Edit Event' : 'Create New Event'}
        </h1>
        <p className="text-gray-600">
          {isEditMode ? 'Update event details' : 'Add a new event to the platform'}
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        <div className="bg-white rounded-xl shadow-lg p-8">
          <h2 className="text-xl font-bold text-gray-900 mb-6">Basic Information</h2>
          
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Event Title *
              </label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-dubai-blue focus:border-transparent"
                placeholder="Enter event title"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Category *
              </label>
              <select
                name="category"
                value={formData.category}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-dubai-blue focus:border-transparent"
              >
                <option value="">Select a category</option>
                {categories.map(category => (
                  <option key={category} value={category}>{category}</option>
                ))}
              </select>
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Short Description *
              </label>
              <input
                type="text"
                name="shortDescription"
                value={formData.shortDescription}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-dubai-blue focus:border-transparent"
                placeholder="Brief description for cards and listings"
                maxLength="150"
              />
              <p className="mt-1 text-sm text-gray-500">
                {formData.shortDescription.length}/150 characters
              </p>
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Full Description *
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                required
                rows="6"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-dubai-blue focus:border-transparent"
                placeholder="Detailed description of the event..."
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Tags
              </label>
              <input
                type="text"
                name="tags"
                value={formData.tags}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-dubai-blue focus:border-transparent"
                placeholder="e.g., conference, networking, luxury"
              />
              <p className="mt-1 text-sm text-gray-500">
                Separate tags with commas
              </p>
            </div>

            <div className="flex items-center space-x-4">
              <div className="flex items-center">
                <input
                  type="checkbox"
                  name="isFeatured"
                  checked={formData.isFeatured}
                  onChange={handleChange}
                  className="h-4 w-4 text-dubai-blue rounded"
                />
                <label className="ml-2 text-sm text-gray-700">
                  Featured Event
                </label>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-8">
          <h2 className="text-xl font-bold text-gray-900 mb-6">Date & Time</h2>
          
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <CalendarDaysIcon className="h-4 w-4 inline mr-1" />
                Date *
              </label>
              <input
                type="date"
                name="date"
                value={formData.date}
                onChange={handleChange}
                required
                min={new Date().toISOString().split('T')[0]}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-dubai-blue focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Time *
              </label>
              <input
                type="time"
                name="time"
                value={formData.time}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-dubai-blue focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Status *
              </label>
              <select
                name="status"
                value={formData.status}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-dubai-blue focus:border-transparent"
              >
                <option value="upcoming">Upcoming</option>
                <option value="ongoing">Ongoing</option>
                <option value="completed">Completed</option>
                <option value="cancelled">Cancelled</option>
              </select>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-8">
          <h2 className="text-xl font-bold text-gray-900 mb-6">Location</h2>
          
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <MapPinIcon className="h-4 w-4 inline mr-1" />
                Venue Name *
              </label>
              <input
                type="text"
                name="venue"
                value={formData.venue}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-dubai-blue focus:border-transparent"
                placeholder="e.g., Dubai World Trade Centre"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Location *
              </label>
              <input
                type="text"
                name="location"
                value={formData.location}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-dubai-blue focus:border-transparent"
                placeholder="e.g., Dubai, UAE"
              />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-8">
          <h2 className="text-xl font-bold text-gray-900 mb-6">Pricing & Capacity</h2>
          
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <CurrencyDollarIcon className="h-4 w-4 inline mr-1" />
                Price (AED) *
              </label>
              <input
                type="number"
                name="price"
                value={formData.price}
                onChange={handleChange}
                required
                min="0"
                step="0.01"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-dubai-blue focus:border-transparent"
                placeholder="0.00"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <UserGroupIcon className="h-4 w-4 inline mr-1" />
                Capacity *
              </label>
              <input
                type="number"
                name="capacity"
                value={formData.capacity}
                onChange={handleChange}
                required
                min="1"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-dubai-blue focus:border-transparent"
                placeholder="Maximum attendees"
              />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-8">
          <h2 className="text-xl font-bold text-gray-900 mb-6">Organizer Information</h2>
          
          <div className="grid md:grid-cols-3 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Organizer Name *
              </label>
              <input
                type="text"
                name="organizer"
                value={formData.organizer}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-dubai-blue focus:border-transparent"
                placeholder="Organization name"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Contact Email *
              </label>
              <input
                type="email"
                name="contactEmail"
                value={formData.contactEmail}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-dubai-blue focus:border-transparent"
                placeholder="contact@example.com"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Contact Phone *
              </label>
              <input
                type="tel"
                name="contactPhone"
                value={formData.contactPhone}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-dubai-blue focus:border-transparent"
                placeholder="+971 50 123 4567"
              />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-8">
          <h2 className="text-xl font-bold text-gray-900 mb-6">Event Images</h2>
          
          <div className="space-y-6">
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
              <CloudArrowUpIcon className="mx-auto h-12 w-12 text-gray-400" />
              <div className="mt-4">
                <label className="cursor-pointer">
                  <span className="btn-primary inline-flex items-center">
                    <PhotoIcon className="h-5 w-5 mr-2" />
                    Upload Images
                  </span>
                  <input
                    type="file"
                    multiple
                    accept="image/*"
                    onChange={(e) => {
                      const files = Array.from(e.target.files);
                      if (files.length > 0) {
                        handleFileSelect(files);
                      }
                    }}
                    className="hidden"
                  />
                </label>
                <p className="mt-2 text-sm text-gray-500">
                  PNG, JPG, GIF up to 10MB each
                </p>
              </div>
            </div>

            {previewImages.length > 0 && (
              <div>
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-medium text-gray-900">
                    Uploaded Images ({previewImages.length})
                  </h3>
                  <div className="text-sm text-gray-500">
                    Click star to set as featured
                  </div>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
                  {previewImages.map((image, index) => (
                    <div key={index} className="relative group">
                      <img
                        src={image}
                        alt={`Preview ${index + 1}`}
                        className="w-full h-32 object-cover rounded-lg"
                      />
                      <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg flex items-center justify-center space-x-2">
                        <button
                          type="button"
                          onClick={() => handleSetFeatured(index)}
                          className={`p-2 rounded-full ${
                            formData.featuredImageIndex === index
                              ? 'bg-yellow-500 text-white'
                              : 'bg-white/80 text-gray-900 hover:bg-white'
                          }`}
                          title={formData.featuredImageIndex === index ? 'Featured' : 'Set as featured'}
                        >
                          ★
                        </button>
                        <button
                          type="button"
                          onClick={() => handleImageRemove(index)}
                          className="p-2 bg-white/80 text-red-600 rounded-full hover:bg-white"
                          title="Remove"
                        >
                          <XMarkIcon className="h-4 w-4" />
                        </button>
                      </div>
                      {formData.featuredImageIndex === index && (
                        <div className="absolute top-2 left-2 bg-yellow-500 text-white text-xs px-2 py-1 rounded">
                          Featured
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="flex justify-end space-x-4">
          <button
            type="button"
            onClick={() => navigate('/admin/events')}
            className="px-6 py-3 border-2 border-gray-300 text-gray-700 font-semibold rounded-lg hover:bg-gray-50 transition duration-300"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={loading}
            className="btn-primary px-8 py-3 disabled:opacity-50"
          >
            {loading ? 'Saving...' : isEditMode ? 'Update Event' : 'Create Event'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AdminEventForm;