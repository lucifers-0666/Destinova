import sharp from 'sharp';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import { v4 as uuidv4 } from 'uuid';
import logger from '../config/logger.js';

// Fix for __dirname in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Output directories
const uploadsDir = path.join(__dirname, '../../uploads');
const profilesDir = path.join(uploadsDir, 'profiles');
const flightsDir = path.join(uploadsDir, 'flights');
const thumbnailsDir = path.join(uploadsDir, 'thumbnails');

// Ensure directories exist
[uploadsDir, profilesDir, flightsDir, thumbnailsDir].forEach(dir => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
});

/**
 * Image processing configuration
 */
export interface ImageProcessingOptions {
  width?: number;
  height?: number;
  quality?: number;
  format?: 'webp' | 'jpeg' | 'png';
  fit?: 'cover' | 'contain' | 'fill' | 'inside' | 'outside';
  background?: string;
  withThumbnail?: boolean;
  thumbnailWidth?: number;
  thumbnailHeight?: number;
}

/**
 * Default processing options
 */
const defaultOptions: ImageProcessingOptions = {
  quality: 80,
  format: 'webp',
  fit: 'cover'
};

/**
 * Profile picture options
 */
export const profilePictureOptions: ImageProcessingOptions = {
  width: 300,
  height: 300,
  quality: 85,
  format: 'webp',
  fit: 'cover',
  withThumbnail: true,
  thumbnailWidth: 100,
  thumbnailHeight: 100
};

/**
 * Flight image options
 */
export const flightImageOptions: ImageProcessingOptions = {
  width: 800,
  height: 600,
  quality: 80,
  format: 'webp',
  fit: 'cover',
  withThumbnail: true,
  thumbnailWidth: 400,
  thumbnailHeight: 300
};

/**
 * Destination image options
 */
export const destinationImageOptions: ImageProcessingOptions = {
  width: 1200,
  height: 800,
  quality: 85,
  format: 'webp',
  fit: 'cover',
  withThumbnail: true,
  thumbnailWidth: 600,
  thumbnailHeight: 400
};

/**
 * Process image result
 */
export interface ProcessedImage {
  filename: string;
  path: string;
  url: string;
  size: number;
  width: number;
  height: number;
  format: string;
  thumbnail?: {
    filename: string;
    path: string;
    url: string;
  };
}

/**
 * Generate output filename
 */
const generateFilename = (prefix: string, format: string): string => {
  const uniqueId = uuidv4();
  const timestamp = Date.now();
  return `${prefix}-${timestamp}-${uniqueId}.${format}`;
};

/**
 * Process and save image from buffer
 */
export const processImage = async (
  buffer: Buffer,
  outputDir: string,
  options: ImageProcessingOptions = {}
): Promise<ProcessedImage> => {
  const opts = { ...defaultOptions, ...options };
  const filename = generateFilename('img', opts.format || 'webp');
  const outputPath = path.join(outputDir, filename);

  try {
    // Create sharp instance
    let sharpInstance = sharp(buffer);

    // Resize if dimensions provided
    if (opts.width || opts.height) {
      sharpInstance = sharpInstance.resize({
        width: opts.width,
        height: opts.height,
        fit: opts.fit || 'cover',
        background: opts.background ? { r: 255, g: 255, b: 255, alpha: 1 } : undefined
      });
    }

    // Convert to specified format with quality
    switch (opts.format) {
      case 'webp':
        sharpInstance = sharpInstance.webp({ quality: opts.quality || 80 });
        break;
      case 'jpeg':
        sharpInstance = sharpInstance.jpeg({ quality: opts.quality || 80 });
        break;
      case 'png':
        sharpInstance = sharpInstance.png({ quality: opts.quality || 80 });
        break;
    }

    // Process and save
    const outputInfo = await sharpInstance.toFile(outputPath);

    const result: ProcessedImage = {
      filename,
      path: outputPath,
      url: `/uploads/${path.basename(outputDir)}/${filename}`,
      size: outputInfo.size,
      width: outputInfo.width,
      height: outputInfo.height,
      format: outputInfo.format
    };

    // Create thumbnail if requested
    if (opts.withThumbnail && (opts.thumbnailWidth || opts.thumbnailHeight)) {
      const thumbnailFilename = generateFilename('thumb', opts.format || 'webp');
      const thumbnailPath = path.join(thumbnailsDir, thumbnailFilename);

      await sharp(buffer)
        .resize({
          width: opts.thumbnailWidth || 200,
          height: opts.thumbnailHeight || 200,
          fit: 'cover'
        })
        .webp({ quality: 70 })
        .toFile(thumbnailPath);

      result.thumbnail = {
        filename: thumbnailFilename,
        path: thumbnailPath,
        url: `/uploads/thumbnails/${thumbnailFilename}`
      };
    }

    logger.info(`[ImageProcessor] Processed image: ${filename}`, {
      size: outputInfo.size,
      dimensions: `${outputInfo.width}x${outputInfo.height}`
    });

    return result;
  } catch (error) {
    logger.error('[ImageProcessor] Processing error:', { error: (error as Error).message });
    throw error;
  }
};

