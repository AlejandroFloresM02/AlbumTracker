const mongoose = require("mongoose");

const UserSchema = mongoose.Schema(
  {
    username: {
      type: String,
      required: [true, "Enter your username"],
      trim: true,
    },
    email: {
      type: String,
      required: [true, "Enter your email address"],
      trim: true,
    },
    password: {
      type: String,
      require: [true, "Enter your password"],
    },
    cratedAt: {
      type: Date,
    },
    updatedAt: {
      type: Date,
    },
  },
  {
    timestamps: true,
  }
);
