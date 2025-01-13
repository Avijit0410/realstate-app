const bcrypt = require('bcryptjs');
const Agent = require('../models/Agent');
const { generateToken } = require('../utils/jwtUtils');

const login = async (req, res) => {
  try {
    const { mobileNumber, password } = req.body;
    console.log('Login attempt:', { mobileNumber });

    // Find agent by mobile number and explicitly select password
    const agent = await Agent.findOne({ mobileNumber }).select('+password');
    
    if (!agent) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Verify password
    const isMatch = await bcrypt.compare(password, agent.password);
    if (!isMatch) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Generate JWT token
    const token = generateToken(agent);

    // Remove password from response
    const agentResponse = agent.toObject();
    delete agentResponse.password;

    // Transform image path if exists
    if (agentResponse.image) {
      agentResponse.image = `/uploads/${agentResponse.image}`;
    }

    res.json({
      token,
      user: {
        _id: agentResponse._id,
        name: agentResponse.name,
        mobileNumber: agentResponse.mobileNumber,
        role: agentResponse.role,
        image: agentResponse.image,
        address: agentResponse.address
      }
    });

  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

const getProfile = async (req, res) => {
  try {
    const agent = await Agent.findById(req.agent.id).select('-password');
    res.json(agent);
  } catch (error) {
    console.error('Get profile error:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

const getMe = async (req, res) => {
  try {
    const agent = await Agent.findById(req.agent.id).select('-password');
    if (!agent) {
      return res.status(404).json({ error: 'Agent not found' });
    }

    const userResponse = agent.toObject();
    if (userResponse.image) {
      userResponse.image = `/uploads/${userResponse.image}`;
    }

    // Send consistent user data structure
    res.json({
      _id: userResponse._id,
      name: userResponse.name,
      mobileNumber: userResponse.mobileNumber,
      role: userResponse.role,
      image: userResponse.image,
      address: userResponse.address
    });
  } catch (error) {
    console.error('Get me error:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

module.exports = {
  login,
  getProfile,
  getMe
}; 