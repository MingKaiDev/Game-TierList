import React, { useEffect, useState, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import BlogCard from '../components/BlogCard'
import { AuthCtx } from '../contexts/AuthContext'

/* ───────── helper to normalise Firestore Timestamp OR ISO string ───────── */
const getYear = dateVal => {
  if (!dateVal) return null
  // Firestore Timestamp from Admin SDK comes as { _seconds, _nanoseconds }
  if (typeof dateVal === 'object' && '_seconds' in dateVal) {
    return new Date(dateVal._seconds * 1000).getFullYear()
  }
  // Otherwise assume ISO string
  const y = new Date(dateVal).getFullYear()
  return isNaN(y) ? null : y
}

const Blog = () => {
  const [blogs, setBlogs] = useState([])
  const [loading, setLoading] = useState(true)
  const [selectedYear, setSelectedYear] = useState('All')
  const { user } = useContext(AuthCtx)
  const navigate = useNavigate()

  /* ─── fetch once ─── */
  useEffect(() => {
    fetch(`${import.meta.env.VITE_BACKEND_URL}/api/blogs`)
      .then(r => r.json())
      .then(setBlogs)
      .catch(err => console.error('Failed to fetch blogs:', err))
      .finally(() => setLoading(false))
  }, [])

  /* ─── build years list ─── */
  const years = useMemo(() => {
    const set = new Set(
      blogs
        .map(b => getYear(b.date))
        .filter(Boolean)                // drop null / NaN
    )
    return Array.from(set).sort((a, b) => b - a)
  }, [blogs])

  /* ─── filter by year ─── */
  const visibleBlogs = useMemo(() => {
    if (selectedYear === 'All') return blogs
    return blogs.filter(b => getYear(b.date)?.toString() === selectedYear)
  }, [blogs, selectedYear])

  /* ─── render ─── */
  return (
    <div style={styles.layout}>
      <div style={styles.columnLeft}>
        <div style={styles.header}>
          <h2 style={styles.heading}>Video Game Reviews</h2>
          {user && (
            <button style={styles.addBtn} onClick={() => navigate('/newblog')}>
              ➕ Add New Blog
            </button>
          )}

        </div>

        {loading ? (
          <p>Loading blogs…</p>
        ) : (
          <div style={styles.blogList}>
            {visibleBlogs.map(b => (
              <BlogCard key={b.id} blog={b} />
            ))}
          </div>
        )}
      </div>

      <div style={styles.columnRight}>
        <h3>Filter by Year</h3>
        <select
          value={selectedYear}
          onChange={e => setSelectedYear(e.target.value)}
          style={styles.select}
        >
          <option value="All">All</option>
          {years.map(y => (
            <option key={y} value={y}>{y}</option>
          ))}
        </select>
      </div>
    </div>
  )
}

/* styles */
const styles = {
  layout: { display: 'flex', gap: '2rem', padding: '2rem', color: '#fff', background: '#121212', minHeight: '100vh' },
  columnLeft: { flex: 3 },
  columnRight: { flex: 1, background: '#1e1e1e', padding: '1.5rem', borderRadius: 8, height: 'fit-content' },
  header: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' },
  heading: { margin: 0, fontSize: '1.6rem', fontWeight: 700 },
  addBtn: { padding: '0.5rem 1rem', borderRadius: 8, border: 'none', background: '#00C800', fontWeight: 600, cursor: 'pointer' },
  blogList: { display: 'flex', flexDirection: 'column', gap: '1.5rem' },
  select: { width: '100%', padding: '0.5rem', borderRadius: 6, fontSize: '1rem' },
}

export default Blog
