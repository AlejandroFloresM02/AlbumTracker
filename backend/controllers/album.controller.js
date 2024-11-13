const Album = require("../models/album.model");
const spotifyService = require('../services/spotifyService');

//Search albums from Spotify
const searchAlbums = async (req,res) =>{
    try{
        const {query} = req.query;
        if(!query){
            return res.status(400).json({error: 'Search query is required'});
        }
        const albums = await spotifyService.searchAlbums(query);
        res.json(albums);
    }catch(error){
        res.status(500).json({error:error.message}); 
    }
};

//Save album to database
const saveAlbum = async(req,res) => {
    try{
        const albumData = req.body;
        
        const validPriorities = ['high','medium','low'];

        if(albumData.priority && !validPriorities.includes(albumData.priority)){
            return res.status(400).json({
                message:'Priority must be "high", "medium", or "low"'
            });
        }

        const existingAlbum = await Album.findOne({
            title: albumData.title,
            artist: albumData.artist
        });

        if(existingAlbum){
            return res.status(400).json({message: 'Album already in your list'});
        }

        const album = new Album({
            title: albumData.title, 
            artist: albumData.artist,
            genre: albumData.genre,
            releaseDate: new Date(albumData.releaseDate),
            imageURL: albumData.imageURL,
            priority: albumData.priority || 'low'
        });

        const savedAlbum = await album.save();
        res.status(201).json({
            message: "Album saved successfully",
            album: savedAlbum,
            priority: savedAlbum.priority
        });
    }catch(error){
        console.error("Error saving album", error.message)
        res.status(500).json({error: "an error ocurred saving the album."});
    }
};

const getAlbums = async (req,res) => {
    try{
        const album = await Album.find();
        res.json(album);
    }catch(error){
        res.status(500).json({error: "Error album not found"});
    }
};

module.exports = {
    searchAlbums,
    saveAlbum,
    getAlbums
};