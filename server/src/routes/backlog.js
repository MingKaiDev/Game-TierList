const express = require('express')
const router = express.Router()
const { db } = require('../firebase')

// GET all backlog items
router.get('/', async (req, res) => {
  try {
    const snapshot = await db.collection('backlog').get()
    const items = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }))
    res.json(items)
  } catch (err) {
    console.error('Failed to fetch backlog:', err)
    res.status(500).json({ error: 'Failed to fetch backlog' })
  }
})

// POST add new backlog item
router.post('/', async (req, res) => {
  try {
    const { title } = req.body
    if (!title || !title.trim()) {
      return res.status(400).json({ error: 'Missing title' })
    }
    const docRef = await db.collection('backlog').add({ title: title.trim(), date: new Date().toISOString() })
    res.status(201).json({ id: docRef.id })
  } catch (err) {
    console.error('Failed to create backlog item:', err)
    res.status(500).json({ error: 'Failed to create backlog item' })
  }
})

module.exports = router
