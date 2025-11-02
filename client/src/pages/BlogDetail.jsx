import { useParams } from 'react-router-dom';
import { useEffect, useState, useContext } from 'react';
import { DiscussionEmbed } from 'disqus-react';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { AuthCtx } from '../contexts/AuthContext';
import useGameBanner from '../hooks/useGameBanner';
import '../styles/BlogDetail.css';

const BlogDetail = () => {
  const { title } = useParams();
  const [blog, setBlog] = useState(null);
  const { user } = useContext(AuthCtx);
  const [localUser, setLocalUser] = useState(null);
  
  // Use the new hook to get the banner image and all other details
  const { imageUrl, details: igdbInfo, loading: bannerLoading } = useGameBanner(blog?.title);

  useEffect(() => {
    const fetchBlog = async () => {
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

        const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/blogs?title=${encodeURIComponent(title)}`, { headers });
        const data = await res.json();
        if (data.length > 0) setBlog(data[0]);
      } catch (err) {
        console.error('Failed to fetch blog:', err);
      }
    };

    fetchBlog();
  }, [title, user]);

  useEffect(() => {
    const auth = getAuth();
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      setLocalUser(firebaseUser);
    });
    return () => unsubscribe();
  }, []);

  if (!blog) {
    return (
      <div className="tome-container">
        <SkeletonLoader type="banner" />
        <header className="tome-header">
          <SkeletonLoader type="title" />
        </header>
        <SkeletonLoader type="text" />
      </div>
    );
  }

  const disqusConfig = {
    url: window.location.href,
    identifier: blog.title,
    title: blog.title,
  };

  return (
    <div className="tome-container">
      {bannerLoading ? (
        <SkeletonLoader type="banner" />
      ) : (
        imageUrl && <img src={imageUrl} alt="Banner" className="banner" />
      )}
      <header className="tome-header">
        <h1 className="tome-title">{blog.title}</h1>
        <p className="tome-meta">Rating: {blog.rating}/10</p>
        {blog.gameplayTime && (
          <p className="tome-meta">
            Gameplay Time: {blog.gameplayTime}
          </p>
        )}
      </header>

      {igdbInfo && (
        <>
          {Array.isArray(igdbInfo.genres) && igdbInfo.genres.length > 0 && (
            <div className="section">
              <strong className="label">Genres:</strong>
              <div className="badge-group">
                {igdbInfo.genres.map((g, i) => (
                  <span key={i} className="badge">{g}</span>
                ))}
              </div>
            </div>
          )}
          {Array.isArray(igdbInfo.developers) && igdbInfo.developers.length > 0 && (
            <div className="section">
              <strong className="label">Developers:</strong>
              <div className="badge-group">
                {igdbInfo.developers.map((d, i) => (
                  <span key={i} className="badge">{d}</span>
                ))}
              </div>
            </div>
          )}
          {Array.isArray(igdbInfo.publishers) && igdbInfo.publishers.length > 0 && (
            <div className="section">
              <strong className="label">Publishers:</strong>
              <div className="badge-group">
                {igdbInfo.publishers.map((p, i) => (
                  <span key={i} className="badge">{p}</span>
                ))}
              </div>
            </div>
          )}
        </>
      )}

      <div className="tome-content" dangerouslySetInnerHTML={{ __html: blog.content }} />

      {localUser && (
        <div className="discussion-section">
          <DiscussionEmbed shortname="game-tierlist" config={disqusConfig} />
        </div>
      )}
    </div>
  );
};

export default BlogDetail;
