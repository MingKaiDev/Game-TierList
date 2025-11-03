const express = require('express')
const router = express.Router()
const { db } = require('../firebase')
const fetch = require('node-fetch')
const checkAuth = require('../middleware/checkAuth')
const admin = require('firebase-admin')
const NodeCache = require('node-cache');
const blogCache = new NodeCache({ stdTTL: 300 }); // Cache for 5 minutes

// Environment configuration
const UAT_ENVIRONMENT = process.env.NODE_ENV !== 'production';
const BLOG_COLLECTION = UAT_ENVIRONMENT ? 'blogs_uat' : 'blogs';
console.log(`[INFO] Using Firestore collection: ${BLOG_COLLECTION}`);

/* ───── IGDB Image Validator ───── */
async function getCoverImageId(title) {
  const IGDB_CLIENT_ID = process.env.IGDB_CLIENT_ID
  const IGDB_ACCESS_TOKEN = process.env.IGDB_ACCESS_TOKEN

  function delay(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

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
// middleware
const verifyToken = async (req, res, next) => {
  const authHeader = req.headers.authorization
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Unauthorized' })
  }

  const idToken = authHeader.split(' ')[1]

  try {
    const decoded = await admin.auth().verifyIdToken(idToken)
    req.user = decoded
    next()
  } catch (err) {
    console.error('Token verification failed:', err)
    res.status(403).json({ error: 'Forbidden' })
  }
}
/* ───── GET All Blogs ───── */
router.get('/', async (req, res) => {
  try {
    const { title } = req.query;
    const cacheKey = `blogs_all`;

    // Try to get data from cache first
    if (blogCache.has(cacheKey)) {
      let blogs = blogCache.get(cacheKey);
      // Perform filtering on cached data
      return filterAndRespond(req, res, blogs, title);
    }

    // If not in cache, fetch from Firestore
    const snapshot = await db.collection(BLOG_COLLECTION).get();
    let blogs = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    
    // Store the full, unfiltered list in cache
    blogCache.set(cacheKey, blogs);

    // Perform filtering and respond
    return filterAndRespond(req, res, blogs, title);

  } catch (err) {
    console.error('Failed to fetch blogs:', err);
    res.status(500).json({ error: 'Failed to fetch blogs' });
  }
});

// Helper function to handle filtering and response
async function filterAndRespond(req, res, blogs, title) {
  let isAuthenticated = false;
  const authHeader = req.headers.authorization;
  if (authHeader && authHeader.startsWith('Bearer ')) {
    const idToken = authHeader.split(' ')[1];
    try {
      await admin.auth().verifyIdToken(idToken);
      isAuthenticated = true;
    } catch (err) {
      // Not authenticated
    }
  }

  let blogsToReturn = [...blogs];

  if (!isAuthenticated) {
    blogsToReturn = blogsToReturn.filter(blog => blog.NSFW !== true);
  }

  if (title) {
    const filtered = blogsToReturn.filter(b =>
      b.title?.toLowerCase() === title.toLowerCase()
    );
    return res.json(filtered);
  }

  return res.json(blogsToReturn);
}


/* ───── POST Create Blog ───── */
router.post('/',verifyToken, async (req, res) => {
  const { title, rating, content, summary, gameplayTime, NSFW } = req.body
  const uid = req.user.uid                       // from verified token
  const now = new Date()

  if (!title || !rating || !content) {
    return res.status(400).json({ error: 'Missing required fields' })
  }

  try {
    // const hasCover = await getCoverImageId(title)
    // if (!hasCover) {
    //   return res.status(400).json({ error: 'Invalid title — no IGDB image found' })
    // }

    const newDoc = await db.collection(BLOG_COLLECTION).add({
      title,
      rating,
      content,
      summary,
      gameplayTime,
      NSFW: Boolean(NSFW), // Ensure it's always a boolean
      date: new Date().toISOString(),
      authorUid: uid,
    })

    blogCache.del('blogs_all'); // Invalidate cache
    res.status(201).json({ id: newDoc.id })
  } catch (err) {
    console.error('Failed to create blog:', err)
    res.status(500).json({ error: 'Failed to create blog' })
  }
})

/* ───── PATCH Update Blog ───── */
router.patch('/:id', verifyToken, async (req, res) => {
  const { id } = req.params
  const { content, rating, gameplayTime, NSFW } = req.body

  try {
    const blogRef = db.collection(BLOG_COLLECTION).doc(id)
    const blogSnap = await blogRef.get()

    if (!blogSnap.exists) {
      return res.status(404).json({ error: 'Blog not found' })
    }

    const blog = blogSnap.data()
    if (blog.authorUid !== req.user.uid) {
      return res.status(403).json({ error: 'Forbidden: Not your blog' })
    }

    const updateData = {
      content,
      rating,
      gameplayTime,
    }

    // Only update NSFW if it's provided in the request
    if (NSFW !== undefined) {
      updateData.NSFW = Boolean(NSFW)
    }

    await blogRef.update(updateData)

    blogCache.del('blogs_all'); // Invalidate cache
    res.status(200).json({ success: true })
  } catch (err) {
    console.error('Blog update failed:', err)
    res.status(500).json({ error: 'Failed to update blog' })
  }
})

/* ───── DELETE Blog ───── */
router.delete('/:id', verifyToken, async (req, res) => {
  const { id } = req.params;

  try {
    const blogRef = db.collection(BLOG_COLLECTION).doc(id);
    const blogSnap = await blogRef.get();

    if (!blogSnap.exists) {
      return res.status(404).json({ error: 'Blog not found' });
    }

    const blog = blogSnap.data();
    if (blog.authorUid !== req.user.uid) {
      return res.status(403).json({ error: 'Forbidden: Not your blog' });
    }

    await blogRef.delete();
    
    blogCache.del('blogs_all'); // Invalidate cache
    res.status(200).json({ success: true, message: 'Blog deleted' });

  } catch (err) {
    console.error('Blog delete failed:', err);
    res.status(500).json({ error: 'Failed to delete blog' });
  }
});


module.exports = router
