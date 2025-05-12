import { useParams } from 'react-router-dom'
import { useEffect, useState } from 'react'

const BlogDetail = () => {
  const { title } = useParams()
  const [blog, setBlog] = useState(null)

  useEffect(() => {
    const fetchBlog = async () => {
      try {
        const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/blogs?title=${encodeURIComponent(title)}`)
        const data = await res.json()
        if (data.length > 0) setBlog(data[0])
      } catch (err) {
        console.error('Failed to fetch blog:', err)
      }
    }

    fetchBlog()
  }, [title])

  if (!blog) return <p style={{ color: 'white' }}>Loading blog...</p>

  return (
    <div style={styles.container}>
      <h1>{blog.title}</h1>
      <p style={styles.rating}>Rating: {blog.rating}/10</p>
      <p style={styles.content}>{blog.content}</p>
    </div>
  )
}

const styles = {
  container: { padding: '2rem', color: 'white', backgroundColor: '#121212', minHeight: '100vh' },
  rating: { color: '#00C800' },
  content: { marginTop: '1rem', fontSize: '1rem', lineHeight: '1.6' },
}

export default BlogDetail
