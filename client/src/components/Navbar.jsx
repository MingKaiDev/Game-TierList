import { Link, useLocation } from 'react-router-dom'

const Navbar = () => {
    const location = useLocation()

    return (
        <nav style={styles.navbar}>
            <div style={styles.logoContainer}>
                <img
                    src="/logo.png"
                    alt="Kai Tierlist Logo"
                    style={{ height: '300px', marginRight: '0.75rem' }}
                />
                <span style={styles.title}>Game Tier List</span>
            </div>
            <div style={styles.navLinks}>
                {navItem("/", "Home", location)}
                {navItem("/blog", "Blog", location)}
                {navItem("/tierlist", "Tier List", location)}
            </div>
        </nav>
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
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        background: '#0d1117',
        color: 'white',
        padding: '1rem 2rem',
        borderBottom: '2px solid #222',
        boxShadow: '0 4px 10px rgba(0,0,0,0.5)',
    },
    logoContainer: {
        display: 'flex',
        alignItems: 'center',
    },
    logo: {
        marginRight: '0.75rem',
    },
    title: {
        fontWeight: 'bold',
        fontSize: '5.0rem',
        letterSpacing: '1px',
    },
    navLinks: {
        display: 'flex',
        gap: '1.2rem',
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
