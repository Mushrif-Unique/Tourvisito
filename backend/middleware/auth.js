import jwt from "jsonwebtoken";
import User from "../models/User.js";

// Protect routes - Verify JWT token
export const protect = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ message: "No token provided" });
    }

    if (!process.env.JWT_SECRET) {
      return res.status(500).json({ message: "JWT secret not configured" });
    }

    const token = authHeader.split(" ")[1];

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Always trust DB, not token payload
    const user = await User.findById(decoded.id).select("-password");

    if (!user) {
      return res.status(401).json({ message: "User not found" });
    }

    // Attach trusted user data
    req.user = {
      id: user._id.toString(),
      role: user.role,
      email: user.email,
      name: user.name,
    };

    next();
  } catch (err) {
    console.error("Auth error:", err.message);

    if (err.name === "JsonWebTokenError") {
      return res.status(401).json({ message: "Invalid token" });
    }

    if (err.name === "TokenExpiredError") {
      return res.status(401).json({ message: "Token expired" });
    }

    return res.status(401).json({ message: "Authentication failed" });
  }
};

// Require specific role(s)
export const requireRole = (roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ message: "Not authenticated" });
    }

    const allowedRoles = Array.isArray(roles) ? roles : [roles];

    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).json({
        message: `Access denied. Required: ${allowedRoles.join(
          " or "
        )}. Your role: ${req.user.role}`,
      });
    }

    next();
  };
};

// Agency or Admin
export const agencyOnly = (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({ message: "Not authenticated" });
  }

  if (!["agency", "admin"].includes(req.user.role)) {
    return res
      .status(403)
      .json({ message: "Agency or Admin access required" });
  }

  next();
};

// Admin only
export const adminOnly = (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({ message: "Not authenticated" });
  }

  if (req.user.role !== "admin") {
    return res.status(403).json({ message: "Admin access required" });
  }

  next();
};

// User only
export const userOnly = (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({ message: "Not authenticated" });
  }

  if (req.user.role !== "user") {
    return res.status(403).json({ message: "User access only" });
  }

  next();
};

// Ownership verification
export const verifyOwnership = (Model, paramName = "id") => {
  return async (req, res, next) => {
    try {
      const resource = await Model.findById(req.params[paramName]);

      if (!resource) {
        return res.status(404).json({ message: "Resource not found" });
      }

      // Admin bypass
      if (req.user.role === "admin") {
        return next();
      }

      const ownerId = resource.createdBy || resource.user;

      if (!ownerId || ownerId.toString() !== req.user.id) {
        return res.status(403).json({ message: "Not authorized" });
      }

      next();
    } catch (error) {
      res.status(500).json({
        message: "Authorization check failed",
        error: error.message,
      });
    }
  };
};
