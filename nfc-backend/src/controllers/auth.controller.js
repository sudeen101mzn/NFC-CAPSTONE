const User = require('../models/user.model');
const { generateToken } = require('../utils/generateToken');
const { registerSchema, loginSchema } = require('../validators/auth.validator');
const { successResponse, errorResponse } = require('../utils/response');

const register = async (req, res, next) => {
  try {
    const parsed = registerSchema.parse(req.body);

    const existingUser = await User.findOne({ email: parsed.email });
    if (existingUser) {
      return errorResponse({
        res,
        message: 'Email already registered',
        statusCode: 409,
      });
    }

    const user = await User.create(parsed);
    const token = generateToken(user._id);

    return successResponse({
      res,
      message: 'User registered successfully',
      data: {
        user,
        token,
      },
      statusCode: 201,
    });
  } catch (error) {
    next(error);
  }
};

const login = async (req, res, next) => {
  try {
    const parsed = loginSchema.parse(req.body);

    const user = await User.findOne({ email: parsed.email }).select('+password');
    if (!user) {
      return errorResponse({
        res,
        message: 'Invalid email or password',
        statusCode: 401,
      });
    }

    const isMatch = await user.matchPassword(parsed.password);
    if (!isMatch) {
      return errorResponse({
        res,
        message: 'Invalid email or password',
        statusCode: 401,
      });
    }

    const token = generateToken(user._id);
    user.password = undefined;

    return successResponse({
      res,
      message: 'Login successful',
      data: {
        user,
        token,
      },
    });
  } catch (error) {
    next(error);
  }
};

const getProfile = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) {
      return errorResponse({
        res,
        message: 'User not found',
        statusCode: 404,
      });
    }

    return successResponse({
      res,
      message: 'Profile fetched successfully',
      data: user,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  register,
  login,
  getProfile,
};
