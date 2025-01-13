require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const Agent = require('../models/Agent');
const connectDB = require('../utils/database');

const recreateAdmin = async () => {
  let connection;
  try {
    connection = await connectDB();
    console.log('Connected to MongoDB');

    // Delete existing admin
    await Agent.deleteOne({ mobileNumber: '9769444733' });
    console.log('Deleted existing admin');

    // Create new admin with original password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash('Avijit@10', salt);

    const admin = new Agent({
      name: 'Avijit',
      mobileNumber: '9769444733',
      password: hashedPassword,
      address: 'Room no 4, pancham galli, bhagat singh nagar no 1, Goregaon west, mumbai 400104',
      role: 'admin'
    });

    const savedAdmin = await admin.save();
    console.log('Created new admin:', {
      id: savedAdmin._id,
      name: savedAdmin.name,
      mobile: savedAdmin.mobileNumber,
      role: savedAdmin.role
    });

    // Verify the password immediately
    const isMatch = await bcrypt.compare('Avijit@10', savedAdmin.password);
    console.log('Password verification:', {
      password: 'Avijit@10',
      hashedPassword: savedAdmin.password,
      matches: isMatch
    });

  } catch (error) {
    console.error('Error:', error);
  } finally {
    if (connection) {
      await connection.connection.close();
      console.log('MongoDB connection closed');
    }
    process.exit(0);
  }
};

recreateAdmin(); 