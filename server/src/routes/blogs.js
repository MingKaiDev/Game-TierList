const express = require('express')
const router = express.Router()
const { db } = require('../firebase')

router.get('/', async (req, res) => {
  const { title } = req.query
  const snapshot = await db.collection('blogs').get()
  const blogs = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }))

  if (title) {
    const filtered = blogs.filter(b => b.title.toLowerCase() === title.toLowerCase())
    return res.json(filtered)
  }

  res.json(blogs)
})

router.post('/', async (req, res) => {
  const { title, rating, content } = req.body
  try {
    const docRef = await db.collection('blogs').add({ title, rating, content })
    res.status(201).json({ id: docRef.id })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

module.exports = router