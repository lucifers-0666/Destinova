import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { User, IUser } from '../models/User.js';
import mongoose from 'mongoose';

export interface AuthRequest extends Request {
  user?: any; // Use any to avoid type conflicts with different user object shapes
  userId?: string;
}

export const protect = async (req: AuthRequest, res: Response, next: NextFunction) => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      token = req.headers.authorization.split(' ')[1];
      const decoded: any = jwt.verify(token, process.env.JWT_SECRET || 'secret');

      req.user = await User.findById(decoded.id).select('-password') as IUser;
      next();
    } catch (error) {
      console.error(error);
      res.status(401).json({ message: 'Not authorized, token failed' });
    }
  }

  if (!token) {
    res.status(401).json({ message: 'Not authorized, no token' });
  }
};

export const optionalAuth = async (req: AuthRequest, _res: Response, next: NextFunction) => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      token = req.headers.authorization.split(' ')[1];
      const decoded: any = jwt.verify(token, process.env.JWT_SECRET || 'secret');
      req.user = await User.findById(decoded.id).select('-password') as IUser & { _id: mongoose.Types.ObjectId };
    } catch (error) {
      // Token invalid, but continue without user
      console.log('Optional auth: Invalid token, continuing as anonymous');
    }
  }

  // Continue regardless of authentication status
  next();
};

export const admin = (req: AuthRequest, res: Response, next: NextFunction) => {
  if (req.user && req.user.role === 'admin') {
    next();
  } else {
    res.status(401).json({ message: 'Not authorized as an admin' });
  }
};

// Alias exports for compatibility
export const authenticateToken = protect;
export const isAdmin = admin;
