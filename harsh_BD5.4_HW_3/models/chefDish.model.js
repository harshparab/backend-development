const { DataType, sequelize } = require("../lib/index.js");
const { chef } = require("./chef.model.js");
const { dish } = require("./dish.model.js");

const chefDish = sequelize.define("chefDish", {
  chefId: {
    type: DataType.INTEGER,
    references: {
      model: chef,
      key: "id",
    },
  },
  dishId: {
    type: DataType.TEXT,
    references: {
      model: dish,
      key: "id",
    },
  },
});

module.exports = { chefDish };
