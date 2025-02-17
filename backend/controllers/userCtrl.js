const JWT = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const path = require("path");
const fs = require("fs");
const { v4: uuid } = require("uuid");
uuid();
const User = require("../models/User");

const registerCtrl = async (req, res) => {
  try {
    const { name, password, email, confirmPassword } = req.body;
    // console.log(req.body);
    if (!name || !password || !email || !confirmPassword) {
      return res.status(403).json({ message: "All fields are required!" });
    }

    if (!/^[a-zA-Z\s]+$/.test(name.trim())) {
      return res.status(422).json({
        message:
          "Name can only contain characters and must not exceed 25 characters!",
      });
    }

    let newEmail = email?.trim().toLowerCase();

    // Check if the email is a Gmail address
    if (!newEmail.endsWith("@gmail.com")) {
      return res
        .status(422)
        .json({ message: "Only @gmail.com emails are allowed" });
    }

    const userExist = await User.findOne({ email: newEmail });

    if (userExist) {
      return res.status(403).json({ message: "Email exists already!" });
    }

    if (
      !/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{6,}$/.test(
        password.trim()
      )
    ) {
      return res.status(422).json({
        message:
          "Password must be at least 6 characters long and include at least one uppercase letter, one lowercase letter, one number, and one special character (@$!%*?&).",
      });
    }

    if (password.trim().length < 6) {
      return res
        .status(403)
        .json({ message: "Password must be at least 6 characters!" });
    }

    if (password !== confirmPassword) {
      return res.status(403).json({ message: "Passwords do not match!" });
    }

    const salt = await bcrypt.genSalt(10);
    const encryptPassword = await bcrypt.hash(password, salt);

    const newUser = await User.create({
      name,
      password: encryptPassword,
      email,
      role: "user",
    });

    if (!newUser) {
      return res.status(403).json({ message: "There was an error signing up" });
    }

    return res.status(200).json({ success: true, newUser });
  } catch (error) {
    console.log(error.message);
    return res.status(500).json("Server error");
  }
};

const loginCtrl = async (req, res) => {
  try {
    const { password, email } = req.body;
    // console.log(password, email)
    if (!password || !email) {
      return res.status(403).json({ message: "All fields are required!" });
    }

    let receivedEmail = email?.toLowerCase();

    const userExist = await User.findOne({ email: receivedEmail });
    // console.log(userExist)

    if (!userExist) {
      return res.status(404).json({ message: "User not found!" });
    }

    const isMatched = await bcrypt.compare(password, userExist.password);

    if (!isMatched) {
      return res.status(403).json({ message: "Invalid credentials!" });
    }

    const { _id: id, name, role } = userExist;

    const token = JWT.sign(
      { id, name, email: receivedEmail },
      process.env.JWT_SECRET_KEY,
      { expiresIn: "1h" }
    );

    return res
      .status(200)
      .json({ token, id, name, email: receivedEmail, role });
  } catch (error) {
    console.log(error.message);
    return res.status(500).json("Server error");
  }
};

const profileCtrl = async (req, res) => {
  try {
    const userExist = await User.findById(req.user.id);

    // console.log(userExist)

    if (!userExist) {
      return res.status(404).json({ message: "User not found!" });
    }

    return res.status(200).json(userExist);
  } catch (error) {
    console.log(error.message);
    return res.status(500).json("Server error");
  }
};

const updateProfileCtrl = async (req, res) => {
  try {
    const { name, email, newPassword, confirmNewPassword, oldPassword } =
      req.body;

    // console.log(req.body);

    const userExist = await User.findById(req.user.id);

    // console.log(userExist)

    if (!userExist) {
      return res.status(404).json({ message: "User not found!" });
    }

    const lowerEmail = email.trim().toLowerCase();

    if (!name && !lowerEmail && !newPassword && !confirmNewPassword) {
      return res.status(422).json({ message: "No field to update!" });
    }

    const userData = {};

    if (name) {
      userData.name = name;
    }

    if (email) {
      userData.email = lowerEmail;
    }

    if (oldPassword) {
      if (newPassword.trim().length < 6) {
        return res
          .status(422)
          .json({ message: "Password must be at lease 6 characters!" });
      }

      if (newPassword !== confirmNewPassword.trim()) {
        return res.status(422).json({ message: "Passwords do not match!" });
      }

      const salt = await bcrypt.genSalt(10);

      const hashPass = await bcrypt.hash(newPassword, salt);

      userData.password = hashPass;
    }

    const updateUser = await User.findByIdAndUpdate(
      req.user.id,
      { ...userData },
      { new: true }
    );

    // console.log(updateUser);

    return res.status(200).json(updateUser);
  } catch (error) {
    console.log(error.message);
    return res.status(500).json("Server error");
  }
};

