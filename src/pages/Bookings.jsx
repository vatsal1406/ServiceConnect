import { useState, useEffect, useCallback } from 'react';
import Navbar from '../components/Navbar';
import { getUserBookings, cancelBooking } from '../services/api/bookingAPI';

// ─── Status Styles Map ────────────────────────────────────────────────────────
const STATUS_CONFIG = {
  pending: {
    badge: 'bg-yellow-50 text-yellow-700 border-yellow-200',
    label: 'Pending',
    message: 'Waiting for a vendor to accept your request.',
  },
  confirmed: {
    badge: 'bg-blue-50 text-blue-700 border-blue-200',
    label: 'Confirmed',
    message: null,
  },
  ongoing: {
    badge: 'bg-purple-50 text-purple-700 border-purple-200',
    label: 'In Progress',
    message: 'A vendor is currently working on your service.',
  },
  completed: {
    badge: 'bg-green-50 text-green-700 border-green-200',
    label: 'Completed',
    message: null,
  },
  cancelled: {
    badge: 'bg-red-50 text-red-700 border-red-200',
    label: 'Cancelled',
    message: null,
  },
};

// Format ISO date to readable string
const fmtDate = (iso) => {
  if (!iso) return '—';
  return new Date(iso).toLocaleDateString('en-US', {
    month: 'short', day: 'numeric', year: 'numeric',
  });
};

// ─── Skeleton Loader ──────────────────────────────────────────────────────────
const Skeleton = () => (
  <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 animate-pulse">
    <div className="flex items-center gap-4 mb-4">
      <div className="w-11 h-11 bg-gray-100 rounded-xl flex-shrink-0" />
      <div className="flex-1 space-y-2">
        <div className="h-4 w-40 bg-gray-100 rounded" />
        <div className="h-3 w-28 bg-gray-100 rounded" />
      </div>
      <div className="h-6 w-24 bg-gray-100 rounded-full" />
    </div>
    <div className="h-3 w-60 bg-gray-100 rounded" />
  </div>
);

// ─── Individual Booking Card ──────────────────────────────────────────────────
const CustomerBookingCard = ({ booking, onCancel }) => {
  const cfg = STATUS_CONFIG[booking.status] || STATUS_CONFIG.pending;
  const [cancelling, setCancelling] = useState(false);

  const handleCancel = async () => {
    setCancelling(true);
    try {
      await onCancel(booking._id || booking.id);
    } finally {
      setCancelling(false);
    }
  };

  const canCancel = ['pending', 'confirmed'].includes(booking.status);
  const vendorName = booking.acceptedBy?.name;

  return (
    <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm hover:shadow-md transition-shadow duration-300">
      {/* Header row */}
      <div className="flex items-start justify-between mb-3 gap-3">
        <div className="flex items-start gap-3 min-w-0">
          <div className="w-10 h-10 bg-indigo-50 rounded-xl flex items-center justify-center flex-shrink-0 mt-0.5">
            <svg className="w-5 h-5 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
          </div>
          <div className="min-w-0">
            <h3 className="font-bold text-gray-900 text-base truncate">{booking.serviceType}</h3>
            <p className="text-xs text-gray-500 mt-0.5">{fmtDate(booking.date)}</p>
          </div>
        </div>
        <span className={`flex-shrink-0 px-2.5 py-1 rounded-full text-xs font-semibold border ${cfg.badge}`}>
          {cfg.label}
        </span>
      </div>

      {/* Status-specific messages */}
      {booking.status === 'pending' && (
        <p className="text-xs text-yellow-600 bg-yellow-50 rounded-lg px-3 py-2 mb-3 border border-yellow-100">
          {cfg.message}
        </p>
      )}
      {booking.status === 'confirmed' && vendorName && (
        <p className="text-xs text-blue-600 bg-blue-50 rounded-lg px-3 py-2 mb-3 border border-blue-100">
          Vendor: <span className="font-semibold">{vendorName}</span> has accepted your request.
        </p>
      )}
      {booking.status === 'ongoing' && (
        <p className="text-xs text-purple-600 bg-purple-50 rounded-lg px-3 py-2 mb-3 border border-purple-100">
          {cfg.message}
        </p>
      )}

      {/* Optional description */}
      {booking.description && (
        <p className="text-xs text-gray-500 mb-3 truncate" title={booking.description}>
          {booking.description}
        </p>
      )}

      {/* Cancel button */}
      {canCancel && (
        <button
          onClick={handleCancel}
          disabled={cancelling}
          className="w-full mt-2 py-2 border border-red-200 text-red-600 hover:bg-red-50 disabled:opacity-60 text-xs font-medium rounded-xl transition-colors"
        >
          {cancelling ? 'Cancelling…' : 'Cancel Booking'}
        </button>
      )}
    </div>
  );
};

// ─── Main Page ────────────────────────────────────────────────────────────────
export default function Bookings() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchBookings = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const data = await getUserBookings();
      setBookings(data);
    } catch {
      setError('Failed to load bookings. Please try again.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchBookings(); }, [fetchBookings]);

  const handleCancel = async (id) => {
    try {
      await cancelBooking(id);
      setBookings(prev =>
        prev.map(b => (b._id || b.id) === id ? { ...b, status: 'cancelled' } : b)
      );
    } catch {
      setError('Failed to cancel booking.');
    }
  };

  const upcoming = bookings.filter(b => ['pending', 'confirmed', 'ongoing'].includes(b.status));
  const past = bookings.filter(b => ['completed', 'cancelled'].includes(b.status));

  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      <Navbar />
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900">My Bookings</h1>
          <p className="mt-1 text-sm text-gray-500">Track and manage all your service requests.</p>
        </div>

        {/* Error Banner */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-100 rounded-xl text-sm text-red-600">
            {error}
            <button onClick={fetchBookings} className="ml-3 font-semibold underline">Retry</button>
          </div>
        )}

        {/* Loading */}
        {loading ? (
          <div className="space-y-4">
            {[1, 2, 3].map(n => <Skeleton key={n} />)}
          </div>

        ) : bookings.length === 0 ? (
          /* Empty state */
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-12 text-center">
            <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
            </div>
            <h3 className="text-lg font-bold text-gray-900 mb-2">No Bookings Yet</h3>
            <p className="text-sm text-gray-500">You haven't requested any services yet.</p>
          </div>

        ) : (
          <div className="space-y-10">
            {upcoming.length > 0 && (
              <div>
                <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-indigo-500" />
                  Upcoming &amp; Current
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {upcoming.map(b => (
                    <CustomerBookingCard key={b._id || b.id} booking={b} onCancel={handleCancel} />
                  ))}
                </div>
              </div>
            )}
            {past.length > 0 && (
              <div>
                <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-gray-400" />
                  Past Bookings
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {past.map(b => (
                    <CustomerBookingCard key={b._id || b.id} booking={b} onCancel={handleCancel} />
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
}
