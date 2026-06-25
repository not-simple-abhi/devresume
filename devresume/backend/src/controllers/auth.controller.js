import jwt from 'jsonwebtoken';
import { signupUser, loginUser } from '../services/auth.service.js';
import { formatSuccessResponse } from '../utils/responseFormatter.js';
import { config } from '../config/env.js';

export const signup = async (req, res, next) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ success: false, message: 'All fields are required' });
    }

    const user = await signupUser(name, email, password);
    res.status(201).json(formatSuccessResponse(user, 'User registered successfully'));
  } catch (error) {
    next(error);
  }
};

export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ success: false, message: 'Email and password are required' });
    }

    const result = await loginUser(email, password);
    res.status(200).json(formatSuccessResponse(result, 'Login successful'));
  } catch (error) {
    next(error);
  }
};

export const refreshToken = async (req, res, next) => {
  try {
    const { refreshToken } = req.body;

    if (!refreshToken) {
      return res.status(400).json({ success: false, message: 'Refresh token is required' });
    }

    const decoded = jwt.verify(refreshToken, config.jwtRefreshSecret);

    const accessToken = jwt.sign(
      { userId: decoded.userId, email: decoded.email },
      config.jwtSecret,
      { expiresIn: config.jwtExpiresIn }
    );

    res.status(200).json(formatSuccessResponse({ accessToken }, 'Token refreshed'));
  } catch (error) {
    next(error);
  }
};
