import React from 'react'
import { Routes, Route } from 'react-router-dom'
import Navbar from './components/Navbar'
import Home from './pages/Home'
import Blog from './pages/Blog'
import TierList from './pages/TierList'
import NewBlog from './pages/NewBlog'
import BlogDetail from './pages/BlogDetail'
import { useEffect } from 'react'
import { AuthCtx } from './contexts/AuthContext'
import Login from './pages/Login'

const backendURL = import.meta.env.VITE_BACKEND_URL;

function PrivateRoute({ children }) {
  const { user, ready } = useContext(AuthCtx)
  if (!ready) return null            // or a spinner
  return user ? children : <Navigate to="/login" replace />
}

const App = () => {
  useEffect(() => {
    fetch(`${import.meta.env.VITE_BACKEND_URL}/api/ping`)
      .then(() => console.log('Render server woken'))
      .catch(() => console.warn('Could not wake Render server'))
  }, [])
  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/blog" element={<Blog />} />
        <Route path="/tierlist" element={<TierList />} />
        <Route path="/newblog" element={
          <PrivateRoute><NewBlog /></PrivateRoute>
        } />
        <Route path="/blog/:title" element={<BlogDetail />} />
        <Route path="/login" element={<Login />} />
      </Routes>
    </>
  )
}



export default App
