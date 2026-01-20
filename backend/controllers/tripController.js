import Trip from "../models/Trip.js";

export const createTrip = async (req, res) => {
  const trip = await Trip.create({ ...req.body, createdBy: req.user.id });
  res.status(201).json(trip);
};

export const getTrips = async (req, res) => {
  res.json(await Trip.find());
};
