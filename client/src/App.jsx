import React, { useEffect, useContext } from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import './App.css';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Blog from './pages/Blog';
import TierList from './pages/TierList';
import NewBlog from './pages/NewBlog';
import BlogDetail from './pages/BlogDetail';
import EditBlog from './pages/EditBlog';
import { AuthCtx } from './contexts/AuthContext';
import Login from './pages/Login';
import Compendium from './pages/Compendium';

const backendURL = import.meta.env.VITE_BACKEND_URL;

function PrivateRoute({ children }) {
  const { user, ready } = useContext(AuthCtx);
  if (!ready) return null; // or a spinner
  return user ? children : <Navigate to="/login" replace />;
}

const pageVariants = {
  initial: {
    opacity: 0,
  },
  in: {
    opacity: 1,
  },
  out: {
    opacity: 0,
  },
};

const pageTransition = {
  type: 'tween',
  ease: 'anticipate',
  duration: 0.75,
};

const AnimatedRoutes = () => {
  const location = useLocation();
  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={<Home />} />
        <Route path="/blog" element={<Blog />} />
        <Route path="/tierlist" element={<TierList />} />
        <Route path="/compendium" element={<Compendium />} />
        <Route path="/newblog" element={<PrivateRoute><NewBlog /></PrivateRoute>} />
        <Route path="/EditBlog/:id" element={<PrivateRoute><EditBlog /></PrivateRoute>} />
        <Route path="/blog/:title" element={<BlogDetail />} />
        <Route path="/login" element={<Login />} />
      </Routes>
    </AnimatePresence>
  );
};

const App = () => {
  useEffect(() => {
    fetch(`${import.meta.env.VITE_BACKEND_URL}/api/ping`)
      .then(() => console.log('Render server woken'))
      .catch(() => console.warn('Could not wake Render server'));
  }, []);

  return (
    <motion.div
      initial="initial"
      animate="in"
      exit="out"
      variants={pageVariants}
      transition={pageTransition}
    >
      <main style={{
        margin: '-8px',
        minHeight: '100vh',
        backgroundColor: 'transparent',
        backgroundImage: `
          linear-gradient(rgba(0, 0, 0, 0.7), rgba(0, 0, 0, 0.7)),
          linear-gradient(90deg, rgba(255, 255, 255, 0.03) 1px, transparent 1px),
          linear-gradient(rgba(255, 255, 255, 0.03) 1px, transparent 1px)
        `,
        backgroundSize: '100%, 25px 25px, 25px 25px',
      }}>
        <Navbar />
        <AnimatedRoutes />
      </main>
    </motion.div>
  );
};

export default App;
