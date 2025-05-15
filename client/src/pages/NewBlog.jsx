import { useState } from 'react'
import { getAuth } from 'firebase/auth'

const NewBlog = () => {
  const [title, setTitle] = useState('')
  const [rating, setRating] = useState('')
  const [content, setContent] = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()

    const newBlog = {
      title,
      rating: parseFloat(rating),
      content,
    }

    try {
      const auth = getAuth()
      const token = await auth.currentUser.getIdToken()

      const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/blogs`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,  // <- IMPORTANT
        },
        body: JSON.stringify(newBlog),
      })

      if (!res.ok) {
        const error = await res.json()
        throw new Error(error.message || 'Failed to create blog')
      }

      alert('Blog created!')
      setTitle('')
      setRating('')
      setContent('')
    } catch (err) {
      console.error('Failed to create blog:', err)
      alert('Submission failed.')
    }
  }


  return (
    <div style={styles.container}>
      <h2>Create New Blog</h2>
      <form onSubmit={handleSubmit} style={styles.form}>
        <input type="text" placeholder="Game Title" value={title} onChange={(e) => setTitle(e.target.value)} required />
        <input type="number" placeholder="Rating (e.g. 9.2)" value={rating} onChange={(e) => setRating(e.target.value)} required />
        <textarea placeholder="Full Blog Content" value={content} onChange={(e) => setContent(e.target.value)} rows={8} required />
        <button type="submit">Create Blog</button>
      </form>
    </div>
  )
}

const styles = {
  container: { padding: '2rem', color: 'white' },
  form: { display: 'flex', flexDirection: 'column', gap: '1rem', width: '400px' },
}

export default NewBlog
