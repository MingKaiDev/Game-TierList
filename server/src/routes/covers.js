// server/src/routes/cover.js
const express = require('express')
const router  = express.Router()
const fetch   = require('node-fetch')
require('dotenv').config()

const IGDB_CLIENT_ID    = process.env.IGDB_CLIENT_ID
const IGDB_ACCESS_TOKEN = process.env.IGDB_ACCESS_TOKEN

router.get('/', async (req, res) => {
  const { title } = req.query
  if (!title) {
    return res.status(400).json({ error: 'Missing title param' })
  }

  try {
    // 🔎  Search for the game and request only cover image IDs
    const igdbRes = await fetch('https://api.igdb.com/v4/games', {
      method: 'POST',
      headers: {
        'Client-ID': IGDB_CLIENT_ID,
        'Authorization': `Bearer ${IGDB_ACCESS_TOKEN}`,
        'Content-Type': 'text/plain',
      },
      body: `search "${title.trim()}"; fields name, cover.image_id; limit 1;`,
    })

    if (igdbRes.status !== 200) {
      return res
        .status(igdbRes.status)
        .json({ error: 'IGDB auth failed or request malformed' })
    }

    const games = await igdbRes.json()
    const imageId = games?.[0]?.cover?.image_id

    if (!imageId) {
      console.warn(`No cover found for "${title}"`)
      return res.status(404).json({ error: 'No cover found' })
    }

    const coverUrl = `https://images.igdb.com/igdb/image/upload/t_cover_big/${imageId}.jpg`
    return res.json({ coverUrl, source: 'cover' })

  } catch (err) {
    console.error('IGDB cover fetch error:', err)
    res.status(500).json({ error: 'Failed to fetch cover' })
  }
})

module.exports = router