const profilePhotoCtrl = async (req, res) => {
  try {
    if (!req.files) {
      return res.status(422).json({ message: "Please choose an image!" });
    }
    const avatar = req.files.profilePhoto;

    // console.log(avatar)

    const userExist = await User.findById(req.user.id);

    // console.log(userExist);

    if (avatar.size > 50 * 1024 * 1024) {
      return res
        .status(422)
        .json({ message: "Picture must be less than 50kb!" });
    }

    const uploadDir = path.join(__dirname, "..", "uploads", "profile");

    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }

    if (userExist.profilePhoto) {
      try {
        await fs.promises.unlink(
          path.join(
            __dirname,
            "..",
            "uploads",
            "profile",
            userExist.profilePhoto
          )
        );
      } catch (error) {
        console.error("Error deleting old avatar:", error);
      }
    }

    const fileName = avatar.name;
    const fileExtension = fileName.split(".").pop();
    const newFileName = `${uuid()}.${fileExtension}`;

    // console.log(newFileName);

    avatar.mv(path.join(uploadDir, newFileName), async (err) => {
      if (err) {
        console.log(err.message);
        return res.status(422).json(err.message);
      }

      // console.log(fileName);

      await User.findByIdAndUpdate(
        req.user.id,
        { profilePhoto: newFileName },
        { new: true }
      );

      const photoUrl = `/uploads/profile/${newFileName}`;
      // console.log(photoUrl);
      const fullPhotoUrl = `${process.env.Base_Url}/${photoUrl}`;
      return res.status(200).json({ fullPhotoUrl });
    });
  } catch (error) {
    console.log(error.message);
    return res.status(500).json("Server error");
  }
};

const getProfilePhotoCtrl = async (req, res) => {
  try {
    const userExist = await User.findById(req.user.id);

    // console.log(userExist.profilePhoto);

    const photoUrl = userExist.profilePhoto;
    // console.log(photoUrl);

    const Base_Url = `${process.env.BASE_URL}/profile/${photoUrl}`;
    // console.log(Base_Url);

    return res.status(200).json({ Base_Url });
  } catch (error) {
    console.log(error.message);
    return res.status(500).json("Server error");
  }
};

const forgotPassword = async (req, res) => {
  try {
    const { email, password, confirmPassword } = req.body;
    // console.log(req.body);

    if (!email || !password || !confirmPassword) {
      return res.status(403).json({ message: "All fields are required!" });
    }

    let lowerEmail = email.trim().toLowerCase();

    const userExist = await User.findOne({ email: lowerEmail });

    if (!userExist) {
      return res.status(404).json({ message: "Wrong email!" });
    }

    if (
      !/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{6,}$/.test(
        password.trim()
      )
    ) {
      return res.status(422).json({
        message:
          "Password must be at least 6 characters long and include at least one uppercase letter, one lowercase letter, one number, and one special character (@$!%*?&).",
      });
    }

    if (password.trim().length < 6) {
      return res
        .status(403)
        .json({ message: "Password must be at least 6 characters!" });
    }

    if (password !== confirmPassword) {
      return res.status(403).json({ message: "Passwords do not match!" });
    }

    const salt = await bcrypt.genSalt(10);
    const encryptPassword = await bcrypt.hash(password, salt);

    const newPassword = await User.findOneAndUpdate(
      { email: lowerEmail },
      {
        password: encryptPassword,
      },
      { new: true }
    );

    if (!newPassword) {
      return res
        .status(403)
        .json({ message: "There was an error creating new password!" });
    }

    return res.status(200).json({ success: true, newPassword });
  } catch (error) {
    console.log(error.message);
    return res.status(500).json("Server error");
  }
};

module.exports = {
  registerCtrl,
  loginCtrl,
  profileCtrl,
  updateProfileCtrl,
  profilePhotoCtrl,
  getProfilePhotoCtrl,
  forgotPassword,
};
