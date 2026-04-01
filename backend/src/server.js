import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import connectDB from './config/db.js';
import authRoutes from './routes/authRoutes.js';
import adminRoutes from './routes/adminRoutes.js';
import bookingRoutes from './routes/bookingRoutes.js';
import userRoutes from "./routes/userRoutes.js";
import serviceRoutes from "./routes/serviceRoutes.js";
import cron from 'node-cron';
import Service from './models/Service.js';

// Load env variables
dotenv.config();

// Connect to MongoDB
connectDB();

const app = express();

// Middleware
app.use(express.json());
app.use(cookieParser());
app.use(cors({
  origin: "http://localhost:5173",
  credentials: true
}));

cron.schedule('0 0 * * *', async () => { // runs daily at midnight
  console.log('Running offer expiry check...');

  const now = new Date();

  const services = await Service.find({
    validTill: { $lt: now },
    isOfferActive: true
  });

  for (let service of services) {
    service.isOfferActive = false;
    service.discount = 0;
    service.validTill = null;
    await service.save();
  }

  console.log('Expired offers updated');
});

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/bookings', bookingRoutes);
app.use("/api/users", userRoutes);
app.use("/api/services", serviceRoutes);

app.get('/', (req, res) => {
  res.send('API is running...');
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
