require('dotenv').config();
const axios = require('axios');
const qs = require('qs');


const client_id = process.env.CLIENT_ID;
const client_secret = process.env.CLIENT_SECRET;
const auth_token = Buffer.from(`${client_id}:${client_secret}`, 'utf-8').toString('base64');

//Spotify API
const getSpotifyToken = async () => {
    try{
        //make post request to SPOTIFY API for access token, sending relavent info
        const token_url = 'https://accounts.spotify.com/api/token';
        const data = qs.stringify({'grant_type':'client_credentials'});

        const response = await axios.post(token_url, data, {
            headers: {
                'Authorization' : `Basic ${auth_token}`,
                'Content-Type': 'application/x-www-form-urlencoded'
            }
        })
        //return acces token
        return response.data.access_token;
        //console.log(response.data.access_token);
    }catch(error){
        console.log(error.response? error.response.data : error.message);
    }
}

async function searchAlbums(query){
    const token = await getSpotifyToken();
    const searchUrl = `https://api.spotify.com/v1/search`;
    const options = {
        headers:{
            Authorization: `Bearer ${token}`
        },
        params:{
            q:query,
            type:'album',
            limit:10
        }
    };
    
    try {
        const response = await axios.get(searchUrl, options);
        const albums = response.data.albums.items;

        return albums.map(album => ({
            title: album.name,
            artist: album.artists[0].name, 
            genre: album.genres || [],
            releaseDate: album.release_date,
            imageURL: album.images[0]?.url || '',
            spotifyId: album.id
        }));
    }catch(error){
        console.error('Error searching for albums:', error);
        throw new Error('Error fetching album data');
    }
}

module.exports = { searchAlbums };