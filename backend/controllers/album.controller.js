const Album = require("../models/album.model");
const { use } = require("../routes/album.routes");
const { searchAlbums: spotifySearch } = require("../services/spotifyService");

//Search albums from Spotify
const searchAlbums = async (req, res) => {
  try {
    const { query } = req.query;
    const userId = req.user._id;

    const spotifyResults = await spotifySearch(query);

    const savedAlbums = await Album.find({
      userId,
      spotifyId: { $in: spotifyResults.map((album) => album.spotifyId) },
    });

    const results = spotifyResults.map((album) => ({
      ...album,
      isSaved: savedAlbums.some((saved) => saved.spotifyId === album.spotifyId),
    }));

    res.json(results);
  } catch (error) {
    console.error("Error searching albums:", error);
    res.status(500).json({ error: "Failed to search albums" });
  }
};

//Save album to database
const saveAlbum = async (req, res) => {
  try {
    const albumData = req.body;
    const userId = req.user._id;

    const validPriorities = ["high", "medium", "low"];
    if (!validPriorities.includes(albumData.priority)) {
      return res.status(400).json({
        message: 'Priority must be "high", "medium", or "low"',
      });
    }

    const existingAlbum = await Album.findOne({
      userId,
      spotifyId: albumData.spotifyId,
    });

    if (existingAlbum) {
      return res.status(400).json({ message: "Album already in your list" });
    }

    const album = new Album({
      ...albumData,
      userId,
    });

    const savedAlbum = await album.save();
    await User.findByIdAndUpdate(userId, {
      $push: { savedAlbums: savedAlbum._id },
    });

    res.status(201).json({
      message: "Album saved successfully",
      album: savedAlbum,
    });
  } catch (error) {
    console.error("Error saving album:", error.message);
    res.status(500).json({ error: "An error ocurred saving the album." });
  }
};

const getUserAlbums = async (req, res) => {
  try {
    const userId = req.user._id;
    const albums = await Album.find({ userId }).sort({
      priority: 1,
      createAt: -1,
    });
    res.json(albums);
  } catch (error) {
    console.error("Error fetching albums:", error);
    res.status(500).json({ error: "Failed to fetch albums" });
  }
};

module.exports = {
  searchAlbums,
  saveAlbum,
getUserAlbums,
};
