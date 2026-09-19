import User from '../models/User.js';
import bcrypt from 'bcryptjs';

export const getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.userId).select(
      '-password'
    );

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }

    return res.status(200).json({
      success: true,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        createdAt: user.createdAt,
      },
    });
  } catch (error) {
    console.error('Profile error:', error);

    return res.status(500).json({
      success: false,
      message: 'Server error',
    });
  }
};

export const updateProfile = async (req, res) => {
  try {
    const {name, email} = req.body;

    if (!name || !email) {
      return res.status(400).json({
        success: false,
        message: 'Name and email are required',
      });
    }

    const existingUser = await User.findOne({
      email: email.toLowerCase(),
      _id: {$ne: req.userId},
    });

    if (existingUser) {
      return res.status(409).json({
        success: false,
        message: 'Email already in use',
      });
    }

    const user = await User.findByIdAndUpdate(
      req.userId,
      {
        name: name.trim(),
        email: email.toLowerCase().trim(),
      },
      {
        new: true,
        runValidators: true,
      },
    ).select('-password');

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }

    return res.status(200).json({
      success: true,
      message: 'Profile updated successfully',
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        createdAt: user.createdAt,
      },
    });
  } catch (error) {
    console.error('Update profile error:', error);

    return res.status(500).json({
      success: false,
      message: 'Server error while updating profile',
    });
  }
};

export const changePassword = async (req, res) => {
  try {
    const {currentPassword, newPassword} = req.body;

    if (!currentPassword || !newPassword) {
      return res.status(400).json({
        success: false,
        message: 'Current password and new password are required',
      });
    }

    if (newPassword.length < 8) {
      return res.status(400).json({
        success: false,
        message: 'New password must be at least 8 characters',
      });
    }

    const user = await User.findById(req.userId);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }

    const isMatch = await bcrypt.compare(
      currentPassword,
      user.password,
    );

    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Current password is incorrect',
      });
    }

    const hashedPassword = await bcrypt.hash(
      newPassword,
      10,
    );

    user.password = hashedPassword;

    await user.save();

    return res.status(200).json({
      success: true,
      message: 'Password changed successfully',
    });
  } catch (error) {
    console.error('Change password error:', error);

    return res.status(500).json({
      success: false,
      message: 'Server error while changing password',
    });
  }
};