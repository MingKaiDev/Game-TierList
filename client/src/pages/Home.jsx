import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'

const AUTO_PLAY_INTERVAL = 5000

const Home = () => {
  const [blogs, setBlogs] = useState([])
  const [loading, setLoad] = useState(true)
  const [current, setCurr] = useState(0)
  const navigate = useNavigate()

  useEffect(() => {
    const fetchLatest = async () => {
      try {
        const r = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/blogs`)
        const data = await r.json()

        const sorted = data
          .filter(b => b.date)
          .sort((a, b) => new Date(b.date) - new Date(a.date))
          .slice(0, 5)

        const enriched = await Promise.all(
          sorted.map(async blog => {
            try {
              const res = await fetch(
                `${import.meta.env.VITE_BACKEND_URL}/api/artwork?title=${encodeURIComponent(blog.title)}`
              )
              const { coverUrl } = await res.json()
              return { ...blog, artworkUrl: coverUrl || null }
            } catch {
              return { ...blog, artworkUrl: null }
            }
          })
        )

        setBlogs(enriched)
      } catch (err) {
        console.error('Blog fetch failed:', err)
      } finally {
        setLoad(false)
      }
    }

    fetchLatest()
  }, [])

  useEffect(() => {
    if (!blogs.length) return
    const id = setInterval(() => setCurr(i => (i + 1) % blogs.length), AUTO_PLAY_INTERVAL)
    return () => clearInterval(id)
  }, [blogs])

  const shift = dir => setCurr(i => (i + dir + blogs.length) % blogs.length)

  return (
    <div style={styles.page}>
      <h1 style={styles.heading}>🌟 Featured</h1>

      <div style={styles.carousel}>
        <button onClick={() => shift(-1)} style={{ ...styles.arrow, left: '-40px' }}>◀</button>

        {loading ? (
          <p style={{ color: '#fff' }}>Loading…</p>
        ) : (
          <div style={styles.frame}>
            {blogs.map((b, i) => (
              <div
                key={b.id}
                style={{
                  ...styles.card,
                  opacity: i === current ? 1 : 0,
                  zIndex: i === current ? 1 : 0,
                }}
              >
                <img
                  src={b.artworkUrl || '/fallback.jpg'}
                  alt={b.title}
                  style={styles.img}
                />
                <div style={styles.overlay}>
                  <h3 style={styles.title}>{b.title}</h3>
                  <p style={styles.snip}>{(b.summary || '').slice(0, 70)}…</p>
                  <button
                    style={styles.btn}
                    onClick={() => navigate(`/blog/${encodeURIComponent(b.title)}`)}
                  >
                    Read More
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        <button onClick={() => shift(1)} style={{ ...styles.arrow, right: '-40px' }}>▶</button>
      </div>

      {!loading && blogs.length > 0 && (
        <div style={styles.dots}>
          {blogs.map((_, i) => (
            <span
              key={i}
              onClick={() => setCurr(i)}
              style={{ ...styles.dot, background: i === current ? '#00C800' : '#555' }}
            />
          ))}
        </div>
      )}

      <div style={styles.dashboard}>
        <div style={styles.widget}>
          <h2>Recently Added</h2>
          <ul style={styles.list}>
            {blogs.slice(0, 3).map((b, i) => (
              <li key={i} style={styles.listItem}>
                <strong>{b.title}</strong> – {new Date(b.date).toLocaleDateString()}
              </li>
            ))}
          </ul>
        </div>

        <div style={styles.widget}>
          <h2>Top Rated</h2>
          <ul style={styles.list}>
            {[...blogs].sort((a, b) => b.rating - a.rating).slice(0, 3).map((b, i) => (
              <li key={i} style={styles.listItem}>
                <strong>{b.title}</strong> – {b.rating}/10
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  )
}

const styles = {
  page: { paddingTop: '100px', textAlign: 'center', background: '#0d1117', minHeight: '100vh' },
  heading: { fontSize: '2rem', color: '#fff', marginBottom: '1rem' },
  carousel: { position: 'relative', width: '100%', maxWidth: '1600px', margin: '0 auto' },
  frame: { position: 'relative', width: '100%', aspectRatio: '2/1', overflow: 'hidden' },
  card: {
    position: 'absolute', top: 0, left: 0, width: '100%', height: '100%',
    borderRadius: '12px', overflow: 'hidden',
    transition: 'opacity .8s ease-in-out', boxShadow: '0 6px 14px rgba(0,0,0,.5)'
  },
  img: { width: '100%', height: '100%', objectFit: 'cover' },
  overlay: {
    position: 'absolute', bottom: 0, width: '100%', padding: '1rem',
    background: 'rgba(0,0,0,.45)', color: '#eee', backdropFilter: 'blur(6px)'
  },
  title: { fontSize: '1.5rem', fontWeight: 700, margin: '0 0 .5rem' },
  snip: { fontSize: '1rem', color: '#ddd', margin: '0 0 .8rem' },
  btn: {
    padding: '.5rem 1rem', background: '#00C800', color: '#fff',
    border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: 600
  },
  arrow: {
    position: 'absolute', top: '50%', transform: 'translateY(-50%)',
    fontSize: '2.5rem', padding: 0, background: 'transparent',
    border: 'none', color: '#fff', cursor: 'pointer', userSelect: 'none',
  },
  dots: { display: 'flex', justifyContent: 'center', gap: '.5rem', marginTop: '1rem' },
  dot: {
    width: '12px', height: '12px', borderRadius: '50%', cursor: 'pointer',
    transition: 'background .3s'
  },

  // NEW Dashboard UI
  dashboard: {
    display: 'flex',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: '2rem',
    padding: '2rem',
    marginTop: '2rem',
    backgroundColor: '#161b22',
    borderTop: '1px solid #222',
  },
  widget: {
    background: '#1e1e1e',
    borderRadius: '12px',
    padding: '1rem 1.5rem',
    width: '300px',
    color: '#fff',
    boxShadow: '0 2px 8px rgba(0,0,0,0.3)',
  },
  list: {
    listStyle: 'none',
    padding: 0,
    margin: 0,
  },
  listItem: {
    padding: '0.5rem 0',
    borderBottom: '1px solid #333',
    fontSize: '0.95rem',
  }
}

export default Home
