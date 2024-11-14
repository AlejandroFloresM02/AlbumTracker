const express = require("express");
const router = express.Router();
const albumController = require("../controllers/album.controller");
const authMiddleware = require("../middleware/auth");

router.use(authMiddleware);

const { searchAlbums, saveAlbum, getUserAlbums } = require("../controllers/album.controller");

router.get("/search", searchAlbums);
router.post("/", saveAlbum); 
router.get("/", getUserAlbums); 


module.exports = router;