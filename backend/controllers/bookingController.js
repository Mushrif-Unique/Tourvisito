import Booking from "../models/Booking.js";

export const createBooking = async (req, res) => {
  const booking = await Booking.create({
    user: req.user.id,
    trip: req.body.trip
  });
  res.status(201).json(booking);
};
