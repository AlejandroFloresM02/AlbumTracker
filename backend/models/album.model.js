const mongoose = require("mongoose");

const AlbumSchema = mongoose.Schema({
  title: {
    type: String,
    required: [true, "Enter album title"],
    trim: true,
  },
  artist: {
    type: String,
    required: [true, "Enter artist name"],
    trim: true,
  },
  genre: {
    type: String,
    required: false,
    trim: true,
  },
  releaseDate: {
    type: Date,
    required: [true, "Enter release date"],
  },
  imageURL: {
    type:String,
    required:false
  },
  priority:{
    type: String,
    enum: ['high','medium','low'],
    default: 'low'
  },
  userId:{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  spotifyId:{
    type: String,
    required: true
  }
},{
    timestamps: true
}
);

module.exports = mongoose.model('Album',AlbumSchema);
