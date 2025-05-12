import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import BlogCard from '../components/BlogCard'

const Blog = () => {
  const [blogs, setBlogs] = useState([])
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/blogs`)
        const data = await res.json()
        setBlogs(data)
      } catch (err) {
        console.error('Failed to fetch blogs:', err)
      } finally {
        setLoading(false)
      }
    }

    fetchBlogs()
  }, [])

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h2>Game Blog Posts</h2>
        <button style={styles.addButton} onClick={() => navigate('/newblog')}>➕ Add New Blog</button>
      </div>

      {loading ? (
        <p>Loading blogs...</p>
      ) : (
        <div style={styles.blogList}>
          {blogs.map((blog) => (
            <BlogCard key={blog.id} blog={blog} />
          ))}
        </div>
      )}
    </div>
  )
}

const styles = {
  container: { padding: '1rem 2rem', color: 'white' },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '1rem',
  },
  addButton: {
    padding: '0.5rem 1rem',
    fontSize: '1rem',
    fontWeight: '600',
    borderRadius: '8px',
    backgroundColor: '#00C800',
    color: 'white',
    border: 'none',
    cursor: 'pointer',
  },
  blogList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1rem',
    maxHeight: '70vh',
    overflowY: 'auto',
  },
  card: {
    display: 'flex',
    backgroundColor: '#1e1e1e',
    padding: '1rem',
    borderRadius: '8px',
    boxShadow: '0 2px 8px rgba(0,0,0,0.2)',
    gap: '1rem',
    alignItems: 'center',
    width: '100%', // or set a maxWidth if needed
  },
  image: {
    width: '100px',
    height: '140px',
    objectFit: 'cover',
    borderRadius: '6px',
  },
  info: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    flex: 1,
    overflow: 'hidden',
    wordWrap: 'break-word',
    color: 'white',
  },
  title: {
    margin: 0,
    fontSize: '1.2rem',
    fontWeight: 'bold',
    color: 'white',
    textDecoration: 'none',
  },

  rating: {
    margin: 0,
    fontSize: '1rem',
    color: '#00C800',
  }
}

export default Blog