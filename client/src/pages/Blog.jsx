import React, { useEffect, useState, useMemo, useContext, useRef } from 'react'
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

const useOnScreen = (rootMargin = '300px') => {
  const ref = useRef(null)
  const [isIntersecting, setIntersecting] = useState(false)
  useEffect(() => {
    if (!ref.current) return
    const obs = new IntersectionObserver(([e]) => setIntersecting(e.isIntersecting), { root: null, rootMargin, threshold: 0 })
    obs.observe(ref.current)
    return () => obs.disconnect()
  }, [rootMargin])
  return [ref, isIntersecting]
}

const LazyMount = ({ once = true, placeholderHeight = 220, children }) => {
  const [ref, visible] = useOnScreen()
  const [hasShown, setHasShown] = useState(false)
  useEffect(() => {
    if (visible) setHasShown(true)
  }, [visible])
  const shouldRender = once ? hasShown || visible : visible
  return (
    <div ref={ref} style={{ minHeight: placeholderHeight }}>
      {shouldRender ? children : <div style={{ height: placeholderHeight, borderRadius: 8, background: '#1a1a1a', border: '1px solid #2a2a2a' }} />}
    </div>
  )
}

const Blog = () => {
  const [blogs, setBlogs] = useState([])
  const [loading, setLoading] = useState(true)
  const [selectedYear, setSelectedYear] = useState('All')
  const [titleQuery, setTitleQuery] = useState('')
  const [minRating, setMinRating] = useState(0)
  const [maxRating, setMaxRating] = useState(10)
  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState(4) //Use this to set default
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
    const set = new Set(blogs.map(b => getYear(b.date)).filter(Boolean))
    return Array.from(set).sort((a, b) => b - a)
  }, [blogs])

  const filteredBlogs = useMemo(() => {
    const filtered =  blogs.filter(b => {
      const year = getYear(b.date)?.toString()
      return (
        (selectedYear === 'All' || year === selectedYear) &&
        b.title.toLowerCase().includes(titleQuery.toLowerCase()) &&
        b.rating >= minRating &&
        b.rating <= maxRating
      )
    })

    // Sort by date descending (latest first)
    return filtered.sort((a, b) => {
    const da = new Date(a.date._seconds ? a.date._seconds * 1000 : a.date)
    const db = new Date(b.date._seconds ? b.date._seconds * 1000 : b.date)
    return db - da
    })
  }, [blogs, selectedYear, titleQuery, minRating, maxRating])

  useEffect(() => { setPage(1) }, [selectedYear, titleQuery, minRating, maxRating, pageSize])

  const totalPages = Math.max(1, Math.ceil(filteredBlogs.length / pageSize))
  useEffect(() => { setPage(p => Math.min(p, totalPages)) }, [totalPages])

  const pagedBlogs = useMemo(() => {
    const start = (page - 1) * pageSize
    return filteredBlogs.slice(start, start + pageSize)
  }, [filteredBlogs, page, pageSize])

  const resetFilters = () => {
    setSelectedYear('All'); setTitleQuery(''); setMinRating(0); setMaxRating(10)
  }

  const startIdx = filteredBlogs.length === 0 ? 0 : (page - 1) * pageSize + 1
  const endIdx = Math.min(page * pageSize, filteredBlogs.length)

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
          <>
            <div style={styles.blogList}>
              {pagedBlogs.map(b => (
                <LazyMount key={b.id} placeholderHeight={240}>
                  <BlogCard blog={b} />
                </LazyMount>
              ))}
              {filteredBlogs.length === 0 && <p>No results.</p>}
            </div>

            <div style={styles.pagination}>
              <div style={styles.pageInfo}>
                {filteredBlogs.length > 0
                  ? `Showing ${startIdx}–${endIdx} of ${filteredBlogs.length}`
                  : 'Showing 0 of 0'}
              </div>

              <div style={styles.pagerControls}>
                <button style={styles.pagerBtn} onClick={() => setPage(1)} disabled={page === 1}>« First</button>
                <button style={styles.pagerBtn} onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1}>‹ Prev</button>
                <span style={styles.pageNumber}>Page {page} / {totalPages}</span>
                <button style={styles.pagerBtn} onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page === totalPages}>Next ›</button>
                <button style={styles.pagerBtn} onClick={() => setPage(totalPages)} disabled={page === totalPages}>Last »</button>
              </div>

              <div style={styles.pageSizeWrap}>
                <label style={styles.labelSmall}>Per page</label>
                <select value={pageSize} onChange={e => setPageSize(Number(e.target.value))} style={styles.pageSizeSelect}>
                  {[4, 8, 16, 32].map(n => <option key={n} value={n}>{n}</option>)}
                </select>
              </div>
            </div>
          </>
        )}
      </div>

      <div style={styles.columnRight}>
        <h3 style={styles.panelTitle}>Filters</h3>
        <label style={styles.label}>Search Title</label>
        <input type="text" value={titleQuery} onChange={e => setTitleQuery(e.target.value)} placeholder="Search by title" style={styles.input} />
        <label style={styles.label}>Filter by Year</label>
        <select value={selectedYear} onChange={e => setSelectedYear(e.target.value)} style={styles.select}>
          <option value="All">All</option>
          {years.map(y => <option key={y} value={y}>{y}</option>)}
        </select>
        <label style={styles.label}>Rating Range</label>
        <div style={styles.rangeGroup}>
          <input type="number" min={0} max={10} value={minRating} onChange={e => setMinRating(Number(e.target.value))} style={styles.rangeInput} />
          <span style={{ margin: '0 0.5rem' }}>–</span>
          <input type="number" min={0} max={10} value={maxRating} onChange={e => setMaxRating(Number(e.target.value))} style={styles.rangeInput} />
        </div>
        <button onClick={resetFilters} style={styles.resetBtn}>Reset Filters</button>
      </div>
    </div>
  )
}

const styles = {
  layout: { display: 'flex', gap: '2rem', padding: '2rem', color: '#fff', background: '#121212', minHeight: '100vh' },
  columnLeft: { flex: 3 },
  columnRight: { flex: 1, background: '#1e1e1e', padding: '1.5rem', borderRadius: 8, height: 'fit-content', display: 'flex', flexDirection: 'column', gap: '1rem' },
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
  resetBtn: { marginTop: '1rem', padding: '0.6rem', border: 'none', background: '#444', color: '#fff', fontWeight: 'bold', borderRadius: 6, cursor: 'pointer' },
  pagination: { marginTop: '1.25rem', paddingTop: '1rem', borderTop: '1px solid #2a2a2a', display: 'grid', gridTemplateColumns: '1fr auto auto', gap: '0.75rem', alignItems: 'center' },
  pageInfo: { opacity: 0.85, fontSize: '0.95rem' },
  pagerControls: { display: 'flex', gap: '0.5rem', alignItems: 'center' },
  pagerBtn: { padding: '0.45rem 0.7rem', borderRadius: 6, border: '1px solid #333', background: '#1d1d1d', color: '#fff', cursor: 'pointer' },
  pageNumber: { minWidth: 110, textAlign: 'center', opacity: 0.9 },
  pageSizeWrap: { display: 'flex', alignItems: 'center', gap: '0.5rem', justifySelf: 'end' },
  labelSmall: { fontSize: '0.9rem', opacity: 0.9 },
  pageSizeSelect: { padding: '0.4rem 0.5rem', borderRadius: 6, background: '#222', color: '#fff', border: '1px solid #444' }
}

export default Blog
