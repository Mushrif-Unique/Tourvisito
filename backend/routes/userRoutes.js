import express from "express";
import { register, login } from "../controllers/authController.js";
import {
  getProfile,
  updateProfile,
  getAllUsers,
  updateUserRole,
  deleteUser
} from "../controllers/userController.js";
import { protect, requireRole } from "../middleware/auth.js";

const router = express.Router();

// AUTH
router.post("/register", register);
router.post("/login", login);

// USER ROUTES
router.get("/profile", protect, getProfile);
router.put("/profile", protect, updateProfile);

// ADMIN ROUTES
router.get("/admin/all", protect, requireRole("admin"), getAllUsers);
router.put("/admin/:userId/role", protect, requireRole("admin"), updateUserRole);
router.delete("/admin/:userId", protect, requireRole("admin"), deleteUser);

export default router;
