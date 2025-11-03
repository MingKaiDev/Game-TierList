# Game-TierList Copilot Instructions

This document provides guidance for AI agents to effectively contribute to the Game-TierList codebase.

## Architecture Overview

This is a full-stack monorepo using the FERN (Firebase, Express, React, Node.js) stack.

-   **`client/`**: A React frontend built with Vite. It handles user interface, authentication, and communication with the backend.
-   **`server/`**: A Node.js/Express backend that provides a RESTful API. It integrates with Firebase for data storage (blogs) and an external API (IGDB) for game data.

### Key Architectural Patterns

-   **Authentication**: Client-side authentication is managed by Firebase Authentication (`client/src/firebaseAuth.js`). The ID token generated upon login is sent to the backend with API requests. The backend verifies this token using a custom middleware (`server/src/middleware/checkAuth.js`) to protect routes.
-   **Data Flow**:
    1.  **Game Data**: The frontend requests game data (covers, details) from the backend's `/api/covers` and `/api/details` endpoints. The backend then fetches this data from the IGDB API.
    2.  **Blog Data**: Blog posts are stored in Firebase Firestore. The backend provides CRUD operations for blogs through the `/api/blogs` endpoint.
-   **State Management**: Global authentication state is managed in the frontend using a React Context (`client/src/contexts/AuthContext.jsx`).

## Developer Workflow

### Backend Setup

1.  Navigate to the `server` directory: `cd server`
2.  Install dependencies: `npm install`
3.  Create a `.env` file and add the following, replacing placeholders with your credentials:
    ```
    FIREBASE_SERVICE_ACCOUNT_KEY_PATH=./firebase-service-account.json
    IGDB_CLIENT_ID=your_igdb_client_id
    IGDB_ACCESS_TOKEN=your_igdb_access_token
    ```
4.  Start the development server: `npm start`
    The server will run on `http://localhost:3001`.

### Frontend Setup

1.  Navigate to the `client` directory: `cd client`
2.  Install dependencies: `npm install`
3.  Create a `.env.local` file and add the backend URL:
    ```
    VITE_BACKEND_URL=http://localhost:3001
    ```
4.  Start the development server: `npm run dev`
    The client will run on `http://localhost:5173`.

## Code Conventions

-   **Styling**: The frontend uses inline CSS-in-JS for component styling. See `client/src/components/BlogCard.jsx` for an example.
-   **API Routes**: Backend routes are modularized by resource. For example, all blog-related endpoints are in `server/src/routes/blogs.js`.
-   **Custom Hooks**: Frontend logic for data fetching is often encapsulated in custom hooks, like `client/src/hooks/useGameCovers.jsx`.
-   **Environment Variables**: Frontend environment variables must be prefixed with `VITE_` as per Vite's convention.

### Key Files to Reference

-   `client/src/contexts/AuthContext.jsx`: For understanding how authentication state is managed and consumed in the React app.
-   `server/src/middleware/checkAuth.js`: For understanding how backend routes are protected.
-   `server/src/routes/`: To see how API endpoints are defined and what controllers they use.
-   `client/src/hooks/useGameCovers.jsx`: An example of fetching data from the backend.
