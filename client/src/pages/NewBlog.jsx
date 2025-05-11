import { useState } from 'react'

const NewBlog = () => {
  const [title, setTitle] = useState('')
  const [rating, setRating] = useState('')
  const [image, setImage] = useState('')
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setMessage('')

    const newBlog = { title, rating: parseFloat(rating), image }

    try {
      const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/blogs`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newBlog),
      })

      if (!response.ok) {
        throw new Error('Failed to submit blog')
      }

      setMessage('Blog created successfully!')
      setTitle('')
      setRating('')
      setImage('')
    } catch (error) {
      console.error('Submission error:', error)
      setMessage('Failed to create blog')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={styles.container}>
      <h2>Create New Blog</h2>
      <form onSubmit={handleSubmit} style={styles.form}>
        <input type="text" placeholder="Game Title" value={title} onChange={(e) => setTitle(e.target.value)} required />
        <input type="number" step="0.1" placeholder="Rating (e.g. 9.2)" value={rating} onChange={(e) => setRating(e.target.value)} required />
        <input type="url" placeholder="Image URL" value={image} onChange={(e) => setImage(e.target.value)} required />
        <button type="submit" disabled={loading}>
          {loading ? 'Submitting...' : 'Create Blog'}
        </button>
      </form>
      {message && <p>{message}</p>}
    </div>
  )
}

const styles = {
  container: { padding: '2rem', color: 'white' },
  form: { display: 'flex', flexDirection: 'column', gap: '1rem', width: '300px' },
}

export default NewBlog
