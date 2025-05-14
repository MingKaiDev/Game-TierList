import useGameCovers from '../hooks/useGameCovers'

const BlogCard = ({ blog }) => {
  const { coverUrl, source, loading } = useGameCovers(blog.title)

  return (
    <div style={styles.card}>
      {loading ? (
        <div style={styles.imgPlaceholder} />
      ) : (
        source === 'cover' ? (
          <img src={coverUrl} alt={blog.title} style={styles.image} />
        ) : (
          <div style={styles.imgPlaceholder} />
        )
      )}

      <div style={styles.info}>
        <h3 style={styles.title}>{blog.title}</h3>
        <p style={styles.date}>{new Date(blog.date).toLocaleDateString()}</p>
        <p style={styles.snippet}>This is a short summary of the blog.</p>
        <a href={`/blog/${encodeURIComponent(blog.title)}`} style={styles.link}>
          Read More
        </a>
      </div>
    </div>
  )
}

const styles = {
  card: {
    display: 'flex',
    background: '#1e1e1e',
    padding: '1rem',
    borderRadius: '10px',
    boxShadow: '0 4px 10px rgba(0,0,0,0.3)',
    gap: '1rem',
    color: '#fff',
  },
  image: {
    width: '100px',
    height: '140px',
    objectFit: 'cover',
    borderRadius: '6px',
  },
  imgPlaceholder: {
    width: '100px',
    height: '140px',
    backgroundColor: '#333',
    borderRadius: '6px',
  },
  info: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
  },
  title: {
    fontSize: '1.2rem',
    fontWeight: 'bold',
  },
  date: {
    fontSize: '0.85rem',
    color: '#aaa',
  },
  snippet: {
    margin: '0.5rem 0',
    fontSize: '0.95rem',
    color: '#ccc',
  },
  link: {
    color: '#00C800',
    textDecoration: 'none',
    fontWeight: 'bold',
  },
}

export default BlogCard
