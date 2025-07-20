import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { getAuth } from 'firebase/auth'

const EditBlog = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const [blog, setBlog] = useState(null)
  const [loading, setLoading] = useState(true)

  const [content, setContent] = useState('')
  const [rating, setRating] = useState('')
  const [gameplayTime, setGameplayTime] = useState('')

  useEffect(() => {
    const fetchBlog = async () => {
      const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/blogs`)
      const data = await res.json()
      const blog = data.find(b => b.id === id)
      if (!blog) return navigate('/')

      const user = getAuth().currentUser
      if (user?.uid !== blog.authorUid) {
        alert('You are not authorized to edit this blog.')
        return navigate('/')
      }

      setBlog(blog)
      setContent(blog.content || '')
      setRating(blog.rating || '')
      setGameplayTime(blog.gameplayTime || '')
      setLoading(false)
    }

    fetchBlog()
  }, [id, navigate])

  const handleSubmit = async () => {
    try {
      const token = await getAuth().currentUser.getIdToken()
      const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/blogs/${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ content, rating: parseFloat(rating), gameplayTime }),
      })

      if (!res.ok) {
        const err = await res.json()
        throw new Error(err.error || 'Failed to update')
      }

      alert('Blog updated!')
      navigate(`/blog/${encodeURIComponent(blog.title)}`)
    } catch (err) {
      console.error(err)
      alert('Update failed.')
    }
  }

  if (loading) return <p style={{ color: 'white' }}>Loading...</p>

  return (
    <div style={{ padding: '2rem', backgroundColor: '#0d1117', minHeight: '100vh', color: 'white' }}>
      <h2>Edit Blog: {blog.title}</h2>

      <textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        rows={10}
        style={{ width: '100%', padding: '1rem', fontSize: '1rem', marginBottom: '1rem' }}
      />

      <input
        type="number"
        value={rating}
        onChange={(e) => setRating(e.target.value)}
        step="0.1"
        min="1"
        max="10"
        placeholder="Rating"
        style={{ width: '100%', padding: '0.5rem', marginBottom: '1rem' }}
      />

      <input
        type="text"
        value={gameplayTime}
        onChange={(e) => setGameplayTime(e.target.value)}
        placeholder="Gameplay Time (e.g. ~30 hours)"
        style={{ width: '100%', padding: '0.5rem', marginBottom: '1rem' }}
      />

      <button onClick={handleSubmit} style={{ padding: '0.6rem 1.2rem' }}>
        Save Changes
      </button>
    </div>
  )
}

export default EditBlog
