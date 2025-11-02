import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { getAuth } from 'firebase/auth';
import { AuthCtx } from '../contexts/AuthContext';
import useGameCovers from '../hooks/useGameCovers';
import { FaSpinner, FaImage } from 'react-icons/fa';
import '../styles/Compendium.css';

const Compendium = () => {
  const [games, setGames] = useState([]);
  const [loading, setLoading] = useState(true);
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
        
        // Sort games alphabetically by title
        uniqueGames.sort((a, b) => a.title.localeCompare(b.title));

        setGames(uniqueGames);
      } catch (err) {
        console.error('Failed to fetch games for compendium:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchGames();
  }, [user]);

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
      </header>
      <div className="compendium-grid">
        {games.map(game => (
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
