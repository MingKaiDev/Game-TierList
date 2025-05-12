import useGameCovers from '../hooks/useGameCovers'

const BlogCard = ({ blog }) => {
  const { coverUrl, loading } = useGameCovers(blog.title)

  return (
    <div style={styles.card}>
      {loading ? (
        <div style={{ width: '100px', height: '140px', backgroundColor: '#333' }} />
      ) : (
        <img src={coverUrl} alt={blog.title} style={styles.image} />
      )}
      <div style={styles.info}>
        <h3 style={styles.title}>{blog.title}</h3>
        <p style={styles.rating}>Rating: {blog.rating}/10</p>
      </div>
    </div>
  )
}

const styles = {
  // same style definitions as before
}

export default BlogCard
