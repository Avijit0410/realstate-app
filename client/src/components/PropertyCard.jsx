import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Carousel } from 'flowbite-react';
import ImageViewer from './ImageViewer';

const PropertyCard = ({ property }) => {
  const navigate = useNavigate();
  const [selectedImage, setSelectedImage] = useState(null);
  
  // Add default values for missing properties
  const {
    _id = '',
    name = 'Unnamed Property',
    address = 'No address provided',
    images = [],
    agent = { name: 'Unknown Agent' },
    location = { coordinates: [0, 0] }
  } = property || {};
  
  const handleViewDetails = () => {
    navigate(`/admin/property/${_id}`);
  };

  const handleViewOnMap = () => {
    const [longitude, latitude] = location.coordinates;
    const url = `https://www.google.com/maps/dir/?api=1&destination=${latitude},${longitude}`;
    window.open(url, '_blank');
  };

  const handleImageClick = (image) => {
    setSelectedImage(image);
  };

  return (
    <>
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        {/* Image Carousel */}
        <div className="h-56 sm:h-64 xl:h-80 2xl:h-96">
          {images.length > 0 ? (
            <Carousel>
              {images.map((image, index) => (
                <div 
                  key={index} 
                  className="w-full h-full cursor-pointer"
                  onClick={() => handleImageClick(image)}
                >
                  <img
                    src={image}
                    alt={`Property ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                </div>
              ))}
            </Carousel>
          ) : (
            <div className="w-full h-full bg-gray-200 flex items-center justify-center">
              <span className="text-gray-400">No images available</span>
            </div>
          )}
        </div>

        {/* Property Info */}
        <div className="p-4">
          <h3 className="text-xl font-semibold text-gray-900 mb-2">
            {name}
          </h3>
          <p className="text-gray-600 mb-2 line-clamp-2">
            {address}
          </p>
          <div className="text-sm text-gray-500 mb-4">
            Added by: {agent?.name || 'Unknown Agent'}
          </div>

          {/* Action Buttons */}
          <div className="flex gap-2">
            <button
              onClick={handleViewDetails}
              className="flex-1 bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 transition-colors flex items-center justify-center"
            >
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
              </svg>
              View Details
            </button>
            <button
              onClick={handleViewOnMap}
              className="flex-1 bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 transition-colors flex items-center justify-center"
            >
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
              </svg>
              View on Map
            </button>
          </div>
        </div>
      </div>

      {/* Image Viewer Modal */}
      <ImageViewer
        image={selectedImage}
        isOpen={!!selectedImage}
        onClose={() => setSelectedImage(null)}
      />
    </>
  );
};

export default PropertyCard; 