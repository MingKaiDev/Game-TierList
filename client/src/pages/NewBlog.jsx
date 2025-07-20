import { useState } from 'react'
import { getAuth } from 'firebase/auth'

const NewBlog = () => {
  const [title, setTitle] = useState('')
  const [rating, setRating] = useState('')
  const [summary, setSummary] = useState('')
  const [content, setContent] = useState('')
  const [gameplayTime, setGameplayTime] = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()
    const newBlog = {
      title,
      rating: parseFloat(rating),
      summary,
      content,
      gameplayTime,
    }

    try {
      const auth = getAuth()
      const token = await auth.currentUser.getIdToken()
      await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/blogs`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(newBlog),
      })

      alert('Blog created!')
      setTitle('')
      setRating('')
      setSummary('')
      setContent('')
      setGameplayTime('')
    } catch (err) {
      console.error('Failed to create blog:', err)
    }
  }

  return (
    <div style={styles.container}>
      <h2 style={styles.heading}>Create New Blog</h2>
      <form onSubmit={handleSubmit} style={styles.form}>
        <input
          type="text"
          placeholder="Game Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
          style={styles.input}
        />
        <input
          type="number"
          placeholder="Rating (e.g. 9.2)"
          value={rating}
          onChange={(e) => setRating(e.target.value)}
          required
          step="0.1"
          min="1"
          max="10"
          style={styles.input}
        />
        <input
          type="text"
          placeholder="Gameplay Duration (e.g. ~40 hours)"
          value={gameplayTime}
          onChange={(e) => setGameplayTime(e.target.value)}
          style={styles.input}
        />
        <input
          type="text"
          placeholder="Short Summary"
          value={summary}
          onChange={(e) => setSummary(e.target.value)}
          required
          style={styles.input}
        />
        <textarea
          placeholder="Full Blog Content"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          rows={10}
          required
          style={styles.textarea}
        />
        <button type="submit" style={styles.button}>Create Blog</button>
      </form>
    </div>
  )
}

const styles = {
  container: {
    padding: '2rem',
    background: '#0d1117',
    color: 'white',
    minHeight: '100vh',
  },
  heading: {
    fontSize: '1.8rem',
    marginBottom: '1.5rem',
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1rem',
    maxWidth: '500px',
  },
  input: {
    padding: '0.8rem',
    borderRadius: '8px',
    border: '1px solid #333',
    background: '#1e1e1e',
    color: 'white',
    fontSize: '1rem',
  },
  textarea: {
    padding: '0.8rem',
    borderRadius: '8px',
    border: '1px solid #333',
    background: '#1e1e1e',
    color: 'white',
    fontSize: '1rem',
    resize: 'vertical',
  },
  button: {
    padding: '0.8rem',
    borderRadius: '8px',
    border: 'none',
    background: '#00C800',
    color: 'white',
    fontWeight: 'bold',
    fontSize: '1rem',
    cursor: 'pointer',
  },
}

export default NewBlog
