import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'

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
            <div key={blog.id} style={styles.card}>
              <img src={blog.image} alt={blog.title} style={styles.image} />
              <div style={styles.info}>
                <h3 style={styles.title}>{blog.title}</h3>
                <p style={styles.rating}>Rating: {blog.rating}/10</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
