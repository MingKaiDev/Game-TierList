import React, { useState, useEffect } from 'react';
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
    const fetchDashboardData = async () => {
      setLoading(true);
      
      // Fetch blogs for rating distribution
      try {
        const blogsRes = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/blogs`);
        if (blogsRes.ok) {
          const blogsData = await blogsRes.json();
          setBlogs(blogsData);
        } else {
          console.error('Failed to fetch blogs for dashboard');
        }
      } catch (err) {
        console.error('Error fetching blogs:', err);
      }

      // Fetch genres for genre distribution
      try {
        const genresRes = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/genres`);
        if (genresRes.ok) {
          const genresData = await genresRes.json();
          setGenreDistribution(genresData);
        } else {
          console.error('Failed to fetch genres for dashboard');
        }
      } catch (err) {
        console.error('Error fetching genres:', err);
      }

      setLoading(false);
    };

    fetchDashboardData();
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
  }};

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
          <h1 className="dashboard-title">Scribe Dashboard </h1>
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
          {blogs.length > 0 ? (
            <Bar data={ratingData} options={chartOptions} />
          ) : (
            <p className="chart-placeholder">No rating data available.</p>
          )}
        </div>
        <div className="chart-card">
          <h2 className="chart-title">Genre Distribution</h2>
          {Object.keys(genreDistribution).length > 0 ? (
            <Pie data={genreData} options={{ plugins: { legend: { labels: { color: '#EAEAEA', font: { family: "'Cinzel', serif" } } } } }} />
          ) : (
            <p className="chart-placeholder">No genre data available. The archives may be silent.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
