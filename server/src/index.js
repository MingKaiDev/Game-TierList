const express = require("express");
const cors = require("cors");
const blogRoutes = require('./routes/blogs')
const coverRoutes = require('./routes/covers')
const pingRoute = require('./routes/ping')
const artworkRoute = require('./routes/artwork')
const detailsRoute = require('./routes/details')
const genresRoute = require('./routes/genres')
const backlogRoute = require('./routes/backlog')

require("dotenv").config();

const app = express();
app.use(cors());
app.use(cors({
    origin: "*",
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type"]
  }));

app.use(express.json());

//Routes
app.use('/api/blogs',blogRoutes)
app.use('/api/cover', coverRoutes)
app.use('/api/ping', pingRoute)
app.use('/api/artwork', artworkRoute)
app.use('/api/details', detailsRoute)
app.use('/api/genres', genresRoute)
app.use('/api/backlog', backlogRoute)

app.get("/api/hello", (req, res) => {
  res.json({ message: "Hello from backend!" });
});
app.get("/", (req,res) => {
  res.json({message: "App is Running"})
})
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
