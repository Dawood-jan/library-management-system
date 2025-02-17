const dotenv = require("dotenv");
dotenv.config();
const express = require("express");
const path = require("path");
const cors = require("cors");
const bcrypt = require("bcryptjs");
const userRoute = require("./routes/userRoute");
const libraryRoute = require("./routes/libraryRoute");
const contactRoute = require("./routes/contactRoute");
const fileUpload = require("express-fileupload");
const connectDB = require("./config/db");
const User = require("./models/User");
PORT = process.env.PORT || 3000;
connectDB();

const app = express();

var corsOptions = {
  origin: "http://localhost:5173",
};
app.use(cors(corsOptions));


app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(fileUpload());

// console.log(process.env.PORT)

// app.use(express.static("uploads"));

app.use("/uploads", express.static(path.join(__dirname, "uploads")));
app.use(express.static(path.join(__dirname, "uploads")));

// Create default admin users
const createAdminUsers = async () => {
  const admins = [
    {
      name: "Manzoor",
      email: "admin@gmail.com",
      password: "Admin_12",
      role: "admin",
    },
  ];

  for (const admin of admins) {
    let user = await User.findOne({ email: admin.email });
    if (!user) {
      const salt = await bcrypt.genSalt(10);
      admin.password = await bcrypt.hash(admin.password, salt);
      user = new User(admin);
      await user.save();
      console.log(`Admin ${admin.email} created`);
    }
  }
};

createAdminUsers();

app.use("/users", userRoute);
app.use("/library", libraryRoute);
app.use("/contact", contactRoute);

app.listen(PORT, () => {
  console.log(`Server started at ${PORT}`);
});
