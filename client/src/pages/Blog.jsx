import React, { useEffect, useState, useMemo, useContext, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import BlogCard from '../components/BlogCard'
import { AuthCtx } from '../contexts/AuthContext'
import { getAuth } from 'firebase/auth'
import { FaFeatherAlt, FaArrowLeft, FaArrowRight } from 'react-icons/fa'

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
  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState(4) //Use this to set default
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768)
  const { user } = useContext(AuthCtx)
  const navigate = useNavigate()

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 768)
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  useEffect(() => {
    const fetchBlogs = async () => {
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
        setBlogs(data)
      } catch (err) {
        console.error('Failed to fetch blogs:', err)
      } finally {
        setLoading(false)
      }
    }

    fetchBlogs()
  }, [user])

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
        b.rating >= minRating
      )
    })
    return filtered.sort((a, b) => new Date(b.date) - new Date(a.date))
  }, [blogs, selectedYear, titleQuery, minRating])

  const paginatedBlogs = useMemo(() => {
    const startIndex = (page - 1) * pageSize
    return filteredBlogs.slice(startIndex, startIndex + pageSize)
  }, [filteredBlogs, page, pageSize])

  const totalPages = Math.ceil(filteredBlogs.length / pageSize)

  const styles = {
    container: {
      padding: '2rem',
      fontFamily: "'Cinzel', serif",
      color: '#EAEAEA',
    },
    header: {
      textAlign: 'center',
      marginBottom: '2rem',
    },
    title: {
      fontSize: '3rem',
      fontWeight: 'bold',
      textTransform: 'uppercase',
      letterSpacing: '0.2rem',
      color: '#B89B72',
      textShadow: '2px 2px 4px rgba(0,0,0,0.5)',
    },
    controlsContainer: {
      display: 'flex',
      flexWrap: 'wrap',
      justifyContent: 'center',
      gap: '2rem',
      marginBottom: '3rem',
      padding: '2rem',
      backgroundColor: 'rgba(16, 16, 16, 0.8)',
      border: '1px solid #B89B72',
      borderRadius: '8px',
      boxShadow: '0 0 15px rgba(184, 155, 114, 0.2)',
    },
    controlGroup: {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      gap: '0.5rem',
    },
    label: {
      fontSize: '1rem',
      color: '#B89B72',
      textTransform: 'uppercase',
    },
    input: {
      backgroundColor: '#101010',
      border: '1px solid #B89B72',
      color: '#EAEAEA',
      padding: '0.5rem',
      borderRadius: '4px',
      fontFamily: "'Cinzel', serif",
      textAlign: 'center',
    },
    select: {
      backgroundColor: '#101010',
      border: '1px solid #B89B72',
      color: '#EAEAEA',
      padding: '0.5rem',
      borderRadius: '4px',
      fontFamily: "'Cinzel', serif",
    },
    sliderContainer: {
      display: 'flex',
      alignItems: 'center',
      gap: '1rem',
    },
    blogList: {
      display: 'grid',
      gridTemplateColumns: isMobile ? '1fr' : 'repeat(4, 1fr)',
      gap: '2rem',
      marginBottom: '2rem',
    },
    paginationContainer: {
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      gap: '1rem',
      marginTop: '2rem',
    },
    paginationButton: {
      background: 'transparent',
      border: '1px solid #B89B72',
      color: '#B89B72',
      padding: '0.5rem 1rem',
      cursor: 'pointer',
      fontFamily: "'Cinzel', serif",
      textTransform: 'uppercase',
      transition: 'all 0.3s ease',
    },
    paginationButtonDisabled: {
      border: '1px solid #444',
      color: '#444',
      cursor: 'not-allowed',
    },
    pageInfo: {
      color: '#EAEAEA',
    },
    newBlogButton: {
      position: 'fixed',
      bottom: '2rem',
      right: '2rem',
      backgroundColor: '#B89B72',
      color: '#101010',
      padding: '1rem',
      borderRadius: '50%',
      border: 'none',
      cursor: 'pointer',
      fontSize: '1.5rem',
      boxShadow: '0 0 15px rgba(184, 155, 114, 0.5)',
      zIndex: 1000,
    }
  }

  if (loading) {
    return <div style={styles.container}>Loading chronicles...</div>
  }

  return (
    <div style={styles.container}>
      <header style={styles.header}>
        <h1 style={styles.title}>The Archives</h1>
      </header>

      {user && (
        <button style={styles.newBlogButton} onClick={() => navigate('/newblog')}>
          <FaFeatherAlt />
        </button>
      )}

      <div style={styles.controlsContainer}>
        <div style={styles.controlGroup}>
          <label htmlFor="title-search" style={styles.label}>Filter by Title</label>
          <input
            id="title-search"
            type="text"
            placeholder="Search title..."
            value={titleQuery}
            onChange={e => setTitleQuery(e.target.value)}
            style={styles.input}
          />
        </div>
        <div style={styles.controlGroup}>
          <label htmlFor="year-select" style={styles.label}>Filter by Year</label>
          <select id="year-select" value={selectedYear} onChange={e => setSelectedYear(e.target.value)} style={styles.select}>
            <option value="All">All Years</option>
            {years.map(y => <option key={y} value={y}>{y}</option>)}
          </select>
        </div>
        <div style={styles.controlGroup}>
          <label style={styles.label}>Minimum Rating</label>
          <div style={styles.sliderContainer}>
            <span style={{color: '#B89B72'}}>0</span>
            <input
              type="range"
              min="0"
              max="10"
              step="1"
              value={minRating}
              onChange={e => setMinRating(e.target.value)}
            />
            <span style={{color: '#B89B72'}}>{minRating}</span>
          </div>
        </div>
      </div>

      <div style={styles.blogList}>
        {paginatedBlogs.map(blog => (
          <LazyMount key={blog.id}>
            <BlogCard blog={blog} />
          </LazyMount>
        ))}
      </div>

      {totalPages > 1 && (
        <div style={styles.paginationContainer}>
          <button
            onClick={() => setPage(p => Math.max(1, p - 1))}
            disabled={page === 1}
            style={{...styles.paginationButton, ...(page === 1 && styles.paginationButtonDisabled)}}
          >
            <FaArrowLeft />
          </button>
          <span style={styles.pageInfo}>Page {page} of {totalPages}</span>
          <button
            onClick={() => setPage(p => Math.min(totalPages, p + 1))}
            disabled={page === totalPages}
            style={{...styles.paginationButton, ...(page === totalPages && styles.paginationButtonDisabled)}}
          >
            <FaArrowRight />
          </button>
        </div>
      )}
    </div>
  )
}

export default Blog
