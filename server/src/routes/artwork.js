// server/src/routes/artwork.js
const express = require('express')
const fetch   = require('node-fetch')
require('dotenv').config()

const router = express.Router()

const IGDB_CLIENT_ID    = process.env.IGDB_CLIENT_ID
const IGDB_ACCESS_TOKEN = process.env.IGDB_ACCESS_TOKEN

router.get('/', async (req, res) => {
  const { title } = req.query
  if (!title) {
    return res.status(400).json({ error: 'Missing title param' })
  }

  try {
    // 1️⃣  Search the game and request nested artwork image IDs
    const igdbRes = await fetch('https://api.igdb.com/v4/games', {
      method: 'POST',
      headers: {
        'Client-ID': IGDB_CLIENT_ID,
        'Authorization': `Bearer ${IGDB_ACCESS_TOKEN}`,
        'Content-Type': 'text/plain',
      },
      body: `search "${title.trim()}"; fields name, artworks.image_id; limit 1;`,
    })

    if (igdbRes.status !== 200) {
      return res
        .status(igdbRes.status)
        .json({ error: 'IGDB auth failed or request malformed' })
    }

    const games = await igdbRes.json()

    // 2️⃣  Ensure an artwork image exists
    const imageId = games?.[0]?.artworks?.[0]?.image_id
    if (!imageId) {
      return res.status(404).json({ error: 'No artwork found' })
    }

    // 3️⃣  Build the banner URL (t_screenshot_huge is landscape 1280×720)
    const coverUrl = `https://images.igdb.com/igdb/image/upload/t_screenshot_huge/${imageId}.jpg`

    return res.json({ coverUrl, source: 'artwork' })
  } catch (err) {
    console.error('IGDB artwork fetch error:', err)
    res.status(500).json({ error: 'Failed to fetch artwork' })
  }
})

module.exports = router
