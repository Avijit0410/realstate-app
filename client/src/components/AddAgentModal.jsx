import { useState } from 'react';
import axios from 'axios';

const AddAgentModal = ({ isOpen, onClose }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showSuccess, setShowSuccess] = useState(false);
  const [imagePreview, setImagePreview] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    mobileNumber: '',
    password: '',
    address: '',
    role: 'agent',
    image: null
  });

  const resetForm = () => {
    setFormData({
      name: '',
      mobileNumber: '',
      password: '',
      address: '',
      role: 'agent',
      image: null
    });
    setImagePreview(null);
    setError('');
    setShowSuccess(false);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) { // 5MB limit
        setError('Image size should be less than 5MB');
        return;
      }
      if (!file.type.startsWith('image/')) {
        setError('Please upload an image file');
        return;
      }
      setFormData(prev => ({ ...prev, image: file }));
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    setShowSuccess(false);

    try {
      const formDataToSend = new FormData();
      formDataToSend.append('name', formData.name);
      formDataToSend.append('mobileNumber', formData.mobileNumber);
      formDataToSend.append('password', formData.password);
      formDataToSend.append('address', formData.address);
      formDataToSend.append('role', formData.role);
      if (formData.image) {
        formDataToSend.append('image', formData.image);
      }

      await axios.post('/api/agents/create', formDataToSend, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });

      setShowSuccess(true);
      setTimeout(() => {
        resetForm();
        onClose();
      }, 2000);

    } catch (err) {
      const errorMessage = err.response?.data?.error || 'Failed to add agent';
      setError(errorMessage);
      const form = document.getElementById('agentForm');
      form.classList.add('animate-shake');
      setTimeout(() => {
        form.classList.remove('animate-shake');
      }, 500);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
      <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-medium">Add New Agent</h3>
          <button
            onClick={() => {
              resetForm();
              onClose();
            }}
            className="text-gray-400 hover:text-gray-500"
          >
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {showSuccess && (
          <div className="mb-4 text-sm text-green-600 bg-green-50 p-3 rounded animate-fade-in-down flex items-center">
            <svg className="w-5 h-5 mr-2 animate-bounce" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
            </svg>
            Agent added successfully!
          </div>
        )}

        {error && (
          <div className="mb-4 text-sm text-red-600 bg-red-50 p-3 rounded animate-fade-in-down flex items-center">
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            {error}
          </div>
        )}

        <form id="agentForm" onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Name</label>
            <input
              type="text"
              name="name"
              required
              value={formData.name}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Mobile Number</label>
            <input
              type="tel"
              name="mobileNumber"
              required
              pattern="[0-9]{10}"
              value={formData.mobileNumber}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              placeholder="10 digit mobile number"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Password</label>
            <input
              type="password"
              name="password"
              required
              minLength="6"
              value={formData.password}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Address</label>
            <textarea
              name="address"
              required
              value={formData.address}
              onChange={handleChange}
              rows="3"
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Role</label>
            <select
              name="role"
              required
              value={formData.role}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            >
              <option value="agent">Agent</option>
              <option value="admin">Admin</option>
            </select>
            <p className="mt-1 text-xs text-gray-500">
              {formData.role === 'admin' 
                ? 'Admin will have full access to manage properties and agents' 
                : 'Agent can only manage their own properties'
              }
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Profile Image</label>
            <input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="mt-1 block w-full text-sm text-gray-500
                file:mr-4 file:py-2 file:px-4
                file:rounded-md file:border-0
                file:text-sm file:font-semibold
                file:bg-indigo-50 file:text-indigo-700
                hover:file:bg-indigo-100"
            />
          </div>

          {imagePreview && (
            <div className="relative w-20 h-20">
              <img
                src={imagePreview}
                alt="Profile preview"
                className="w-full h-full object-cover rounded-full"
              />
              <button
                type="button"
                onClick={() => {
                  setImagePreview(null);
                  setFormData(prev => ({ ...prev, image: null }));
                }}
                className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          )}

          <div className="mt-5">
            <button
              type="submit"
              disabled={loading}
              className={`w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white 
                ${loading ? 'bg-indigo-400 cursor-not-allowed' : 'bg-indigo-600 hover:bg-indigo-700'} 
                focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 
                transition-all duration-150 ease-in-out
                ${loading ? 'animate-pulse' : ''}`}
            >
              {loading ? (
                <div className="flex items-center">
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Adding Agent...
                </div>
              ) : (
                'Add Agent'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddAgentModal; 