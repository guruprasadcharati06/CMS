import jwt from "jsonwebtoken";
import User from "../models/User.model.js";

const normalizeRole = (role) => {
  const normalized = (role || "").trim().toLowerCase();
  if (normalized === "principal") return "admin";
  return normalized;
};

export const authenticate = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ message: "Authorization header missing" });
    }

    const token = authHeader.split(" ")[1];
    const secret = process.env.JWT_SECRET;
    if (!secret) {
      return res.status(500).json({ message: "JWT secret not configured" });
    }

    const payload = jwt.verify(token, secret);
    const user = await User.findById(payload.sub).select("-password");
    if (!user) {
      return res.status(401).json({ message: "Invalid token" });
    }

    const normalizedRole = normalizeRole(user.role);
    if (normalizedRole !== user.role) {
      user.role = normalizedRole;
    }
    req.user = { id: user._id.toString(), role: normalizedRole, data: user };
    return next();
  } catch (error) {
    return res.status(401).json({ message: "Unauthorized" });
  }
};

export const attachUserIfPresent = async (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return next();
  }

  try {
    const token = authHeader.split(" ")[1];
    const secret = process.env.JWT_SECRET;
    if (!secret) {
      return next();
    }

    const payload = jwt.verify(token, secret);
    const user = await User.findById(payload.sub).select("-password");
    if (!user) {
      return next();
    }

    const normalizedRole = normalizeRole(user.role);
    if (normalizedRole !== user.role) {
      user.role = normalizedRole;
    }
    req.user = { id: user._id.toString(), role: normalizedRole, data: user };
  } catch (error) {
    // Ignore token errors for optional authentication
  }

  return next();
};

export const authorizeRoles = (...roles) => (req, res, next) => {
  const allowedRoles = roles.map((role) => normalizeRole(role));
  const currentRole = normalizeRole(req.user?.role);

  if (!req.user || !allowedRoles.includes(currentRole)) {
    return res.status(403).json({ message: "Forbidden" });
  }
  return next();
};
