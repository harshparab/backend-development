const { DataType, sequelize } = require("../lib/index.js");
const { recipe } = require("./recipe.model.js");
const { user } = require("./user.model.js");

const favorite = sequelize.define("favorite", {
  userId: {
    type: DataType.INTEGER,
    references: {
      model: user,
      key: "id",
    },
  },
  recipeId: {
    type: DataType.INTEGER,
    references: {
      model: recipe,
      key: "id",
    },
  },
});

recipe.belongsToMany(user, { through: favorite });
user.belongsToMany(recipe, { through: favorite });

module.exports = { favorite };
