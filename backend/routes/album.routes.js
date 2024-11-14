const express = require("express");
const router = express.Router();
const albumController = require("../controllers/album.controller");

const{
    searchAlbums,
    saveAlbum,
    getAlbums,
} = require("../controllers/album.controller.js");

router.get("/search", albumController.searchAlbums);
router.post("/save", albumController.saveAlbum);
router.get("/", albumController.getUserAlbums);

module.exports = router;