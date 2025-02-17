const Contact = require("../models/Contact");

const contactCtrl = async (req, res) => {
  try {
    const { name, email, subject, message } = req.body;

    

    // Check if all required fields are provided
    if (!email || !name || !subject || !message) {
      return res.status(422).json({ message: "All fields are required!" });
    }

    const userEmail = email.toLowerCase();

    // Check if the email is a Gmail address
    if (!userEmail.endsWith("@gmail.com")) {
      return res
        .status(422)
        .json({ message: "Only @gmail.com emails are allowed" });
    }

    return res
      .status(200)
      .json({success: "true", message: "Your message has been sent successfully!" });
  } catch (error) {
    console.error("Login error:", error); // Log the actual error for debugging
    res.status(500).json({ message: "Server error" });
  }
};

module.exports = {
  contactCtrl,
};
