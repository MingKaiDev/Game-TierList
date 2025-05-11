const express = require('express')
const router = express.Router()
const { db } = require('../firebase')

router.get('/', async (req, res) => {
  try {
    const snapshot = await db.collection('blogs').get()
    const blogs = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }))
    res.json(blogs)
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

router.post('/', async (req, res) => {
  const { title, rating, image } = req.body
  try {
    const docRef = await db.collection('blogs').add({ title, rating, image })
    res.status(201).json({ id: docRef.id })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

module.exports = router