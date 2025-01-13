import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import proLogo from '../assets/pro7logo.jpeg';
import AddPropertyModal from './AddPropertyModal';
import AddAgentModal from './AddAgentModal';

const Navbar = () => {
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isAddPropertyModalOpen, setIsAddPropertyModalOpen] = useState(false);
  const [isAddAgentModalOpen, setIsAddAgentModalOpen] = useState(false);
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login', { replace: true });
  };

  const handleAddAgent = () => {
    setIsAddAgentModalOpen(true);
  };

  return (
    <nav className="bg-white shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          {/* Logo */}
          <div className="flex-shrink-0 flex items-center">
            <img
              className="h-12 w-auto object-contain"
              src={proLogo}
              alt="Pro7 Logo"
            />
          </div>

          {/* Navigation Items */}
          <div className="flex items-center space-x-4">
            {/* Add Agent button (only for admin) */}
            {user?.role === 'admin' && (
              <button
                onClick={handleAddAgent}
                className="bg-green-600 text-white px-3 py-1.5 text-sm rounded-md hover:bg-green-700 transition-colors flex items-center"
              >
                <svg 
                  className="w-4 h-6 mr-1.6" 
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                >
                  <path 
                    strokeLinecap="round" 
                    strokeLinejoin="round" 
                    strokeWidth="2" 
                    d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" 
                  />
                </svg>
                Add Agent
              </button>
            )}

            <button
              onClick={() => setIsAddPropertyModalOpen(true)}
              className="bg-indigo-600 text-white px-3 py-1.5 text-sm rounded-md hover:bg-indigo-700 transition-colors flex items-center"
            >
              <svg 
                className="w-4 h-6 mr-1.6" 
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
              Add Property
            </button>

            {/* Profile Dropdown */}
            <div className="relative">
              <button
                onClick={() => setIsProfileOpen(!isProfileOpen)}
                className="flex items-center space-x-2 text-gray-700 hover:text-gray-900 focus:outline-none"
              >
                {user?.image ? (
                  <img
                    src={user.image}
                    alt={user.name}
                    className="w-8 h-8 rounded-full object-cover border border-gray-200"
                    onError={(e) => {
                      e.target.onerror = null; // Prevent infinite loop
                      e.target.src = ''; // Clear the source
                      // You could also set a default image here
                      setUser(prev => ({ ...prev, image: null })); // Fall back to initials
                    }}
                  />
                ) : (
                  <div className="w-8 h-8 rounded-full bg-indigo-600 flex items-center justify-center text-white">
                    {user?.name?.charAt(0).toUpperCase()}
                  </div>
                )}
                <span className="hidden md:block">{user?.name}</span>
                <svg
                  className={`w-5 h-5 transition-transform ${
                    isProfileOpen ? 'transform rotate-180' : ''
                  }`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </button>

              {/* Dropdown Menu */}
              {isProfileOpen && (
                <div className="absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 z-50">
                  <div className="py-1">
                    <div className="px-4 py-2 text-sm text-gray-700 border-b">
                      <div className="flex items-center space-x-3">
                        {user?.image ? (
                          <img
                            src={user.image}
                            alt={user.name}
                            className="w-10 h-10 rounded-full object-cover border border-gray-200"
                          />
                        ) : (
                          <div className="w-10 h-10 rounded-full bg-indigo-600 flex items-center justify-center text-white">
                            {user?.name?.charAt(0).toUpperCase()}
                          </div>
                        )}
                        <div>
                          <p className="font-medium">{user?.name}</p>
                          <p className="text-gray-500">{user?.mobileNumber}</p>
                        </div>
                      </div>
                    </div>
                    <button
                      onClick={handleLogout}
                      className="w-full text-left px-4 py-2 text-sm text-red-700 hover:bg-red-50 flex items-center"
                    >
                      <svg
                        className="w-5 h-5 mr-2"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                        />
                      </svg>
                      Logout
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      
      <AddPropertyModal 
        isOpen={isAddPropertyModalOpen}
        onClose={() => setIsAddPropertyModalOpen(false)}
        onPropertyAdded={() => {
          setIsAddPropertyModalOpen(false);
          window.location.reload();
        }}
      />
      
      <AddAgentModal
        isOpen={isAddAgentModalOpen}
        onClose={() => setIsAddAgentModalOpen(false)}
      />
    </nav>
  );
};

export default Navbar; 