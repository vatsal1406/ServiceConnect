import { useState, useEffect, useCallback } from 'react';
import { Calendar, Clock, RefreshCw } from 'lucide-react';
import VendorLayout from '../../components/vendor/VendorLayout';
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

const TABS = [
  { id: 'incoming', label: 'Incoming Requests', icon: Clock },
  { id: 'active', label: 'My Active Work', icon: Calendar },
  { id: 'completed', label: 'Completed Works', icon: Calendar },
];

const SkeletonCard = () => (
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

const VendorBookings = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('incoming');
  const [pendingBookings, setPendingBookings] = useState([]);
  const [activeBookings, setActiveBookings] = useState([]);
  const [completedBookings, setCompletedBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [actionError, setActionError] = useState('');

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
      setError('Failed to load bookings.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchAll(); }, [fetchAll]);

  const displayedBookings =
    activeTab === 'incoming'
      ? pendingBookings
      : activeTab === 'active'
        ? activeBookings
        : completedBookings; // ✅ NEW

  const handleAccept = async (id) => {
    setActionError('');
    try {
      await acceptBooking(id);
      fetchAll();
    } catch (err) {
      setActionError(
        err.response?.status === 409
          ? 'Already accepted by another vendor.'
          : 'Failed to accept booking.'
      );
    }
  };

  const handleReject = async (id) => {
    setActionError('');
    try {
      await cancelBooking(id);
      setPendingBookings(prev => prev.filter(b => (b._id || b.id) !== id));
    } catch {
      setActionError('Failed to reject booking.');
    }
  };

  const handleViewLocation = (id) => {
    navigate(`/vendor/map/${id}`);
  };

  const handleStart = async (id) => {
    setActionError('');
    try {
      await startBooking(id);
      setActiveBookings(prev =>
        prev.map(b => (b._id || b.id) === id ? { ...b, status: 'ongoing' } : b)
      );
    } catch {
      setActionError('Failed to start service.');
    }
  };

  const handleComplete = async (id) => {
    setActionError('');
    try {
      await completeBooking(id);
      fetchAll();
    } catch {
      setActionError('Failed to complete service.');
    }
  };

  return (
    <VendorLayout>
      {/* Page Header */}
      <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-1">Bookings Management</h2>
          <p className="text-sm text-gray-500">Accept incoming requests and manage your active jobs.</p>
        </div>
        <button
          onClick={fetchAll}
          className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-xl text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors shadow-sm"
        >
          <RefreshCw className="w-4 h-4" />
          Refresh
        </button>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-1 mb-8 border-b border-gray-200">
        {TABS.map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            onClick={() => { setActiveTab(id); setActionError(''); }}
            className={`relative flex items-center gap-2 px-4 py-3 text-sm font-medium transition-colors ${activeTab === id ? 'text-indigo-600' : 'text-gray-500 hover:text-gray-700'
              }`}
          >
            <Icon className="w-4 h-4" />
            {label}
            {id === 'incoming' && pendingBookings.length > 0 && (
              <span className="ml-1 bg-indigo-100 text-indigo-600 text-xs font-bold rounded-full px-1.5 py-0.5">
                {pendingBookings.length}
              </span>
            )}
            {id === 'completed' && completedBookings.length > 0 && (
              <span className="ml-1 bg-green-100 text-green-600 text-xs font-bold rounded-full px-1.5 py-0.5">
                {completedBookings.length}
              </span>
            )}
            {activeTab === id && (
              <span className="absolute bottom-0 left-0 w-full h-0.5 bg-indigo-600 rounded-t-full" />
            )}
          </button>
        ))}
      </div>

      {/* Action Error Banner */}
      {actionError && (
        <div className="mb-6 p-3 bg-red-50 border border-red-100 rounded-xl text-sm text-red-600 flex justify-between items-center">
          {actionError}
          <button onClick={() => setActionError('')} className="text-red-400 hover:text-red-600 font-bold text-lg leading-none">×</button>
        </div>
      )}

      {/* Fetch Error */}
      {error && !loading && (
        <div className="mb-6 p-4 bg-red-50 border border-red-100 rounded-xl text-sm text-red-600">
          {error}
          <button onClick={fetchAll} className="ml-3 font-semibold underline">Retry</button>
        </div>
      )}

      {/* Bookings Grid */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {[1, 2, 3].map(n => <SkeletonCard key={n} />)}
        </div>
      ) : displayedBookings.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {displayedBookings.map(booking => (
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
        <div className="bg-white rounded-2xl border border-gray-100 p-16 text-center shadow-sm flex flex-col items-center">
          <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mb-4">
            <Calendar className="w-8 h-8 text-gray-400" />
          </div>
          <h4 className="text-lg font-semibold text-gray-900 mb-2">No bookings found</h4>
          <p className="text-gray-500 text-sm max-w-sm">
            {activeTab === 'incoming'
              ? "No pending requests matching your services right now."
              : "You don't have any active or ongoing jobs."}
          </p>
        </div>
      )}
    </VendorLayout>
  );
};

export default VendorBookings;
