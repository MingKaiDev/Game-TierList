import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'

const initialBlogs = [
  {
    id: 1,
    title: 'The Witcher 3: Wild Hunt',
    rating: 9.5,
    image: 'https://upload.wikimedia.org/wikipedia/en/0/0c/Witcher_3_cover_art.jpg',
  },
  {
    id: 2,
    title: 'Elden Ring',
    rating: 9.8,
    image: 'https://upload.wikimedia.org/wikipedia/en/b/b9/Elden_Ring_Box_art.jpg',
  },
  {
    id: 3,
    title: 'Hades',
    rating: 9.0,
    image: 'https://upload.wikimedia.org/wikipedia/en/e/e0/Hades_cover_art.jpg',
  },
]

const Blog = () => {
  const [blogs, setBlogs] = useState(initialBlogs)

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h2>Game Blog Posts</h2>
        <button style={styles.addButton} onClick={() => useNavigate('/newblog')}>➕ Add New Blog</button>
      </div>
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
    </div>
  )
}

const styles = {
  container: {
    padding: '1rem 2rem',
  },
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
    color: 'white',
    gap: '1rem',
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
    justifyContent: 'space-between',
  },
  title: {
    margin: 0,
    fontSize: '1.2rem',
  },
  rating: {
    margin: 0,
    fontSize: '1rem',
    color: '#00C800',
  },
}

export default Blog