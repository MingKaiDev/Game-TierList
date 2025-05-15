// server/src/middleware/checkAuth.js
const admin = require('../firebaseAdmin')

module.exports = async function checkAuth(req, res, next) {
  const header = req.headers.authorization || ''
  const match  = header.match(/^Bearer (.+)$/)

  if (!match) return res.status(401).json({ error: 'Missing auth token' })

  try {
    const decoded = await admin.auth().verifyIdToken(match[1])
    req.user = decoded                    // attach user info to request
    return next()
  } catch (err) {
    console.error('Token verify failed:', err)
    return res.status(401).json({ error: 'Invalid / expired token' })
  }
}
