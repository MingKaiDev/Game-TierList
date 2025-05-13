import React from 'react'
import { Routes, Route } from 'react-router-dom'
import Navbar from './components/Navbar'
import Home from './pages/Home'
import Blog from './pages/Blog'
import TierList from './pages/TierList'
import NewBlog from './pages/NewBlog'
import BlogDetail from './pages/BlogDetail'
import { useEffect } from 'react'



const backendURL = import.meta.env.VITE_BACKEND_URL;

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
        <Route path="/newblog" element={<NewBlog />} />
        <Route path="/blog/:title" element={<BlogDetail />} />

      </Routes>
    </>
  )
}



export default App
