const { S3Client, PutObjectCommand, DeleteObjectCommand, HeadBucketCommand } = require('@aws-sdk/client-s3');
const { Upload } = require('@aws-sdk/lib-storage');
const sharp = require('sharp');
const path = require('path');

// Bucket name and public base
const BUCKET = process.env.B2_BUCKET || '';
const PUBLIC_BASE = process.env.B2_PUBLIC_BASE || '';

// Create S3 client lazily to ensure env vars are loaded
let _s3Client = null;

function getS3Client() {
  if (!_s3Client && process.env.B2_ENDPOINT) {
    _s3Client = new S3Client({
      endpoint: process.env.B2_ENDPOINT,
      region: 'us-east-005',
      credentials: {
        accessKeyId: process.env.B2_ACCESS_KEY_ID || '',
        secretAccessKey: process.env.B2_SECRET_ACCESS_KEY || ''
      },
      forcePathStyle: true // Required for B2
    });
  }
  return _s3Client;
}

// Getter for s3Client (backwards compatibility)
const s3Client = {
  send: async (command) => {
    const client = getS3Client();
    if (!client) throw new Error('B2 not configured');
    return client.send(command);
  }
};

/**
 * Check B2 connection health
 */
async function checkConnection() {
  try {
    const client = getS3Client();
    if (!client) {
      return { connected: false, error: 'B2 not configured' };
    }
    
    const bucket = process.env.B2_BUCKET;
    const command = new HeadBucketCommand({ Bucket: bucket });
    await client.send(command);
    console.log('✅ B2 Storage Connected Successfully');
    return { connected: true, bucket: bucket };
  } catch (error) {
    console.error('❌ B2 Storage Connection Error:', error.message);
    return { connected: false, error: error.message };
  }
}

/**
 * Generate unique filename
 */
function generateFileName(originalName, prefix = '') {
  const timestamp = Date.now();
  const random = Math.round(Math.random() * 1E9);
  const ext = path.extname(originalName).toLowerCase();
  return `${prefix}${timestamp}-${random}${ext}`;
}

/**
 * Optimize image for web
 */
async function optimizeImage(buffer, options = {}) {
  const {
    maxWidth = 1920,
    maxHeight = 1920,
    quality = 85,
    format = 'jpeg'
  } = options;

  try {
    let sharpInstance = sharp(buffer);
    
    // Get image metadata
    const metadata = await sharpInstance.metadata();
    
    // Resize if needed (maintain aspect ratio)
    if (metadata.width > maxWidth || metadata.height > maxHeight) {
      sharpInstance = sharpInstance.resize(maxWidth, maxHeight, {
        fit: 'inside',
        withoutEnlargement: true
      });
    }
    
    // Convert to optimized format
    if (format === 'jpeg' || format === 'jpg') {
      sharpInstance = sharpInstance.jpeg({ quality, progressive: true });
    } else if (format === 'png') {
      sharpInstance = sharpInstance.png({ quality, compressionLevel: 9 });
    } else if (format === 'webp') {
      sharpInstance = sharpInstance.webp({ quality });
    }
    
    const optimizedBuffer = await sharpInstance.toBuffer();
    const newMetadata = await sharp(optimizedBuffer).metadata();
    
    return {
      buffer: optimizedBuffer,
      width: newMetadata.width,
      height: newMetadata.height,
      size: optimizedBuffer.length
    };
  } catch (error) {
    console.error('Image optimization error:', error);
    // Return original if optimization fails
    return { buffer, width: null, height: null, size: buffer.length };
  }
}

/**
 * Create thumbnail
 */
async function createThumbnail(buffer, options = {}) {
  const { width = 400, height = 400, quality = 80 } = options;
  
  try {
    const thumbnail = await sharp(buffer)
      .resize(width, height, {
        fit: 'cover',
        position: 'center'
      })
      .jpeg({ quality, progressive: true })
      .toBuffer();
    
    return thumbnail;
  } catch (error) {
    console.error('Thumbnail creation error:', error);
    return null;
  }
}

/**
 * Upload file to B2
 */
