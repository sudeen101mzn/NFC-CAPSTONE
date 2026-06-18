const { errorResponse } = require('../utils/response');

const notFoundHandler = (req, res, next) => {
  return errorResponse({
    res,
    message: `Route not found: ${req.originalUrl}`,
    statusCode: 404,
  });
};

const errorHandler = (err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  const message = err.message || 'Internal Server Error';

  if (err.name === 'ValidationError') {
    return errorResponse({
      res,
      message: 'Validation failed',
      statusCode: 400,
      error: err.errors,
    });
  }

  if (err.name === 'MongoServerError' && err.code === 11000) {
    return errorResponse({
      res,
      message: 'Duplicate field value entered',
      statusCode: 409,
      error: err.keyValue,
    });
  }

  if (err.name === 'ZodError') {
    return errorResponse({
      res,
      message: 'Validation failed',
      statusCode: 400,
      error: err.errors,
    });
  }

  return errorResponse({
    res,
    message,
    statusCode,
    error: process.env.NODE_ENV === 'development' ? err.stack : undefined,
  });
};

module.exports = {
  notFoundHandler,
  errorHandler,
};
