import Service from '../models/Service.js';
import User from '../models/User.js';

// @route   GET /api/admin/dashboard
// @desc    Get system statistics
// @access  Private/Admin
export const getAdminStats = async (req, res) => {
  try {
    const totalUsers = await User.countDocuments({ role: 'Customer' });
    const totalVendors = await User.countDocuments({ role: 'Vendor' });
    const pendingVendors = await User.countDocuments({ role: 'Vendor', status: 'Pending' });

    res.json({
      totalUsers,
      totalVendors,
      pendingVendors,
      totalServices: 0 // Mocked for now, if no service model
    });
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};

// @route   GET /api/admin/users
// @desc    Get all users (Customers)
// @access  Private/Admin
export const getUsers = async (req, res) => {
  try {
    const users = await User.find({ role: 'Customer' }).select('-password');
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
};

// @route   GET /api/admin/vendors
// @desc    Get all vendors
// @access  Private/Admin
export const getVendors = async (req, res) => {
  try {
    const vendors = await User.find({ role: 'Vendor' }).select('-password');
    res.json(vendors);
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
};

// @route   PUT /api/admin/vendor/:id/approve
// @desc    Approve a vendor
// @access  Private/Admin
export const approveVendor = async (req, res) => {
  try {
    const vendor = await User.findById(req.params.id);

    if (!vendor || vendor.role !== 'Vendor') {
      return res.status(404).json({ message: 'Vendor not found' });
    }

    vendor.status = 'Approved';
    await vendor.save();

    res.json({ message: 'Vendor approved successfully', vendor });
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
};

// @route   PUT /api/admin/vendor/:id/reject
// @desc    Reject a vendor
// @access  Private/Admin
export const rejectVendor = async (req, res) => {
  try {
    const vendor = await User.findById(req.params.id);

    if (!vendor || vendor.role !== 'Vendor') {
      return res.status(404).json({ message: 'Vendor not found' });
    }

    vendor.status = 'Rejected';
    await vendor.save();

    res.json({ message: 'Vendor rejected successfully', vendor });
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
};

// @route   POST /api/admin/service
// @desc    Create a new service
// @access  Private/Admin
export const createService = async (req, res) => {
  try {
    const {
      name,
      category,
      desc,
      icon,
      basePrice,
      discount = 0,
      isOfferActive = false,
      validTill = null
    } = req.body;

    // 🔴 Validation
    if (!name || !category || !basePrice) {
      return res.status(400).json({
        message: 'Name, category and basePrice are required'
      });
    }

    // 🔴 Check duplicate
    const existing = await Service.findOne({ name });
    if (existing) {
      return res.status(400).json({ message: 'Service already exists' });
    }

    // ✅ Create service
    const service = await Service.create({
      name,
      category,
      desc,
      icon,
      basePrice,
      discount,
      isOfferActive,
      validTill
    });

    res.status(201).json({
      message: 'Service created successfully',
      service
    });

  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
};

// @route   PUT /api/admin/service/:id
// @desc    Update service pricing (basePrice + discount)
// @access  Private/Admin
export const updateServicePricing = async (req, res) => {
  try {
    const { name, basePrice, discount, isOfferActive, validTill } = req.body;

    // 🔍 Find by name from user input
    const service = await Service.findOne({ name });

    if (!service) {
      return res.status(404).json({ message: 'Service not found' });
    }

    // 🔄 Update fields
    if (basePrice !== undefined) service.basePrice = basePrice;
    if (discount !== undefined) service.discount = discount;
    if (isOfferActive !== undefined) service.isOfferActive = isOfferActive;
    if (validTill !== undefined) service.validTill = validTill;

    await service.save();

    res.json({
      message: 'Service updated successfully',
      service
    });

  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
};