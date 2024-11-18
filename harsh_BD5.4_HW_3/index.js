const express = require("express");
const { resolve } = require("path");
const { sequelize } = require("./lib");
const { chef } = require("./models/chef.model.js");
const { dish } = require("./models/dish.model.js");
const { error } = require("console");

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());

// dishes
let dishesData = [
  {
    name: "Margherita Pizza",
    cuisine: "Italian",
    preparationTime: 20,
  },
  {
    name: "Sushi",
    cuisine: "Japanese",
    preparationTime: 50,
  },
  {
    name: "Poutine",
    cuisine: "Canadian",
    preparationTime: 30,
  },
];

// chefs
let chefsData = [
  { name: "Gordon Ramsay", birthYear: 1966 },
  { name: "Masaharu Morimoto", birthYear: 1955 },
  { name: "Ricardo Larrivée", birthYear: 1967 },
];

app.get("/seed-db", async (req, res) => {
  try {
    await sequelize.sync({ force: true });
    await chef.bulkCreate(chefsData);
    await dish.bulkCreate(dishesData);

    return res.status(200).json({ message: "Database seeded successfully" });
  } catch (error) {
    return res
      .status(500)
      .json({ error: error.message, message: "Failed to seed database" });
  }
});

// endpoint 1
async function addNewChef(newChef) {
  let newChefData = await chef.create(newChef);

  return { newChef: newChefData };
}

app.post("/chefs/new", async (req, res) => {
  try {
    let newChef = req.body.newChef;

    let result = await addNewChef(newChef);

    if (result.newChef != undefined) {
      return res.status(200).json(result);
    } else {
      return res.status(400).json({ message: "Failed to add new chef record" });
    }
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

// endpoint 2
async function updateChefById(newChefData, id) {
  let updatedData = await chef.findOne({ where: { id } });

  if (updatedData) {
    updatedData.set(newChefData);
    updatedData.save();

    return { message: "Chef updated successfully", updatedChef: updatedData };
  } else {
    return { message: "" };
  }
}

app.post("/chefs/update/:id", async (req, res) => {
  try {
    let id = req.params.id;

    let newChefData = req.body;

    let result = await updateChefById(newChefData, id);

    if (result.message != "") {
      return res.status(200).json(result);
    } else {
      return res.status(400).json({ message: "Failed to update chef data" });
    }
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

app.listen(port, () => {
  console.log(`Server is listening on http://localhost:${port}`);
});
