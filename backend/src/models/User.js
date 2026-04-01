import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    enum: ['Customer', 'Vendor', 'Admin'],
    default: 'Customer',
  },
  // Array of service types offered — only relevant for Vendor accounts
  services: {
    type: [String],
    default: [],
  },
  status: {
    type: String,
    enum: ['Pending', 'Approved', 'Rejected'],
    default: 'Pending',
  },

  location: {
    type: {
      type: String,
      enum: ['Point'], // GeoJSON type
      required: false
    },
    coordinates: {
      type: [Number], // [longitude, latitude]
      required: false
    },
  }


}, {
  timestamps: true
});

userSchema.index({ location: "2dsphere" });

const User = mongoose.model('User', userSchema);
export default User;
