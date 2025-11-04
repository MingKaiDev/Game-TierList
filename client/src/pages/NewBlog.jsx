import React, { useState } from 'react'
import { getAuth } from 'firebase/auth'
import '../styles/NewBlog.css'

const NewBlog = () => {
  const [title, setTitle] = useState('')
  const [rating, setRating] = useState('')
  const [summary, setSummary] = useState('')
  const [content, setContent] = useState('')
  const [gameplayTime, setGameplayTime] = useState('')
  const [nsfw, setNsfw] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    const newBlog = {
      title,
      rating: parseFloat(rating),
      summary,
      content,
      gameplayTime,
      NSFW: nsfw,
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
      setNsfw(false)
    } catch (err) {
      console.error('Failed to create blog:', err)
      
    }
  }

  return (
    <div className="new-blog-container">
      <h1 className="new-blog-heading">Create New Blog</h1>
      <form onSubmit={handleSubmit} className="new-blog-form">
        <input
          type="text"
          placeholder="Game Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
          className="new-blog-input"
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
          className="new-blog-input"
        />
        <input
          type="text"
          placeholder="Gameplay Duration (e.g. ~40 hours)"
          value={gameplayTime}
          onChange={(e) => setGameplayTime(e.target.value)}
          className="new-blog-input"
        />
        <input
          type="text"
          placeholder="Short Summary"
          value={summary}
          onChange={(e) => setSummary(e.target.value)}
          required
          className="new-blog-input"
        />
        <textarea
          placeholder="Full Blog Content"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          rows={10}
          required
          className="new-blog-textarea"
        />
        <div className="new-blog-checkbox-container">
          <input
            type="checkbox"
            id="nsfw"
            checked={nsfw}
            onChange={(e) => setNsfw(e.target.checked)}
            className="new-blog-checkbox"
          />
          <label htmlFor="nsfw" className="new-blog-checkbox-label">
            NSFW Content (requires login to view)
          </label>
        </div>
        <button type="submit" className="new-blog-button">
          Create Blog
        </button>
      </form>
    </div>
  )
}

export default NewBlog