async function uploadToB2(file, options = {}) {
  const {
    folder = 'uploads',
    optimize = true,
    createThumb = true,
    prefix = ''
  } = options;

  try {
    const client = getS3Client();
    if (!client) {
      throw new Error('B2 storage not configured');
    }
    
    const bucket = process.env.B2_BUCKET;
    const publicBase = process.env.B2_PUBLIC_BASE;
    
    const fileName = generateFileName(file.originalname, prefix);
    const fileKey = `${folder}/${fileName}`;
    
    let fileBuffer = file.buffer;
    let resolution = { width: null, height: null };
    
    // Optimize image if it's an image file
    const isImage = /\.(jpg|jpeg|png|webp|gif)$/i.test(file.originalname);
    
    if (isImage && optimize) {
      const optimized = await optimizeImage(file.buffer);
      fileBuffer = optimized.buffer;
      resolution = { width: optimized.width, height: optimized.height };
    }
    
    // Upload main file with multipart upload for reliability
    const upload = new Upload({
      client: client,
      params: {
        Bucket: bucket,
        Key: fileKey,
        Body: fileBuffer,
        ContentType: file.mimetype,
        CacheControl: 'public, max-age=31536000' // 1 year cache
      }
    });

    // Track upload progress
    upload.on('httpUploadProgress', (progress) => {
      if (progress.total) {
        const percent = Math.round((progress.loaded / progress.total) * 100);
        console.log(`Upload progress: ${percent}%`);
      }
    });

    await upload.done();
    
    const imageUrl = `${publicBase}/${fileKey}`;
    let thumbnailUrl = imageUrl;
    
    // Create and upload thumbnail
    if (isImage && createThumb) {
      const thumbBuffer = await createThumbnail(file.buffer);
      if (thumbBuffer) {
        const thumbKey = `${folder}/thumbnails/${fileName}`;
        
        await client.send(new PutObjectCommand({
          Bucket: bucket,
          Key: thumbKey,
          Body: thumbBuffer,
          ContentType: 'image/jpeg',
          CacheControl: 'public, max-age=31536000'
        }));
        
        thumbnailUrl = `${publicBase}/${thumbKey}`;
      }
    }
    
    console.log(`✅ Uploaded to B2: ${fileKey}`);
    
    return {
      success: true,
      imageUrl,
      thumbnailUrl,
      key: fileKey,
      fileName,
      resolution,
      size: fileBuffer.length
    };
  } catch (error) {
    console.error('B2 upload error:', error);
    return {
      success: false,
      error: error.message
    };
  }
}

/**
 * Upload multiple files to B2
 */
async function uploadMultipleToB2(files, options = {}) {
  const results = await Promise.all(
    files.map(file => uploadToB2(file, options))
  );
  
  return results;
}

/**
 * Delete file from B2
 */
async function deleteFromB2(key) {
  try {
    const client = getS3Client();
    if (!client) {
      throw new Error('B2 storage not configured');
    }
    
    const bucket = process.env.B2_BUCKET;
    
    await client.send(new DeleteObjectCommand({
      Bucket: bucket,
      Key: key
    }));
    
    // Also try to delete thumbnail
    const thumbKey = key.replace(/\/([^/]+)$/, '/thumbnails/$1');
    try {
      await client.send(new DeleteObjectCommand({
        Bucket: bucket,
        Key: thumbKey
      }));
    } catch (e) {
      // Thumbnail might not exist
    }
    
    console.log(`✅ Deleted from B2: ${key}`);
    return { success: true };
  } catch (error) {
    console.error('B2 delete error:', error);
    return { success: false, error: error.message };
  }
}

/**
 * Get signed URL for private access (if needed)
 */
function getPublicUrl(key) {
  const publicBase = process.env.B2_PUBLIC_BASE;
  return `${publicBase}/${key}`;
}

/**
 * Create WebP preview for wallpaper grid display
 * Desktop: 1280px wide | Mobile: 540px wide
 */
async function createPreview(buffer, deviceType = 'desktop') {
  const width = deviceType === 'mobile' ? 540 : 1280;
  try {
    const result = await sharp(buffer)
      .resize(width, null, {
        fit: 'inside',
        withoutEnlargement: true,
        kernel: sharp.kernel.lanczos3
      })
      .webp({ quality: 75, effort: 4 })
      .toBuffer({ resolveWithObject: true });

    return {
      buffer: result.data,
      width: result.info.width,
      height: result.info.height,
      size: result.data.length
    };
  } catch (error) {
    console.error('Preview creation error:', error);
    return null;
  }
}

/**
 * Create optimized JPG download (keep original dimensions, strip metadata)
 */
async function createOptimizedDownload(buffer) {
  try {
    const result = await sharp(buffer)
      .jpeg({
        quality: 90,
        mozjpeg: true,
        progressive: true
      })
      .withMetadata(false)
      .toBuffer({ resolveWithObject: true });

    return {
      buffer: result.data,
      width: result.info.width,
      height: result.info.height,
      size: result.data.length
    };
  } catch (error) {
    console.error('Optimized download creation error:', error);
    return null;
  }
}

/**
 * Upload a raw buffer to B2 with a custom key
 */
async function uploadBufferToB2(buffer, key, contentType) {
  try {
    const client = getS3Client();
    if (!client) throw new Error('B2 storage not configured');

    const bucket = process.env.B2_BUCKET;
    const publicBase = process.env.B2_PUBLIC_BASE;

    const upload = new Upload({
      client,
      params: {
        Bucket: bucket,
        Key: key,
        Body: buffer,
        ContentType: contentType,
        CacheControl: 'public, max-age=31536000'
      }
    });

    await upload.done();
    return { success: true, url: `${publicBase}/${key}`, key };
  } catch (error) {
    console.error('B2 buffer upload error:', error);
    return { success: false, error: error.message };
  }
}

module.exports = {
  getS3Client,
  checkConnection,
  uploadToB2,
  uploadMultipleToB2,
  deleteFromB2,
  getPublicUrl,
  optimizeImage,
  createThumbnail,
  generateFileName,
  createPreview,
  createOptimizedDownload,
  uploadBufferToB2
};
