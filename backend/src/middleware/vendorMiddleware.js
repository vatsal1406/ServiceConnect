// Guard middleware — allows only users with role 'Vendor' to proceed
export const vendorOnly = (req, res, next) => {
  if (req.user && req.user.role === 'Vendor') {
    return next();
  }
  return res.status(403).json({ message: 'Access denied. Vendors only.' });
};
