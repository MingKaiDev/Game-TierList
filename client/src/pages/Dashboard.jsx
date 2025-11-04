import React, { useState, useEffect, useContext } from 'react';
import { getAuth } from 'firebase/auth';
import { AuthCtx } from '../contexts/AuthContext';
import { Bar, Pie } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement, Title } from 'chart.js';
import SkeletonLoader from '../components/SkeletonLoader';
import '../styles/Dashboard.css';

ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement, Title);

const Dashboard = () => {
  const [blogs, setBlogs] = useState([]);
  const [genreDistribution, setGenreDistribution] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [blogsRes, genresRes] = await Promise.all([
          fetch(`${import.meta.env.VITE_BACKEND_URL}/api/blogs`),
          fetch(`${import.meta.env.VITE_BACKEND_URL}/api/genres`)
        ]);
        
        const blogsData = await blogsRes.json();
        const genresData = await genresRes.json();

        setBlogs(blogsData);
        setGenreDistribution(genresData);

      } catch (err) {
        console.error('Failed to fetch data for dashboard:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const ratingDistribution = blogs.reduce((acc, blog) => {
    const rating = Math.floor(blog.rating);
    acc[rating] = (acc[rating] || 0) + 1;
    return acc;
  }, {});

  const chartOptions = {
    plugins: {
      legend: {
        labels: {
          color: '#EAEAEA',
          font: {
            family: "'Cinzel', serif",
          }
        }
      }
    },
    scales: {
      x: {
        ticks: {
          color: '#B89B72',
        },
        grid: {
          color: 'rgba(184, 155, 114, 0.2)',
        }
      },
      y: {
        ticks: {
          color: '#B89B72',
        },
        grid: {
          color: 'rgba(184, 155, 114, 0.2)',
        }
      }
    }
  };

  const ratingData = {
    labels: Object.keys(ratingDistribution).sort((a, b) => a - b),
    datasets: [{
      label: 'Number of Games',
      data: Object.values(ratingDistribution),
      backgroundColor: '#B89B72',
      borderColor: '#101010',
      borderWidth: 1,
    }],
  };

  const genreData = {
    labels: Object.keys(genreDistribution),
    datasets: [{
      data: Object.values(genreDistribution),
      backgroundColor: [
        '#B89B72', '#C0A581', '#C8AF90', '#D0B99F', '#D8C3AE',
        '#A98C63', '#9A7D54', '#8B6E45', '#7C5F36', '#6D5027'
      ],
      borderColor: '#101010',
      borderWidth: 1,
    }],
  };

  if (loading) {
    return (
      <div className="dashboard-container">
        <header className="dashboard-header">
          <h1 className="dashboard-title">Scribe's Dashboard</h1>
        </header>
        <div className="charts-grid">
          <div className="chart-card"><SkeletonLoader type="card" style={{height: '300px'}}/></div>
          <div className="chart-card"><SkeletonLoader type="card" style={{height: '300px'}}/></div>
        </div>
      </div>
    );
  }

  return (
    <div className="dashboard-container">
      <header className="dashboard-header">
        <h1 className="dashboard-title">Scribe's Dashboard</h1>
        <p className="dashboard-subtitle">An overview of your chronicles.</p>
      </header>
      <div className="charts-grid">
        <div className="chart-card">
          <h2 className="chart-title">Rating Distribution</h2>
          <Bar data={ratingData} options={chartOptions} />
        </div>
        <div className="chart-card">
          <h2 className="chart-title">Genre Distribution</h2>
          <Pie data={genreData} options={{ plugins: { legend: { labels: { color: '#EAEAEA', font: { family: "'Cinzel', serif" } } } } }} />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
