import { useParams } from 'react-router-dom'
import { useEffect, useState } from 'react'

const BlogDetail = () => {
  const { title } = useParams()
  const [blog, setBlog] = useState(null)
  const [igdbInfo, setIgdbInfo] = useState(null)

  useEffect(() => {
    const fetchBlog = async () => {
      const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/blogs?title=${encodeURIComponent(title)}`)
      const data = await res.json()
      if (data.length > 0) setBlog(data[0])
    }

    const fetchDetails = async () => {
      const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/details?title=${encodeURIComponent(title)}`)
      const data = await res.json()
      setIgdbInfo(data)
    }

    fetchBlog()
    fetchDetails()
  }, [title])

  if (!blog) return <p style={{ color: 'white' }}>Loading blog...</p>

  return (
    <div style={styles.container}>
      {igdbInfo?.artworkUrl && (
        <img src={igdbInfo.artworkUrl} alt="Banner" style={styles.banner} />
      )}
      <h1>{blog.title}</h1>
      <p style={styles.rating}>Rating: {blog.rating}/10</p>
      <p style={styles.content}>{blog.content}</p>

      {igdbInfo && (
        <div style={styles.meta}>
          {igdbInfo.genres.length > 0 && (
            <p><strong>Genres:</strong> {igdbInfo.genres.join(', ')}</p>
          )}
          {igdbInfo.developers.length > 0 && (
            <p><strong>Developer(s):</strong> {igdbInfo.developers.join(', ')}</p>
          )}
          {igdbInfo.publishers.length > 0 && (
            <p><strong>Publisher(s):</strong> {igdbInfo.publishers.join(', ')}</p>
          )}
        </div>
      )}
    </div>
  )
}

const styles = {
  container: { padding: '2rem', color: 'white', backgroundColor: '#121212', minHeight: '100vh' },
  banner: { width: '100%', borderRadius: '8px', marginBottom: '2rem', maxHeight: '400px', objectFit: 'cover' },
  rating: { color: '#00C800', fontSize: '1.2rem' },
  content: { marginTop: '1rem', fontSize: '1rem', lineHeight: '1.6' },
  meta: { marginTop: '2rem', color: '#ccc', fontSize: '0.95rem', lineHeight: '1.5' },
}

export default BlogDetail
