import { useState } from 'react';

const statusStyles = {
  pending: {
    bg: 'bg-yellow-50',
    text: 'text-yellow-700',
    border: 'border-yellow-200',
    label: 'Pending',
  },
  confirmed: {
    bg: 'bg-blue-50',
    text: 'text-blue-700',
    border: 'border-blue-200',
    label: 'Confirmed',
  },
  ongoing: {
    bg: 'bg-purple-50',
    text: 'text-purple-700',
    border: 'border-purple-200',
    label: 'In Progress',
  },
  completed: {
    bg: 'bg-green-50',
    text: 'text-green-700',
    border: 'border-green-200',
    label: 'Completed',
  },
  cancelled: {
    bg: 'bg-red-50',
    text: 'text-red-700',
    border: 'border-red-200',
    label: 'Cancelled',
  },
};

// Safely format a date string from the backend ISO format
const formatDate = (dateStr) => {
  if (!dateStr) return '—';
  return new Date(dateStr).toLocaleDateString('en-US', {
    month: 'short', day: 'numeric', year: 'numeric',
  });
};

const BookingCard = ({ booking, onAccept, onReject, onStart, onComplete, onViewLocation }) => {
  const [actionLoading, setActionLoading] = useState(null);

  // Map backend fields → display fields
  const isCompleted = booking.status === 'completed';
  const serviceName = booking.serviceType || booking.serviceName || 'Service';
  const userName = booking.user?.name || booking.userName || 'Customer';
  const { status, date, description } = booking;
  const id = booking._id || booking.id;

  const currentStatusStyle = statusStyles[status] || statusStyles.pending;

  const handleAction = async (actionFn, actionKey) => {
    setActionLoading(actionKey);
    try {
      await actionFn(id);
    } finally {
      setActionLoading(null);
    }
  };

  return (
    <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm hover:shadow-md transition-shadow duration-300">
      {/* Header */}
      <div className="flex justify-between items-start mb-3">
        <div className="flex-1 min-w-0 pr-3">
          <h4 className="text-base font-bold text-gray-900 mb-0.5 truncate">{serviceName}</h4>
          <p className="text-sm text-gray-500">Customer: <span className="font-medium text-gray-700">{userName}</span></p>
        </div>
        <span className={`flex-shrink-0 px-3 py-1 rounded-full text-xs font-semibold border ${currentStatusStyle.bg} ${currentStatusStyle.text} ${currentStatusStyle.border}`}>
          {currentStatusStyle.label}
        </span>
      </div>

      {/* Meta Info */}
      <div className="flex items-center gap-4 text-xs text-gray-500 mb-4">
        <span className="flex items-center gap-1.5">
          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
          {formatDate(date)}
        </span>
        {description && (
          <span className="truncate max-w-[140px]" title={description}>{description}</span>
        )}
      </div>

      {/* Action Buttons */}
      {/* Action Buttons */}
      <div className="flex flex-col gap-2">

        {/* View Location */}
        <button
          onClick={() => onViewLocation(id)}
          className="w-full px-3 py-2 bg-gray-100 hover:bg-gray-200 text-gray-800 text-sm font-medium rounded-xl transition-colors"
        >
          View Location
        </button>

        {/* Action Buttons Row */}
        <div className="flex items-center gap-2">

          {status === 'pending' && (
            <>
              <button
                onClick={() => handleAction(onAccept, 'accept')}
                disabled={!!actionLoading}
                className="flex-1 px-3 py-2 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-60 text-white text-sm font-medium rounded-xl transition-colors"
              >
                {actionLoading === 'accept' ? 'Accepting…' : 'Accept'}
              </button>

              <button
                onClick={() => handleAction(onReject, 'reject')}
                disabled={!!actionLoading}
                className="flex-1 px-3 py-2 bg-white border border-red-200 text-red-600 hover:bg-red-50 disabled:opacity-60 text-sm font-medium rounded-xl transition-colors"
              >
                {actionLoading === 'reject' ? 'Rejecting…' : 'Reject'}
              </button>
            </>
          )}

          {status === 'confirmed' && (
            <button
              onClick={() => handleAction(onStart, 'start')}
              disabled={!!actionLoading}
              className="w-full px-3 py-2 bg-blue-600 hover:bg-blue-700 disabled:opacity-60 text-white text-sm font-medium rounded-xl transition-colors"
            >
              {actionLoading === 'start' ? 'Starting…' : 'Start Service'}
            </button>
          )}

          {status === 'ongoing' && (
            <button
              onClick={() => handleAction(onComplete, 'complete')}
              disabled={!!actionLoading}
              className="w-full px-3 py-2 bg-purple-600 hover:bg-purple-700 disabled:opacity-60 text-white text-sm font-medium rounded-xl transition-colors"
            >
              {actionLoading === 'complete' ? 'Completing…' : 'Complete Service'}
            </button>
          )}

          {(status === 'completed' || status === 'cancelled') && (
            <div className="w-full text-center text-xs font-medium text-gray-400 bg-gray-50 py-2 rounded-xl border border-gray-100">
              No actions available
            </div>
          )}

        </div>
      </div>
    </div>
  );
};

export default BookingCard;

