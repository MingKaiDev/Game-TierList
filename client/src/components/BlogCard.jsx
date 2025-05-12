import { Link } from 'react-router-dom'
import useGameCovers from '../hooks/useGameCovers'

/* convert same way for the label */
const formatDate = val => {
  if (!val) return ''
  if (typeof val === 'object' && '_seconds' in val)
    return new Date(val._seconds * 1000).toLocaleDateString()
  return new Date(val).toLocaleDateString()
}

const BlogCard = ({ blog }) => {
  const { coverUrl, loading } = useGameCovers(blog.title)

  return (
    <div style={styles.card}>
      {loading ? (
        <div style={styles.imgPlaceholder} />
      ) : (
        <img src={coverUrl} alt={blog.title} style={styles.img} />
      )}

      <div style={styles.info}>
        <h3 style={styles.title}>{blog.title}</h3>
        <p style={styles.date}>{formatDate(blog.date)}</p>
        <p style={styles.snippet}>This is a short summary of the blog.</p>
        <Link to={`/blog/${encodeURIComponent(blog.title)}`} style={styles.link}>
          Read More
        </Link>
      </div>
    </div>
  )
}

const styles = {
  card: { display: 'flex', background: '#fff', color: '#000', border: '2px solid #ccc', borderRadius: 6, padding: '1rem', gap: '1.5rem', maxWidth: 700 },
  img: { width: 120, height: 160, objectFit: 'cover', borderRadius: 4 },
  imgPlaceholder: { width: 120, height: 160, background: '#444', borderRadius: 4 },
  info: { flex: 1, display: 'flex', flexDirection: 'column', gap: '0.25rem' },
  title: { margin: 0, fontSize: '1.2rem', fontWeight: 700 },
  date: { margin: 0, fontSize: '0.85rem', color: '#888' },
  snippet: { margin: '0.5rem 0', fontSize: '0.95rem', color: '#333' },
  link: { marginTop: 'auto', color: '#007bff', textDecoration: 'none' },
}

export default BlogCard
