const express = require('express')
const router = express.Router()
const fetch = require('node-fetch')
require('dotenv').config()

const IGDB_CLIENT_ID = process.env.IGDB_CLIENT_ID
const IGDB_ACCESS_TOKEN = process.env.IGDB_ACCESS_TOKEN

router.get('/', async (req, res) => {
  const { title } = req.query
  if (!title) return res.status(400).json({ error: 'Missing title param' })

  try {
    const igdbRes = await fetch('https://api.igdb.com/v4/games', {
      method: 'POST',
      headers: {
        'Client-ID': IGDB_CLIENT_ID,
        'Authorization': `Bearer ${IGDB_ACCESS_TOKEN}`,
        'Content-Type': 'text/plain',
      },
      body: `search "${title.trim()}"; fields name,cover.image_id,artworks.image_id; limit 1;`,
    })

    console.log(`IGDB fetch status: ${igdbRes.status}`)

    const data = await igdbRes.json()
    console.log('IGDB response:', JSON.stringify(data, null, 2))

    if (igdbRes.status !== 200) {
      return res.status(igdbRes.status).json({ error: 'IGDB auth failed or request malformed' })
    }

    if (data.length) {
      const game = data[0]

      if (game.cover?.image_id) {
        const coverUrl = `https://images.igdb.com/igdb/image/upload/t_cover_big/${game.cover.image_id}.jpg`
        return res.json({ coverUrl, source: 'cover' })
      } else if (game.artworks?.length && game.artworks[0].image_id) {
        const bannerUrl = `https://images.igdb.com/igdb/image/upload/t_screenshot_huge/${game.artworks[0].image_id}.jpg`
        return res.json({ coverUrl: bannerUrl, source: 'artwork' })
      }
    }

    console.warn(`No image found for title: "${title}"`)
    return res.status(404).json({ error: 'No image found' })

  } catch (err) {
    console.error('IGDB fetch error:', err)
    res.status(500).json({ error: 'Failed to fetch image' })
  }
})

module.exports = router
