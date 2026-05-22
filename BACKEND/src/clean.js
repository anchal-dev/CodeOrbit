const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Problem = require('./models/problem');

dotenv.config();

const cleanDB = async () => {
  try {
    await mongoose.connect(process.env.DB_CONNECT_STRING);
    console.log("Connected to MongoDB for cleanup...");
    
    const result = await Problem.deleteMany({});
    console.log(`Deleted ${result.deletedCount} problems.`);
    
    mongoose.disconnect();
  } catch (error) {
    console.error("Cleanup error:", error);
    process.exit(1);
  }
};

cleanDB();
