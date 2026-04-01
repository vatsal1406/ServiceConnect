import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import Splash from './pages/Splash';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Home from './pages/Home';
import ServiceListing from './pages/ServiceListing';
import Bookings from './pages/Bookings';
import Profile from './pages/Profile';
import AdminDashboard from './pages/admin/AdminDashboard';
import VendorDashboard from './pages/vendor/VendorDashboard';
import VendorBookings from './pages/vendor/VendorBookings';
import VendorMap from './pages/vendor/VendorMap';
import "leaflet/dist/leaflet.css";

const AppRoutes = () => {

  const { isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#F9FAFB]">
        <div className="animate-spin h-10 w-10 border-4 border-indigo-500 border-t-transparent rounded-full shadow-sm"></div>
      </div>
    );
  }

  return (
    <Routes>
      <Route path="/" element={<Splash />} />
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />
      <Route
        path="/home"
        element={
          <ProtectedRoute allowedRoles={['Customer']}>
            <Home />
          </ProtectedRoute>
        }
      />
      <Route
        path="/services/:categoryId"
        element={
          <ProtectedRoute allowedRoles={['Customer']}>
            <ServiceListing />
          </ProtectedRoute>
        }
      />
      <Route
        path="/bookings"
        element={
          <ProtectedRoute allowedRoles={['Customer']}>
            <Bookings />
          </ProtectedRoute>
        }
      />
      <Route
        path="/profile"
        element={
          <ProtectedRoute allowedRoles={['Customer']}>
            <Profile />
          </ProtectedRoute>
        }
      />
      {/* Secure Admin Route */}
      <Route
        path="/admin"
        element={
          <ProtectedRoute allowedRoles={['Admin']}>
            <AdminDashboard />
          </ProtectedRoute>
        }
      />
      {/* Secure Vendor Routes */}
      <Route
        path="/vendor/dashboard"
        element={
          <ProtectedRoute allowedRoles={['Vendor']}>
            <VendorDashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/vendor/bookings"
        element={
          <ProtectedRoute allowedRoles={['Vendor']}>
            <VendorBookings />
          </ProtectedRoute>
        }
      />
      <Route
        path="/vendor/map/:id"
        element={
          <ProtectedRoute allowedRoles={['Vendor']}>
            <VendorMap />
          </ProtectedRoute>
        }
      />
    </Routes>
  );
};

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <AppRoutes />
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
