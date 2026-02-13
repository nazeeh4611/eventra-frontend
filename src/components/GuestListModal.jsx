import React, { useState, useEffect, useRef } from 'react';
import { XMarkIcon, UserPlusIcon, UserIcon, PhoneIcon, ChevronDownIcon, ChevronUpIcon, ExclamationCircleIcon } from '@heroicons/react/24/outline';
import axios from 'axios';
import toast from 'react-hot-toast';
import baseurl from '../Base/base';
import ModalPortal from './ModalPortal';

const GuestListModal = ({ event, onClose }) => {
  const [formData, setFormData] = useState({
    guestName: '',
    phone: '',
    numberOfGuests: 1,
    additionalGuests: []
  });
  
  const [errors, setErrors] = useState({
    guestName: '',
    phone: '',
    numberOfGuests: '',
    additionalGuests: [],
    general: ''
  });
  
  const [touched, setTouched] = useState({
    guestName: false,
    phone: false,
    numberOfGuests: false
  });
  
  const [loading, setLoading] = useState(false);
  const [showAllGuests, setShowAllGuests] = useState(false);
  const modalContentRef = useRef(null);

  // Validation functions
  const validatePhone = (phone) => {
    const phoneRegex = /^[0-9+\-\s]{8,15}$/;
    if (!phone) return 'Phone number is required';
    if (!phoneRegex.test(phone.replace(/\s/g, ''))) return 'Please enter a valid phone number';
    return '';
  };

  const validateGuestName = (name) => {
    if (!name) return 'Primary guest name is required';
    if (name.length < 2) return 'Name must be at least 2 characters';
    if (name.length > 50) return 'Name must be less than 50 characters';
    return '';
  };

  const validateAdditionalGuest = (name, index) => {
    if (name && name.length > 0) {
      if (name.length < 2) return `Guest ${index + 2} name must be at least 2 characters`;
      if (name.length > 50) return `Guest ${index + 2} name must be less than 50 characters`;
    }
    return '';
  };

  const validateForm = () => {
    const phoneError = validatePhone(formData.phone);
    const guestNameError = validateGuestName(formData.guestName);
    
    const additionalErrors = formData.additionalGuests.map((guest, index) => 
      validateAdditionalGuest(guest, index)
    );

    setErrors({
      guestName: guestNameError,
      phone: phoneError,
      numberOfGuests: '',
      additionalGuests: additionalErrors,
      general: ''
    });

    setTouched({
      guestName: true,
      phone: true,
      numberOfGuests: true
    });

    return !phoneError && !guestNameError && additionalErrors.every(error => !error);
  };

  // Check for server-side capacity errors
  const checkCapacityError = (errorResponse) => {
    if (errorResponse?.data?.error?.toLowerCase().includes('capacity') ||
        errorResponse?.data?.error?.toLowerCase().includes('spot') ||
        errorResponse?.data?.error?.toLowerCase().includes('available')) {
      setErrors(prev => ({
        ...prev,
        numberOfGuests: 'Not enough spots available for selected number of guests',
        general: 'Capacity limit reached'
      }));
      return true;
    }
    return false;
  };

  // Check for duplicate entry errors
  const checkDuplicateError = (errorResponse) => {
    if (errorResponse?.data?.error?.toLowerCase().includes('already') ||
        errorResponse?.data?.error?.toLowerCase().includes('existing') ||
        errorResponse?.data?.error?.toLowerCase().includes('duplicate')) {
      setErrors(prev => ({
        ...prev,
        phone: 'This phone number is already registered for this event',
        general: 'Duplicate entry'
      }));
      return true;
    }
    return false;
  };

  // Prevent body scroll
  useEffect(() => {
    const originalStyle = window.getComputedStyle(document.body).overflow;
    document.body.style.overflow = 'hidden';
    document.body.style.touchAction = 'none';
    
    return () => {
      document.body.style.overflow = originalStyle;
      document.body.style.touchAction = '';
    };
  }, []);

  // Handle escape key
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleEscape);
    return () => window.removeEventListener('keydown', handleEscape);
  }, [onClose]);

  // Reset scroll when guest count changes
  useEffect(() => {
    if (modalContentRef.current) {
      modalContentRef.current.scrollTop = 0;
    }
    setShowAllGuests(false);
    
    // Clear additional guest errors when count changes
    setErrors(prev => ({
      ...prev,
      additionalGuests: [],
      numberOfGuests: ''
    }));
  }, [formData.numberOfGuests]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    
    // Clear field error when user starts typing
    setErrors(prev => ({
      ...prev,
      [name]: '',
      general: ''
    }));

    if (name === 'numberOfGuests') {
      const num = parseInt(value);
      
      // Check if enough spots available
      const availableSpots = event.capacity ? event.capacity - (event.bookedSeats || 0) : 298;
      if (num > availableSpots) {
        setErrors(prev => ({
          ...prev,
          numberOfGuests: `Only ${availableSpots} spot${availableSpots === 1 ? '' : 's'} available`
        }));
      }
      
      setFormData(prev => ({
        ...prev,
        numberOfGuests: num,
        additionalGuests: Array(num - 1).fill('')
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }

    // Real-time validation for touched fields
    if (touched[name]) {
      let error = '';
      if (name === 'phone') error = validatePhone(value);
      if (name === 'guestName') error = validateGuestName(value);
      
      setErrors(prev => ({
        ...prev,
        [name]: error
      }));
    }
  };

  const handleGuestNameChange = (index, value) => {
    const updatedGuests = [...formData.additionalGuests];
    updatedGuests[index] = value;
    
    setFormData(prev => ({
      ...prev,
      additionalGuests: updatedGuests
    }));

    // Validate this specific guest field
    const error = validateAdditionalGuest(value, index);
    const updatedAdditionalErrors = [...(errors.additionalGuests || [])];
    updatedAdditionalErrors[index] = error;
    
    setErrors(prev => ({
      ...prev,
      additionalGuests: updatedAdditionalErrors,
      general: ''
    }));
  };

  const handleBlur = (field) => {
    setTouched(prev => ({
      ...prev,
      [field]: true
    }));

    // Validate on blur
    let error = '';
    if (field === 'phone') error = validatePhone(formData.phone);
    if (field === 'guestName') error = validateGuestName(formData.guestName);
    
    setErrors(prev => ({
      ...prev,
      [field]: error
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate all fields before submission
    if (!validateForm()) {
      // Show first error in toast
      const firstError = errors.phone || errors.guestName || errors.numberOfGuests;
      if (firstError) {
        toast.error(firstError);
      } else {
        toast.error('Please fix the errors before submitting');
      }
      return;
    }

    // Check capacity again before submission
    const availableSpots = event.capacity ? event.capacity - (event.bookedSeats || 0) : 298;
    if (formData.numberOfGuests > availableSpots) {
      const errorMsg = `Only ${availableSpots} spot${availableSpots === 1 ? '' : 's'} available`;
      setErrors(prev => ({
        ...prev,
        numberOfGuests: errorMsg
      }));
      toast.error(errorMsg);
      return;
    }

    setLoading(true);
    
    try {
      const guestData = {
        eventId: event._id,
        guestName: formData.guestName.trim(),
        phone: formData.phone.trim(),
        numberOfGuests: parseInt(formData.numberOfGuests),
        additionalGuests: formData.additionalGuests
          .filter(name => name && name.trim() !== '')
          .map(name => ({
            name: name.trim(),
            email: '',
            phone: ''
          }))
      };
      
      await axios.post(`${baseurl}/guestlist`, guestData);
      toast.success('Successfully added to guest list! 🎉');
      onClose();
    } catch (error) {
      console.error('Submission error:', error);
      
      let errorMessage = 'Failed to join guest list';
      
      // Handle different error types
      if (error.response) {
        // Server responded with error
        if (error.response.status === 400) {
          // Check for specific error types
          if (checkCapacityError(error.response)) {
            errorMessage = 'Not enough spots available';
          } else if (checkDuplicateError(error.response)) {
            errorMessage = 'You are already on the guest list';
          } else {
            errorMessage = error.response.data?.error || 'Invalid submission';
          }
        } else if (error.response.status === 409) {
          errorMessage = 'You are already registered for this event';
          setErrors(prev => ({
            ...prev,
            phone: 'This phone number is already registered'
          }));
        } else if (error.response.status === 403) {
          errorMessage = 'Guest list is closed';
        } else {
          errorMessage = error.response.data?.error || 'Server error';
        }
      } else if (error.request) {
        // No response received
        errorMessage = 'Network error - please check your connection';
      }

      // Set general error
      setErrors(prev => ({
        ...prev,
        general: errorMessage
      }));

      // Show toast error
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const totalAdditionalGuests = formData.numberOfGuests - 1;
  const visibleGuests = showAllGuests ? totalAdditionalGuests : Math.min(totalAdditionalGuests, 3);
  const hiddenGuestsCount = totalAdditionalGuests - 3;
  const availableSpots = event.capacity ? event.capacity - (event.bookedSeats || 0) : 298;

  return (
    <ModalPortal>
      {/* Backdrop */}
      <div 
        className="fixed inset-0 z-[99999]"
        style={{ 
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
          backdropFilter: 'blur(4px)',
          WebkitBackdropFilter: 'blur(4px)',
        }}
        onClick={handleBackdropClick}
      />
      
      {/* Modal Container */}
      <div className="fixed inset-0 z-[999999] flex items-center justify-center p-4 pointer-events-none">
        <div className="relative w-full max-w-sm 
                     bg-gradient-to-b from-[#1e1e2a] to-[#14141c]
                     rounded-2xl 
                     border border-cyan-500/30 
                     shadow-xl shadow-cyan-500/20
                     overflow-hidden
                     flex flex-col max-h-[85vh] 
                     pointer-events-auto
                     transform transition-all duration-300 animate-slideUp">
          
          {/* Header */}
          <div className="relative px-4 py-3 border-b border-white/5 bg-[#1a1a24] flex-shrink-0">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="p-1.5 rounded-lg bg-gradient-to-br from-cyan-500/20 to-blue-500/20 border border-cyan-500/30">
                  <UserPlusIcon className="h-4 w-4 text-cyan-400" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-white">
                    Join Guest List
                  </h3>
                  <p className="text-[0.6rem] text-gray-400 line-clamp-1 max-w-[160px]">
                    {event?.title || 'Event'}
                  </p>
                </div>
              </div>
              <button
                onClick={onClose}
                className="p-1.5 hover:bg-white/5 rounded-lg transition-all group"
              >
                <XMarkIcon className="h-4 w-4 text-gray-400 group-hover:text-white" />
              </button>
            </div>
          </div>

          {/* Event Quick Info */}
          <div className="px-4 py-2 bg-white/5 border-b border-white/5 flex-shrink-0">
            <div className="flex items-center justify-between text-xs">
              <div className="flex items-center gap-2">
                <span className="text-gray-400">📅</span>
                <span className="text-gray-300">
                  {event.date ? new Date(event.date).toLocaleDateString('en-US', { 
                    day: 'numeric', 
                    month: 'short' 
                  }) : 'TBD'}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-gray-400">📍</span>
                <span className="text-gray-300 truncate max-w-[120px]">
                  {event.venue || event.location || 'Dubai'}
                </span>
              </div>
              <div className="flex items-center gap-1">
                <span className={`inline-flex h-2 w-2 rounded-full ${availableSpots > 0 ? 'bg-green-500' : 'bg-red-500'}`}></span>
                <span className="text-gray-400 text-[0.6rem]">
                  {availableSpots} left
                </span>
              </div>
            </div>
          </div>

          {/* General Error Banner */}
          {errors.general && (
            <div className="mx-4 mt-3 p-2 bg-red-500/10 border border-red-500/30 rounded-lg flex items-center gap-2">
              <ExclamationCircleIcon className="h-4 w-4 text-red-400 flex-shrink-0" />
              <p className="text-[0.65rem] text-red-400">{errors.general}</p>
            </div>
          )}

          {/* Scrollable Form Area */}
          <div 
            ref={modalContentRef}
            className="flex-1 overflow-y-auto px-4 py-3"
            style={{
              WebkitOverflowScrolling: 'touch',
              scrollbarWidth: 'thin',
              scrollbarColor: '#22d3ee #1f2937',
            }}
          >
            <style jsx>{`
              div::-webkit-scrollbar {
                width: 3px;
              }
              div::-webkit-scrollbar-track {
                background: #1f2937;
                border-radius: 8px;
              }
              div::-webkit-scrollbar-thumb {
                background: #22d3ee;
                border-radius: 8px;
              }
              @keyframes slideUp {
                from {
                  opacity: 0;
                  transform: translateY(20px);
                }
                to {
                  opacity: 1;
                  transform: translateY(0);
                }
              }
              .animate-slideUp {
                animation: slideUp 0.25s ease-out;
              }
            `}</style>
            
            <form id="guestListForm" onSubmit={handleSubmit} className="space-y-4">
              {/* Phone Number */}
              <div>
                <label className="flex items-center gap-1 text-[0.65rem] font-medium text-gray-300 mb-1.5">
                  <PhoneIcon className="h-3 w-3 text-cyan-400" />
                  Phone Number <span className="text-cyan-400">*</span>
                </label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  onBlur={() => handleBlur('phone')}
                  required
                  className={`w-full px-3 py-2.5 text-sm 
                           bg-[#0a0a10] border rounded-lg 
                           text-white placeholder-gray-500 
                           focus:ring-2 outline-none transition-all
                           ${errors.phone && touched.phone 
                             ? 'border-red-500 focus:border-red-500 focus:ring-red-500/20' 
                             : 'border-cyan-500/30 focus:border-cyan-400 focus:ring-cyan-400/20'}`}
                  placeholder="+971 50 123 4567"
                />
                {errors.phone && touched.phone && (
                  <p className="mt-1 text-[0.6rem] text-red-400 flex items-center gap-1">
                    <ExclamationCircleIcon className="h-2.5 w-2.5" />
                    {errors.phone}
                  </p>
                )}
              </div>

              {/* Primary Guest */}
              <div>
                <label className="flex items-center gap-1 text-[0.65rem] font-medium text-gray-300 mb-1.5">
                  <UserIcon className="h-3 w-3 text-cyan-400" />
                  Primary Guest <span className="text-cyan-400">*</span>
                </label>
                <input
                  type="text"
                  name="guestName"
                  value={formData.guestName}
                  onChange={handleChange}
                  onBlur={() => handleBlur('guestName')}
                  required
                  className={`w-full px-3 py-2.5 text-sm 
                           bg-[#0a0a10] border rounded-lg 
                           text-white placeholder-gray-500 
                           focus:ring-2 outline-none transition-all
                           ${errors.guestName && touched.guestName 
                             ? 'border-red-500 focus:border-red-500 focus:ring-red-500/20' 
                             : 'border-cyan-500/30 focus:border-cyan-400 focus:ring-cyan-400/20'}`}
                  placeholder="Your full name"
                />
                {errors.guestName && touched.guestName && (
                  <p className="mt-1 text-[0.6rem] text-red-400 flex items-center gap-1">
                    <ExclamationCircleIcon className="h-2.5 w-2.5" />
                    {errors.guestName}
                  </p>
                )}
              </div>

              {/* Number of Guests */}
              <div>
                <label className="block text-[0.65rem] font-medium text-gray-300 mb-1.5">
                  Number of Guests
                </label>
                <select
                  name="numberOfGuests"
                  value={formData.numberOfGuests}
                  onChange={handleChange}
                  className={`w-full px-3 py-2.5 text-sm 
                           bg-[#0a0a10] border rounded-lg 
                           text-white focus:ring-2 
                           outline-none transition-all appearance-none cursor-pointer
                           ${errors.numberOfGuests 
                             ? 'border-red-500 focus:border-red-500 focus:ring-red-500/20' 
                             : 'border-cyan-500/30 focus:border-cyan-400 focus:ring-cyan-400/20'}`}
                  style={{
                    backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='%2322d3ee'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M19 9l-7 7-7-7'%3E%3C/path%3E%3C/svg%3E")`,
                    backgroundRepeat: 'no-repeat',
                    backgroundPosition: 'right 0.75rem center',
                    backgroundSize: '1rem',
                  }}
                >
                  {[1,2,3,4,5,6,7,8,9,10].map(num => (
                    <option 
                      key={num} 
                      value={num} 
                      className="bg-[#0a0a10]"
                      disabled={num > availableSpots}
                    >
                      {num} {num === 1 ? 'Guest' : 'Guests'} {num > availableSpots ? '(Not available)' : ''}
                    </option>
                  ))}
                </select>
                {errors.numberOfGuests && (
                  <p className="mt-1 text-[0.6rem] text-red-400 flex items-center gap-1">
                    <ExclamationCircleIcon className="h-2.5 w-2.5" />
                    {errors.numberOfGuests}
                  </p>
                )}
                <p className="mt-1 text-[0.6rem] text-gray-500">
                  AED 0 • Free entry • {availableSpots} spots available
                </p>
              </div>

              {/* Additional Guests Section */}
              {totalAdditionalGuests > 0 && (
                <div className="space-y-2 p-3 bg-cyan-500/5 rounded-lg border border-cyan-500/20">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-medium text-cyan-400">
                      Additional Guests ({totalAdditionalGuests})
                    </span>
                    {totalAdditionalGuests > 3 && (
                      <button
                        type="button"
                        onClick={() => setShowAllGuests(!showAllGuests)}
                        className="flex items-center gap-1 px-2 py-1 text-[0.55rem] 
                                 bg-cyan-500/10 hover:bg-cyan-500/20 
                                 text-cyan-300 rounded-md transition-all"
                      >
                        {showAllGuests ? (
                          <>Show Less <ChevronUpIcon className="h-2.5 w-2.5" /></>
                        ) : (
                          <>Show All <ChevronDownIcon className="h-2.5 w-2.5" /></>
                        )}
                      </button>
                    )}
                  </div>
                  
                  {Array.from({ length: visibleGuests }).map((_, index) => (
                    <div key={index}>
                      <input
                        type="text"
                        value={formData.additionalGuests[index] || ''}
                        onChange={(e) => handleGuestNameChange(index, e.target.value)}
                        placeholder={`Guest ${index + 2} name (optional)`}
                        className={`w-full px-3 py-2 text-xs 
                                 bg-[#0a0a10] border rounded-lg 
                                 text-white placeholder-gray-600 
                                 focus:ring-2 outline-none transition-all
                                 ${errors.additionalGuests?.[index] 
                                   ? 'border-red-500 focus:border-red-500 focus:ring-red-500/20' 
                                   : 'border-cyan-500/20 focus:border-cyan-400 focus:ring-cyan-400/20'}`}
                      />
                      {errors.additionalGuests?.[index] && (
                        <p className="mt-1 text-[0.55rem] text-red-400 flex items-center gap-1">
                          <ExclamationCircleIcon className="h-2 w-2" />
                          {errors.additionalGuests[index]}
                        </p>
                      )}
                    </div>
                  ))}
                  
                  {!showAllGuests && hiddenGuestsCount > 0 && (
                    <button
                      type="button"
                      onClick={() => setShowAllGuests(true)}
                      className="w-full py-2 text-[0.55rem] text-cyan-400 
                               bg-cyan-500/5 hover:bg-cyan-500/10 
                               rounded-lg border border-cyan-500/30 border-dashed
                               flex items-center justify-center gap-1
                               transition-all"
                    >
                      <UserIcon className="h-2.5 w-2.5" />
                      + {hiddenGuestsCount} more {hiddenGuestsCount === 1 ? 'guest' : 'guests'}
                    </button>
                  )}

                  <p className="text-[0.55rem] text-gray-500 pt-1">
                    ℹ️ Guest names help with quick check-in
                  </p>
                </div>
              )}

              {/* Total Summary */}
              <div className="flex items-center justify-between bg-cyan-500/5 p-2.5 rounded-lg border border-cyan-500/20">
                <span className="text-xs text-gray-400">Total Guests</span>
                <span className="text-sm font-bold text-cyan-400">
                  {formData.numberOfGuests} {formData.numberOfGuests === 1 ? 'Guest' : 'Guests'}
                </span>
              </div>
            </form>
          </div>

          {/* Footer with Actions */}
          <div className="px-4 py-3 border-t border-white/5 bg-[#1a1a24] flex-shrink-0">
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 py-2.5 px-3 text-xs font-medium 
                         text-gray-300 bg-white/5 border border-white/10 rounded-lg
                         hover:bg-white/10 transition-all active:scale-95"
              >
                Cancel
              </button>
              <button
                type="submit"
                form="guestListForm"
                disabled={loading || availableSpots === 0}
                className={`flex-1 py-2.5 px-3 text-xs font-bold text-white
                         bg-gradient-to-r from-cyan-600 to-blue-600 rounded-lg
                         hover:shadow-lg hover:shadow-cyan-500/30 
                         transition-all active:scale-95 
                         ${(loading || availableSpots === 0) ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                {loading ? 'Joining...' : availableSpots === 0 ? 'Sold Out' : 'Join Guest List'}
              </button>
            </div>
            
            {/* Spots Left */}
            <div className="flex items-center justify-between mt-2 text-[0.55rem]">
              <span className={`${availableSpots > 0 ? 'text-gray-600' : 'text-red-400'}`}>
                🎟️ {availableSpots} {availableSpots === 1 ? 'spot' : 'spots'} left
              </span>
              <span className={`${availableSpots > 0 ? 'text-cyan-500/70' : 'text-red-400/70'}`}>
                • {availableSpots > 0 ? 'Guest list open' : 'Sold out'}
              </span>
            </div>
          </div>
        </div>
      </div>
    </ModalPortal>
  );
};

export default GuestListModal;