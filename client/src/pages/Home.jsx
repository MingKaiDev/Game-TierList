import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'

const Home = () => {
  const [blogs, setBlogs] = useState([])
  const [loading, setLoading] = useState(true)
  const [current, setCurrent] = useState(0)
  const navigate = useNavigate()

  useEffect(() => {
    const fetchLatestBlogs = async () => {
      try {
        const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/blogs`)
        const data = await res.json()
        const sorted = data
          .filter(b => b.date)
          .sort((a, b) => new Date(b.date) - new Date(a.date))
          .slice(0, 5)

        const enriched = await Promise.all(
          sorted.map(async (blog) => {
            try {
              const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/cover?title=${encodeURIComponent(blog.title)}`)
              const cover = await res.json()
              return { ...blog, coverUrl: cover.coverUrl || null, source: cover.source || null }
            } catch {
              return { ...blog, coverUrl: null, source: null }
            }
          })
        )

        setBlogs(enriched)
      } catch (err) {
        console.error('Failed to fetch blogs:', err)
      } finally {
        setLoading(false)
      }
    }

    fetchLatestBlogs()
  }, [])

  const scroll = (direction) => {
    setCurrent((prev) => (prev + direction + blogs.length) % blogs.length)
  }

  const blog = blogs[current]

  return (
    <div style={styles.page}>
      <h1 style={styles.heading}>🌟 Featured</h1>
      <div style={styles.carousel}>
        <button onClick={() => scroll(-1)} style={styles.arrow}>◀</button>
        {loading ? (
          <p style={{ color: 'white' }}>Loading...</p>
        ) : (
          <div style={styles.card}>
            {blog.coverUrl ? (
              <img
                src={blog.coverUrl}
                alt={blog.title}
                style={blog.source === 'artwork' ? styles.imageArtwork : styles.imageCover}
              />
            ) : (
              <div style={styles.imagePlaceholder} />
            )}
            <div style={styles.overlay}>
              <h3 style={styles.cardTitle}>{blog.title}</h3>
              <p style={styles.desc}>{blog.content?.slice(0, 70)}...</p>
              <button
                style={styles.readMore}
                onClick={() => navigate(`/blog/${encodeURIComponent(blog.title)}`)}
              >
                Read More
              </button>
            </div>
          </div>
        )}
        <button onClick={() => scroll(1)} style={styles.arrow}>▶</button>
      </div>
    </div>
  )
}

const styles = {
  page: {
    paddingTop: '100px',
    textAlign: 'center',
    backgroundColor: '#0d1117',
    minHeight: '100vh',
  },
  heading: {
    fontSize: '2rem',
    marginBottom: '1rem',
    color: '#fff',
  },
  carousel: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '2rem',
  },
  card: {
    width: '600px',
    height: '900px',
    position: 'relative',
    borderRadius: '12px',
    overflow: 'hidden',
    boxShadow: '0 6px 14px rgba(0,0,0,0.5)',
    backgroundColor: '#1e1e1e',
    transition: 'transform 0.5s ease',
  },
  imageCover: {
    width: '100%',
    height: '100%',
    objectFit: 'cover',
    display: 'block',
  },
  imageArtwork: {
    width: '100%',
    height: '100%',
    objectFit: 'contain',
    backgroundColor: '#111',
    padding: '1rem',
  },
  overlay: {
    position: 'absolute',
    bottom: 0,
    width: '100%',
    padding: '1rem',
    background: 'rgba(255, 255, 255, 0.1)',
    color: '#eee',
    backdropFilter: 'blur(4px)',
  },
  cardTitle: {
    fontSize: '1.3rem',
    marginBottom: '0.5rem',
    fontWeight: 'bold',
    color: '#eee',
  },
  desc: {
    fontSize: '0.95rem',
    marginBottom: '0.8rem',
    color: '#ddd',
  },
  readMore: {
    padding: '0.4rem 0.8rem',
    backgroundColor: '#00C800',
    border: 'none',
    color: 'white',
    borderRadius: '6px',
    cursor: 'pointer',
  },
  arrow: {
    fontSize: '2.2rem',
    background: 'transparent',
    border: 'none',
    color: '#fff',
    cursor: 'pointer',
  },
  imagePlaceholder: {
    width: '100%',
    height: '100%',
    backgroundColor: '#333',
  },
}

export default Home
