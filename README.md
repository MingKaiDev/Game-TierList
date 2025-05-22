# 🎮 Game Blog & Tier List App

A full-stack web application for reviewing and tier-listing video games. Built with the **FERN stack** (Firebase, Express, React, Node.js), and styled for clarity and responsiveness.

## 🔥 Live Demo

- **Frontend**: [Vercel Deployment](https://your-vercel-url.vercel.app)
- **Backend**: [Render Deployment](https://your-render-url.onrender.com)

---

## 🛠️ Features

### 🔹 General
- Fully responsive UI built with **React + Vite**
- **Firebase Firestore** backend for structured blog data
- **IGDB API integration** for:
  - Game artwork banners
  - Cover thumbnails
  - Metadata: genres, developers, publishers

### 🔹 Pages
#### 🏠 Home
- Carousel of 5 featured games
- Animated transitions, arrows, autoplay, dots

#### 📚 Blog Page
- Scrollable blog list
- Blog cards include:
  - Game title
  - Rating
  - Cover image
  - Short summary
- **Filters**:
  - By year
  - By rating range
  - By keyword
- Add new blog (only for signed-in users)

#### ✍️ New Blog
- Form to add:
  - Title
  - Rating
  - Short summary
  - Full blog content
- Requires login via Firebase Auth

#### 🧾 Blog Detail Page
- Dynamic rendering of:
  - Game artwork banner
  - Rating + content
  - Metadata (genres, publishers, developers)
  - **Disqus** comment section

#### 🧩 Tier List
- Renders all games in a ranking chart from **10** to **1**
- Grouped and styled per score, each using the same BlogCard component

---

## 🔐 Authentication

- Implemented with **Firebase Auth**
- Only authenticated users can add new blog entries

---

## 📦 Tech Stack

| Layer        | Tech                  |
|--------------|-----------------------|
| Frontend     | React, Vite           |
| Backend      | Express, Node.js      |
| Database     | Firebase Firestore    |
| Auth         | Firebase Auth         |
| Game API     | IGDB (Twitch Developer API) |
| Hosting      | Vercel (frontend), Render (backend) |

---

## 🚀 Getting Started

### 🔧 Setup Instructions

```bash
# Clone the repository
git clone https://github.com/yourusername/game-blog-tierlist.git
cd game-blog-tierlist

# Setup backend
cd server
npm install
# Add .env with Firebase Admin keys and IGDB credentials

# Setup frontend
cd ../client
npm install
# Add .env with VITE_BACKEND_URL

# Run locally
npm run dev
