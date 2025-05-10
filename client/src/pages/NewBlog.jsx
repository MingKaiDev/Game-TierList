import { useState } from 'react'

const NewBlog = () => {
  const [title, setTitle] = useState('')
  const [rating, setRating] = useState('')
  const [image, setImage] = useState('')

  const handleSubmit = (e) => {
    e.preventDefault()
    const newBlog = { title, rating: parseFloat(rating), image }
    console.log('Submit blog:', newBlog)
    // TODO: send to Firebase
  }

  return (
    <div style={styles.container}>
      <h2>Create New Blog</h2>
      <form onSubmit={handleSubmit} style={styles.form}>
        <input type="text" placeholder="Game Title" value={title} onChange={(e) => setTitle(e.target.value)} required />
        <input type="number" placeholder="Rating (e.g. 9.2)" value={rating} onChange={(e) => setRating(e.target.value)} required />
        <input type="url" placeholder="Image URL" value={image} onChange={(e) => setImage(e.target.value)} required />
        <button type="submit">Create Blog</button>
      </form>
    </div>
  )
}

const styles = {
  container: { padding: '2rem', color: 'white' },
  form: { display: 'flex', flexDirection: 'column', gap: '1rem', width: '300px' },
}

export default NewBlog