/**
 * Process profile picture
 */
export const processProfilePicture = async (buffer: Buffer): Promise<ProcessedImage> => {
  return processImage(buffer, profilesDir, profilePictureOptions);
};

/**
 * Process flight image
 */
export const processFlightImage = async (buffer: Buffer): Promise<ProcessedImage> => {
  return processImage(buffer, flightsDir, flightImageOptions);
};

/**
 * Process destination image
 */
export const processDestinationImage = async (buffer: Buffer): Promise<ProcessedImage> => {
  return processImage(buffer, flightsDir, destinationImageOptions);
};

/**
 * Get image metadata
 */
export const getImageMetadata = async (buffer: Buffer): Promise<sharp.Metadata> => {
  return sharp(buffer).metadata();
};

/**
 * Validate image dimensions
 */
export const validateImageDimensions = async (
  buffer: Buffer,
  minWidth?: number,
  minHeight?: number,
  maxWidth?: number,
  maxHeight?: number
): Promise<{ valid: boolean; message?: string; metadata: sharp.Metadata }> => {
  const metadata = await getImageMetadata(buffer);

  if (minWidth && metadata.width && metadata.width < minWidth) {
    return {
      valid: false,
      message: `Image width must be at least ${minWidth}px`,
      metadata
    };
  }

  if (minHeight && metadata.height && metadata.height < minHeight) {
    return {
      valid: false,
      message: `Image height must be at least ${minHeight}px`,
      metadata
    };
  }

  if (maxWidth && metadata.width && metadata.width > maxWidth) {
    return {
      valid: false,
      message: `Image width must not exceed ${maxWidth}px`,
      metadata
    };
  }

  if (maxHeight && metadata.height && metadata.height > maxHeight) {
    return {
      valid: false,
      message: `Image height must not exceed ${maxHeight}px`,
      metadata
    };
  }

  return { valid: true, metadata };
};

/**
 * Optimize existing image file
 */
export const optimizeImage = async (
  inputPath: string,
  outputPath?: string,
  options: ImageProcessingOptions = {}
): Promise<ProcessedImage> => {
  const opts = { ...defaultOptions, ...options };
  const output = outputPath || inputPath;

  try {
    let sharpInstance = sharp(inputPath);

    if (opts.width || opts.height) {
      sharpInstance = sharpInstance.resize({
        width: opts.width,
        height: opts.height,
        fit: opts.fit || 'inside'
      });
    }

    switch (opts.format) {
      case 'webp':
        sharpInstance = sharpInstance.webp({ quality: opts.quality || 80 });
        break;
      case 'jpeg':
        sharpInstance = sharpInstance.jpeg({ quality: opts.quality || 80 });
        break;
      case 'png':
        sharpInstance = sharpInstance.png({ quality: opts.quality || 80 });
        break;
    }

    const outputInfo = await sharpInstance.toFile(output);

    return {
      filename: path.basename(output),
      path: output,
      url: `/uploads/${path.basename(path.dirname(output))}/${path.basename(output)}`,
      size: outputInfo.size,
      width: outputInfo.width,
      height: outputInfo.height,
      format: outputInfo.format
    };
  } catch (error) {
    logger.error('[ImageProcessor] Optimize error:', { error: (error as Error).message });
    throw error;
  }
};

/**
 * Delete processed image and its thumbnail
 */
export const deleteProcessedImage = async (imagePath: string, thumbnailPath?: string): Promise<void> => {
  try {
    if (fs.existsSync(imagePath)) {
      fs.unlinkSync(imagePath);
      logger.debug(`[ImageProcessor] Deleted image: ${imagePath}`);
    }

    if (thumbnailPath && fs.existsSync(thumbnailPath)) {
      fs.unlinkSync(thumbnailPath);
      logger.debug(`[ImageProcessor] Deleted thumbnail: ${thumbnailPath}`);
    }
  } catch (error) {
    logger.error('[ImageProcessor] Delete error:', { error: (error as Error).message });
  }
};

export default {
  processImage,
  processProfilePicture,
  processFlightImage,
  processDestinationImage,
  getImageMetadata,
  validateImageDimensions,
  optimizeImage,
  deleteProcessedImage,
  profilePictureOptions,
  flightImageOptions,
  destinationImageOptions
};
