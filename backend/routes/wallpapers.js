const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const Wallpaper = require('../models/Wallpaper');
const { auth, optionalAuth } = require('../middleware/auth');
const { uploadToB2, deleteFromB2, createPreview, createOptimizedDownload, uploadBufferToB2 } = require('../utils/b2Storage');

// Always use memory storage for B2 cloud uploads
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 15 * 1024 * 1024 }, // 15MB limit
  fileFilter: (req, file, cb) => {
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Invalid file type. Only JPEG, PNG and WebP are allowed.'), false);
    }
  }
});

// @route   GET /api/wallpapers
// @desc    Get all wallpapers with filters
// @access  Public
router.get('/', async (req, res) => {
  try {
    const { 
      category, 
      deviceType, 
      search, 
      featured,
      page = 1, 
      limit = 24,
      sort = 'trending'
    } = req.query;

    const query = {};
    
    if (category) query.category = category;
    if (deviceType) query.deviceType = deviceType;
    if (featured === 'true') query.featured = true;
    if (search) {
      query.$text = { $search: search };
    }

    const pageNum = parseInt(page);
    const limitNum = parseInt(limit);
    const total = await Wallpaper.countDocuments(query);

    let wallpapers;

    if (sort === 'trending') {
      // Trending: weighted score combining downloads, likes, views, recency
      const pipeline = [];
      if (Object.keys(query).length > 0) {
        pipeline.push({ $match: query });
      }
      
      // Calculate trending score: recent downloads weigh most, then likes, then views
      // Recency boost: newer wallpapers get priority
      pipeline.push({
        $addFields: {
          _trendingScore: {
            $add: [
              { $multiply: [{ $ifNull: ['$downloads', 0] }, 5] },
              { $multiply: [{ $ifNull: ['$likes', 0] }, 3] },
              { $multiply: [{ $ifNull: ['$views', 0] }, 0.1] },
              // Recency boost: items added in last 30 days get a bonus
              {
                $cond: {
                  if: {
                    $gte: [
                      '$createdAt',
                      { $subtract: [new Date(), 30 * 24 * 60 * 60 * 1000] }
                    ]
                  },
                  then: 50,
                  else: 0
                }
              },
              // Add slight randomness for variety (0-10)
              { $mod: [{ $toLong: { $toDate: '$_id' } }, 10] }
            ]
          }
        }
      });
      
      pipeline.push({ $sort: { _trendingScore: -1, _id: -1 } });
      pipeline.push({ $skip: (pageNum - 1) * limitNum });
      pipeline.push({ $limit: limitNum });
      pipeline.push({ $project: { _trendingScore: 0 } });
      wallpapers = await Wallpaper.aggregate(pipeline);
    } else if (sort === 'random') {
      const pipeline = [];
      if (Object.keys(query).length > 0) {
        pipeline.push({ $match: query });
      }
      
      if (pageNum === 1 && !search) {
        pipeline.push({ $sample: { size: limitNum } });
        wallpapers = await Wallpaper.aggregate(pipeline);
      } else {
        pipeline.push({ $addFields: { _rand: { $mod: [{ $toLong: { $toDate: '$_id' } }, 97] } } });
        pipeline.push({ $sort: { _rand: 1, _id: 1 } });
        pipeline.push({ $skip: (pageNum - 1) * limitNum });
        pipeline.push({ $limit: limitNum });
        pipeline.push({ $project: { _rand: 0 } });
        wallpapers = await Wallpaper.aggregate(pipeline);
      }
    } else if (sort === 'popular') {
      // Sort by all-time popularity
      const skip = (pageNum - 1) * limitNum;
      wallpapers = await Wallpaper.find(query)
        .sort({ downloads: -1, likes: -1, views: -1 })
        .skip(skip)
        .limit(limitNum);
    } else if (sort === 'newest') {
      const skip = (pageNum - 1) * limitNum;
      wallpapers = await Wallpaper.find(query)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limitNum);
    } else {
      const skip = (pageNum - 1) * limitNum;
      wallpapers = await Wallpaper.find(query)
        .sort(sort)
        .skip(skip)
        .limit(limitNum);
    }

    res.json({
      wallpapers,
      pagination: {
        current: pageNum,
        pages: Math.ceil(total / limitNum),
        total
      }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/wallpapers/categories
// @desc    Get wallpaper categories with counts
// @access  Public
router.get('/categories', async (req, res) => {
  try {
    const categories = await Wallpaper.aggregate([
      { $group: { _id: '$category', count: { $sum: 1 } } },
      { $sort: { count: -1 } }
    ]);
    res.json(categories);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/wallpapers/stats
// @desc    Get total wallpaper and photo counts for home page
// @access  Public
router.get('/stats', async (req, res) => {
  try {
    const Photo = require('../models/Photo');
    const [wallpaperCount, photoCount] = await Promise.all([
      Wallpaper.countDocuments(),
      Photo.countDocuments()
    ]);
    res.json({ wallpapers: wallpaperCount, stockPhotos: photoCount });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/wallpapers/related/:id
// @desc    Get related wallpapers (same category + device, excluding current)
// @access  Public
router.get('/related/:id', async (req, res) => {
  try {
    const wallpaper = await Wallpaper.findById(req.params.id);
    if (!wallpaper) {
      return res.status(404).json({ message: 'Wallpaper not found' });
    }

    const limit = parseInt(req.query.limit) || 12;

    // Find related: same category + same device type, random sampling, exclude current
    const related = await Wallpaper.aggregate([
      {
        $match: {
          _id: { $ne: wallpaper._id },
          category: wallpaper.category,
          deviceType: wallpaper.deviceType
        }
      },
      { $sample: { size: limit } }
    ]);

    // If not enough in same category+device, backfill with same category any device
    if (related.length < limit) {
      const existingIds = [wallpaper._id, ...related.map(r => r._id)];
      const backfill = await Wallpaper.aggregate([
        {
          $match: {
            _id: { $nin: existingIds },
            category: wallpaper.category
          }
        },
        { $sample: { size: limit - related.length } }
      ]);
      related.push(...backfill);
    }

    // Still not enough? backfill with same device type from any category
    if (related.length < limit) {
      const existingIds = [wallpaper._id, ...related.map(r => r._id)];
      const backfill = await Wallpaper.aggregate([
        {
          $match: {
            _id: { $nin: existingIds },
            deviceType: wallpaper.deviceType
          }
        },
        { $sample: { size: limit - related.length } }
      ]);
      related.push(...backfill);
    }

    res.json(related);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/wallpapers/:id
// @desc    Get single wallpaper
// @access  Public
router.get('/:id', async (req, res) => {
  try {
    const wallpaper = await Wallpaper.findByIdAndUpdate(
      req.params.id,
      { $inc: { views: 1 } },
      { new: true }
    );
    
    if (!wallpaper) {
      return res.status(404).json({ message: 'Wallpaper not found' });
    }
    
    res.json(wallpaper);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   POST /api/wallpapers/:id/download
// @desc    Track wallpaper download
// @access  Public
router.post('/:id/download', async (req, res) => {
  try {
    const wallpaper = await Wallpaper.findByIdAndUpdate(
      req.params.id,
      { $inc: { downloads: 1 } },
      { new: true }
    );
    
    if (!wallpaper) {
      return res.status(404).json({ message: 'Wallpaper not found' });
    }
    
    res.json({ 
      message: 'Download tracked',
      downloadUrl: wallpaper.downloadUrl || wallpaper.imageUrl
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/wallpapers/:id/proxy-download
// @desc    Proxy download wallpaper image to bypass CORS
// @access  Public
router.get('/:id/proxy-download', async (req, res) => {
  try {
    const wallpaper = await Wallpaper.findById(req.params.id);
    
    if (!wallpaper) {
      return res.status(404).json({ message: 'Wallpaper not found' });
    }
    
    // Fetch the image from the source (prefer downloadUrl for quality)
    const https = require('https');
    const http = require('http');
    const imageUrl = wallpaper.downloadUrl || wallpaper.imageUrl;
    const protocol = imageUrl.startsWith('https') ? https : http;
    
    protocol.get(imageUrl, (imageResponse) => {
      // Set headers for file download
      res.setHeader('Content-Type', imageResponse.headers['content-type'] || 'image/jpeg');
      res.setHeader('Content-Disposition', `attachment; filename="${wallpaper.title.toLowerCase().replace(/\s+/g, '-')}.jpg"`);
      res.setHeader('Access-Control-Allow-Origin', '*');
      
      // Pipe the image data to response
      imageResponse.pipe(res);
    }).on('error', (err) => {
      console.error('Proxy download error:', err);
      res.status(500).json({ message: 'Failed to download image' });
    });
    
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   POST /api/wallpapers/:id/like
// @desc    Like a wallpaper
// @access  Public
router.post('/:id/like', async (req, res) => {
  try {
    const wallpaper = await Wallpaper.findByIdAndUpdate(
      req.params.id,
      { $inc: { likes: 1 } },
      { new: true }
    );
    
    if (!wallpaper) {
      return res.status(404).json({ message: 'Wallpaper not found' });
    }
    
    res.json(wallpaper);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   POST /api/wallpapers/upload
// @desc    Upload wallpapers (authenticated users) - Uses B2 cloud storage
// @access  Private
router.post('/upload', auth, upload.array('images', 5), async (req, res) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ message: 'No images uploaded' });
    }

    const { title, description, category, tags, deviceType } = req.body;
    
    console.log(`📤 Uploading ${req.files.length} wallpaper(s) to B2...`);
    
    const wallpapers = [];
    
    for (let index = 0; index < req.files.length; index++) {
      const file = req.files[index];
      
      // Upload original to B2 (optimized by uploadToB2)
      const uploadResult = await uploadToB2(file, {
        folder: 'wallpapers',
        optimize: true,
        createThumb: true,
        prefix: 'wall-'
      });
      
      if (!uploadResult.success) {
        console.error(`❌ Failed to upload file ${index + 1}:`, uploadResult.error);
        throw new Error(`Failed to upload image ${index + 1}: ${uploadResult.error}`);
      }
      
      console.log(`✅ Uploaded file ${index + 1}: ${uploadResult.imageUrl}`);

      // Also generate preview WebP + optimized download JPG
      let previewUrl = uploadResult.thumbnailUrl;
      let downloadUrl = uploadResult.imageUrl;

      try {
        const preview = await createPreview(file.buffer, deviceType || 'desktop');
        if (preview) {
          const previewKey = `wallpapers/preview/wall-${Date.now()}-${Math.round(Math.random() * 1E9)}.webp`;
          const previewResult = await uploadBufferToB2(preview.buffer, previewKey, 'image/webp');
          if (previewResult.success) previewUrl = previewResult.url;
        }

        const optimized = await createOptimizedDownload(file.buffer);
        if (optimized) {
          const dlKey = `wallpapers/5k/wall-${Date.now()}-${Math.round(Math.random() * 1E9)}.jpg`;
          const dlResult = await uploadBufferToB2(optimized.buffer, dlKey, 'image/jpeg');
          if (dlResult.success) downloadUrl = dlResult.url;
        }
      } catch (optErr) {
        console.warn('⚠️ Preview/download generation failed, using defaults:', optErr.message);
      }
      
      const wallpaper = new Wallpaper({
        title: req.files.length > 1 ? `${title} (${index + 1})` : title,
        description: description || '',
        category: category || 'nature',
        deviceType: deviceType || 'desktop',
        imageUrl: uploadResult.imageUrl,
        thumbnailUrl: uploadResult.thumbnailUrl,
        previewUrl,
        downloadUrl,
        resolution: uploadResult.resolution || { width: 1920, height: 1080 },
        tags: tags ? tags.split(',').map(t => t.trim()) : [],
        uploadedBy: req.user._id,
        storageType: 'b2',
        storageKey: uploadResult.key
      });
      
      await wallpaper.save();
      wallpapers.push(wallpaper);
    }

    console.log(`✅ Successfully uploaded ${wallpapers.length} wallpaper(s)`);

    res.status(201).json({ 
      message: `${wallpapers.length} wallpaper(s) uploaded successfully`,
      storage: 'B2 Cloud',
      wallpapers 
    });
  } catch (error) {
    console.error('Upload error:', error);
    res.status(500).json({ message: 'Upload failed', error: error.message });
  }
});

// @route   POST /api/wallpapers
// @desc    Add new wallpaper (admin)
// @access  Private
router.post('/', auth, async (req, res) => {
  try {
    const wallpaper = new Wallpaper({
      ...req.body,
      uploadedBy: req.user._id
    });
    await wallpaper.save();
    res.status(201).json(wallpaper);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   DELETE /api/wallpapers/:id
// @desc    Delete a wallpaper
// @access  Private
router.delete('/:id', auth, async (req, res) => {
  try {
    const wallpaper = await Wallpaper.findById(req.params.id);
    
    if (!wallpaper) {
      return res.status(404).json({ message: 'Wallpaper not found' });
    }
    
    // Check ownership
    if (wallpaper.uploadedBy && wallpaper.uploadedBy.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to delete this wallpaper' });
    }
    
    // Delete from B2 if stored there
    if (wallpaper.storageKey) {
      await deleteFromB2(wallpaper.storageKey);
    }
    
    await Wallpaper.findByIdAndDelete(req.params.id);
    
    res.json({ message: 'Wallpaper deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
