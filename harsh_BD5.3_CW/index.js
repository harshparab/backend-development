const express = require("express");
const { resolve } = require("path");
const { sequelize } = require("./lib/index.js");
const { track } = require("./models/track.model.js");

const app = express();
const port = 3000;
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

    return res.status(200).json({ message: "Database seeded successfully" });
  } catch (error) {
    return res
      .status(500)
      .json({ error: error.message, message: "Failed to seed database" });
  }
});

// endpoint 1
async function fetchAllTracks() {
  let tracks = await track.findAll();

  return { tracks };
}

app.get("/tracks", async (req, res) => {
  try {
    let result = await fetchAllTracks();

    if (result.tracks.length > 0) {
      return res.status(200).json(result);
    } else {
      return res.status(404).json({ message: "No tracks found" });
    }
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
});

// endpoint 2
async function addNewTrack(trackData) {
  let newTrack = await track.create(trackData);

  return { newTrack };
}

app.post("/tracks/new", async (req, res) => {
  try {
    let newTrack = req.body.newTrack;

    let result = await addNewTrack(newTrack);

    if (result.newTrack != {}) {
      return res.status(200).json(result);
    } else {
      return res.status(400).json({ message: "Failed to add data" });
    }
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
});

// endpoint 3
async function updateTrackById(updatedTrackData, id) {
  let trackData = await track.findOne({ where: { id } });

  if (!trackData) {
    return { message: "" };
  } else {
    trackData.set(updatedTrackData);
    await trackData.save();
    return { message: "Data updated successfully" };
  }
}

app.post("/tracks/update/:id", async (req, res) => {
  try {
    let id = req.params.id;
    let newTrackData = req.body;

    let result = await updateTrackById(newTrackData, id);

    if (result.message != "") {
      return res.status(200).json(result);
    } else {
      return res.status(400).json({ message: "Failed to update data" });
    }
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
});

// endpoint 4
async function deleteTrackByID(id) {
  let trackData = await track.destroy({ where: { id } });

  if (trackData) {
    return { message: "Data deleted successfully" };
  } else {
    return {};
  }
}

app.post("/tracks/delete", async (req, res) => {
  try {
    let id = req.body.id;

    let result = await deleteTrackByID(id);

    if (result.message != "") {
      return res.status(200).json(result);
    } else {
      return res.status(400).json({ message: "Failed to delete data" });
    }
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
