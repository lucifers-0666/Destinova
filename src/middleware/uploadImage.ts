import multer, { FileFilterCallback, StorageEngine } from 'multer';
import path from 'path';
import { Request, Response, NextFunction } from 'express';
import { fileURLToPath } from 'url';
import fs from 'fs';
import { v4 as uuidv4 } from 'uuid';
import { BadRequestError } from './errorHandler.js';
import logger from '../config/logger.js';

// Fix for __dirname in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Upload directories
const uploadsDir = path.join(__dirname, '../../uploads');
const profilesDir = path.join(uploadsDir, 'profiles');
const flightsDir = path.join(uploadsDir, 'flights');
const tempDir = path.join(uploadsDir, 'temp');

// Ensure directories exist
[uploadsDir, profilesDir, flightsDir, tempDir].forEach(dir => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
});

// Allowed MIME types
const ALLOWED_MIME_TYPES = [
  'image/jpeg',
  'image/jpg',
  'image/png',
  'image/webp',
  'image/gif'
];

// Max file size (5MB)
const MAX_FILE_SIZE = 5 * 1024 * 1024;

/**
 * File filter function
 */
const imageFileFilter = (
  _req: Request,
  file: Express.Multer.File,
  cb: FileFilterCallback
): void => {
  if (ALLOWED_MIME_TYPES.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new BadRequestError(`Invalid file type. Allowed types: ${ALLOWED_MIME_TYPES.join(', ')}`));
  }
};

/**
 * Generate unique filename
 */
const generateFilename = (originalName: string): string => {
  const ext = path.extname(originalName).toLowerCase();
  const uniqueId = uuidv4();
  const timestamp = Date.now();
  return `${timestamp}-${uniqueId}${ext}`;
};

/**
 * Disk storage configuration
 */
const createDiskStorage = (destination: string): StorageEngine => {
  return multer.diskStorage({
    destination: (_req, _file, cb) => {
      cb(null, destination);
    },
    filename: (_req, file, cb) => {
      cb(null, generateFilename(file.originalname));
    }
  });
};

/**
 * Memory storage for processing before saving
 */
const memoryStorage = multer.memoryStorage();

/**
 * Profile picture upload configuration
 */
export const uploadProfilePicture = multer({
  storage: memoryStorage,
  limits: {
    fileSize: MAX_FILE_SIZE,
    files: 1
  },
  fileFilter: imageFileFilter
}).single('profileImage');

/**
 * Flight image upload configuration
 */
export const uploadFlightImage = multer({
  storage: memoryStorage,
  limits: {
    fileSize: MAX_FILE_SIZE,
    files: 1
  },
  fileFilter: imageFileFilter
}).single('flightImage');

/**
 * Multiple images upload (for galleries)
 */
export const uploadMultipleImages = multer({
  storage: memoryStorage,
  limits: {
    fileSize: MAX_FILE_SIZE,
    files: 10
  },
  fileFilter: imageFileFilter
}).array('images', 10);

/**
 * Generic file upload with disk storage
 */
export const uploadToDisk = (destination: string, fieldName: string = 'file') => {
  return multer({
    storage: createDiskStorage(destination),
    limits: {
      fileSize: MAX_FILE_SIZE,
      files: 1
    },
    fileFilter: imageFileFilter
  }).single(fieldName);
};

/**
 * Error handling middleware for multer
 */
export const handleUploadError = (
  err: Error,
  _req: Request,
  _res: Response,
  next: NextFunction
): void => {
  if (err instanceof multer.MulterError) {
    if (err.code === 'LIMIT_FILE_SIZE') {
      throw new BadRequestError(`File too large. Maximum size is ${MAX_FILE_SIZE / (1024 * 1024)}MB`);
    }
    if (err.code === 'LIMIT_FILE_COUNT') {
      throw new BadRequestError('Too many files uploaded');
    }
    if (err.code === 'LIMIT_UNEXPECTED_FILE') {
      throw new BadRequestError('Unexpected field name for file upload');
    }
    throw new BadRequestError(`Upload error: ${err.message}`);
  }
  next(err);
};

/**
 * Get upload paths
 */
export const uploadPaths = {
  profiles: profilesDir,
  flights: flightsDir,
  temp: tempDir,
  base: uploadsDir
};

/**
 * Delete file utility
 */
export const deleteFile = async (filePath: string): Promise<boolean> => {
  try {
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
      logger.info(`[Upload] Deleted file: ${filePath}`);
      return true;
    }
    return false;
  } catch (error) {
    logger.error(`[Upload] Failed to delete file: ${filePath}`, { error: (error as Error).message });
    return false;
  }
};

/**
 * Clean up old temp files (older than 1 hour)
 */
export const cleanupTempFiles = (): void => {
  try {
    const files = fs.readdirSync(tempDir);
    const oneHourAgo = Date.now() - (60 * 60 * 1000);
    
    files.forEach(file => {
      const filePath = path.join(tempDir, file);
      const stats = fs.statSync(filePath);
      
      if (stats.mtimeMs < oneHourAgo) {
        fs.unlinkSync(filePath);
        logger.debug(`[Upload] Cleaned up temp file: ${file}`);
      }
    });
  } catch (error) {
    logger.error('[Upload] Temp cleanup error:', { error: (error as Error).message });
  }
};

export default {
  uploadProfilePicture,
  uploadFlightImage,
  uploadMultipleImages,
  uploadToDisk,
  handleUploadError,
  uploadPaths,
  deleteFile,
  cleanupTempFiles
};
