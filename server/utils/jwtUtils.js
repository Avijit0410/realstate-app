const jwt = require('jsonwebtoken');

const generateToken = (agent) => {
  return jwt.sign(
    { id: agent._id, role: agent.role },
    process.env.JWT_SECRET,
    { expiresIn: '7d' }
  );
};

module.exports = { generateToken }; 