const express = require("express");
const { resolve } = require("path");
const { sequelize } = require("./lib/index.js");
const { track } = require("./models/track.model.js");
const { user } = require("./models/user.model.js");
const { like } = require("./models/like.model.js");

const app = express();
const port = process.env.PORT || 3000;
app.use(express.json());

const trackData = [
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

// database seed
app.get("/seed-db", async (req, res) => {
  try {
    await sequelize.sync({ force: true });
    await track.bulkCreate(trackData);

    return res.status(200).json({ message: "Database seeded successfully" });
  } catch (error) {
    return res
      .status(500)
      .json({ error: error.message, message: "Failed to seed database" });
  }
});

// endpoint 1
async function addNewUser(newUser) {
  let newUserData = await user.create(newUser);

  return { newUser: newUserData };
}

app.post("/users/new", async (req, res) => {
  try {
    let newUser = req.body.newUser;

    let result = await addNewUser(newUser);

    if (result.newUser != undefined) {
      return res.status(200).json(result);
    } else {
      return res.status(400).json({ message: "Failed to insert new user" });
    }
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

// endpoint 2
async function updateUserById(newUserData, id) {
  let fetchedUser = await user.findOne({ where: { id } });

  if (fetchedUser) {
    fetchedUser.set(newUserData);

    fetchedUser.save();

    return {
      message: "User Updated Successfully",
      updatedUser: fetchedUser,
    };
  } else {
    return { message: "" };
  }
}

app.post("/users/update/:id", async (req, res) => {
  try {
    let id = req.params.id;

    let newUserData = req.body;

    let result = await updateUserById(newUserData, id);
    if (result.message != "") {
      return res.status(200).json(result);
    } else {
      return res.status(400).json({ message: "Failed to update user data" });
    }
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

app.listen(port, () => {
  console.log(`Server is listening on http://localhost:${port}`);
});
