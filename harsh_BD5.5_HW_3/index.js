const express = require("express");
const { resolve } = require("path");
const { sequelize } = require("./lib");
const { recipe } = require("./models/recipe.model");
const { user } = require("./models/user.model");
const { favorite } = require("./models/favorite");
const { Op } = require("@sequelize/core");

const app = express();
const port = process.env.PORT || 3000;

const recipesData = [
  {
    title: "Spaghetti Carbonara",
    chef: "Chef Luigi",
    cuisine: "Italian",
    preparationTime: 30,
    instructions:
      "Cook spaghetti. In a bowl, mix eggs, cheese, and pepper. Combine with pasta and pancetta.",
  },
  {
    title: "Chicken Tikka Masala",
    chef: "Chef Anil",
    cuisine: "Indian",
    preparationTime: 45,
    instructions:
      "Marinate chicken in spices and yogurt. Grill and serve with a creamy tomato sauce.",
  },
  {
    title: "Sushi Roll",
    chef: "Chef Sato",
    cuisine: "Japanese",
    preparationTime: 60,
    instructions:
      "Cook sushi rice. Place rice on nori, add fillings, roll, and slice into pieces.",
  },
  {
    title: "Beef Wellington",
    chef: "Chef Gordon",
    cuisine: "British",
    preparationTime: 120,
    instructions:
      "Wrap beef fillet in puff pastry with mushroom duxelles and bake until golden.",
  },
  {
    title: "Tacos Al Pastor",
    chef: "Chef Maria",
    cuisine: "Mexican",
    preparationTime: 50,
    instructions:
      "Marinate pork in adobo, grill, and serve on tortillas with pineapple and cilantro.",
  },
];

app.get("/seed-db", async (req, res) => {
  try {
    await sequelize.sync({ force: true });
    await recipe.bulkCreate(recipesData);
    await user.create({
      username: "foodlover",
      email: "foodlover@example.com",
      password: "securepassword",
    });

    return res.status(200).json({ message: "Database seeded successfully" });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Failed to seed database", error: error.message });
  }
});

// endpoint 1
async function favoriteRecipe(data) {
  let newFavorite = await favorite.create({
    userId: data.userId,
    recipeId: data.recipeId,
  });

  return { newFavorite: newFavorite };
}

app.get("/users/:id/favorite", async (req, res) => {
  try {
    let userId = req.params.id;
    let recipeId = req.query.recipeId;

    let result = await favoriteRecipe({ userId: userId, recipeId: recipeId });

    if (result.newFavorite != undefined) {
      return res.status(200).json({
        message: "Recipe favourited",
        newFavorite: result.newFavorite,
      });
    } else {
      return res
        .status(400)
        .json({ message: "Failed to add favourite recipe" });
    }
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

async function unfavoriteRecipe(data) {
  let unfavoriteRecipe = await favorite.destroy({
    where: {
      userId: data.userId,
      recipeId: data.recipeId,
    },
  });

  if (unfavoriteRecipe) {
    return { message: "Recipe unfavorited" };
  } else {
    return { message: "" };
  }
}

app.get("/users/:id/unfavorite", async (req, res) => {
  try {
    let userId = req.params.id;
    let recipeId = req.query.recipeId;

    let result = await unfavoriteRecipe({ userId: userId, recipeId: recipeId });
    if (result.message != "") {
      return res.status(200).json({ message: result.message });
    } else {
      return res.status(400).json({ message: "Failed to unfavorite recipe" });
    }
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

// endpoint 3
async function getAllFavoritedRecipes(userId) {
  let userFavoritedRecipes = await favorite.findAll({ where: { userId } });

  let favoriteRecipeList = [];

  for (let i = 0; i < userFavoritedRecipes.length; i++) {
    favoriteRecipeList.push(userFavoritedRecipes[i].recipeId);
  }

  let favoritedRecipe = await recipe.findAll({
    where: { id: { [Op.in]: favoriteRecipeList } },
  });

  return { favoritedRecipe };
}

app.get("/users/:id/favorites", async (req, res) => {
  try {
    let userId = req.params.id;

    let result = await getAllFavoritedRecipes(userId);

    if (result.favoritedRecipe.length > 0) {
      return res.status(200).json(result);
    } else {
      return res.status(404).json({ message: "No user favorite recipe found" });
    }
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

app.listen(port, () => {
  console.log(`The server is listening on http://localhost:${port}`);
});
