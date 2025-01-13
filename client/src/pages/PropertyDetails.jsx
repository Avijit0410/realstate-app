import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Carousel } from 'flowbite-react';
import Navbar from '../components/Navbar';
import { useAuth } from '../context/AuthContext';
import EditPropertyModal from '../components/EditPropertyModal';

const PropertyDetails = () => {
  const { user } = useAuth();
  const [property, setProperty] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { id } = useParams();
  const navigate = useNavigate();
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deleteError, setDeleteError] = useState('');

  const fetchProperty = async () => {
    try {
      const response = await axios.get(`/api/properties/${id}`);
      setProperty(response.data);
    } catch (err) {
      setError('Failed to fetch property details');
      console.error('Error:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProperty();
  }, [id]);

  const handleGetDirections = () => {
    if (property?.location?.coordinates) {
      const [longitude, latitude] = property.location.coordinates;
      const url = `https://www.google.com/maps/dir/?api=1&destination=${latitude},${longitude}`;
      window.open(url, '_blank');
    }
  };

  const handleBack = () => {
    navigate(-1);
  };

  const handleEdit = () => {
    setIsEditModalOpen(true);
  };

  const handleDelete = async () => {
    try {
      setDeleteError('');
      const response = await axios.delete(`/api/properties/${id}`);
      if (response.data.message) {
        navigate(user?.role === 'admin' ? '/admin/dashboard' : '/agent/dashboard');
      }
    } catch (error) {
      console.error('Error deleting property:', error);
      setDeleteError(error.response?.data?.error || 'Failed to delete property');
      return;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  if (error || !property) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-red-500">{error || 'Property not found'}</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar />
      <div className="py-8">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Back Button */}
          <button
            onClick={handleBack}
            className="mb-6 flex items-center text-indigo-600 hover:text-indigo-800"
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Back
          </button>

          {/* Image Carousel */}
          <div className="bg-white rounded-lg shadow-lg overflow-hidden mb-8">
            <div className="h-96">
              {property.images.length > 0 ? (
                <Carousel>
                  {property.images.map((image, index) => (
                    <img
                      key={index}
                      src={image}
                      alt={`Property ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                  ))}
                </Carousel>
              ) : (
                <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                  <span className="text-gray-400">No images available</span>
                </div>
              )}
            </div>
          </div>

          {/* Property Details */}
          <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
            <div className="flex justify-between items-start mb-4">
              <h1 className="text-3xl font-bold text-gray-900">{property.name}</h1>
              
              {/* Action Buttons - Only show for property owner or admin */}
              {(user?.role === 'admin' || user?.id === property.agent._id) && (
                <div className="flex space-x-3">
                  <button
                    onClick={handleEdit}
                    className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 transition-colors flex items-center"
                  >
                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                    </svg>
                    Edit
                  </button>
                  <button
                    onClick={() => setShowDeleteConfirm(true)}
                    className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700 transition-colors flex items-center"
                  >
                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                    Delete
                  </button>
                </div>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <h2 className="text-xl font-semibold text-gray-900 mb-4">Property Information</h2>
                <div className="space-y-3">
                  <p className="text-gray-600">
                    <span className="font-medium">Address:</span> {property.address}
                  </p>
                  <p className="text-gray-600">
                    <span className="font-medium">Owner Contact:</span> {property.ownerNumber}
                  </p>
                  <p className="text-gray-600">
                    <span className="font-medium">Coordinates:</span>{' '}
                    {property.location.coordinates[1]}, {property.location.coordinates[0]}
                  </p>
                </div>
              </div>

              <div>
                <h2 className="text-xl font-semibold text-gray-900 mb-4">Agent Information</h2>
                <div className="space-y-3">
                  <p className="text-gray-600">
                    <span className="font-medium">Name:</span> {property.agent.name}
                  </p>
                  <p className="text-gray-600">
                    <span className="font-medium">Contact:</span> {property.agent.mobileNumber}
                  </p>
                  <p className="text-gray-600">
                    <span className="font-medium">Address:</span> {property.agent.address}
                  </p>
                </div>
              </div>
            </div>

            {/* Get Directions Button */}
            <button
              onClick={handleGetDirections}
              className="mt-8 w-full bg-green-600 text-white px-6 py-3 rounded-md hover:bg-green-700 transition-colors flex items-center justify-center"
            >
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
              </svg>
              Get Directions
            </button>
          </div>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-xl max-w-md w-full mx-4">
            <h3 className="text-lg font-medium text-gray-900 mb-4">
              Delete Property
            </h3>
            {deleteError && (
              <div className="mb-4 text-sm text-red-600 bg-red-50 p-3 rounded">
                {deleteError}
              </div>
            )}
            <p className="text-gray-500 mb-6">
              Are you sure you want to delete this property? This action cannot be undone.
            </p>
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => {
                  setDeleteError('');
                  setShowDeleteConfirm(false);
                }}
                className="px-4 py-2 text-gray-700 border border-gray-300 rounded-md hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Property Modal */}
      <EditPropertyModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        property={property}
        onPropertyUpdated={() => {
          setIsEditModalOpen(false);
          // Refresh property data
          fetchProperty();
        }}
      />
    </div>
  );
};

export default PropertyDetails; 