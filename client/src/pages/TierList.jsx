import { useEffect, useState } from 'react'
import useGameCovers from '../hooks/useGameCovers'

const TierList = () => {
  const [blogs, setBlogs] = useState([])

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/blogs`)
        const data = await res.json()
        setBlogs(data)
      } catch (err) {
        console.error('Failed to fetch blogs:', err)
      }
    }

    fetchBlogs()
  }, [])

  const grouped = Array.from({ length: 10 }, (_, i) => {
    const tier = 10 - i
    const tierBlogs = blogs.filter(b => Math.floor(b.rating) === tier)
    return { tier, blogs: tierBlogs }
  })

  return (
    <div style={styles.page}>
      <h2 style={styles.heading}>Game Tier List</h2>
      {grouped.map(({ tier, blogs }) => (
        blogs.length > 0 && (
          <div key={tier} style={styles.tierRow}>
            <div style={styles.tierLabel}>{tier}</div>
            <div style={styles.tierContent}>
              {blogs.map(blog => (
                <Card key={blog.id} blog={blog} />
              ))}
            </div>
          </div>
        )
      ))}
    </div>
  )
}

const Card = ({ blog }) => {
  const { coverUrl, source, loading } = useGameCovers(blog.title)

  return (
    <div style={styles.card}>
      {loading ? (
  <div style={styles.imgPlaceholder} />
) : (
  source === 'cover' ? (
    <img src={coverUrl} alt={blog.title} style={styles.image} />
  ) : (
    <div style={styles.imgPlaceholder}>
      <span style={styles.fallbackText}>No Cover</span>
    </div>
  )
)}
      <div style={styles.cardTitle}>{blog.title}</div>
    </div>
  )
}

const styles = {
  page: {
    padding: '2rem',
    background: '#0d1117',
    color: '#fff',
    minHeight: '100vh',
  },
  heading: {
    fontSize: '2rem',
    marginBottom: '1.5rem',
  },
  tierRow: {
    display: 'flex',
    alignItems: 'flex-start',
    marginBottom: '1.5rem',
  },
  tierLabel: {
    fontSize: '2rem',
    fontWeight: 'bold',
    marginRight: '1rem',
    width: '50px',
    textAlign: 'center',
    background: '#111',
    padding: '0.5rem',
    borderRadius: '8px',
  },
  tierContent: {
    display: 'flex',
    gap: '1rem',
    flexWrap: 'wrap',
  },
  card: {
    width: '120px',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    background: '#1e1e1e',
    borderRadius: '10px',
    padding: '0.5rem',
    boxShadow: '0 4px 8px rgba(0,0,0,0.3)',
  },
  image: {
    width: '100px',
    height: '140px',
    objectFit: 'cover',
    borderRadius: '6px',
  },
  imgPlaceholder: {
    width: '100px',
    height: '140px',
    backgroundColor: '#333',
    borderRadius: '6px',
  },
  cardTitle: {
    marginTop: '0.5rem',
    textAlign: 'center',
    fontSize: '0.9rem',
    color: '#fff',
  },
  fallbackText: {
  fontSize: '0.7rem',
  color: '#aaa',
  textAlign: 'center',
  paddingTop: '2.5rem'
},

}

export default TierList
