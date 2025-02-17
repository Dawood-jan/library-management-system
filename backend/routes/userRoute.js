const express = require("express");
const auth = require("../config/auth");
const {
  registerCtrl,
  loginCtrl,
  profileCtrl,
  profilePhotoCtrl,
  getProfilePhotoCtrl,
  updateProfileCtrl,
  forgotPassword,
} = require("../controllers/userCtrl");
const router = express.Router();

router.post("/signup", registerCtrl);

router.post("/login", loginCtrl);

router.post("/forgot-password", forgotPassword);

router.get("/profile", auth, profileCtrl);

router.put("/update-profile", auth, updateProfileCtrl);

router.post("/profile-photo", auth, profilePhotoCtrl);

router.get("/profile-photo", auth, getProfilePhotoCtrl);

module.exports = router;
