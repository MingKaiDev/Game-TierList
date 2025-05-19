import React, { useEffect, useState, useMemo, useContext } from 'react'
import { useNavigate } from 'react-router-dom'
import BlogCard from '../components/BlogCard'
import { AuthCtx } from '../contexts/AuthContext'

const getYear = dateVal => {
  if (!dateVal) return null
  if (typeof dateVal === 'object' && '_seconds' in dateVal) {
    return new Date(dateVal._seconds * 1000).getFullYear()
  }
  const y = new Date(dateVal).getFullYear()
  return isNaN(y) ? null : y
}

const Blog = () => {
  const [blogs, setBlogs] = useState([])
  const [loading, setLoading] = useState(true)
  const [selectedYear, setSelectedYear] = useState('All')
  const [titleQuery, setTitleQuery] = useState('')
  const [minRating, setMinRating] = useState(0)
  const [maxRating, setMaxRating] = useState(10)
  const { user } = useContext(AuthCtx)
  const navigate = useNavigate()

  useEffect(() => {
    fetch(`${import.meta.env.VITE_BACKEND_URL}/api/blogs`)
      .then(r => r.json())
      .then(setBlogs)
      .catch(err => console.error('Failed to fetch blogs:', err))
      .finally(() => setLoading(false))
  }, [])

  const years = useMemo(() => {
    const set = new Set(
      blogs.map(b => getYear(b.date)).filter(Boolean)
    )
    return Array.from(set).sort((a, b) => b - a)
  }, [blogs])

  const filteredBlogs = useMemo(() => {
    return blogs.filter(b => {
      const year = getYear(b.date)?.toString()
      return (
        (selectedYear === 'All' || year === selectedYear) &&
        b.title.toLowerCase().includes(titleQuery.toLowerCase()) &&
        b.rating >= minRating &&
        b.rating <= maxRating
      )
    })
  }, [blogs, selectedYear, titleQuery, minRating, maxRating])

  const resetFilters = () => {
    setSelectedYear('All')
    setTitleQuery('')
    setMinRating(0)
    setMaxRating(10)
  }

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
            {filteredBlogs.map(b => (
              <BlogCard key={b.id} blog={b} />
            ))}
          </div>
        )}
      </div>

      <div style={styles.columnRight}>
        <h3 style={styles.panelTitle}>Filters</h3>
        <label style={styles.label}>Search Title</label>
        <input
          type="text"
          value={titleQuery}
          onChange={e => setTitleQuery(e.target.value)}
          placeholder="Search by title"
          style={styles.input}
        />

        <label style={styles.label}>Filter by Year</label>
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

        <label style={styles.label}>Rating Range</label>
        <div style={styles.rangeGroup}>
          <input
            type="number"
            min={0}
            max={10}
            value={minRating}
            onChange={e => setMinRating(Number(e.target.value))}
            style={styles.rangeInput}
          />
          <span style={{ margin: '0 0.5rem' }}>–</span>
          <input
            type="number"
            min={0}
            max={10}
            value={maxRating}
            onChange={e => setMaxRating(Number(e.target.value))}
            style={styles.rangeInput}
          />
        </div>

        <button onClick={resetFilters} style={styles.resetBtn}>Reset Filters</button>
      </div>
    </div>
  )
}

const styles = {
  layout: { display: 'flex', gap: '2rem', padding: '2rem', color: '#fff', background: '#121212', minHeight: '100vh' },
  columnLeft: { flex: 3 },
  columnRight: {
    flex: 1,
    background: '#1e1e1e',
    padding: '1.5rem',
    borderRadius: 8,
    height: 'fit-content',
    display: 'flex',
    flexDirection: 'column',
    gap: '1rem'
  },
  header: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' },
  heading: { margin: 0, fontSize: '1.6rem', fontWeight: 700 },
  addBtn: { padding: '0.5rem 1rem', borderRadius: 8, border: 'none', background: '#00C800', fontWeight: 600, cursor: 'pointer' },
  blogList: { display: 'flex', flexDirection: 'column', gap: '1.5rem' },
  panelTitle: { fontSize: '1.2rem', fontWeight: 700, marginBottom: '0.5rem' },
  label: { marginTop: '0.5rem', marginBottom: '0.25rem', fontWeight: 600 },
  input: { width: '100%', padding: '0.5rem', borderRadius: 6, fontSize: '1rem', background: '#222', color: '#fff', border: '1px solid #444' },
  select: { width: '100%', padding: '0.5rem', borderRadius: 6, fontSize: '1rem', background: '#222', color: '#fff', border: '1px solid #444' },
  rangeGroup: { display: 'flex', alignItems: 'center' },
  rangeInput: { width: '50%', padding: '0.5rem', borderRadius: 6, fontSize: '1rem', background: '#222', color: '#fff', border: '1px solid #444' },
  resetBtn: {
    marginTop: '1rem',
    padding: '0.6rem',
    border: 'none',
    background: '#444',
    color: '#fff',
    fontWeight: 'bold',
    borderRadius: 6,
    cursor: 'pointer'
  }
}

export default Blog
