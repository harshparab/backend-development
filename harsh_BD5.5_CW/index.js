const express = require("express");
const { resolve } = require("path");
const { user } = require("./models/user.model.js");
const { track } = require("./models/track.model.js");
const { like } = require("./models/like.model.js");
const { sequelize } = require("./lib");
const { Op } = require("@sequelize/core");

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());

const tracksData = [
  {
    name: "Raabta",
    genre: "Romantic",
    release_year: 2012,
    artist: "Arijit Singh",
    album: "Agent Vinod",
    duration: 4,
  },
  {
    name: "Naina Da Kya Kasoor",
    genre: "Pop",
    release_year: 2018,
    artist: "Amit Trivedi",
    album: "Andhadhun",
    duration: 3,
  },
  {
    name: "Ghoomar",
    genre: "Traditional",
    release_year: 2018,
    artist: "Shreya Ghoshal",
    album: "Padmaavat",
    duration: 3,
  },
  {
    name: "Bekhayali",
    genre: "Rock",
    release_year: 2019,
    artist: "Sachet Tandon",
    album: "Kabir Singh",
    duration: 6,
  },
  {
    name: "Hawa Banke",
    genre: "Romantic",
    release_year: 2019,
    artist: "Darshan Raval",
    album: "Hawa Banke (Single)",
    duration: 3,
  },
  {
    name: "Ghungroo",
    genre: "Dance",
    release_year: 2019,
    artist: "Arijit Singh",
    album: "War",
    duration: 5,
  },
  {
    name: "Makhna",
    genre: "Hip-Hop",
    release_year: 2019,
    artist: "Tanishk Bagchi",
    album: "Drive",
    duration: 3,
  },
  {
    name: "Tera Ban Jaunga",
    genre: "Romantic",
    release_year: 2019,
    artist: "Tulsi Kumar",
    album: "Kabir Singh",
    duration: 3,
  },
  {
    name: "First Class",
    genre: "Dance",
    release_year: 2019,
    artist: "Arijit Singh",
    album: "Kalank",
    duration: 4,
  },
  {
    name: "Kalank Title Track",
    genre: "Romantic",
    release_year: 2019,
    artist: "Arijit Singh",
    album: "Kalank",
    duration: 5,
  },
];

app.get("/seed-db", async (req, res) => {
  try {
    await sequelize.sync({ force: true });
    await track.bulkCreate(tracksData);
    await user.create({
      username: "testuser",
      email: "testuser@gmail.com",
      password: "testuser",
    });

    return res.status(200).json({ message: "Database seeded successfully" });
  } catch (error) {
    return res
      .status(500)
      .json({ error: error.message, message: "Failed to seed database" });
  }
});

// endpoint 1
async function likeTrack(data) {
  let newLikedTrack = await like.create({
    userId: data.userId,
    trackId: data.trackId,
  });

  return { newLike: newLikedTrack };
}

app.get("/users/:id/like", async (req, res) => {
  try {
    let userId = req.params.id;
    let trackId = req.query.trackId;

    let result = await likeTrack({ userId: userId, trackId: trackId });

    if (result.newLike != undefined) {
      return res
        .status(200)
        .json({ message: "Track liked", newLike: result.newLike });
    } else {
      return res.status(400).json({ message: "Failed to insert data" });
    }
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

// endpoint 2
async function dislikeTrack(data) {
  let deleteLikeData = await like.destroy({
    where: { userId: data.userId, trackId: data.trackId },
  });

  if (deleteLikeData) {
    return { message: "Track disliked" };
  } else {
    return { message: "" };
  }
}

app.get("/users/:id/dislike", async (req, res) => {
  try {
    let userId = req.params.id;
    let trackId = req.query.trackId;

    let result = await dislikeTrack({ userId: userId, trackId: trackId });
    if (result.message != "") {
      return res.status(200).json(result);
    } else {
      return res.status(400).json({ message: "Failed to dislike track" });
    }
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

// endpoint 3
async function getAllLikedTracks(userId) {
  let trackIdData = await like.findAll({
    where: { userId },
    attributes: ["trackId"],
  });

  let trackDataArray = [];

  for (let i = 0; i < trackIdData.length; i++) {
    trackDataArray.push(trackIdData[i].trackId);
  }

  const allLikedTracks = await track.findAll({
    where: { id: { [Op.in]: trackDataArray } },
  });

  return { likedTracks: allLikedTracks };
}

app.get("/users/:id/liked", async (req, res) => {
  try {
    let userId = req.params.id;

    let result = await getAllLikedTracks(userId);

    if (result.likedTracks.length > 0) {
      return res.status(200).json(result);
    } else {
      return res.status(404).json({ message: "No tracks liked by user" });
    }
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

// endpoint 4
async function getAllLikedTracksByArtists(userId, artist) {
  let allUserLikedTracks = await like.findAll({
    where: { userId },
    attributes: ["trackId"],
  });

  let trackDataArray = [];

  for (let i = 0; i < allUserLikedTracks.length; i++) {
    trackDataArray.push(allUserLikedTracks[i].trackId);
  }

  let allLIkedTracksByArtists = await track.findAll({
    where: { id: { [Op.in]: trackDataArray }, artist },
  });

  return { likedTracks: allLIkedTracksByArtists };
}

app.get("/users/:id/liked-artist", async (req, res) => {
  try {
    let userId = req.params.id;
    let artist = req.query.artist;

    let result = await getAllLikedTracksByArtists(userId, artist);
    if (result.likedTracks.length > 0) {
      return res.status(200).json(result);
    } else {
      return res
        .status(404)
        .json({ message: "No track found by artist, like by user" });
    }
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

app.listen(port, () => {
  console.log(`Server is listening on http://localhost:${port}`);
});
