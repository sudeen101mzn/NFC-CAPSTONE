const User = require('../models/user.model');
const bcrypt = require('bcryptjs');
const { generateToken, verifyToken } = require('../utils/generateToken');
const { successResponse, responses } = require('../utils/response');
const { asyncHandler, AppError } = require('../middleware/error.middleware');
const { 
  validate, 
  registerSchema, 
  loginSchema,
  changePasswordSchema,
  updateProfileSchema 
} = require('../utils/validations');

/**
 * @route   POST /api/auth/register
 * @desc    Register a new user
 * @access  Public
 */
exports.register = asyncHandler(async (req, res, next) => {
  // Validate input
  const validation = validate(registerSchema, req.body);
  if (!validation.success) {
    return responses.badRequest(res, 'Validation failed', validation.errors);
  }

  const { name, email, mobileNumber, password } = validation.data;

  // Check if user already exists
  const userExists = await User.findOne({
    $or: [{ email }, { mobileNumber }],
  });

  if (userExists) {
    throw new AppError(
      `User with this ${userExists.email === email ? 'email' : 'mobile number'} already exists`,
      409,
      'USER_EXISTS'
    );
  }

  // Hash password
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);

  // Create user
  const user = await User.create({
    name,
    email,
    mobileNumber,
    password: hashedPassword,
  });

  // Generate token
  const token = generateToken(user._id);

  // Return response
  return successResponse(res, {
    statusCode: 201,
    message: 'User registered successfully',
    data: {
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        mobileNumber: user.mobileNumber,
        role: user.role,
      },
      token,
    },
  });
});

/**
 * @route   POST /api/auth/login
 * @desc    Login user
 * @access  Public
 */
exports.login = asyncHandler(async (req, res, next) => {
  // Validate input
  const validation = validate(loginSchema, req.body);
  if (!validation.success) {
    return responses.badRequest(res, 'Validation failed', validation.errors);
  }

  const { email, password } = validation.data;

  // Find user and explicitly select password
  const user = await User.findOne({ email }).select('+password');

  if (!user) {
    throw new AppError('Invalid email or password', 401, 'INVALID_CREDENTIALS');
  }

  // Check password
  const isPasswordValid = await user.comparePassword(password);

  if (!isPasswordValid) {
    throw new AppError('Invalid email or password', 401, 'INVALID_CREDENTIALS');
  }

  // Update last login
  user.lastLogin = new Date();
  await user.save();

  // Generate token
  const token = generateToken(user._id);

  // Return response
  return successResponse(res, {
    statusCode: 200,
    message: 'Login successful',
    data: {
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        mobileNumber: user.mobileNumber,
        role: user.role,
        balance: user.balance,
      },
      token,
    },
  });
});

/**
 * @route   GET /api/auth/me
 * @desc    Get current user profile
 * @access  Private
 */
exports.getMe = asyncHandler(async (req, res, next) => {
  const user = await User.findById(req.userId);

  if (!user) {
    throw new AppError('User not found', 404, 'USER_NOT_FOUND');
  }

  return successResponse(res, {
    statusCode: 200,
    message: 'User profile retrieved successfully',
    data: {
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        mobileNumber: user.mobileNumber,
        role: user.role,
        balance: user.balance,
        isTappedIn: user.isTappedIn,
        nfcUid: user.nfcUid,
        createdAt: user.createdAt,
        lastLogin: user.lastLogin,
      },
    },
  });
});

/**
 * @route   PUT /api/auth/profile
 * @desc    Update user profile
 * @access  Private
 */
exports.updateProfile = asyncHandler(async (req, res, next) => {
  // Validate input
  const validation = validate(updateProfileSchema, req.body);
  if (!validation.success) {
    return responses.badRequest(res, 'Validation failed', validation.errors);
  }

  const { name, mobileNumber } = validation.data;

  // Check if mobile number is already taken
  if (mobileNumber) {
    const existingUser = await User.findOne({
      mobileNumber,
      _id: { $ne: req.userId },
    });
    if (existingUser) {
      throw new AppError('Mobile number already in use', 409, 'MOBILE_IN_USE');
    }
  }

  // Update user
  const user = await User.findByIdAndUpdate(
    req.userId,
    { name, mobileNumber },
    { new: true, runValidators: true }
  );

  return successResponse(res, {
    statusCode: 200,
    message: 'Profile updated successfully',
    data: { user },
  });
});

/**
 * @route   POST /api/auth/change-password
 * @desc    Change user password
 * @access  Private
 */
exports.changePassword = asyncHandler(async (req, res, next) => {
  // Validate input
  const validation = validate(changePasswordSchema, req.body);
  if (!validation.success) {
    return responses.badRequest(res, 'Validation failed', validation.errors);
  }

  const { oldPassword, newPassword } = validation.data;

  // Get user with password
  const user = await User.findById(req.userId).select('+password');

  if (!user) {
    throw new AppError('User not found', 404, 'USER_NOT_FOUND');
  }

  // Verify old password
  const isPasswordValid = await user.comparePassword(oldPassword);
  if (!isPasswordValid) {
    throw new AppError('Old password is incorrect', 401, 'INVALID_PASSWORD');
  }

  // Hash new password
  const salt = await bcrypt.genSalt(10);
  user.password = await bcrypt.hash(newPassword, salt);
  await user.save();

  return successResponse(res, {
    statusCode: 200,
    message: 'Password changed successfully',
    data: null,
  });
});

/**
 * @route   POST /api/auth/logout
 * @desc    Logout user (client-side token removal)
 * @access  Private
 */
exports.logout = asyncHandler(async (req, res, next) => {
  return successResponse(res, {
    statusCode: 200,
    message: 'Logout successful. Please remove the token from client.',
    data: null,
  });
});
