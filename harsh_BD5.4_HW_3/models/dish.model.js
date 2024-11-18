const { DataType, sequelize } = require("../lib/index.js");

const dish = sequelize.define("dish", {
  name: { type: DataType.TEXT, allowNull: false },
  cuisine: { type: DataType.TEXT },
  preparationTime: { type: DataType.INTEGER },
});

module.exports = { dish };
