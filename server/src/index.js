const express = require("express");
const cors = require("cors");
const blogRoutes = require('./routes/blogs')
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
app.use('/api/blogs',blogroutes)


app.get("/api/hello", (req, res) => {
  res.json({ message: "Hello from backend!" });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
