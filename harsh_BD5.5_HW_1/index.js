const express = require("express");
const { resolve } = require("path");
const { sequelize } = require("./lib/index.js");
const { book } = require("./models/book.model.js");
const { user } = require("./models/user.model.js");
const { like } = require("./models/like.model.js");
const { Op } = require("@sequelize/core");

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());

const booksData = [
  {
    title: "To Kill a Mockingbird",
    author: "Harper Lee",
    genre: "Fiction",
    year: 1960,
    summary: "A novel about the serious issues of rape and racial inequality.",
  },
  {
    title: "1984",
    author: "George Orwell",
    genre: "Dystopian",
    year: 1949,
    summary:
      "A novel presenting a dystopian future under a totalitarian regime.",
  },
  {
    title: "Moby-Dick",
    author: "Herman Melville",
    genre: "Adventure",
    year: 1851,
    summary:
      "The narrative of the sailor Ishmael and the obsessive quest of Ahab.",
  },
  {
    title: "Pride and Prejudice",
    author: "Jane Austen",
    genre: "Romance",
    year: 1813,
    summary:
      "A romantic novel that charts the emotional development of the protagonist Elizabeth Bennet.",
  },
  {
    title: "The Great Gatsby",
    author: "F. Scott Fitzgerald",
    genre: "Fiction",
    year: 1925,
    summary: "A novel about the American dream and the roaring twenties.",
  },
];

app.get("/seed-db", async (req, res) => {
  try {
    await sequelize.sync({ force: true });
    await book.bulkCreate(booksData);
    await user.create({
      username: "booklover",
      email: "booklover@gmail.com",
      password: "password123",
    });

    res.status(200).json({ message: "Database seeded successfully" });
  } catch (error) {
    return res
      .status(500)
      .json({ error: error.message, message: "Failed to seed database" });
  }
});

// endpoint 1
async function likeBook(data) {
  let likeBookData = await like.create({
    userId: data.userId,
    bookId: data.bookId,
  });

  return { likeBookData };
}

app.get("/users/:id/like", async (req, res) => {
  try {
    let userId = req.params.id;
    let bookId = req.query.bookId;
    let result = await likeBook({ userId: userId, bookId: bookId });

    if (result.likeBookData != undefined) {
      return res
        .status(200)
        .json({ message: "Book liked", newLike: result.likeBookData });
    } else {
      return res.status(400).json({ message: "Failed to add new like" });
    }
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

// endpoint 2
async function dislikeBook(data) {
  let dislikedBook = await like.destroy({
    where: {
      userId: data.userId,
      bookId: data.bookId,
    },
  });

  if (dislikedBook) {
    return { message: "Book disliked" };
  } else {
    return { message: "" };
  }
}

app.get("/users/:id/dislike", async (req, res) => {
  try {
    let userId = req.params.id;
    let bookId = req.query.bookId;

    let result = await dislikeBook({ userId: userId, bookId: bookId });

    if (result.message != "") {
      return res.status(200).json(result);
    } else {
      return res.status(400).json({ message: "Failed to dislike book" });
    }
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

// endpoint 3
async function getAllLikedBooks(userId) {
  let userslikes = await like.findAll({
    where: { userId },
    attributes: ["bookId"],
  });

  let usersLikesData = [];

  for (let i = 0; i < userslikes.length; i++) {
    usersLikesData.push(userslikes[i].bookId);
  }

  let likedBooks = await book.findAll({
    where: { id: { [Op.in]: usersLikesData } },
  });

  return { likedBooks };
}

app.get("/users/:id/liked", async (req, res) => {
  try {
    let userId = req.params.id;

    let result = await getAllLikedBooks(userId);
    if (result.likedBooks.length > 0) {
      return res.status(200).json(result);
    } else {
      return res.status(404).json({ error: "No books liked by user" });
    }
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

app.listen(port, () => {
  console.log(`Server is listening on http://localhost:${port}`);
});
