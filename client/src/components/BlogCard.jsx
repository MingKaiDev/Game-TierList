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
        <p style={styles.snippet}>{blog.summary}</p>
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
    background: '#1A1A1A',
    padding: '1rem',
    borderRadius: '2px',
    border: '1px solid #444',
    boxShadow: '0 2px 8px rgba(0,0,0,0.5)',
    gap: '1rem',
    color: '#EAEAEA',
    transition: 'border-color 0.3s, box-shadow 0.3s',
  },
  image: {
    width: '100px',
    height: '140px',
    objectFit: 'cover',
    borderRadius: '2px',
    border: '1px solid #444',
  },
  imgPlaceholder: {
    width: '100px',
    height: '140px',
    backgroundColor: '#2a2a2a',
    borderRadius: '2px',
    border: '1px solid #444',
  },
  info: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
  },
  title: {
    fontSize: '1.3rem',
    fontWeight: 'bold',
    fontFamily: "'Cinzel', serif",
    color: '#EAEAEA',
  },
  date: {
    fontSize: '0.8rem',
    color: '#999',
    fontStyle: 'italic',
  },
  snippet: {
    margin: '0.75rem 0',
    fontSize: '0.9rem',
    color: '#BDBDBD',
  },
  link: {
    color: '#B89B72',
    textDecoration: 'none',
    fontWeight: 'bold',
    fontFamily: "'Cinzel', serif",
    transition: 'color 0.3s, text-shadow 0.3s',
  },
}

export default BlogCard
