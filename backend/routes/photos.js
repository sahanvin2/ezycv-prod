const express = require('express');
const router = express.Router();
const multer = require('multer');
const Photo = require('../models/Photo');
const { auth, optionalAuth } = require('../middleware/auth');
const { uploadToB2, deleteFromB2 } = require('../utils/b2Storage');

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

// @route   GET /api/photos
// @desc    Get all photos with filters
// @access  Public
router.get('/', async (req, res) => {
  try {
    const { 
      category, 
      search, 
      featured,
      license,
      page = 1, 
      limit = 20,
      sort = '-createdAt'
    } = req.query;

    const query = {};
    
    if (category) query.category = category;
    if (license) query.license = license;
    if (featured === 'true') query.featured = true;
    if (search) {
      query.$text = { $search: search };
    }

    const skip = (parseInt(page) - 1) * parseInt(limit);

    const photos = await Photo.find(query)
      .sort(sort)
      .skip(skip)
      .limit(parseInt(limit));

    const total = await Photo.countDocuments(query);

    res.json({
      photos,
      pagination: {
        current: parseInt(page),
        pages: Math.ceil(total / parseInt(limit)),
        total
      }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/photos/categories
// @desc    Get photo categories with counts
// @access  Public
router.get('/categories', async (req, res) => {
  try {
    const categories = await Photo.aggregate([
      { $group: { _id: '$category', count: { $sum: 1 } } },
      { $sort: { count: -1 } }
    ]);
    res.json(categories);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/photos/:id
// @desc    Get single photo
// @access  Public
router.get('/:id', async (req, res) => {
  try {
    const photo = await Photo.findByIdAndUpdate(
      req.params.id,
      { $inc: { views: 1 } },
      { new: true }
    );
    
    if (!photo) {
      return res.status(404).json({ message: 'Photo not found' });
    }
    
    res.json(photo);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   POST /api/photos/:id/download
// @desc    Track photo download
// @access  Public
router.post('/:id/download', async (req, res) => {
  try {
    const photo = await Photo.findByIdAndUpdate(
      req.params.id,
      { $inc: { downloads: 1 } },
      { new: true }
    );
    
    if (!photo) {
      return res.status(404).json({ message: 'Photo not found' });
    }
    
    res.json({ 
      message: 'Download tracked',
      downloadUrl: photo.imageUrl
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/photos/:id/proxy-download
// @desc    Proxy download photo image to bypass CORS
// @access  Public
router.get('/:id/proxy-download', async (req, res) => {
  try {
    const photo = await Photo.findById(req.params.id);
    
    if (!photo) {
      return res.status(404).json({ message: 'Photo not found' });
    }
    
    // Fetch the image from the source
    const https = require('https');
    const http = require('http');
    const imageUrl = photo.imageUrl;
    const protocol = imageUrl.startsWith('https') ? https : http;
    
    protocol.get(imageUrl, (imageResponse) => {
      // Set headers for file download
      res.setHeader('Content-Type', imageResponse.headers['content-type'] || 'image/jpeg');
      res.setHeader('Content-Disposition', `attachment; filename="${photo.title.toLowerCase().replace(/\s+/g, '-')}.jpg"`);
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

// @route   POST /api/photos/:id/like
// @desc    Like a photo
// @access  Public
router.post('/:id/like', async (req, res) => {
  try {
    const photo = await Photo.findByIdAndUpdate(
      req.params.id,
      { $inc: { likes: 1 } },
      { new: true }
    );
    
    if (!photo) {
      return res.status(404).json({ message: 'Photo not found' });
    }
    
    res.json(photo);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   POST /api/photos/upload
// @desc    Upload photos (authenticated users) - Uses B2 cloud storage
// @access  Private
router.post('/upload', auth, upload.array('images', 5), async (req, res) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ message: 'No images uploaded' });
    }

    const { title, description, category, tags } = req.body;
    
    console.log(`📤 Uploading ${req.files.length} photo(s) to B2...`);
    
    const photos = [];
    
    for (let index = 0; index < req.files.length; index++) {
      const file = req.files[index];
      
      // Upload to B2 cloud storage
      const uploadResult = await uploadToB2(file, {
        folder: 'photos',
        optimize: true,
        createThumb: true,
        prefix: 'photo-'
      });
      
      if (!uploadResult.success) {
        console.error(`❌ Failed to upload file ${index + 1}:`, uploadResult.error);
        throw new Error(`Failed to upload image ${index + 1}: ${uploadResult.error}`);
      }
      
      console.log(`✅ Uploaded file ${index + 1}: ${uploadResult.imageUrl}`);
      
      const photo = new Photo({
        title: req.files.length > 1 ? `${title} (${index + 1})` : title,
        description: description || '',
        category: category || 'business',
        imageUrl: uploadResult.imageUrl,
        thumbnailUrl: uploadResult.thumbnailUrl,
        resolution: uploadResult.resolution || { width: 1920, height: 1280 },
        tags: tags ? tags.split(',').map(t => t.trim()) : [],
        uploadedBy: req.user._id,
        storageType: 'b2',
        storageKey: uploadResult.key
      });
      
      await photo.save();
      photos.push(photo);
    }

    console.log(`✅ Successfully uploaded ${photos.length} photo(s)`);

    res.status(201).json({ 
      message: `${photos.length} photo(s) uploaded successfully`,
      storage: 'B2 Cloud',
      photos 
    });
  } catch (error) {
    console.error('Upload error:', error);
    res.status(500).json({ message: 'Upload failed', error: error.message });
  }
});

// @route   POST /api/photos
// @desc    Add new photo (admin)
// @access  Private
router.post('/', auth, async (req, res) => {
  try {
    const photo = new Photo({
      ...req.body,
      uploadedBy: req.user._id
    });
    await photo.save();
    res.status(201).json(photo);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   DELETE /api/photos/:id
// @desc    Delete a photo
// @access  Private
router.delete('/:id', auth, async (req, res) => {
  try {
    const photo = await Photo.findById(req.params.id);
    
    if (!photo) {
      return res.status(404).json({ message: 'Photo not found' });
    }
    
    // Check ownership
    if (photo.uploadedBy && photo.uploadedBy.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to delete this photo' });
    }
    
    // Delete from B2 if stored there
    if (photo.storageKey) {
      await deleteFromB2(photo.storageKey);
    }
    
    await Photo.findByIdAndDelete(req.params.id);
    
    res.json({ message: 'Photo deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
