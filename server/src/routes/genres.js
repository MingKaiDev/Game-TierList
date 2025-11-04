const express = require('express');
const router = express.Router();
const { getFirestore } = require('firebase-admin/firestore');
const axios = require('axios');
const NodeCache = require('node-cache');

const db = getFirestore();
const igdbCache = new NodeCache({ stdTTL: 86400 }); // Cache IGDB data for 24 hours

const getIgdbAccessToken = async () => {
  let token = igdbCache.get('igdb_access_token');
  if (token) {
    return token;
  }
  try {
    const response = await axios.post(`https://id.twitch.tv/oauth2/token?client_id=${process.env.IGDB_CLIENT_ID}&client_secret=${process.env.IGDB_CLIENT_SECRET}&grant_type=client_credentials`);
    token = response.data.access_token;
    igdbCache.set('igdb_access_token', token, response.data.expires_in);
    return token;
  } catch (error) {
    console.error('Failed to get IGDB access token:', error);
    throw new Error('Could not retrieve IGDB access token');
  }
};

router.get('/', async (req, res) => {
  try {
    const collectionName = process.env.NODE_ENV === 'development' ? 'blogs_uat' : 'blogs';
    const blogsSnapshot = await db.collection(collectionName).get();
    const blogs = blogsSnapshot.docs.map(doc => doc.data());
    
    const uniqueGameTitles = [...new Set(blogs.map(blog => blog.title))];
    
    const accessToken = await getIgdbAccessToken();
    
    let allGenres = [];

    for (const title of uniqueGameTitles) {
      const cachedGenres = igdbCache.get(`genres_${title}`);
      if (cachedGenres) {
        allGenres.push(...cachedGenres);
        continue;
      }

      try {
        const igdbResponse = await axios.post('https://api.igdb.com/v4/games', 
          `fields name,genres.name; search "${title}"; limit 1;`,
          {
            headers: {
              'Client-ID': process.env.IGDB_CLIENT_ID,
              'Authorization': `Bearer ${accessToken}`,
              'Accept': 'application/json',
            }
          }
        );

        if (igdbResponse.data.length > 0 && igdbResponse.data[0].genres) {
          const genres = igdbResponse.data[0].genres.map(g => g.name);
          allGenres.push(...genres);
          igdbCache.set(`genres_${title}`, genres);
        }
      } catch (error) {
        console.error(`Failed to fetch genres for ${title}:`, error.message);
        // Continue to next game even if one fails
      }
    }

    const genreCounts = allGenres.reduce((acc, genre) => {
      acc[genre] = (acc[genre] || 0) + 1;
      return acc;
    }, {});

    res.status(200).json(genreCounts);
  } catch (error) {
    console.error('Error in getGenreDistribution:', error);
    res.status(500).json({ message: 'Failed to get genre distribution' });
  }
});

module.exports = router;
