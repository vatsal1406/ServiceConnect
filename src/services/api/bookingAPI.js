import api from './axiosConfig';

// ─── Customer APIs ────────────────────────────────────────────────────────────

// POST /api/bookings — create a new booking
export const createBooking = async (payload) => {
  const response = await api.post('/bookings', payload);
  return response.data;
};

// GET /api/bookings/my — fetch all bookings for the logged-in customer
export const getUserBookings = async () => {
  const response = await api.get('/bookings/my');
  return response.data;
};

// PUT /api/bookings/:id/cancel — cancel a booking
export const cancelBooking = async (id) => {
  const response = await api.put(`/bookings/${id}/cancel`);
  return response.data;
};

// ─── Vendor APIs ──────────────────────────────────────────────────────────────

// GET /api/bookings/vendor — pending bookings matching vendor's services
export const getVendorPendingBookings = async () => {
  const response = await api.get('/bookings/vendor');
  return response.data;
};

// GET /api/bookings/vendor/active — confirmed + ongoing bookings for vendor
export const getVendorActiveBookings = async () => {
  const response = await api.get('/bookings/vendor/active');
  return response.data;
};

// GET /api/bookings/vendor/completed — completed bookings for vendor
export const getVendorCompletedBookings = async () => {
  const response = await api.get('/bookings/vendor/completed');
  return response.data;
};

// PUT /api/bookings/:id/accept — atomically accept a pending booking
export const acceptBooking = async (id) => {
  const response = await api.put(`/bookings/${id}/accept`);
  return response.data;
};

// PUT /api/bookings/:id/start — start a confirmed booking
export const startBooking = async (id) => {
  const response = await api.put(`/bookings/${id}/start`);
  return response.data;
};

// PUT /api/bookings/:id/complete — complete an ongoing booking
export const completeBooking = async (id) => {
  const response = await api.put(`/bookings/${id}/complete`);
  return response.data;
};

export const getBookingById = async (id) => {
  const response = await api.get(`/bookings/${id}`);
  return response.data;
};

export const updateVendorLocation = async (coords) => {
  const res = await api.put("/users/location", coords);
  return res.data;
};
