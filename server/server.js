const express = require("express");
const cors = require("cors");
const books = require("./books");

const app = express();
const PORT = 3000;

// Enable CORS for all origins
app.use(cors());

app.get("/search", (req, res) => {
  const query = req.query.query;
  if (!query) {
    return res.status(400).json({ error: "Missing query parameter" });
  }

  const results = books.filter((book) =>
    book.title.toLowerCase().includes(query.toLowerCase())
  );

  const response = results.map(({ title, author, description }) => ({
    title,
    author,
    description,
  }));

  res.json(response);
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
