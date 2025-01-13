require('dotenv').config();
const mongoose = require('mongoose');
const Property = require('../models/Property');
const Agent = require('../models/Agent');

const sampleProperties = [
  {
    name: 'Luxury Villa',
    address: '123 Palm Street, Mumbai, Maharashtra',
    ownerNumber: '9876543210',
    location: {
      type: 'Point',
      coordinates: [72.8777, 19.0760] // Mumbai coordinates
    },
    images: [
      '/uploads/property1.jpg',
      '/uploads/property2.jpg'
    ]
  },
  {
    name: 'Sea View Apartment',
    address: '456 Marine Drive, Mumbai, Maharashtra',
    ownerNumber: '9876543211',
    location: {
      type: 'Point',
      coordinates: [72.8252, 18.9548]
    },
    images: [
      '/uploads/property3.jpg',
      '/uploads/property4.jpg'
    ]
  },
  {
    name: 'Garden Residence',
    address: '789 Green Park, Goregaon, Mumbai',
    ownerNumber: '9876543212',
    location: {
      type: 'Point',
      coordinates: [72.8479, 19.1663]
    },
    images: [
      '/uploads/property5.jpg',
      '/uploads/property6.jpg'
    ]
  }
];

// Function to create sample images
const createSampleImages = async () => {
  const fs = require('fs');
  const path = require('path');
  
  // Create uploads directory if it doesn't exist
  const uploadsDir = path.join(__dirname, '../uploads');
  if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir);
  }

  // Create sample image files
  const sampleImageContent = Buffer.from(
    'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8BQDwAEhQGAhKmMIQAAAABJRU5ErkJggg==',
    'base64'
  );

  sampleProperties.forEach(property => {
    property.images.forEach(imagePath => {
      const fullPath = path.join(__dirname, '..', imagePath);
      if (!fs.existsSync(fullPath)) {
        fs.writeFileSync(fullPath, sampleImageContent);
      }
    });
  });
};

const createSampleProperties = async () => {
  try {
    console.log('Connecting to MongoDB...');
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
    console.log('Connected to MongoDB successfully');

    // Get the admin user to assign as the agent
    const admin = await Agent.findOne({ role: 'admin' });
    if (!admin) {
      console.error('No admin user found. Please run createAdmin.js first');
      process.exit(1);
    }

    // Create sample images
    await createSampleImages();

    // Delete existing properties
    await Property.deleteMany({});
    console.log('Cleared existing properties');

    // Create new properties
    const propertiesWithAgent = sampleProperties.map(prop => ({
      ...prop,
      agent: admin._id
    }));

    const created = await Property.insertMany(propertiesWithAgent);
    console.log(`Created ${created.length} sample properties`);

    // Log created properties
    created.forEach(prop => {
      console.log(`Created property: ${prop.name}`);
      console.log(`ID: ${prop._id}`);
      console.log(`Images: ${prop.images.join(', ')}`);
      console.log('---');
    });

    await mongoose.connection.close();
    console.log('MongoDB connection closed');
    process.exit(0);
  } catch (error) {
    console.error('Error:', error);
    if (mongoose.connection) {
      await mongoose.connection.close();
    }
    process.exit(1);
  }
};

// Handle process termination
process.on('SIGINT', async () => {
  if (mongoose.connection) {
    await mongoose.connection.close();
    console.log('MongoDB connection closed through app termination');
  }
  process.exit(0);
});

createSampleProperties(); 