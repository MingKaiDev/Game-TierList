import { Link, useLocation } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { AuthCtx } from '../contexts/AuthContext'
import { logout } from '../firebaseAuth'

const Navbar = () => {
  const location = useLocation()
  const [scrolled, setScrolled] = useState(false)
  const { user } = useContext(AuthCtx)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <div style={{ paddingTop: '60px' }}>
      <nav style={{
        ...styles.navbar,
        ...(scrolled ? styles.navbarScrolled : {}),
      }}>
        {/* Left nav */}
        <div style={styles.navLeft}>
          {navItem("/", "Home", location)}
          {navItem("/blog", "Blog", location)}
          {navItem("/tierlist", "Tier List", location)}
        </div>

        {/* Center logo */}
        <div style={styles.logoContainer}>
          <img
            src="/logo.png"
            alt="Kai Tierlist Logo"
            style={{
              height: scrolled ? '60px' : '80px',
              transition: 'height 0.3s ease',
            }}
          />
          <span style={{
            ...styles.title,
            fontSize: scrolled ? '2rem' : '2.75rem',
          }}>
            Game Tier List
          </span>
        </div>

        {/* Right placeholder for spacing or future links */}
        <div style={styles.navRight}>
          <div>
            {user
              ? <button onClick={logout} style={styles.authBtn}>Logout</button>
              : <Link to="/login" style={styles.authBtn}>Login</Link>}
          </div>
        </div>
      </nav>
    </div>
  )
}

const navItem = (path, label, location) => (
  <Link
    to={path}
    style={{
      ...styles.link,
      ...(location.pathname === path ? styles.activeLink : {}),
    }}
  >
    {label}
  </Link>
)

const styles = {
  navbar: {
    position: 'fixed',
    top: 0,
    zIndex: 1000,
    width: '100%',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    background: '#0d1117',
    color: 'white',
    padding: '1.2rem 2rem',
    borderBottom: '2px solid #222',
    boxShadow: '0 4px 10px rgba(0,0,0,0.5)',
    transition: 'all 0.3s ease',
  },
  navbarScrolled: {
    padding: '0.5rem 2rem',
    background: '#0d1117',
  },
  navLeft: {
    display: 'flex',
    gap: '1rem',
    alignItems: 'center',
  },
  navRight: {
    width: '150px', // balance for centered logo
  },
  logoContainer: {
    position: 'absolute',
    left: '50%',
    transform: 'translateX(-50%)',
    display: 'flex',
    alignItems: 'center',
    gap: '1rem',
  },
  title: {
    fontWeight: 'bold',
    letterSpacing: '1px',
    transition: 'font-size 0.3s ease',
  },
  link: {
    color: '#ccc',
    textDecoration: 'none',
    fontWeight: '600',
    padding: '0.5rem 1rem',
    borderRadius: '8px',
    transition: 'all 0.3s ease',
    backgroundColor: '#1a1a1a',
  },
  activeLink: {
    backgroundColor: "#00C800",
    color: "#fff",
  },
}

export default Navbar
