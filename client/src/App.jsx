import React from 'react'
import { Routes, Route } from 'react-router-dom'
import Navbar from './components/Navbar'
import Home from './pages/Home'
import Blog from './pages/Blog'
import TierList from './pages/TierList'

const backendURL = import.meta.env.VITE_BACKEND_URL;

const App = () => {
  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/blog" element={<Blog />} />
        <Route path="/tierlist" element={<TierList />} />
      </Routes>
    </>
  )
}

export default App
