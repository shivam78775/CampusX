// utils/cloudinary.js

const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const multer = require('multer');
require('dotenv').config(); // Make sure this is at the top if you're not importing it elsewhere

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const storage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: 'campusx-posts',
    allowed_formats: ['jpg', 'jpeg', 'png'],
    transformation: [{  }],
  },
});

const upload = multer({ storage });

module.exports = { cloudinary, upload };
