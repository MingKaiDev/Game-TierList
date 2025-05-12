import React, { useEffect, useState, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import BlogCard from '../components/BlogCard'

const Blog = () => {
  const [blogs, setBlogs] = useState([])
  const [loading, setLoading] = useState(true)
  const [selectedYear, setSelectedYear] = useState('All')
  const navigate = useNavigate()

  /* ─────────────────────────  FETCH  ───────────────────────── */
  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/blogs`)
        const data = await res.json()
        setBlogs(data)                 // <- data should include `date`
      } catch (err) {
        console.error('Failed to fetch blogs:', err)
      } finally {
        setLoading(false)
      }
    }
    fetchBlogs()
  }, [])

  /* ────────────────  BUILD UNIQUE YEARS FOR FILTER  ─────────────── */
  const years = useMemo(() => {
    const set = new Set(blogs.map(b => new Date(b.date).getFullYear()))
    return Array.from(set).sort((a, b) => b - a)          // newest first
  }, [blogs])

  /* ────────────────  APPLY YEAR FILTER  ─────────────── */
  const filteredBlogs = useMemo(() => {
    if (selectedYear === 'All') return blogs
    return blogs.filter(
      b => new Date(b.date).getFullYear().toString() === selectedYear
    )
  }, [blogs, selectedYear])

  /* ─────────────────────────  RENDER  ───────────────────────── */
  return (
    <div style={styles.layout}>
      {/* ───────── Left column: Blog list ───────── */}
      <div style={styles.blogColumn}>
        <div style={styles.header}>
          <h2 style={styles.heading}>Game Blog Posts</h2>
          <button style={styles.addButton} onClick={() => navigate('/newblog')}>
            ➕ Add New Blog
          </button>
        </div>

        {loading ? (
          <p>Loading blogs...</p>
        ) : (
          <div style={styles.blogList}>
            {filteredBlogs.map(blog => (
              <BlogCard key={blog.id} blog={blog} />
            ))}
          </div>
        )}
      </div>

      {/* ───────── Right column: Year filter ───────── */}
      <div style={styles.filterColumn}>
        <h3 style={styles.filterHeading}>Filter by Year</h3>
        <select
          value={selectedYear}
          onChange={e => setSelectedYear(e.target.value)}
          style={styles.select}
        >
          <option value="All">All</option>
          {years.map(y => (
            <option key={y} value={y}>
              {y}
            </option>
          ))}
        </select>
      </div>
    </div>
  )
}

/* ─────────────────────────  STYLES  ───────────────────────── */
const styles = {
  layout: {
    display: 'flex',
    gap: '2rem',
    padding: '2rem',
    minHeight: '100vh',
    backgroundColor: '#121212',
    color: 'white',
  },

  /* left side */
  blogColumn: { flex: 3 },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '1.5rem',
  },
  heading: { margin: 0, fontSize: '1.6rem', fontWeight: 'bold' },
  addButton: {
    padding: '0.5rem 1rem',
    fontSize: '1rem',
    fontWeight: 600,
    borderRadius: '8px',
    backgroundColor: '#00C800',
    color: '#fff',
    border: 'none',
    cursor: 'pointer',
  },
  blogList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1.5rem',
  },

  /* right side */
  filterColumn: {
    flex: 1,
    backgroundColor: '#1e1e1e',
    padding: '1.5rem',
    borderRadius: '8px',
    height: 'fit-content',
  },
  filterHeading: { marginTop: 0 },
  select: {
    width: '100%',
    padding: '0.5rem',
    borderRadius: '6px',
    fontSize: '1rem',
  },
}

export default Blog
