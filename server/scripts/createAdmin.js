require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const Agent = require('../models/Agent');

const createAdmin = async () => {
  try {
    console.log('Connecting to MongoDB...');
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
    console.log('Connected successfully');

    const adminData = {
      name: 'Avijit',
      mobileNumber: '9769444733',
      password: 'Avijit@10',
      address: 'Room no 4, pancham galli, bhagat singh nagar no 1, Goregaon west, mumbai 400104',
      role: 'admin'
    };

    // Check for existing admin
    console.log('Checking for existing admin...');
    const existingAdmin = await Agent.findOne({ mobileNumber: adminData.mobileNumber });
    
    if (existingAdmin) {
      console.log('Existing admin found:', {
        id: existingAdmin._id,
        name: existingAdmin.name,
        mobile: existingAdmin.mobileNumber,
        role: existingAdmin.role
      });
      await mongoose.connection.close();
      process.exit(0);
    }

    console.log('Creating new admin...');
    const salt = await bcrypt.genSalt(10);
    adminData.password = await bcrypt.hash(adminData.password, salt);

    const admin = new Agent(adminData);
    await admin.save();

    console.log('Admin created successfully:', {
      id: admin._id,
      name: admin.name,
      mobile: admin.mobileNumber,
      role: admin.role
    });

    await mongoose.connection.close();
    process.exit(0);
  } catch (error) {
    console.error('Error:', error);
    if (mongoose.connection) {
      await mongoose.connection.close();
    }
    process.exit(1);
  }
};

createAdmin(); 