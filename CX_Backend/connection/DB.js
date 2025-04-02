const mongoose = require("mongoose");
require("dotenv").config();

const startServer = async () => {
    try {
        console.log("Attempting to connect to MongoDB...");

        await mongoose.connect(process.env.MONGODBURL, {
            serverSelectionTimeoutMS: 60000,  
            socketTimeoutMS: 60000,            
            connectTimeoutMS: 60000,           
        });

        console.log("✅ MongoDB Connected Successfully!");
    } catch (error) {
        console.error("❌ Error connecting to MongoDB:", error.message);
        process.exit(1);
    }
};

module.exports = { startServer };  
