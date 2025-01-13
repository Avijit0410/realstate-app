require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const Agent = require('../models/Agent');

const testLogin = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    const mobileNumber = '9769444733';
    const password = 'Avijit@10';

    // Find the admin
    const admin = await Agent.findOne({ mobileNumber }).select('+password');
    console.log('Found admin:', admin ? 'Yes' : 'No');
    
    if (admin) {
      console.log('Admin details:', {
        id: admin._id,
        name: admin.name,
        mobile: admin.mobileNumber,
        role: admin.role,
        hasPassword: !!admin.password
      });

      // Test password
      const isMatch = await bcrypt.compare(password, admin.password);
      console.log('Password match:', isMatch);

      // Create new hash for verification
      const salt = await bcrypt.genSalt(10);
      const newHash = await bcrypt.hash(password, salt);
      console.log('Password hashes:', {
        stored: admin.password,
        new: newHash
      });
    } else {
      console.log('Admin not found');
    }

    await mongoose.connection.close();
  } catch (error) {
    console.error('Error:', error);
    if (mongoose.connection) {
      await mongoose.connection.close();
    }
  }
};

testLogin(); 