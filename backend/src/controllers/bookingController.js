import Booking from '../models/Booking.js';
import Service from '../models/Service.js';
import User from '../models/User.js';

// @route   POST /api/bookings
// @access  Protected (Customer)
// @desc    Create a new booking request
export const createBooking = async (req, res) => {
  try {
    const { serviceType, description, date, address, location } = req.body;

    if (!serviceType || !date || !address) {
      return res.status(400).json({
        message: "serviceType, date and address are required."
      });
    }

    if (!location || location.lat == null || location.lng == null) {
      return res.status(400).json({
        message: "Valid location coordinates are required."
      });
    }

    console.log("Incoming booking:", req.body);

    const booking = await Booking.create({
      user: req.user._id,
      serviceType,
      description: description || '',
      date,
      address,
      location: {
        type: "Point",
        coordinates: [location.lng, location.lat], // ✅ FIXED
      },
      status: 'pending',
      acceptedBy: null,
    });

    res.status(201).json(booking);

  } catch (error) {
    console.error("Create booking error:", error);
    res.status(500).json({ message: 'Server Error' });
  }
};

// @route   GET /api/bookings/my
// @access  Protected (Customer)
// @desc    Get all bookings for the logged-in customer
export const getUserBookings = async (req, res) => {
  try {
    const bookings = await Booking.find({ user: req.user._id })
      .populate('acceptedBy', 'name email')
      .sort({ createdAt: -1 });

    res.json(bookings);
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
};

// @route   GET /api/bookings/vendor
// @access  Protected (Vendor only)
// @desc    Get pending bookings that match the vendor's offered services
export const getVendorBookings = async (req, res) => {
  try {
    const vendor = await User.findById(req.user._id);

    if (!vendor || !vendor.services || vendor.services.length === 0) {
      return res.status(400).json({ message: 'Vendor has no services configured.' });
    }

    if (!vendor.location || !vendor.location.coordinates) {
      return res.status(400).json({ message: 'Vendor location not found.' });
    }

    const [vendorLng, vendorLat] = vendor.location.coordinates;

    const bookings = await Booking.find({
      status: 'pending',
      acceptedBy: null,

      serviceType: {
        $in: vendor.services.map(service => new RegExp(`^${service}$`, 'i'))
      },

      location: {
        $near: {
          $geometry: {
            type: "Point",
            coordinates: [vendorLng, vendorLat],
          },
          $maxDistance: 10000 // ✅ 10 km
        }
      }
    })
      .populate('user', 'name email')
      .populate('acceptedBy', 'name email')
      .sort({ createdAt: -1 });

    res.json(bookings);

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
};

// @route   GET /api/bookings/vendor/active
// @access  Protected (Vendor only)
// @desc    Get confirmed and ongoing bookings for the logged-in vendor
export const getVendorActiveBookings = async (req, res) => {
  try {
    const bookings = await Booking.find({
      acceptedBy: req.user._id,
      status: { $in: ['confirmed', 'ongoing'] },
    })
      .populate('user', 'name email')
      .populate('acceptedBy', 'name email')
      .sort({ date: 1 });

    res.json(bookings);
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
};

// @route   PUT /api/bookings/:id/accept
// @access  Protected (Vendor only)
// @desc    Atomically accept a booking – only one vendor can ever succeed
export const acceptBooking = async (req, res) => {
  try {
    // Atomic find + update: only matches if still pending and not yet claimed
    const booking = await Booking.findOneAndUpdate(
      {
        _id: req.params.id,
        status: 'pending',
        acceptedBy: null,
      },
      {
        status: 'confirmed',
        acceptedBy: req.user._id,
      },
      { new: true }
    ).populate('user', 'name email')
      .populate('acceptedBy', 'name email');

    if (!booking) {
      // Either doesn't exist or was already accepted by another vendor
      return res.status(409).json({ message: 'Booking already accepted or not found.' });
    }

    res.json(booking);
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
};

// @route   PUT /api/bookings/:id/start
// @access  Protected (Vendor only)
// @desc    Mark a confirmed booking as ongoing (service has started)
export const startBooking = async (req, res) => {
  try {
    const booking = await Booking.findOneAndUpdate(
      {
        _id: req.params.id,
        acceptedBy: req.user._id, // Only the vendor who accepted can start it
        status: 'confirmed',
      },
      { status: 'ongoing' },
      { new: true }
    );

    if (!booking) {
      return res.status(404).json({ message: 'Booking not found or cannot be started.' });
    }

    res.json(booking);
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
};

// @route   PUT /api/bookings/:id/complete
// @access  Protected (Vendor only)
// @desc    Mark an ongoing booking as completed
export const completeBooking = async (req, res) => {
  try {
    const booking = await Booking.findOneAndUpdate(
      {
        _id: req.params.id,
        acceptedBy: req.user._id,
        status: 'ongoing',
      },
      { status: 'completed' },
      { new: true }
    );

    if (!booking) {
      return res.status(404).json({ message: 'Booking not found or cannot be completed.' });
    }

    res.json(booking);
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
};

// @route   PUT /api/bookings/:id/cancel
// @access  Protected (Customer or the accepting Vendor)
// @desc    Cancel a pending or confirmed booking
export const cancelBooking = async (req, res) => {
  try {
    const userId = req.user._id.toString();

    const booking = await Booking.findById(req.params.id);

    if (!booking) {
      return res.status(404).json({ message: 'Booking not found.' });
    }

    // Allow only the booking's customer or the accepting vendor to cancel
    const isOwner = booking.user.toString() === userId;
    const isVendor = booking.acceptedBy?.toString() === userId;

    if (!isOwner && !isVendor) {
      return res.status(403).json({ message: 'Not authorized to cancel this booking.' });
    }

    if (!['pending', 'confirmed'].includes(booking.status)) {
      return res.status(400).json({ message: 'Only pending or confirmed bookings can be cancelled.' });
    }

    booking.status = 'cancelled';
    await booking.save();

    res.json(booking);
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
};

// @route   GET /api/bookings/vendor/completed
// @access  Protected (Vendor only)
// @desc    Get completed bookings for the logged-in vendor
export const getVendorCompletedBookings = async (req, res) => {
  try {
    const bookings = await Booking.find({
      acceptedBy: req.user._id,
      status: 'completed',
    })
      .populate('user', 'name email')
      .populate('acceptedBy', 'name email')
      .sort({ updatedAt: -1 }); // latest completed first

    res.json(bookings);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
};


const getFinalPrice = async (serviceId) => {
  const service = await Service.findById(serviceId);

  if (!service) {
    throw new Error("Service not found");
  }

  let finalPrice = service.basePrice;

  if (
    service.isOfferActive &&
    (!service.validTill || service.validTill > new Date())
  ) {
    finalPrice =
      finalPrice - (finalPrice * service.discount) / 100;
  }

  return {
    finalPrice: Math.round(finalPrice),
    originalPrice: service.basePrice,
    discount: service.isOfferActive ? service.discount : 0,
    service, // optional (very useful)
  };
};
// @route   GET /api/bookings/:id
// @access  Protected (Customer or Vendor)
// @desc    Get single booking by ID
export const getBookingById = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id)
      .populate('user', 'name email')
      .populate('acceptedBy', 'name email');

    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    // Fetch vendor (acceptedBy)
    let vendorLocation = null;

    if (booking.acceptedBy) {
      const vendor = await User.findById(booking.acceptedBy._id);

      if (vendor?.location?.coordinates) {
        vendorLocation = {
          lat: vendor.location.coordinates[1],
          lng: vendor.location.coordinates[0],
        };
      }
    }

    // Format response
    const formattedBooking = {
      ...booking._doc,
      location: {
        lat: booking.location.coordinates[1],
        lng: booking.location.coordinates[0],
      },
      vendorLocation, // ✅ NEW
    };

    res.json(formattedBooking);

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
};