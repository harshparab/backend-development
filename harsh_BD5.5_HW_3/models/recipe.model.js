const { DataType, sequelize } = require("../lib/index.js");

const recipe = sequelize.define("recipe", {
  title: DataType.TEXT,
  chef: DataType.TEXT,
  cuisine: DataType.TEXT,
  preparationTime: DataType.INTEGER,
  instructions: DataType.TEXT,
});

module.exports = { recipe };
