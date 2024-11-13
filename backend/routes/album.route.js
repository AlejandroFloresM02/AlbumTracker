const express = require("express");
const Album = require("../models/album.model.js");
const router = express.Router();
const albumController = require("../controllers/album.controller.js");

const{
    searchAlbums,
    saveAlbum,
    getAlbums,
} = require("../controllers/album.controller.js");

router.get("/search",albumController.searchAlbums); 
router.get("/save",albumController.saveAlbum); 
router.get("/",albumController.getAlbums);

module.exports = router;