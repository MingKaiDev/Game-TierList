import React, { useEffect, useState } from 'react'

const Backlog = () => {
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [title, setTitle] = useState('')

  const backend = import.meta.env.VITE_BACKEND_URL

  const fetchItems = async () => {
    setLoading(true)
    try {
      const r = await fetch(`${backend}/api/backlog`)
      const data = await r.json()
      setItems(data)
    } catch (err) {
      console.error('Failed to load backlog items', err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchItems()
  }, [])

  const handleAdd = async (e) => {
    e.preventDefault()
    if (!title.trim()) return
    try {
      const r = await fetch(`${backend}/api/backlog`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title: title.trim() }),
      })
      if (!r.ok) throw new Error('Failed to add')
      setTitle('')
      setShowForm(false)
      await fetchItems()
    } catch (err) {
      console.error('Add failed', err)
      alert('Failed to add backlog item')
    }
  }

  const styles = {
    container: { padding: '2rem', fontFamily: "'Cinzel', serif", color: '#EAEAEA' },
    header: { textAlign: 'center', marginBottom: '1.5rem' },
    title: { fontSize: '2.5rem', color: '#B89B72', fontWeight: 'bold' },
    list: { display: 'grid', gap: '0.75rem', maxWidth: 800, margin: '0 auto' },
    item: { padding: '0.75rem 1rem', background: '#101010', border: '1px solid #B89B72', borderRadius: 6 },
    addBtn: { position: 'fixed', bottom: '2rem', right: '2rem', backgroundColor: '#B89B72', color: '#101010', padding: '1rem', borderRadius: '50%', border: 'none', cursor: 'pointer', fontSize: '1.2rem' },
    form: { display: 'flex', gap: '0.5rem', justifyContent: 'center', marginTop: '1rem' },
    input: { padding: '0.5rem', borderRadius: 4, border: '1px solid #B89B72', background: '#0e0e0e', color: '#EAEAEA' },
    submit: { padding: '0.5rem 1rem', borderRadius: 4, border: '1px solid #B89B72', background: '#B89B72', color: '#101010', cursor: 'pointer' }
  }

  return (
    <div style={styles.container}>
      <header style={styles.header}>
        <h1 style={styles.title}>Backlog</h1>
        <p style={{ textAlign: 'center', color: '#DDD' }}>Games you own but haven't played yet.</p>
      </header>

      {loading ? (
        <div>Loading backlog...</div>
      ) : (
        <div style={styles.list}>
          {items.length === 0 ? (
            <div style={{ textAlign: 'center', color: '#CCC' }}>No items in backlog yet.</div>
          ) : (
            items.map(it => (
              <div key={it.id} style={styles.item}>{it.title}</div>
            ))
          )}
        </div>
      )}

      <button style={styles.addBtn} onClick={() => setShowForm(s => !s)} title="Add to backlog">+</button>

      {showForm && (
        <form style={styles.form} onSubmit={handleAdd}>
          <input value={title} onChange={e => setTitle(e.target.value)} placeholder="Game title" style={styles.input} />
          <button type="submit" style={styles.submit}>Add</button>
        </form>
      )}
    </div>
  )
}

export default Backlog
