const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const Property = require('../models/Property');
const { auth, adminAuth } = require('../middleware/auth');

// Configure multer for image uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/'); // Make sure this directory exists
  },
  filename: (req, file, cb) => {
    // Create unique filename with timestamp and original extension
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, 'property-' + uniqueSuffix + path.extname(file.originalname));
  }
});

// File filter to allow only images
const fileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith('image/')) {
    cb(null, true);
  } else {
    cb(new Error('Not an image! Please upload only images.'), false);
  }
};

const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB limit
  }
});

// Get all properties (admin only)
router.get('/all', adminAuth, async (req, res) => {
  try {
    const properties = await Property.find()
      .populate('agent', 'name')
      .sort({ createdAt: -1 });

    // Transform the response to include full URLs for images
    const transformedProperties = properties.map(property => {
      const prop = property.toObject();
      prop.images = prop.images.map(image => 
        image.startsWith('http') ? image : `${process.env.BASE_URL}${image}`
      );
      return prop;
    });

    console.log('Sending properties:', transformedProperties);
    res.json(transformedProperties);
  } catch (error) {
    console.error('Error fetching properties:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Get agent's properties
router.get('/my-properties', auth, async (req, res) => {
  try {
    const properties = await Property.find({ agent: req.agent._id })
      .sort({ createdAt: -1 });

    // Transform the response to include full URLs for images
    const transformedProperties = properties.map(property => {
      const prop = property.toObject();
      prop.images = prop.images.map(image => 
        image.startsWith('http') ? image : `${process.env.BASE_URL}${image}`
      );
      return prop;
    });

    res.json(transformedProperties);
  } catch (error) {
    console.error('Error fetching agent properties:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Add new property with multiple images
router.post('/', auth, upload.array('images', 10), async (req, res) => {
  try {
    const { name, address, ownerNumber, latitude, longitude } = req.body;

    // Create array of image paths
    const images = req.files.map(file => `/uploads/${file.filename}`);

    const property = new Property({
      name,
      address,
      ownerNumber,
      location: {
        type: 'Point',
        coordinates: [parseFloat(longitude), parseFloat(latitude)]
      },
      images, // Store array of image paths
      agent: req.agent._id // Get agent ID from auth middleware
    });

    await property.save();
    res.status(201).json(property);
  } catch (error) {
    console.error('Error creating property:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Get property by ID
router.get('/:id', auth, async (req, res) => {
  try {
    const property = await Property.findById(req.params.id)
      .populate('agent', 'name mobileNumber address');

    if (!property) {
      return res.status(404).json({ error: 'Property not found' });
    }

    // Transform the response to include full URLs for images
    const transformedProperty = property.toObject();
    transformedProperty.images = transformedProperty.images.map(image => 
      image.startsWith('http') ? image : `${process.env.BASE_URL}${image}`
    );

    res.json(transformedProperty);
  } catch (error) {
    console.error('Error fetching property:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Update property
router.put('/:id', auth, async (req, res) => {
  try {
    const property = await Property.findById(req.params.id);
    
    // Check if property exists
    if (!property) {
      return res.status(404).json({ error: 'Property not found' });
    }

    // Check if user is authorized to update this property
    if (property.agent.toString() !== req.agent.id && req.agent.role !== 'admin') {
      return res.status(403).json({ error: 'Not authorized' });
    }

    // Update property
    const updatedProperty = await Property.findByIdAndUpdate(
      req.params.id,
      {
        ...req.body,
        location: {
          type: 'Point',
          coordinates: [parseFloat(req.body.longitude), parseFloat(req.body.latitude)]
        }
      },
      { new: true }
    );

    res.json(updatedProperty);
  } catch (error) {
    console.error('Error updating property:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Delete property
router.delete('/:id', auth, async (req, res) => {
  try {
    const property = await Property.findById(req.params.id);
    
    if (!property) {
      return res.status(404).json({ error: 'Property not found' });
    }

    // Check if user is authorized to delete this property
    if (property.agent.toString() !== req.agent.id && req.agent.role !== 'admin') {
      return res.status(403).json({ error: 'Not authorized' });
    }

    await Property.findByIdAndDelete(req.params.id);
    res.json({ message: 'Property removed' });
  } catch (error) {
    console.error('Error deleting property:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router; 