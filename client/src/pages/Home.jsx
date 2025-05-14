import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'

const AUTO_PLAY_INTERVAL = 5000

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
              // Only use if artwork source
              if (cover.source === 'artwork') {
                return { ...blog, coverUrl: cover.coverUrl }
              }
            } catch {}
            return null
          })
        )

        const filtered = enriched.filter(Boolean)
        setBlogs(filtered)
      } catch (err) {
        console.error('Failed to fetch blogs:', err)
      } finally {
        setLoading(false)
      }
    }

    fetchLatestBlogs()
  }, [])

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrent((prev) => (prev + 1) % blogs.length)
    }, AUTO_PLAY_INTERVAL)
    return () => clearInterval(interval)
  }, [blogs])

  const scroll = (dir) => {
    setCurrent((prev) => (prev + dir + blogs.length) % blogs.length)
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
          <div style={styles.cardContainer}>
            {blogs.map((b, index) => (
              <div
                key={b.id}
                style={{
                  ...styles.card,
                  opacity: index === current ? 1 : 0,
                  zIndex: index === current ? 1 : 0,
                }}
              >
                <img
                  src={b.coverUrl}
                  alt={b.title}
                  style={styles.imageArtwork}
                />
                <div style={styles.overlay}>
                  <h3 style={styles.cardTitle}>{b.title}</h3>
                  <p style={styles.desc}>{b.content?.slice(0, 70)}...</p>
                  <button
                    style={styles.readMore}
                    onClick={() => navigate(`/blog/${encodeURIComponent(b.title)}`)}
                  >
                    Read More
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        <button onClick={() => scroll(1)} style={styles.arrow}>▶</button>
      </div>

      {/* Indicator dots */}
      {!loading && blogs.length > 0 && (
        <div style={styles.dots}>
          {blogs.map((_, i) => (
            <span
              key={i}
              onClick={() => setCurrent(i)}
              style={{
                ...styles.dot,
                backgroundColor: i === current ? '#00C800' : '#555',
              }}
            />
          ))}
        </div>
      )}
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
    position: 'relative',
  },
  cardContainer: {
    position: 'relative',
    width: '800px',
    height: '500px',
  },
  card: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '800px',
    height: '500px',
    borderRadius: '12px',
    overflow: 'hidden',
    boxShadow: '0 6px 14px rgba(0,0,0,0.5)',
    backgroundColor: '#1e1e1e',
    transition: 'opacity 0.8s ease-in-out',
  },
  imageArtwork: {
    width: '100%',
    height: '100%',
    objectFit: 'cover',
    display: 'block',
  },
  overlay: {
    position: 'absolute',
    bottom: 0,
    width: '100%',
    padding: '1rem',
    background: 'rgba(0, 0, 0, 0.4)',
    color: '#eee',
    backdropFilter: 'blur(6px)',
  },
  cardTitle: {
    fontSize: '1.5rem',
    marginBottom: '0.5rem',
    fontWeight: 'bold',
  },
  desc: {
    fontSize: '1rem',
    marginBottom: '0.8rem',
    color: '#ddd',
  },
  readMore: {
    padding: '0.5rem 1rem',
    backgroundColor: '#00C800',
    border: 'none',
    color: 'white',
    borderRadius: '6px',
    cursor: 'pointer',
    fontWeight: 'bold',
  },
  arrow: {
    fontSize: '2.2rem',
    background: 'transparent',
    border: 'none',
    color: '#fff',
    cursor: 'pointer',
  },
  dots: {
    marginTop: '1rem',
    display: 'flex',
    justifyContent: 'center',
    gap: '0.5rem',
  },
  dot: {
    width: '12px',
    height: '12px',
    borderRadius: '50%',
    display: 'inline-block',
    cursor: 'pointer',
    transition: 'background-color 0.3s ease',
  },
}

export default Home
