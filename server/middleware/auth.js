const jwt = require('jsonwebtoken');
const Agent = require('../models/Agent');

const auth = async (req, res, next) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    if (!token) {
      return res.status(401).json({ error: 'No token, authorization denied' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const agent = await Agent.findById(decoded.id);
    
    if (!agent) {
      return res.status(401).json({ error: 'Token is not valid' });
    }

    req.agent = agent;
    next();
  } catch (error) {
    res.status(401).json({ error: 'Token is not valid' });
  }
};

const adminAuth = async (req, res, next) => {
  try {
    await auth(req, res, async () => {
      if (req.agent.role !== 'admin') {
        return res.status(403).json({ error: 'Access denied. Admin only.' });
      }
      next();
    });
  } catch (error) {
    res.status(403).json({ error: 'Access denied' });
  }
};

module.exports = { auth, adminAuth }; 