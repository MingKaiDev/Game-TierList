import React, { useState, useEffect, useMemo, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { getAuth } from 'firebase/auth';
import { AuthCtx } from '../contexts/AuthContext';
import useGameCovers from '../hooks/useGameCovers';
import { FaSpinner, FaImage, FaSearch, FaSortAlphaDown, FaSortAlphaUp } from 'react-icons/fa';
import '../styles/Compendium.css';

const Compendium = () => {
  const [games, setGames] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortOrder, setSortOrder] = useState('asc'); // 'asc' or 'desc'
  const { user } = useContext(AuthCtx);

  useEffect(() => {
    const fetchGames = async () => {
      try {
        const headers = { 'Content-Type': 'application/json' };
        if (user) {
          try {
            const auth = getAuth();
            const token = await auth.currentUser.getIdToken();
            headers.Authorization = `Bearer ${token}`;
          } catch (err) {
            console.warn('Failed to get auth token:', err);
          }
        }

        const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/blogs`, { headers });
        const blogs = await res.json();
        
        // Get unique games, preserving the original blog object for linking
        const uniqueGames = Array.from(new Map(blogs.map(blog => [blog.title, blog])).values());
        
        setGames(uniqueGames);
      } catch (err) {
        console.error('Failed to fetch games for compendium:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchGames();
  }, [user]);

  const filteredAndSortedGames = useMemo(() => {
    return games
      .filter(game => game.title.toLowerCase().includes(searchTerm.toLowerCase()))
      .sort((a, b) => {
        if (sortOrder === 'asc') {
          return a.title.localeCompare(b.title);
        }
        return b.title.localeCompare(a.title);
      });
  }, [games, searchTerm, sortOrder]);

  if (loading) {
    return (
      <div className="compendium-loading">
        <FaSpinner className="spinner" />
        <span>Loading Compendium...</span>
      </div>
    );
  }

  return (
    <div className="compendium-container">
      <header className="compendium-header">
        <h1 className="compendium-title">Game Compendium</h1>
        <p className="compendium-subtitle">A library of all chronicled games.</p>
        <div className="compendium-controls">
          <div className="search-bar">
            <FaSearch className="search-icon" />
            <input
              type="text"
              placeholder="Search for a game..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <button className="sort-button" onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}>
            {sortOrder === 'asc' ? <FaSortAlphaDown /> : <FaSortAlphaUp />}
            <span>Sort</span>
          </button>
        </div>
      </header>
      <div className="compendium-grid">
        {filteredAndSortedGames.map(game => (
          <GameCard key={game.id} game={game} />
        ))}
      </div>
    </div>
  );
};

const GameCard = ({ game }) => {
  const { coverUrl, loading: coverLoading } = useGameCovers(game.title);
  const navigate = useNavigate();

  const handleClick = () => {
    navigate(`/blog/${game.title}`);
  };

  return (
    <div className="compendium-card" onClick={handleClick} title={game.title}>
      {coverLoading ? (
        <div className="compendium-card-placeholder">
          <FaSpinner className="spinner" />
        </div>
      ) : coverUrl ? (
        <img src={coverUrl} alt={game.title} className="compendium-card-image" />
      ) : (
        <div className="compendium-card-placeholder">
          <FaImage />
        </div>
      )}
      <div className="compendium-card-title">{game.title}</div>
    </div>
  );
};

export default Compendium;
