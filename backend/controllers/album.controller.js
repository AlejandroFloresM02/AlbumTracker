const Album = require("../models/album.model.js");


app.get('/auth', async (req,res) =>{
    try{
        const token = await getSpotifyToken();
        res.json({ access_token: token});
    }catch(error){
        res.status(500).json({message:error});
    }
});