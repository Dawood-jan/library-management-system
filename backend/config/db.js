const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    // console.log(process.env.MONGO_URI)
    await mongoose.connect(process.env.MONGO_URI);

    console.log("DB connected successfully!");
  } catch (error) {
    console.error("Error connecting to MongoDB:", error.message);

    process.exit(1);
  }
};

module.exports = connectDB;
