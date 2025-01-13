import { useState, useEffect } from 'react';
import axios from 'axios';
import PropertyCard from '../components/PropertyCard';
import Navbar from '../components/Navbar';

const AgentDashboard = () => {
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isAddPropertyModalOpen, setIsAddPropertyModalOpen] = useState(false);

  useEffect(() => {
    const fetchProperties = async () => {
      try {
        const response = await axios.get('/api/properties/my-properties');
        console.log('Fetched properties:', response.data);
        setProperties(response.data);
      } catch (err) {
        setError('Failed to fetch properties');
        console.error('Error fetching properties:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchProperties();
  }, []);

  const handleAddPropertyClick = () => {
    setIsAddPropertyModalOpen(true);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-red-500">{error}</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-6">My Properties</h1>
        
        {properties.length === 0 ? (
          <div className="bg-white rounded-lg shadow-md p-8 text-center">
            <div className="mb-4">
              <svg 
                className="mx-auto h-12 w-12 text-gray-400"
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 48 48"
              >
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth="2" 
                  d="M24 8V4m0 4v4m8-4h4m-4 0h-4m11.314 11.314l2.828-2.828m-2.828 2.828l-2.828-2.828M7.314 19.314l-2.828-2.828m2.828 2.828l2.828-2.828M4 24h4m-4 0h-4m4 8h-4m4 0h4m2.314 5.314l-2.828 2.828m2.828-2.828l-2.828-2.828m26.372 2.828l2.828 2.828m-2.828-2.828l2.828-2.828M44 32h-4m4 0h4m-4-8h4m-4 0h-4M36.686 19.314l2.828-2.828m-2.828 2.828l-2.828-2.828" 
                />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              No Properties Added Yet
            </h3>
            <p className="text-gray-500 mb-6">
              Get started by adding your first property listing
            </p>
            <button
              onClick={() => setIsAddPropertyModalOpen(true)}
              className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              <svg 
                className="-ml-1 mr-2 h-5 w-5" 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth="2" 
                  d="M12 4v16m8-8H4" 
                />
              </svg>
              Add a Property
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {properties.map((property) => (
              <PropertyCard 
                key={property._id} 
                property={property}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default AgentDashboard; 