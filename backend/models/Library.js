const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// const librarySchema = new Schema(
//   {
//     title: {
//       type: String,
//       required: true,
//     },
//     book: {
//       type: String,
//       required: true,
//     },
//     author: {
//       type: String,
//       required: true,
//     },
//     isbn: {
//       type: String,
//       required: true,
//     },
//     genre: {
//       type: String,
//       enum: ["science", "history", "fiction"],
//     },
//     recipientId: {
//       type: mongoose.Schema.Types.ObjectId,
//       ref: "User",
//     },
//     bookPhoto: {
//       type: String,
//     },
//     abstract: {
//       type: String,
//     },
//     isRequested: {
//       type: Boolean,
//       default: false,
//     },
//     requestStatus: {
//       type: String,
//       enum: ["pending", "approved", "rejected"],
//       default: null,
//     },
//     requestDate: {
//       type: Date,
//       default: null,
//     },
//     returnDate: {
//       type: Date,
//       default: null,
//     },
//     approvalDate: {
//       type: Date,
//       default: null,
//     },
//     dueDate: {
//       type: Date,
//       default: null,
//     },
//     fine: {
//       type: Number,
//       default: 0, // Tracks the fine amount for overdue books
//     },
//     borrowedBy: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }], // Tracks which users have borrowed
//     isRequestedBy: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
//   },
//   { timestamps: true }
// );

const borrowedSchema = new Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    requestDate: {
      type: Date,
      default: null,
    },
    approvalDate: {
      type: Date,
      default: null,
    },
    dueDate: {
      type: Date,
      default: null,
    },
    returnDate: {
      type: Date,
      default: null,
    },
    requestStatus: {
      type: String,
      enum: ["pending", "approved", "rejected"],
      default: null,
    },
    fine: {
      type: Number,
      default: 0,
    },
    finePaid: { type: Boolean, default: false },
  },
  { _id: false } // Prevents auto-generation of an _id for subdocuments
);

const librarySchema = new Schema(
  {
    title: {
      type: String,
      required: true,
    },
    book: {
      type: String,
      required: true,
    },
    author: {
      type: String,
      required: true,
    },
    isbn: {
      type: String,
      required: true,
    },
    genre: {
      type: String,
      enum: ["science", "history", "fiction"],
    },
    recipientId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    bookPhoto: {
      type: String,
    },
    abstract: {
      type: String,
    },

    borrowedBy: [borrowedSchema], // Array of borrowed book details
    isRequestedBy: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
  },
  { timestamps: true }
);

module.exports = mongoose.model("Library", librarySchema);
