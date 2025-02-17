const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const userSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },

    password: {
      type: String,
      required: true,
      trim: true,
    },
    profilePhoto: {
      type: String,
    },
    fine: {
      type: String,
      default: null,
    },
    role: {
      type: String,
      enum: ["admin", "user"],
      default: "user",
    },

    borrowedBooks: [{ type: mongoose.Schema.Types.ObjectId, ref: "Library" }],
  },

  { timestamps: true }
);

module.exports = mongoose.model("User", userSchema);
