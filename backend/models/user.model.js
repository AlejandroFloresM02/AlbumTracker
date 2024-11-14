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
    savedAlbums: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Album'
    }]
  },
  {
    timestamps: true,
  }
);
