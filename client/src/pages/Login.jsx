import { useState, useContext } from 'react'
import { loginWithEmail, loginWithGoogle } from '../firebaseAuth'
import { AuthCtx } from '../contexts/AuthContext'
import { useNavigate } from 'react-router-dom'

export default function Login() {
  const { user }   = useContext(AuthCtx)
  const navigate   = useNavigate()
  const [email, setEmail] = useState('')
  const [pw,    setPw]    = useState('')
  const [err,   setErr]   = useState('')

  if (user) return navigate('/')

  const handleEmailLogin = async (e) => {
    e.preventDefault()
    try {
      await loginWithEmail(email, pw)
      navigate('/')        // success
    } catch (e) {
      setErr(e.message)
    }
  }

  return (
    <div style={styles.wrap}>
      <div style={styles.container}>
        <h2 style={styles.heading}>Login</h2>
        <form onSubmit={handleEmailLogin} style={styles.form}>
          <input 
            type="email" 
            value={email} 
            onChange={e=>setEmail(e.target.value)} 
            placeholder="Email" 
            required
            style={styles.input}
          />
          <input 
            type="password" 
            value={pw} 
            onChange={e=>setPw(e.target.value)} 
            placeholder="Password" 
            required
            style={styles.input}
          />
          <button type="submit" style={styles.submitBtn}>Login</button>
        </form>
        <button onClick={loginWithGoogle} style={styles.googleBtn}>Sign-in with Google</button>
        {err && <p style={styles.error}>{err}</p>}
      </div>
    </div>
  )
}

const styles = {
  wrap: {
    background: '#0d1117',
    minHeight: '100vh',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: '#fff',
    padding: '1rem',
  },
  container: {
    background: '#1e1e1e',
    padding: '2.5rem',
    borderRadius: '12px',
    boxShadow: '0 8px 32px rgba(0,0,0,0.4)',
    width: '100%',
    maxWidth: '400px',
    textAlign: 'center',
  },
  heading: {
    fontSize: '2rem',
    marginBottom: '1.5rem',
    color: '#fff',
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1rem',
    marginBottom: '1.5rem',
  },
  input: {
    padding: '0.8rem',
    borderRadius: '8px',
    border: '1px solid #333',
    background: '#0d1117',
    color: '#fff',
    fontSize: '1rem',
  },
  submitBtn: {
    padding: '0.8rem',
    borderRadius: '8px',
    border: 'none',
    background: '#00C800',
    color: '#fff',
    fontWeight: 'bold',
    fontSize: '1rem',
    cursor: 'pointer',
    transition: 'background 0.3s ease',
  },
  googleBtn: {
    padding: '0.8rem',
    borderRadius: '8px',
    border: '1px solid #333',
    background: '#333',
    color: '#fff',
    fontWeight: 'bold',
    fontSize: '1rem',
    cursor: 'pointer',
    width: '100%',
    transition: 'background 0.3s ease',
  },
  error: {
    color: '#ff4444',
    marginTop: '1rem',
    fontSize: '0.9rem',
  },
}
