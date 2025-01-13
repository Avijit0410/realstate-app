const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const { auth, adminAuth } = require('../middleware/auth');
const Agent = require('../models/Agent');
const bcrypt = require('bcryptjs');

// Configure multer for image uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, 'agent-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Not an image! Please upload only images.'), false);
    }
  }
});

// Create new agent (admin only)
router.post('/create', adminAuth, upload.single('image'), async (req, res) => {
  try {
    const { name, mobileNumber, password, address, role } = req.body;

    // Check if agent with mobile number already exists
    const existingAgent = await Agent.findOne({ mobileNumber });
    if (existingAgent) {
      return res.status(400).json({ error: 'Mobile number already registered' });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create new agent
    const agent = new Agent({
      name,
      mobileNumber,
      password: hashedPassword,
      address,
      role: role || 'agent',
      image: req.file ? req.file.filename : undefined
    });

    await agent.save();

    // Remove password from response
    const agentResponse = agent.toObject();
    delete agentResponse.password;

    res.status(201).json(agentResponse);
  } catch (error) {
    console.error('Create agent error:', error);
    res.status(500).json({ error: 'Failed to create agent' });
  }
});

module.exports = router; 