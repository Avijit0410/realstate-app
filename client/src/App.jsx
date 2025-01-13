import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Login from './pages/Login';
import AdminDashboard from './pages/AdminDashboard';
import AgentDashboard from './pages/AgentDashboard';
import PropertyDetails from './pages/PropertyDetails';
import PrivateRoute from './components/PrivateRoute';
import AdminRoute from './components/AdminRoute';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/" element={<Navigate to="/login" replace />} />
          
          {/* Admin Routes */}
          <Route
            path="/admin/*"
            element={
              <AdminRoute>
                <Routes>
                  <Route path="dashboard" element={<AdminDashboard />} />
                  <Route path="property/:id" element={<PropertyDetails />} />
                </Routes>
              </AdminRoute>
            }
          />

          {/* Agent Routes */}
          <Route
            path="/agent/*"
            element={
              <PrivateRoute>
                <Routes>
                  <Route path="dashboard" element={<AgentDashboard />} />
                  <Route path="property/:id" element={<PropertyDetails />} />
                </Routes>
              </PrivateRoute>
            }
          />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
