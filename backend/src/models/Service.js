import mongoose from 'mongoose';

const serviceSchema = new mongoose.Schema(
    {
        // Service name (Cleaning, Plumbing, etc.)
        name: {
            type: String,
            required: true,
            trim: true,
            unique: true,
        },
        icon: {
            type: String,
            trim: true,
            default: 'default'
        },

        // Base/original price
        basePrice: {
            type: Number,
            required: true,
            min: 0,
        },

        // Discount percentage (0–100)
        discount: {
            type: Number,
            default: 0,
            min: 0,
            max: 100,
        },

        // Whether offer is active
        isOfferActive: {
            type: Boolean,
            default: false,
        },

        // Optional expiry date for offer
        validTill: {
            type: Date,
            default: null,
        },

        // Optional category (Home, Repair, etc.)
        category: {
            type: String,
            trim: true,
        },
        desc: {
            type: String,
            trim: true
        },
    },
    { timestamps: true }
);

export default mongoose.model('Service', serviceSchema);