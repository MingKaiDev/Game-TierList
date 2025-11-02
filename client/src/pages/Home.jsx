import { useEffect, useState, useContext } from 'react'
import { useNavigate } from 'react-router-dom'
import { AuthCtx } from '../contexts/AuthContext'
import { getAuth } from 'firebase/auth'
import { FaChevronLeft, FaChevronRight, FaSpinner } from 'react-icons/fa';

const AUTO_PLAY_INTERVAL = 5000

const Home = () => {
  const [blogs, setBlogs] = useState([])
  const [loading, setLoad] = useState(true)
  const [current, setCurr] = useState(0)
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768)
  const { user } = useContext(AuthCtx)
  const navigate = useNavigate()
  const delay = (ms) => new Promise(res => setTimeout(res, ms));

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 768)
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  useEffect(() => {
    const fetchLatest = async () => {
      try {
        // Prepare headers with authentication if user is logged in
        const headers = { 'Content-Type': 'application/json' }
        if (user) {
          try {
            const auth = getAuth()
            const token = await auth.currentUser.getIdToken()
            headers.Authorization = `Bearer ${token}`
          } catch (err) {
            console.warn('Failed to get auth token:', err)
          }
        }

        const r = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/blogs`, { headers })
        const data = await r.json()

        const sorted = data
          .filter(b => typeof b.rating === 'number' && b.rating >= 7 && b.date)
          .sort((a, b) => new Date(b.date) - new Date(a.date))
          .slice(0, 5)


        const enriched = [];

        for (const blog of sorted) {
          try {
            const res = await fetch(
              `${import.meta.env.VITE_BACKEND_URL}/api/artwork?title=${encodeURIComponent(blog.title)}`
            );
            const { coverUrl } = await res.json();
            enriched.push({ ...blog, artworkUrl: coverUrl || null });
          } catch (err) {
            console.warn(`Artwork fetch failed for "${blog.title}"`, err.message);
            enriched.push({ ...blog, artworkUrl: null });
          }

          await delay(500); // throttle each request
        }

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
      <h1 style={styles.heading}>Featured Chronicles</h1>

      <div style={styles.carousel}>
        {!isMobile && <button onClick={() => shift(-1)} style={{ ...styles.arrow, left: '-50px' }}><FaChevronLeft /></button>}

        {loading ? (
          <div style={styles.loader}>
            <FaSpinner className="spinner" />
            <p style={{marginTop: '1rem'}}>Loading Tomes...</p>
          </div>
        ) : (
          <div style={isMobile ? styles.frameMobile : styles.frame}>
            {blogs.map((b, i) => (
              <div
                key={b.id}
                style={{
                  ...styles.card,
                  opacity: i === current ? 1 : 0,
                  transform: `translateX(${(i - current) * 100}%)`,
                  zIndex: i === current ? 10 : 1,
                }}
              >
                <img
                  src={b.artworkUrl || '/fallback.jpg'}
                  alt={b.title}
                  style={styles.img}
                />
                <div style={styles.overlay}>
                  <h3 style={isMobile ? styles.titleMobile : styles.title}>{b.title}</h3>
                  <p style={isMobile ? styles.snipMobile : styles.snip}>{(b.summary || '').slice(0, isMobile ? 60 : 100)}…</p>
                  <button
                    style={isMobile ? styles.btnMobile : styles.btn}
                    onClick={() => navigate(`/blog/${encodeURIComponent(b.title)}`)}
                  >
                    Read the Chronicle
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {!isMobile && <button onClick={() => shift(1)} style={{ ...styles.arrow, right: '-50px' }}><FaChevronRight /></button>}
      </div>

      <div style={styles.dots}>
        {blogs.map((_, i) => (
          <span
            key={i}
            onClick={() => setCurr(i)}
            style={{ ...styles.dot, background: i === current ? '#B89B72' : '#444' }}
          />
        ))}
      </div>

      <div style={{
        ...styles.dashboard,
        gap: isMobile ? '1.5rem' : '2rem',
        padding: isMobile ? '1.5rem' : '2rem',
        marginTop: isMobile ? '2rem' : '3rem'
      }}>
        {/* 🔹 Recently Added */}
        <div style={styles.widget}>
          <h2 style={styles.widgetTitle}>Recent Entries</h2>
          <ul style={styles.list}>
            {[...blogs]
              .sort((a, b) => new Date(b.date) - new Date(a.date))
              .slice(0, 3)
              .map((b, i) => (
                <li key={i} style={styles.listItem}>
                  <span style={styles.listItemTitle}>{b.title}</span>
                  <span style={styles.listItemDate}>{new Date(b.date).toLocaleDateString()}</span>
                </li>
              ))}
          </ul>
        </div>

        {/* 🔹 Top Rated */}
        <div style={styles.widget}>
          <h2 style={styles.widgetTitle}>Top Rated</h2>
          <ul style={styles.list}>
            {[...blogs]
              .filter(b => typeof b.rating === 'number')
              .sort((a, b) => b.rating - a.rating)
              .slice(0, 3)
              .map((b, i) => (
                <li key={i} style={styles.listItem}>
                  <span style={styles.listItemTitle}>{b.title}</span>
                  <span style={styles.listItemRating}>{b.rating}/10</span>
                </li>
              ))}
          </ul>
        </div>
      </div>

    </div>
  )
}

const styles = {
  page: {
    padding: '0 1rem',
    textAlign: 'center',
    background: '#101010',
    minHeight: '100vh',
    color: '#EAEAEA',
    fontFamily: "'Cinzel', serif",
  },
  heading: {
    fontSize: '2.5rem',
    fontWeight: '700',
    color: '#EAEAEA',
    marginBottom: '1.5rem',
    textShadow: '1px 1px 3px rgba(0,0,0,0.7)',
  },
  carousel: {
    position: 'relative',
    width: '100%',
    maxWidth: '1200px',
    margin: '0 auto',
  },
  frame: {
    position: 'relative',
    width: '100%',
    aspectRatio: '16/9',
    overflow: 'hidden',
    borderRadius: '2px',
    border: '1px solid #444',
  },
  frameMobile: {
    position: 'relative',
    width: '100%',
    aspectRatio: '4/3',
    overflow: 'hidden',
    borderRadius: '2px',
    border: '1px solid #444',
  },
  card: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    transition: 'opacity 0.8s ease-in-out, transform 0.8s ease-in-out',
    boxShadow: '0 8px 20px rgba(0,0,0,0.6)',
  },
  img: {
    width: '100%',
    height: '100%',
    objectFit: 'cover',
    filter: 'brightness(0.7)',
  },
  overlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    width: '100%',
    padding: '1.5rem 2rem',
    background: 'linear-gradient(to top, rgba(0,0,0,0.8) 0%, rgba(0,0,0,0) 100%)',
    color: '#EAEAEA',
    textAlign: 'left',
  },
  title: {
    fontSize: '2rem',
    fontWeight: 700,
    margin: '0 0 0.5rem',
    textShadow: '2px 2px 4px rgba(0,0,0,0.8)',
  },
  titleMobile: {
    fontSize: '1.5rem',
    fontWeight: 700,
    margin: '0 0 0.4rem',
  },
  snip: {
    fontSize: '1rem',
    color: '#BDBDBD',
    margin: '0 0 1rem',
    maxWidth: '80%',
  },
  snipMobile: {
    fontSize: '0.9rem',
    color: '#BDBDBD',
    margin: '0 0 0.8rem',
  },
  btn: {
    padding: '0.7rem 1.5rem',
    background: 'transparent',
    color: '#B89B72',
    border: '1px solid #B89B72',
    borderRadius: '2px',
    cursor: 'pointer',
    fontWeight: 600,
    fontFamily: "'Cinzel', serif",
    transition: 'background-color 0.3s, color 0.3s',
  },
  btnMobile: {
    padding: '0.5rem 1rem',
    fontSize: '0.9rem',
  },
  arrow: {
    position: 'absolute',
    top: '50%',
    transform: 'translateY(-50%)',
    fontSize: '3rem',
    background: 'transparent',
    border: 'none',
    color: 'rgba(255, 255, 255, 0.7)',
    cursor: 'pointer',
    userSelect: 'none',
    transition: 'color 0.3s',
  },
  dots: {
    display: 'flex',
    justifyContent: 'center',
    gap: '0.75rem',
    marginTop: '1.5rem',
  },
  dot: {
    width: '10px',
    height: '10px',
    borderRadius: '50%',
    cursor: 'pointer',
    border: '1px solid #B89B72',
    transition: 'background .3s',
  },
  dashboard: {
    display: 'flex',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: '2rem',
    padding: '2rem',
    marginTop: '3rem',
    backgroundColor: '#1A1A1A',
    borderTop: '1px solid #444',
    borderRadius: '2px',
  },
  widget: {
    background: 'transparent',
    width: '320px',
    color: '#EAEAEA',
  },
  widgetTitle: {
    fontSize: '1.5rem',
    marginBottom: '1rem',
    paddingBottom: '0.5rem',
    borderBottom: '1px solid #444',
    color: '#B89B72',
  },
  list: {
    listStyle: 'none',
    padding: 0,
    margin: 0,
  },
  listItem: {
    padding: '0.75rem 0',
    borderBottom: '1px solid #2a2a2a',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  listItemTitle: {
    fontWeight: 'bold',
  },
  listItemDate: {
    fontSize: '0.85rem',
    color: '#999',
  },
  listItemRating: {
    fontSize: '0.9rem',
    fontWeight: 'bold',
    color: '#B89B72',
  },
  loader: {
    width: '100%',
    height: '400px',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    color: '#B89B72',
  }
}

export default Home
