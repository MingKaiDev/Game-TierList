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
      <h2>Login</h2>
      <form onSubmit={handleEmailLogin} style={styles.form}>
        <input type="email" value={email} onChange={e=>setEmail(e.target.value)} placeholder="email" required/>
        <input type="password" value={pw} onChange={e=>setPw(e.target.value)} placeholder="password" required/>
        <button type="submit">Login</button>
      </form>
      <button onClick={loginWithGoogle}>Sign-in with Google</button>
      {err && <p style={{color:'red'}}>{err}</p>}
    </div>
  )
}

const styles = {
  wrap:{padding:'2rem', color:'#fff', textAlign:'center'},
  form:{display:'flex', flexDirection:'column', gap:'.8rem', marginBottom:'1rem'}
}
