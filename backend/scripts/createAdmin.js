import mongoose from 'mongoose';
import bcrypt from 'bcrypt';
import dotenv from 'dotenv';
import User from '../src/models/User.js';

dotenv.config();

const createAdmin = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    
    const adminExists = await User.findOne({ email: 'admin@serviceconnect.com' });
    
    if (adminExists) {
      console.log('Admin user already exists');
      process.exit();
    }
    
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash('admin123', salt);
    
    const adminUser = new User({
      name: 'Super Admin',
      email: 'admin@serviceconnect.com',
      password: hashedPassword,
      role: 'Admin',
      status: 'Approved'
    });
    
    await adminUser.save();
    console.log('Admin user created successfully');
    process.exit();
  } catch (error) {
    console.error('Error creating admin:', error);
    process.exit(1);
  }
};

createAdmin();
