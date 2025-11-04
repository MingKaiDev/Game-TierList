import { Link, useLocation } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { AuthCtx } from '../contexts/AuthContext'
import { logout } from '../firebaseAuth'
import { useContext } from 'react';
import { FaSignInAlt, FaSignOutAlt } from 'react-icons/fa';

const Navbar = () => {
  const location = useLocation()
  const [scrolled, setScrolled] = useState(false)
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768)
  const { user } = useContext(AuthCtx)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 768)
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  return (
    <div style={{ paddingTop: isMobile ? '70px' : '80px' }}>
      <nav style={{
        ...styles.navbar,
        ...(scrolled ? styles.navbarScrolled : {}),
        padding: isMobile ? (scrolled ? '0.5rem 0.5rem' : '0.75rem 0.75rem') : (scrolled ? '0.5rem 0.75rem' : '0.75rem 1rem'),
      }}>
        {/* Left nav */}
        <div style={{
          ...styles.navLeft,
          gap: isMobile ? '0.5rem' : '1rem',
        }}>
          {navItem("/", "Home", location, isMobile)}
          {navItem("/blog", "Blog", location, isMobile)}
          {navItem("/tierlist", isMobile ? "Tier" : "Tier List", location, isMobile)}
          {navItem("/compendium", "Compendium", location, isMobile)}
          {navItem("/dashboard", "Dashboard", location, isMobile)}
        </div>

        {/* Center logo */}
        <div style={styles.logoContainer}>
          <img
            src="/logo.png"
            alt="Kai Tierlist Logo"
            style={{
              height: isMobile ? (scrolled ? '30px' : '35px') : (scrolled ? '45px' : '60px'),
              transition: 'height 0.3s ease',
            }}
          />
          {!isMobile && (
            <span style={{
              ...styles.title,
              fontSize: scrolled ? '1.5rem' : '2rem',
            }}>
              Game Tier List
            </span>
          )}
        </div>

        {/* Right auth */}
        <div style={styles.navRight}>
          {user
            ? <button onClick={logout} style={{
                ...styles.authBtn,
                padding: isMobile ? '0.5rem 0.8rem' : '0.6rem 1.2rem',
                fontSize: isMobile ? '0.9rem' : '1rem',
              }}><FaSignOutAlt /></button>
            : <Link to="/login" style={{
                ...styles.authBtn,
                padding: isMobile ? '0.5rem 0.8rem' : '0.6rem 1.2rem',
                fontSize: isMobile ? '0.9rem' : '1rem',
              }}><FaSignInAlt /></Link>}
        </div>
      </nav>
    </div>
  )
}

const navItem = (path, label, location, isMobile) => (
  <Link
    to={path}
    style={{
      ...styles.link,
      ...(location.pathname === path ? styles.activeLink : {}),
      padding: isMobile ? '0.5rem 0.8rem' : '0.6rem 1.2rem',
      fontSize: isMobile ? '0.9rem' : '1rem',
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
    background: '#101010',
    color: '#EAEAEA',
    padding: '0.75rem 1rem',
    borderBottom: '1px solid #B89B72',
    boxShadow: '0 2px 10px rgba(0,0,0,0.7)',
    transition: 'all 0.3s ease',
    minHeight: '70px',
    boxSizing: 'border-box',
    fontFamily: "'Cinzel', serif",
  },
  navbarScrolled: {
    padding: '0.5rem 0.75rem',
    background: '#101010',
    minHeight: '60px',
  },
  navLeft: {
    display: 'flex',
    gap: '1rem',
    alignItems: 'center',
    flex: '0 0 auto',
  },
  navRight: {
    display: 'flex',
    justifyContent: 'flex-end',
    alignItems: 'center',
    flex: '0 0 auto',
  },
  logoContainer: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.75rem',
    position: 'absolute',
    left: '50%',
    transform: 'translateX(-50%)',
  },
  title: {
    fontWeight: 'bold',
    letterSpacing: '1px',
    transition: 'font-size 0.3s ease',
    whiteSpace: 'nowrap',
    color: '#EAEAEA',
    textShadow: '1px 1px 2px rgba(0,0,0,0.7)',
  },
  link: {
    color: '#BDBDBD',
    textDecoration: 'none',
    fontWeight: '600',
    padding: '0.6rem 1.2rem',
    borderRadius: '2px',
    transition: 'all 0.3s ease',
    backgroundColor: 'transparent',
    border: '1px solid transparent',
  },
  activeLink: {
    backgroundColor: "rgba(184, 155, 114, 0.1)",
    color: "#DDC6A3",
    border: '1px solid #B89B72',
  },
  authBtn: {
    color: '#B89B72',
    textDecoration: 'none',
    fontWeight: '600',
    padding: '0.6rem 1.2rem',
    borderRadius: '2px',
    transition: 'all 0.3s ease',
    backgroundColor: 'transparent',
    border: '1px solid #B89B72',
    cursor: 'pointer',
    fontFamily: "'Cinzel', serif",
  },
}

export default Navbar
