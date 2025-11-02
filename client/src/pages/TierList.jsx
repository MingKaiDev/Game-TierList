import { useEffect, useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import useGameCovers from '../hooks/useGameCovers';
import { AuthCtx } from '../contexts/AuthContext';
import { getAuth } from 'firebase/auth';
import { FaSpinner, FaImage } from 'react-icons/fa';
import '../styles/TierList.css';

const TierList = () => {
  const [blogs, setBlogs] = useState([]);
  const { user } = useContext(AuthCtx);

  useEffect(() => {
    const fetchBlogs = async () => {
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
        const data = await res.json();
        setBlogs(data);
      } catch (err) {
        console.error('Failed to fetch blogs:', err);
      }
    };

    fetchBlogs();
  }, [user]);

  const grouped = Array.from({ length: 11 }, (_, i) => {
    const tier = 10 - i;
    const tierBlogs = blogs.filter(b => Math.floor(b.rating) === tier);
    return { tier, blogs: tierBlogs };
  });

  return (
    <div className="tier-page-container">
      <header className="tier-page-header">
        <h1 className="tier-page-title">Game Tier List</h1>
      </header>
      {grouped.map(({ tier, blogs: tierBlogs }) => (
        tierBlogs.length > 0 && (
          <div key={tier} className="tier-row">
            <div className="tier-label">{tier}</div>
            <div className="tier-content">
              {tierBlogs.map(blog => (
                <Card key={blog.id} blog={blog} />
              ))}
            </div>
          </div>
        )
      ))}
    </div>
  );
};

const Card = ({ blog }) => {
  const { coverUrl, loading } = useGameCovers(blog.title);
  const navigate = useNavigate();

  const handleClick = () => {
    navigate(`/blog/${blog.title}`);
  };

  return (
    <div className="tier-card" onClick={handleClick} title={blog.title}>
      {loading ? (
        <div className="tier-card-placeholder">
          <FaSpinner className="spinner" />
        </div>
      ) : (
        coverUrl ? (
          <img src={coverUrl} alt={blog.title} className="tier-card-image" />
        ) : (
          <div className="tier-card-placeholder">
            <FaImage />
          </div>
        )
      )}
      <div className="tier-card-title">{blog.title}</div>
    </div>
  );
};

export default TierList;
