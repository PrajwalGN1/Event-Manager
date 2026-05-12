const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Protect routes - Verify JWT
exports.protect = async (req, res, next) => {
  let token;

  // Check if header exists and starts with Bearer
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    try {
      // Get token from header (Format: "Bearer <token>")
      token = req.headers.authorization.split(' ')[1];

      // Verify token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // Get user from the token payload and attach to request object
      // We use select('-password') to ensure password is not attached to req.user
      req.user = await User.findById(decoded.id).select('-password');

      if (!req.user) {
        res.status(401);
        return next(new Error('Not authorized, user no longer exists'));
      }

      return next(); // Clean execution halt
    } catch (error) {
      res.status(401);
      return next(new Error('Not authorized, token failed'));
    }
  }

  if (!token) {
    res.status(401);
    return next(new Error('Not authorized, no token provided'));
  }
};

// Admin middleware - Check if user has admin role
exports.admin = (req, res, next) => {
  if (req.user && req.user.role === 'admin') {
    next();
  } else {
    res.status(403); // 403 Forbidden
    return next(new Error('Not authorized as an admin'));
  }
};
