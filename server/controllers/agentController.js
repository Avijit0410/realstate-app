const bcrypt = require('bcryptjs');
const Agent = require('../models/Agent');

// Create new user (admin or agent) - admin only
const createUser = async (req, res) => {
  try {
    const { name, mobileNumber, password, address, role } = req.body;

    // Validate role
    if (!['admin', 'agent'].includes(role)) {
      return res.status(400).json({ error: 'Invalid role specified' });
    }

    // Check if mobile number already exists
    const existingUser = await Agent.findOne({ mobileNumber });
    if (existingUser) {
      return res.status(400).json({ error: 'Mobile number already registered' });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create new user
    const user = new Agent({
      name,
      mobileNumber,
      password: hashedPassword,
      address,
      role,
      image: req.file ? `/uploads/${req.file.filename}` : null
    });

    await user.save();

    // Remove password from response
    const userResponse = user.toObject();
    delete userResponse.password;

    res.status(201).json(userResponse);
  } catch (error) {
    console.error('Create user error:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

// Update agent location
const updateLocation = async (req, res) => {
  try {
    const { latitude, longitude } = req.body;
    
    const agent = await Agent.findById(req.agent.id);
    if (!agent) {
      return res.status(404).json({ error: 'Agent not found' });
    }

    agent.currentLocation = {
      type: 'Point',
      coordinates: [parseFloat(longitude), parseFloat(latitude)]
    };

    await agent.save();
    res.json(agent);
  } catch (error) {
    console.error('Update location error:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

// Get all users (admin only)
const getAllUsers = async (req, res) => {
  try {
    const { role } = req.query;
    let query = {};
    
    // If role is specified, filter by role
    if (role && ['admin', 'agent'].includes(role)) {
      query.role = role;
    }

    const users = await Agent.find(query)
      .select('-password')
      .sort({ createdAt: -1 });
    
    res.json(users);
  } catch (error) {
    console.error('Get all users error:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

// Delete user (admin only)
const deleteUser = async (req, res) => {
  try {
    const user = await Agent.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Prevent deleting self
    if (user._id.toString() === req.agent.id) {
      return res.status(400).json({ error: 'Cannot delete your own account' });
    }

    // Check if trying to delete the last admin
    if (user.role === 'admin') {
      const adminCount = await Agent.countDocuments({ role: 'admin' });
      if (adminCount <= 1) {
        return res.status(400).json({ error: 'Cannot delete the last admin account' });
      }
    }

    await user.deleteOne();
    res.json({ message: 'User deleted successfully' });
  } catch (error) {
    console.error('Delete user error:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

module.exports = {
  createUser,
  updateLocation,
  getAllUsers,
  deleteUser
}; 