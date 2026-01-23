// backend/middleware/errorHandler.js

// Not Found Handler
export const notFound = (req, res, next) => {
  const error = new Error(`Not Found - ${req.originalUrl}`);
  res.status(404);
  next(error);
};

// General Error Handler
export const errorHandler = (err, req, res, next) => {
  // Get status code (default to 500)
  const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
  
  // Log error in development
  if (process.env.NODE_ENV === 'development') {
    console.error('Error:', err);
  }

  res.status(statusCode).json({
    success: false,
    message: err.message,
    // Only send stack trace in development
    stack: process.env.NODE_ENV === 'development' ? err.stack : undefined,
    // Additional error details
    error: process.env.NODE_ENV === 'development' ? err : undefined
  });
};

// Mongoose Error Handler
export const handleMongooseError = (err, req, res, next) => {
  // Duplicate key error
  if (err.code === 11000) {
    const field = Object.keys(err.keyPattern)[0];
    return res.status(400).json({
      success: false,
      message: `${field} already exists`,
      field: field
    });
  }

  // Validation error
  if (err.name === 'ValidationError') {
    const errors = Object.values(err.errors).map(e => e.message);
    return res.status(400).json({
      success: false,
      message: 'Validation failed',
      errors: errors
    });
  }

  // Cast error (invalid ObjectId)
  if (err.name === 'CastError') {
    return res.status(400).json({
      success: false,
      message: `Invalid ${err.path}: ${err.value}`
    });
  }

  next(err);
};

// Async Handler Wrapper (to avoid try-catch in every controller)
export const asyncHandler = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};