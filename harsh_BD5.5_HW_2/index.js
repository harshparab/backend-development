const express = require("express");
const { resolve } = require("path");
const { sequelize } = require("./lib/index.js");
const { user } = require("./models/user.model.js");
const { movie } = require("./models/movie.model.js");
const { like } = require("./models/like.model.js");
const { Op } = require("@sequelize/core");

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());

const moviesData = [
  {
    title: "Inception",
    director: "Christopher Nolan",
    genre: "Sci-Fi",
    year: 2010,
    summary:
      "A skilled thief is given a chance at redemption if he can successfully perform an inception.",
  },
  {
    title: "The Godfather",
    director: "Francis Ford Coppola",
    genre: "Crime",
    year: 1972,
    summary:
      "The aging patriarch of an organized crime dynasty transfers control of his clandestine empire to his reluctant son.",
  },
  {
    title: "Pulp Fiction",
    director: "Quentin Tarantino",
    genre: "Crime",
    year: 1994,
    summary:
      "The lives of two mob hitmen, a boxer, a gangster, and his wife intertwine in four tales of violence and redemption.",
  },
  {
    title: "The Dark Knight",
    director: "Christopher Nolan",
    genre: "Action",
    year: 2008,
    summary:
      "When the menace known as the Joker emerges, Batman must accept one of the greatest psychological and physical tests of his ability to fight injustice.",
  },
  {
    title: "Forrest Gump",
    director: "Robert Zemeckis",
    genre: "Drama",
    year: 1994,
    summary:
      "The presidencies of Kennedy and Johnson, the Vietnam War, and other events unfold from the perspective of an Alabama man with an IQ of 75.",
  },
];

app.get("/seed-db", async (req, res) => {
  try {
    await sequelize.sync({ force: true });
    await movie.bulkCreate(moviesData);
    await user.create({
      username: "moviefan",
      email: "moviefan@gmail.com",
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
async function likeMovie(data) {
  let likedMovie = await like.create({
    userId: data.userId,
    movieId: data.movieId,
  });

  return { likedMovie };
}

app.get("/users/:id/like", async (req, res) => {
  try {
    let userId = req.params.id;
    let movieId = req.query.movieId;

    let result = await likeMovie({ userId: userId, movieId: movieId });
    if (result.likedMovie != undefined) {
      return res
        .status(200)
        .json({ message: "Movie liked", newLike: result.likedMovie });
    } else {
      return res.status(400).json({ message: "Failed to add likes" });
    }
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

// endpoint 2
async function dislikeMovie(data) {
  let dislikedMovie = await like.destroy({
    where: {
      userId: data.userId,
      movieId: data.movieId,
    },
  });

  if (dislikedMovie) {
    return { message: "Movie disliked" };
  } else {
    return { message: "" };
  }
}

app.get("/users/:id/dislike", async (req, res) => {
  try {
    let userId = req.params.id;
    let movieId = req.query.movieId;

    let result = await dislikeMovie({ userId: userId, movieId: movieId });
    if (result.message != "") {
      return res.status(200).json(result);
    } else {
      return res.status(400).json({ message: "Failed to dislike movie" });
    }
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

// endpoint 3
async function getAllLikedMovies(userId) {
  let allUserLikedMovies = await like.findAll({ where: { userId } });

  let userLikedMoviesList = [];

  for (let i = 0; i < allUserLikedMovies.length; i++) {
    userLikedMoviesList.push(allUserLikedMovies[i].movieId);
  }

  let allLikedMoviesList = await movie.findAll({
    where: { id: { [Op.in]: userLikedMoviesList } },
  });

  return { likedMovies: allLikedMoviesList };
}

app.get("/users/:id/liked", async (req, res) => {
  try {
    let userId = req.params.id;

    let result = await getAllLikedMovies(userId);

    if (result.likedMovies.length > 0) {
      return res.status(200).json(result);
    } else {
      return res.status(404).json({ message: "No movies found liked by user" });
    }
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

app.listen(port, () => {
  console.log(`Server is listening on http://localhost:${port}`);
});
