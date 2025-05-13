const express = require('express')
const router = express.Router()
const { db } = require('../firebase')
const fetch = require('node-fetch')

/* ───── IGDB Image Validator ───── */
async function getCoverImageId(title) {
  const IGDB_CLIENT_ID = process.env.IGDB_CLIENT_ID
  const IGDB_ACCESS_TOKEN = process.env.IGDB_ACCESS_TOKEN

  if (!IGDB_CLIENT_ID || !IGDB_ACCESS_TOKEN) {
    console.error('Missing IGDB credentials')
    return null
  }

  try {
    const res = await fetch('https://api.igdb.com/v4/games', {
      method: 'POST',
      headers: {
        'Client-ID': IGDB_CLIENT_ID,
        'Authorization': `Bearer ${IGDB_ACCESS_TOKEN}`,
        'Content-Type': 'text/plain',
      },
      body: `search "${title}"; fields cover.image_id; limit 1;`,
    })

    const data = await res.json()
    return data?.[0]?.cover?.image_id || null
  } catch (err) {
    console.error('IGDB fetch failed:', err)
    return null
  }
}

/* ───── GET All Blogs ───── */
router.get('/', async (req, res) => {
  try {
    const { title } = req.query
    const snapshot = await db.collection('blogs').get()
    const blogs = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }))

    if (title) {
      const filtered = blogs.filter(b =>
        b.title?.toLowerCase() === title.toLowerCase()
      )
      return res.json(filtered)
    }

    res.json(blogs)
  } catch (err) {
    console.error('Failed to fetch blogs:', err)
    res.status(500).json({ error: 'Failed to fetch blogs' })
  }
})

/* ───── POST Create Blog ───── */
router.post('/', async (req, res) => {
  const { title, rating, content } = req.body

  if (!title || !rating || !content) {
    return res.status(400).json({ error: 'Missing required fields' })
  }

  try {
    const hasCover = await getCoverImageId(title)
    if (!hasCover) {
      return res.status(400).json({ error: 'Invalid title — no IGDB image found' })
    }

    const newDoc = await db.collection('blogs').add({
      title,
      rating,
      content,
      date: new Date().toISOString(),
    })

    res.status(201).json({ id: newDoc.id })
  } catch (err) {
    console.error('Failed to create blog:', err)
    res.status(500).json({ error: 'Failed to create blog' })
  }
})

module.exports = router
