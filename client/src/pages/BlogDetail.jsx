import { useParams } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { DiscussionEmbed } from 'disqus-react'

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
  const disqusConfig = {
    url: window.location.href,
    identifier: blog.title, // can be blog.id if unique
    title: blog.title,
  }
  return (
    <div style={styles.container}>
      {igdbInfo?.artworkUrl && (
        <img src={igdbInfo.artworkUrl} alt="Banner" style={styles.banner} />
      )}
      <h1>{blog.title}</h1>
      <p style={styles.rating}>Rating: {blog.rating}/10</p>
      <p style={styles.content}>{blog.content}</p>

      {igdbInfo && igdbInfo.genres.length > 0 && (
        <div style={styles.section}>
          <strong style={styles.label}>Genres:</strong>
          <div style={styles.badgeGroup}>
            {igdbInfo.genres.map((g, i) => (
              <span key={i} style={styles.badge}>{g}</span>
            ))}
          </div>
        </div>
      )}
      {igdbInfo && igdbInfo.developers.length > 0 && (
        <div style={styles.section}>
          <strong style={styles.label}>Developers:</strong>
          <div style={styles.badgeGroup}>
            {igdbInfo.developers.map((d, i) => (
              <span key={i} style={styles.badge}>{d}</span>
            ))}
          </div>
        </div>
      )}
      {igdbInfo && igdbInfo.publishers.length > 0 && (
        <div style={styles.section}>
          <strong style={styles.label}>Publishers:</strong>
          <div style={styles.badgeGroup}>
            {igdbInfo.publishers.map((p, i) => (
              <span key={i} style={styles.badge}>{p}</span>
            ))}
          </div>
        </div>
      )}
      <div style={{ marginTop: '3rem' }}>
        <DiscussionEmbed shortname="your-disqus-shortname" config={disqusConfig} />
      </div>

    </div>
  )
}

const styles = {
  container: { padding: '2rem', color: 'white', backgroundColor: '#121212', minHeight: '100vh' },
  banner: { width: '100%', borderRadius: '8px', marginBottom: '2rem', maxHeight: '400px', objectFit: 'cover' },
  rating: { color: '#00C800', fontSize: '1.2rem' },
  content: { marginTop: '1rem', fontSize: '1rem', lineHeight: '1.6' },
  meta: { marginTop: '2rem', color: '#ccc', fontSize: '0.95rem', lineHeight: '1.5' },
  section: {
    marginTop: '1.5rem',
  },
  label: {
    color: '#ccc',
    marginRight: '0.5rem',
  },
  badgeGroup: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '0.5rem',
    marginTop: '0.3rem',
  },
  badge: {
    backgroundColor: '#222',
    border: '1px solid #444',
    color: '#0f0',
    padding: '0.3rem 0.6rem',
    borderRadius: '20px',
    fontSize: '0.85rem',
  }

}

export default BlogDetail
