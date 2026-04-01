import mongoose from 'mongoose';

const bookingSchema = new mongoose.Schema({
  // The customer who made the booking
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },

  // Type of service requested e.g. "Cleaning", "Plumbing"
  serviceType: {
    type: String,
    required: true,
    trim: true,
  },

  // Optional description / notes from the customer
  description: {
    type: String,
    default: '',
    trim: true,
  },

  // Requested date for the service
  date: {
    type: Date,
    required: true,
  },

  // Address string
  address: {
    type: String,
    required: true,
  },

  // Location coordinates
  location: {
    type: {
      type: String,
      enum: ['Point'], // GeoJSON type
      default: 'Point',
    },
    coordinates: {
      type: [Number], // [longitude, latitude]
      required: true,
    },
  },

  // Lifecycle status of the booking
  status: {
    type: String,
    enum: ['pending', 'confirmed', 'ongoing', 'completed', 'cancelled'],
    default: 'pending',
  },

  // The vendor who accepted — null until a vendor claims it
  acceptedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    default: null,
  },
}, {
  timestamps: true,
});

bookingSchema.index({ location: "2dsphere" });

const Booking = mongoose.model('Booking', bookingSchema);
export default Booking;
