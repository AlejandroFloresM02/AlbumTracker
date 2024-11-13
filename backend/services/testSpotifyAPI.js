require('dotenv').config();
const { searchAlbums } = require('./spotifyService'); 

(async () => {
    try {
        const albums = await searchAlbums('Deathconsciousness'); 
        console.log(albums); 
    } catch (error) {
        console.error('Test failed:', error.message);
    }
})();