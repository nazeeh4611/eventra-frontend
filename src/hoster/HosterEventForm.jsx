import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  ArrowLeftIcon,
  PhotoIcon,
  CalendarDaysIcon,
  MapPinIcon,
  CurrencyDollarIcon,
  UserGroupIcon,
  CloudArrowUpIcon,
  XMarkIcon,
  CheckIcon
} from '@heroicons/react/24/outline';
import axios from 'axios';
import toast from 'react-hot-toast';
import baseurl from '../Base/base';

const HosterEventForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEditMode = !!id;
  const fileInputRef = useRef(null);
  const canvasRef = useRef(null);
  const imageRef = useRef(null);

  const [loading, setLoading] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [previewImages, setPreviewImages] = useState([]);
  const [showCropper, setShowCropper] = useState(false);
  const [currentCropImage, setCurrentCropImage] = useState(null);
  const [cropIndex, setCropIndex] = useState(null);

  // cropData is in *image natural coordinates*
  const [cropData, setCropData] = useState({
    x: 0,
    y: 0,
    width: 400,
    height: 500,
    naturalWidth: 0,
    naturalHeight: 0
  });

  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [isResizing, setIsResizing] = useState(false);
  const [resizeDirection, setResizeDirection] = useState(null);

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
    contactEmail: '',
    contactPhone: '',
    tags: '',
    status: 'upcoming',
    existingImages: [],
    featuredImageIndex: 0,
    musicGenres: '',
    musicArtists: ''
  });

  const categories = [
    'Business', 'Technology', 'Music', 'Sports', 'Arts & Culture',
    'Food & Drink', 'Networking', 'Entertainment', 'Education',
    'Lifestyle', 'Health & Wellness', 'Charity'
  ];

  const statusOptions = [
    { value: 'upcoming', label: 'Upcoming' },
    { value: 'live', label: 'Live' },
    { value: 'ongoing', label: 'Ongoing' },
    { value: 'completed', label: 'Completed' },
    { value: 'cancelled', label: 'Cancelled' }
  ];

  useEffect(() => {
    if (isEditMode) {
      fetchEventData();
    }
  }, [id]);

  const fetchEventData = async () => {
    try {
      const token = localStorage.getItem('hosterToken');
      const response = await axios.get(`${baseurl}/hoster/events/${id}`, {
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
        contactEmail: event.contactEmail,
        contactPhone: event.contactPhone,
        tags: event.tags?.join(', ') || '',
        status: event.status,
        existingImages: event.images || [],
        featuredImageIndex: featuredIndex >= 0 ? featuredIndex : 0,
        musicGenres: event.musicGenres?.join(', ') || 'BOLLYWOOD, SOUTH, TECHNO',
        musicArtists: event.musicArtists?.join(', ') || 'ALASANDRA, VIPIN, TORTA'
      });

      setPreviewImages(event.images || []);
    } catch (error) {
      toast.error('Failed to load event data');
      navigate('/hoster/events');
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

  const handleCropImage = (index) => {
    setCurrentCropImage(previewImages[index]);
    setCropIndex(index);
    setShowCropper(true);
    
    const img = new Image();
    img.src = previewImages[index];
    img.onload = () => {
      const aspectRatio = 4 / 5;
      let width, height;
      
      if (img.width / img.height > aspectRatio) {
        height = img.height;
        width = height * aspectRatio;
      } else {
        width = img.width;
        height = width / aspectRatio;
      }
      
      setCropData({
        x: (img.width - width) / 2,
        y: (img.height - height) / 2,
        width,
        height,
        naturalWidth: img.width,
        naturalHeight: img.height
      });

      // initial canvas preview
      requestAnimationFrame(() => {
        updateCanvas({
          x: (img.width - width) / 2,
          y: (img.height - height) / 2,
          width,
          height,
          naturalWidth: img.width,
          naturalHeight: img.height
        });
      });
    };
  };

  // Map client coords to image *natural* coords
  const clientToImageCoords = (clientX, clientY) => {
    if (!imageRef.current) return { x: 0, y: 0 };

    const rect = imageRef.current.getBoundingClientRect();
    const { naturalWidth, naturalHeight } = cropData;

    const scaleX = naturalWidth / rect.width;
    const scaleY = naturalHeight / rect.height;

    let x = (clientX - rect.left) * scaleX;
    let y = (clientY - rect.top) * scaleY;

    // clamp
    x = Math.max(0, Math.min(x, naturalWidth));
    y = Math.max(0, Math.min(y, naturalHeight));

    return { x, y };
  };

  const handleMouseDown = (e, type = 'move') => {
    e.preventDefault();
    if (!imageRef.current) return;

    const { x, y } = clientToImageCoords(e.clientX, e.clientY);

    if (type === 'move') {
      setIsDragging(true);
      setDragStart({
        x: x - cropData.x,
        y: y - cropData.y
      });
    } else {
      setIsResizing(true);
      setResizeDirection(type);
    }
  };

  const handleMouseMove = (e) => {
    if (!imageRef.current) return;

    const { x: imgX, y: imgY } = clientToImageCoords(e.clientX, e.clientY);

    if (isDragging) {
      const newX = imgX - dragStart.x;
      const newY = imgY - dragStart.y;

      setCropData(prev => {
        const updated = {
          ...prev,
          x: Math.max(0, Math.min(newX, prev.naturalWidth - prev.width)),
          y: Math.max(0, Math.min(newY, prev.naturalHeight - prev.height))
        };
        updateCanvas(updated);
        return updated;
      });
    } else if (isResizing) {
      setCropData(prev => {
        let { x, y, width, height } = prev;
        const aspectRatio = 4 / 5;

        if (resizeDirection.includes('right')) {
          const newWidth = imgX - x;
          if (newWidth > 50 && x + newWidth <= prev.naturalWidth) {
            width = newWidth;
            height = width / aspectRatio;
            if (y + height > prev.naturalHeight) {
              height = prev.naturalHeight - y;
              width = height * aspectRatio;
            }
          }
        }
        if (resizeDirection.includes('bottom')) {
          const newHeight = imgY - y;
          if (newHeight > 50 && y + newHeight <= prev.naturalHeight) {
            height = newHeight;
            width = height * aspectRatio;
            if (x + width > prev.naturalWidth) {
              width = prev.naturalWidth - x;
              height = width / aspectRatio;
            }
          }
        }
        if (resizeDirection.includes('left')) {
          const newWidth = width + (x - imgX);
          if (newWidth > 50 && imgX >= 0) {
            width = newWidth;
            x = imgX;
            height = width / aspectRatio;
            if (y + height > prev.naturalHeight) {
              height = prev.naturalHeight - y;
              width = height * aspectRatio;
              x = prev.x + prev.width - width;
            }
          }
        }
        if (resizeDirection.includes('top')) {
          const newHeight = height + (y - imgY);
          if (newHeight > 50 && imgY >= 0) {
            height = newHeight;
            y = imgY;
            width = height * aspectRatio;
            if (x + width > prev.naturalWidth) {
              width = prev.naturalWidth - x;
              height = width / aspectRatio;
              y = prev.y + prev.height - height;
            }
          }
        }

        // clamp final box
        x = Math.max(0, Math.min(x, prev.naturalWidth - width));
        y = Math.max(0, Math.min(y, prev.naturalHeight - height));

        const updated = {
          ...prev,
          x,
          y,
          width,
          height
        };
        updateCanvas(updated);
        return updated;
      });
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
    setIsResizing(false);
    setResizeDirection(null);
  };

  const updateCanvas = (data = cropData) => {
    if (!canvasRef.current || !imageRef.current) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');

    canvas.width = 800;
    canvas.height = 1000;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(
      imageRef.current,
      data.x,
      data.y,
      data.width,
      data.height,
      0,
      0,
      800,
      1000
    );
  };

  const handleCropComplete = () => {
    if (!imageRef.current || !canvasRef.current) return;

    const canvas = canvasRef.current;
    const data = cropData;

    // Make sure canvas has the latest crop area
    updateCanvas(data);

    canvas.toBlob((blob) => {
      if (!blob) {
        toast.error('Failed to crop image');
        return;
      }

      const croppedFile = new File([blob], `cropped-${Date.now()}.jpg`, { type: 'image/jpeg' });
      const croppedImageUrl = URL.createObjectURL(blob);
      
      const isExistingImage = cropIndex < formData.existingImages.length;
      
      if (isExistingImage) {
        const newExistingImages = [...formData.existingImages];
        newExistingImages[cropIndex] = croppedImageUrl;
        setFormData(prev => ({
          ...prev,
          existingImages: newExistingImages
        }));
      } else {
        const fileIndex = cropIndex - formData.existingImages.length;
        const newSelectedFiles = [...selectedFiles];
        newSelectedFiles[fileIndex] = croppedFile;
        setSelectedFiles(newSelectedFiles);
      }

      const newPreviews = [...previewImages];
      newPreviews[cropIndex] = croppedImageUrl;
      setPreviewImages(newPreviews);
      
      setShowCropper(false);
      setCurrentCropImage(null);
      setCropIndex(null);
      toast.success('Image cropped successfully');
    }, 'image/jpeg', 0.9);
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

    if (!formData.title || !formData.description || !formData.shortDescription || 
        !formData.venue || !formData.location || !formData.date || !formData.time || 
        !formData.category || !formData.price || !formData.capacity || 
        !formData.contactEmail || !formData.contactPhone) {
      toast.error('Please fill in all required fields');
      setLoading(false);
      return;
    }

    if (previewImages.length === 0) {
      toast.error('Please upload at least one image');
      setLoading(false);
      return;
    }

    const selectedDate = new Date(formData.date);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    if (selectedDate < today) {
      toast.error('Event date cannot be in the past');
      setLoading(false);
      return;
    }

    try {
      const token = localStorage.getItem('hosterToken');
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
      submitData.append('contactEmail', formData.contactEmail);
      submitData.append('contactPhone', formData.contactPhone);
      submitData.append('tags', formData.tags);
      submitData.append('status', formData.status);
      submitData.append('featuredImageIndex', formData.featuredImageIndex);
      submitData.append('musicGenres', formData.musicGenres);
      submitData.append('musicArtists', formData.musicArtists);
      
      formData.existingImages.forEach(img => {
        if (img.startsWith('blob:')) {
          submitData.append('croppedImages', img);
        } else {
          submitData.append('existingImages', img);
        }
      });
      
      selectedFiles.forEach(file => {
        submitData.append('images', file);
      });

      if (isEditMode) {
        await axios.put(`${baseurl}/hoster/events/${id}`, submitData, {
          headers: { 
            Authorization: `Bearer ${token}`,
            'Content-Type': 'multipart/form-data'
          }
        });
        toast.success('Event updated successfully');
      } else {
        await axios.post(`${baseurl}/hoster/events`, submitData, {
          headers: { 
            Authorization: `Bearer ${token}`,
            'Content-Type': 'multipart/form-data'
          }
        });
        toast.success('Event created successfully');
      }

      navigate('/hoster/events');
    } catch (error) {
      toast.error(error.response?.data?.error || 'Operation failed');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  return (
    <div>
      {showCropper && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-4"
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
        >
          <div className="bg-white rounded-2xl w-full max-w-6xl p-6">
            <div className="flex justify-between items-center mb-4">
              <div>
                <h3 className="text-xl font-bold text-gray-900">Crop Image for Card</h3>
                <p className="text-sm text-gray-500">Maintain 4:5 aspect ratio for perfect card display</p>
              </div>
              <button
                onClick={() => setShowCropper(false)}
                className="p-2 hover:bg-gray-100 rounded-full"
              >
                <XMarkIcon className="h-6 w-6 text-gray-500" />
              </button>
            </div>
            
            <div className="flex gap-6">
              <div className="relative flex-1 bg-gray-900 rounded-lg overflow-hidden" style={{ height: '600px' }}>
                <img
                  ref={imageRef}
                  src={currentCropImage}
                  alt="Crop"
                  className="absolute inset-0 w-full h-full object-contain"
                  crossOrigin="anonymous"
                  onLoad={() => updateCanvas(cropData)}
                />
                
                <div
                  className="absolute border-2 border-purple-500 cursor-move"
                  style={{
                    left: `${(cropData.x / cropData.naturalWidth) * 100}%`,
                    top: `${(cropData.y / cropData.naturalHeight) * 100}%`,
                    width: `${(cropData.width / cropData.naturalWidth) * 100}%`,
                    height: `${(cropData.height / cropData.naturalHeight) * 100}%`,
                    boxShadow: '0 0 0 9999px rgba(0, 0, 0, 0.7)'
                  }}
                  onMouseDown={(e) => handleMouseDown(e, 'move')}
                >
                  <div className="absolute top-0 left-0 w-4 h-4 border-t-4 border-l-4 border-white" />
                  <div className="absolute top-0 right-0 w-4 h-4 border-t-4 border-r-4 border-white" />
                  <div className="absolute bottom-0 left-0 w-4 h-4 border-b-4 border-l-4 border-white" />
                  <div className="absolute bottom-0 right-0 w-4 h-4 border-b-4 border-r-4 border-white" />
                  
                  <div
                    className="absolute -right-2 -top-2 w-4 h-4 bg-purple-600 rounded-full cursor-ne-resize"
                    onMouseDown={(e) => handleMouseDown(e, 'top-right')}
                  />
                  <div
                    className="absolute -left-2 -top-2 w-4 h-4 bg-purple-600 rounded-full cursor-nw-resize"
                    onMouseDown={(e) => handleMouseDown(e, 'top-left')}
                  />
                  <div
                    className="absolute -right-2 -bottom-2 w-4 h-4 bg-purple-600 rounded-full cursor-se-resize"
                    onMouseDown={(e) => handleMouseDown(e, 'bottom-right')}
                  />
                  <div
                    className="absolute -left-2 -bottom-2 w-4 h-4 bg-purple-600 rounded-full cursor-sw-resize"
                    onMouseDown={(e) => handleMouseDown(e, 'bottom-left')}
                  />
                </div>
              </div>

              <div className="w-80">
                <div className="bg-gray-50 rounded-lg p-4 mb-4">
                  <h4 className="font-semibold text-gray-900 mb-2">Preview</h4>
                  <div className="aspect-[4/5] bg-gray-900 rounded-lg overflow-hidden">
                    <canvas
                      ref={canvasRef}
                      width="800"
                      height="1000"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <p className="text-xs text-gray-500 mt-2 text-center">
                    Card preview (4:5 ratio)
                  </p>
                </div>

                <div className="bg-purple-50 rounded-lg p-4">
                  <h4 className="font-semibold text-purple-900 mb-2">Tips</h4>
                  <ul className="text-xs text-purple-700 space-y-1">
                    <li>• Drag to move crop area</li>
                    <li>• Drag corners to resize</li>
                    <li>• Keep face/important elements centered</li>
                    <li>• 4:5 ratio works best for cards</li>
                  </ul>
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-3 mt-6">
              <button
                onClick={() => setShowCropper(false)}
                className="px-6 py-3 border-2 border-gray-300 text-gray-700 font-semibold rounded-lg hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={handleCropComplete}
                className="px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold rounded-lg hover:from-purple-700 hover:to-pink-700 flex items-center gap-2"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v16h16M4 4l16 16M4 20L20 4" />
                </svg>
                Apply Crop
              </button>
            </div>
          </div>
        </div>
      )}

      {/* form UI below is same as your original, just using handleChange etc. */}
      <div className="mb-8">
        <button
          onClick={() => navigate('/hoster/events')}
          className="inline-flex items-center text-purple-600 hover:text-purple-700 mb-6"
        >
          <ArrowLeftIcon className="h-5 w-5 mr-2" />
          Back to Events
        </button>
        <h1 className="text-3xl font-bold text-gray-900">
          {isEditMode ? 'Edit Event' : 'Create New Event'}
        </h1>
        <p className="text-gray-600">
          {isEditMode ? 'Update event details' : 'Add a new event to your portfolio'}
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Basic Information */}
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
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
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
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              >
                <option value="">Select a category</option>
                {categories.map(category => (
                  <option key={category} value={category}>{category}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Event Status *
              </label>
              <select
                name="status"
                value={formData.status}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              >
                {statusOptions.map(option => (
                  <option key={option.value} value={option.value}>{option.label}</option>
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
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
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
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                placeholder="Detailed description of the event..."
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Music Genres
              </label>
              <input
                type="text"
                name="musicGenres"
                value={formData.musicGenres}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                placeholder="BOLLYWOOD, SOUTH, TECHNO"
              />
              <p className="mt-1 text-sm text-gray-500">
                Separate genres with commas
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Music Artists
              </label>
              <input
                type="text"
                name="musicArtists"
                value={formData.musicArtists}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                placeholder="ALASANDRA, VIPIN, TORTA"
              />
              <p className="mt-1 text-sm text-gray-500">
                Separate artists with commas
              </p>
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
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                placeholder="e.g., conference, networking, luxury"
              />
              <p className="mt-1 text-sm text-gray-500">
                Separate tags with commas
              </p>
            </div>
          </div>
        </div>

        {/* Date & Time */}
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
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
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
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
            </div>
          </div>
        </div>

        {/* Location */}
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
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
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
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                placeholder="e.g., Dubai, UAE"
              />
            </div>
          </div>
        </div>

        {/* Pricing & Capacity */}
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
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
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
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                placeholder="Maximum attendees"
              />
            </div>
          </div>
        </div>

        {/* Contact */}
        <div className="bg-white rounded-xl shadow-lg p-8">
          <h2 className="text-xl font-bold text-gray-900 mb-6">Contact Information</h2>
          
          <div className="grid md:grid-cols-2 gap-6">
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
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
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
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                placeholder="+971 50 123 4567"
              />
            </div>
          </div>
        </div>

        {/* Images */}
        <div className="bg-white rounded-xl shadow-lg p-8">
          <h2 className="text-xl font-bold text-gray-900 mb-6">Event Images</h2>
          
          <div className="space-y-6">
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
              <CloudArrowUpIcon className="mx-auto h-12 w-12 text-gray-400" />
              <div className="mt-4">
                <label className="cursor-pointer">
                  <span className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg hover:from-purple-700 hover:to-pink-700">
                    <PhotoIcon className="h-5 w-5 mr-2" />
                    Upload Images
                  </span>
                  <input
                    ref={fileInputRef}
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
                    Click crop icon to adjust image for card display (4:5 ratio)
                  </div>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
                  {previewImages.map((image, index) => (
                    <div key={index} className="relative group aspect-[4/5]">
                      <img
                        src={image}
                        alt={`Preview ${index + 1}`}
                        className="w-full h-full object-cover rounded-lg"
                      />
                      <div className="absolute inset-0 bg-black/70 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg flex flex-col items-center justify-center gap-2">
                        <button
                          type="button"
                          onClick={() => handleCropImage(index)}
                          className="p-2 bg-white text-purple-600 rounded-full hover:bg-purple-100"
                          title="Crop image for card"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v16h16M4 4l16 16M4 20L20 4" />
                          </svg>
                        </button>
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
                          <CheckIcon className="h-4 w-4" />
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

        {/* Submit */}
        <div className="flex justify-end space-x-4">
          <button
            type="button"
            onClick={() => navigate('/hoster/events')}
            className="px-6 py-3 border-2 border-gray-300 text-gray-700 font-semibold rounded-lg hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={loading}
            className="px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold rounded-lg hover:from-purple-700 hover:to-pink-700 disabled:opacity-50 flex items-center"
          >
            {loading ? (
              <>
                <svg className="animate-spin h-5 w-5 mr-2 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Saving...
              </>
            ) : isEditMode ? (
              'Update Event'
            ) : (
              'Create Event'
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default HosterEventForm;
