import { Link } from 'react-router-dom'
import useGameCovers from '../hooks/useGameCovers'

const BlogCard = ({ blog }) => {
  const { coverUrl, loading } = useGameCovers(blog.title)

  return (
    <div style={styles.card}>
      {loading ? (
        <div style={styles.imagePlaceholder}>Loading...</div>
      ) : (
        <img src={coverUrl} alt={blog.title} style={styles.image} />
      )}

      <div style={styles.info}>
        <h3 style={styles.title}>{blog.title}</h3>
        <p style={styles.desc}>This is a short summary of the blog. You’ll replace this with real content later.</p>
        <Link to={`/blog/${encodeURIComponent(blog.title)}`} style={styles.link}>Read More</Link>
      </div>
    </div>
  )
}

const styles = {
  card: {
    display: 'flex',
    border: '2px solid #ccc',
    borderRadius: '6px',
    padding: '1rem',
    backgroundColor: 'white',
    color: 'black',
    maxWidth: '700px',
    width: '100%',
    gap: '1.5rem',
  },
  image: {
    width: '120px',
    height: '160px',
    objectFit: 'cover',
    borderRadius: '4px',
  },
  imagePlaceholder: {
    width: '120px',
    height: '160px',
    backgroundColor: '#eee',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '0.9rem',
    color: '#666',
  },
  info: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
    flex: 1,
  },
  title: {
    margin: 0,
    fontSize: '1.2rem',
    fontWeight: 'bold',
  },
  desc: {
    margin: '0.5rem 0',
    fontSize: '0.95rem',
    color: '#333',
  },
  link: {
    marginTop: 'auto',
    alignSelf: 'flex-start',
    fontSize: '0.95rem',
    color: '#007bff',
    textDecoration: 'none',
  },
}

export default BlogCard
