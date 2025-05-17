// server/routes/details.js
const express = require('express')
const router = express.Router()
const fetch = require('node-fetch')

const IGDB_CLIENT_ID = process.env.IGDB_CLIENT_ID
const IGDB_ACCESS_TOKEN = process.env.IGDB_ACCESS_TOKEN

router.get('/', async (req, res) => {
  const { title } = req.query
  if (!title) return res.status(400).json({ error: 'Missing title' })

  try {
    const gameRes = await fetch('https://api.igdb.com/v4/games', {
      method: 'POST',
      headers: {
        'Client-ID': IGDB_CLIENT_ID,
        'Authorization': `Bearer ${IGDB_ACCESS_TOKEN}`,
        'Content-Type': 'text/plain',
      },
      body: `search "${title}"; fields name,artworks.image_id,genres.name,involved_companies.company.name,involved_companies.developer,involved_companies.publisher; limit 1;`
    })

    const data = await gameRes.json()
    if (!data.length) return res.status(404).json({ error: 'Game not found' })

    const game = data[0]
    const artworkUrl = game.artworks?.[0]?.image_id
      ? `https://images.igdb.com/igdb/image/upload/t_screenshot_huge/${game.artworks[0].image_id}.jpg`
      : null

    const devs = game.involved_companies?.filter(c => c.developer).map(c => c.company.name) || []
    const pubs = game.involved_companies?.filter(c => c.publisher).map(c => c.company.name) || []

    return res.json({
      artworkUrl,
      genres: game.genres?.map(g => g.name) || [],
      developers: devs,
      publishers: pubs,
    })
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Failed to fetch details' })
  }
})

module.exports = router
