import express from 'express';
import {
  createBooking,
  getUserBookings,
  getVendorBookings,
  getVendorActiveBookings,
  acceptBooking,
  startBooking,
  completeBooking,
  cancelBooking,
  getBookingById,
  getVendorCompletedBookings
} from '../controllers/bookingController.js';
import { protect } from '../middleware/authMiddleware.js';
import { vendorOnly } from '../middleware/vendorMiddleware.js';

const router = express.Router();

// ─── Customer Routes ──────────────────────────────────────────────────────────

// POST /api/bookings — create a new booking
router.post('/', protect, createBooking);

// GET /api/bookings/my — get all bookings for the logged-in customer
router.get('/my', protect, getUserBookings);

// ─── Vendor Routes ────────────────────────────────────────────────────────────

// GET /api/bookings/vendor — get pending bookings matching vendor's services
router.get('/vendor', protect, vendorOnly, getVendorBookings);

// GET /api/bookings/vendor/active — get confirmed + ongoing bookings for vendor
router.get('/vendor/active', protect, vendorOnly, getVendorActiveBookings);

router.get('/vendor/completed', protect, vendorOnly, getVendorCompletedBookings);

// PUT /api/bookings/:id/accept — atomically accept a pending booking
router.put('/:id/accept', protect, vendorOnly, acceptBooking);

// PUT /api/bookings/:id/start — start service (confirmed → ongoing)
router.put('/:id/start', protect, vendorOnly, startBooking);

// PUT /api/bookings/:id/complete — complete service (ongoing → completed)
router.put('/:id/complete', protect, vendorOnly, completeBooking);

// ─── Shared Routes ────────────────────────────────────────────────────────────

// PUT /api/bookings/:id/cancel — cancel a booking (customer or vendor)
router.put('/:id/cancel', protect, cancelBooking);



router.get('/:id', protect, getBookingById);

export default router;
