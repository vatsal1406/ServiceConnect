import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import User from '../models/User.js';

// Generate tokens
const generateTokens = (id) => {
  const accessToken = jwt.sign({ id }, process.env.JWT_ACCESS_SECRET, { expiresIn: '15m' });
  const refreshToken = jwt.sign({ id }, process.env.JWT_REFRESH_SECRET, { expiresIn: '7d' });
  return { accessToken, refreshToken };
};

// @route POST /api/auth/signup
export const signup = async (req, res) => {
  try {
    const { name, email, password, role, services, location } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({
        message: 'Name, email, and password are required.'
      });
    }

    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: 'User already exists' });
    }

    if (role === 'Vendor') {
      if (!services || services.length === 0) {
        return res.status(400).json({
          message: 'Vendors must select at least one service.'
        });
      }

      if (!location || location.lat == null || location.lng == null) {
        return res.status(400).json({
          message: 'Vendors must provide location.'
        });
      }
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const safeServices = Array.isArray(services) ? services : [];

    const userData = {
      name,
      email,
      password: hashedPassword,
      role: role || 'Customer',
      services: role === 'Vendor'
        ? safeServices.map(s => s.toLowerCase().trim())
        : [],
    };

    // ✅ store GeoJSON
    if (
      role === 'Vendor' &&
      location &&
      location.lat != null &&
      location.lng != null
    ) {
      userData.location = {
        type: "Point",
        coordinates: [location.lng, location.lat],
      };
    }

    const user = await User.create(userData);

    res.status(201).json({
      message: 'User created successfully'
    });

  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
};

// @route POST /api/auth/login
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });

    if (user && (await bcrypt.compare(password, user.password))) {
      const { accessToken, refreshToken } = generateTokens(user._id);

      res.cookie('refreshToken', refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        path: '/',
        maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
      });

      res.json({
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          role: user.role
        },
        accessToken
      });
    } else {
      res.status(401).json({ message: 'Invalid credentials' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
};

// @route POST /api/auth/refresh
export const refresh = async (req, res) => {
  try {
    const refreshToken = req.cookies.refreshToken;
    if (!refreshToken) {
      return res.status(401).json({ message: 'Not authorized, no refresh token' });
    }

    const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);
    const user = await User.findById(decoded.id).select('-password');

    if (!user) {
      return res.status(401).json({ message: 'Not authorized' });
    }

    const accessToken = jwt.sign({ id: user._id }, process.env.JWT_ACCESS_SECRET, { expiresIn: '15m' });
    res.json({ user, accessToken });
  } catch (error) {
    console.log("REFRESH ERROR:", error.message);
    res.status(401).json({ message: 'Not authorized, token failed' });
  }
};

// @route POST /api/auth/logout
export const logout = async (req, res) => {
  try {
    res.clearCookie('refreshToken');
    res.json({ message: 'Logged out successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
};
