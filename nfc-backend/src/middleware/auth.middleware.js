const jwt = require('jsonwebtoken');
const User = require('../models/user.model');
const { errorResponse } = require('../utils/response');

const protect = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return errorResponse({
        res,
        message: 'Authorization token required',
        statusCode: 401,
      });
    }

    const token = authHeader.split(' ')[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id);

    if (!user) {
      return errorResponse({
        res,
        message: 'Invalid authorization token',
        statusCode: 401,
      });
    }

    req.user = user;
    next();
  } catch (error) {
    return errorResponse({
      res,
      message: 'Unauthorized access',
      statusCode: 401,
      error: error.message,
    });
  }
};

module.exports = {
  protect,
};
