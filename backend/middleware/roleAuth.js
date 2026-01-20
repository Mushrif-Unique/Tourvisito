export const agencyOnly = (req, res, next) => {
  if (req.user.role !== "agency") {
    return res.status(403).json({ message: "Agency only" });
  }
  next();
};
