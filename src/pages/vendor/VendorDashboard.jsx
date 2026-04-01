import { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import VendorLayout from '../../components/vendor/VendorLayout';
import DashboardCards from '../../components/vendor/DashboardCards';
import BookingCard from '../../components/vendor/BookingCard';
import { useNavigate } from 'react-router-dom';
import {
  getVendorPendingBookings,
  getVendorActiveBookings,
  getVendorCompletedBookings,
  acceptBooking,
  cancelBooking,
  startBooking,
  completeBooking,
} from '../../services/api/bookingAPI';

// Skeleton loader for cards
const CardSkeleton = () => (
  <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm animate-pulse">
    <div className="flex justify-between mb-3">
      <div className="space-y-2">
        <div className="h-4 w-36 bg-gray-100 rounded" />
        <div className="h-3 w-24 bg-gray-100 rounded" />
      </div>
      <div className="h-6 w-20 bg-gray-100 rounded-full" />
    </div>
    <div className="h-3 w-28 bg-gray-100 rounded mb-4" />
    <div className="flex gap-2">
      <div className="flex-1 h-9 bg-gray-100 rounded-xl" />
      <div className="flex-1 h-9 bg-gray-100 rounded-xl" />
    </div>
  </div>
);

const VendorDashboard = () => {
  const navigate = useNavigate();
  const [pendingBookings, setPendingBookings] = useState([]);
  const [activeBookings, setActiveBookings] = useState([]);
  const [completedBookings, setCompletedBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchAll = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const [pending, active, completed] = await Promise.all([
        getVendorPendingBookings(),
        getVendorActiveBookings(),
        getVendorCompletedBookings(),
      ]);
      setPendingBookings(pending);
      setActiveBookings(active);
      setCompletedBookings(completed);
    } catch {
      setError('Failed to load bookings. Please try again.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchAll(); }, [fetchAll]);

  // Derive stats from live data
  const stats = {
    total: pendingBookings.length + activeBookings.length,
    pending: pendingBookings.length,
    ongoing: activeBookings.filter(b => b.status === 'ongoing').length,
    completed: completedBookings.length,
  };

  // All bookings shown in "Recent" section (first 6)
  const recentBookings = [...pendingBookings, ...activeBookings].slice(0, 6);

  const handleAccept = async (id) => {
    try {
      await acceptBooking(id);
      fetchAll(); // Refetch so the accepted booking moves to active list
    } catch (err) {
      const msg = err.response?.status === 409
        ? 'Already accepted by another vendor.'
        : 'Action failed. Please try again.';
      alert(msg);
    }
  };

  const handleReject = async (id) => {
    try {
      await cancelBooking(id);
      setPendingBookings(prev => prev.filter(b => (b._id || b.id) !== id));
    } catch {
      alert('Failed to cancel booking.');
    }
  };

  const handleStart = async (id) => {
    try {
      await startBooking(id);
      setActiveBookings(prev => prev.map(b => (b._id || b.id) === id ? { ...b, status: 'ongoing' } : b));
    } catch {
      alert('Failed to start service.');
    }
  };

  const handleComplete = async (id) => {
    try {
      await completeBooking(id);
      fetchAll();
    } catch {
      alert('Failed to complete service.');
    }
  };

  const handleViewLocation = (id) => {
    navigate(`/vendor/map/${id}`);
  };

  return (
    <VendorLayout>
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-1">Welcome Back!</h2>
        <p className="text-gray-500 text-sm">Here's an overview of your services and bookings today.</p>
      </div>

      {/* Statistics Cards */}
      <DashboardCards stats={stats} />

      {/* Error */}
      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-100 rounded-xl text-sm text-red-600">
          {error}
          <button onClick={fetchAll} className="ml-3 font-semibold underline">Retry</button>
        </div>
      )}

      {/* Recent Bookings */}
      <div className="mt-8">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-xl font-bold text-gray-900">Recent Bookings</h3>
          <Link to="/vendor/bookings" className="text-sm font-medium text-indigo-600 hover:text-indigo-700">
            View All
          </Link>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {[1, 2, 3].map(n => <CardSkeleton key={n} />)}
          </div>
        ) : recentBookings.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {recentBookings.map(booking => (
              <BookingCard
                key={booking._id || booking.id}
                booking={booking}
                onAccept={handleAccept}
                onReject={handleReject}
                onStart={handleStart}
                onComplete={handleComplete}
                onViewLocation={handleViewLocation}
              />
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-2xl border border-gray-100 p-12 text-center shadow-sm">
            <h4 className="text-lg font-medium text-gray-900 mb-2">No recent bookings</h4>
            <p className="text-gray-500 text-sm">When customers book your services, they will appear here.</p>
          </div>
        )}
      </div>
    </VendorLayout>
  );
};

export default VendorDashboard;

