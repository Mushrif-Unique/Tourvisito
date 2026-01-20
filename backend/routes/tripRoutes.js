import express from "express";
import { createTrip, getTrips } from "../controllers/tripController.js";
import { protect } from "../middleware/auth.js";
import { agencyOnly } from "../middleware/roleAuth.js";

const router = express.Router();

router.post("/", protect, agencyOnly, createTrip);
router.get("/", getTrips);

export default router;
