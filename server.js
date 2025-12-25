import express from "express";
import fetch from "node-fetch";

const app = express();
const PORT = 3000;

/* BOOK API */
app.get("/book", async (req, res) => {
  try {
    const response = await fetch(
      "https://openlibrary.org/search.json?title=harry+potter"
    );
    const data = await response.json();
    const book = data.docs[0];

    res.json({
      title: book.title,
      genre: book.subject?.[0] || "Fantasy"
    });
  } catch (err) {
    res.status(500).json({ error: "Book API error" });
  }
});

/* MOVIE API (Book API'yi kullanır) */
app.get("/movie", async (req, res) => {
  try {
    const bookRes = await fetch("http://localhost:3000/book");
    const book = await bookRes.json();

    const response = await fetch("https://ghibliapi.vercel.app/films");
    const movies = await response.json();

    const movie =
      movies.find(m =>
        m.description.toLowerCase().includes(book.genre.toLowerCase())
      ) || movies[0];

    res.json({
      book: book.title,
      recommended_movie: movie.title
    });
  } catch (err) {
    res.status(500).json({ error: "Movie API error" });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
